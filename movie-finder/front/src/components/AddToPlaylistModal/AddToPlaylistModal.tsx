import { useState, useEffect } from 'react';
import { getPlaylists, createPlaylist, addMovieToPlaylist } from '../../proxy/playlistsApi';
import type { Playlist } from '../../types/playlist.type';
import type { Movie } from '../../types/movie.type';
import './AddToPlaylistModal.css';

interface AddToPlaylistModalProps {
    movie: Movie;
    onClose: () => void;
}

export default function AddToPlaylistModal({ movie, onClose }: AddToPlaylistModalProps) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            setIsLoading(true);
            const data = await getPlaylists();
            setPlaylists(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId: number) => {
        try {
            await addMovieToPlaylist(playlistId, { movie });
            alert('Film ajouté à la playlist !');
            onClose();
        } catch (err) {
            alert('Erreur lors de l\'ajout du film (peut-être déjà présent)');
            console.error(err);
        }
    };

    const handleCreateAndAdd = async () => {
        if (!newPlaylistName.trim()) {
            setError('Le nom est requis');
            return;
        }

        try {
            setIsCreating(true);
            setError('');
            const newPlaylist = await createPlaylist({ name: newPlaylistName.trim() });
            await addMovieToPlaylist(newPlaylist.id, { movie });
            alert('Playlist créée et film ajouté !');
            onClose();
        } catch (err) {
            alert('Erreur lors de la création de la playlist');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const isMovieInPlaylist = (playlist: Playlist) => {
        return playlist.movies.some(m => m.id === movie.id);
    };

    return (
        <div className="add-to-playlist-modal" onClick={onClose}>
            <div className="add-to-playlist-modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="add-to-playlist-modal__header">
                    <h2 className="add-to-playlist-modal__title">Ajouter à une playlist</h2>
                    <button onClick={onClose} className="add-to-playlist-modal__close">
                        ✕
                    </button>
                </div>

                <div className="add-to-playlist-modal__movie">
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : ''}
                        alt={movie.title}
                        className="add-to-playlist-modal__poster"
                    />
                    <div className="add-to-playlist-modal__movie-info">
                        <h3>{movie.title}</h3>
                        {movie.release_date && (
                            <p>{new Date(movie.release_date).getFullYear()}</p>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="add-to-playlist-modal__loading">
                        <div className="spinner-small"></div>
                        <p>Chargement...</p>
                    </div>
                ) : (
                    <>
                        {playlists.length > 0 && (
                            <div className="add-to-playlist-modal__list">
                                {playlists.map((playlist) => {
                                    const alreadyAdded = isMovieInPlaylist(playlist);
                                    return (
                                        <button
                                            key={playlist.id}
                                            onClick={() => !alreadyAdded && handleAddToPlaylist(playlist.id)}
                                            className={`add-to-playlist-modal__item ${alreadyAdded ? 'add-to-playlist-modal__item--disabled' : ''}`}
                                            disabled={alreadyAdded}
                                        >
                                            <span className="add-to-playlist-modal__item-name">
                                                {playlist.name}
                                            </span>
                                            <span className="add-to-playlist-modal__item-count">
                                                {playlist.movies.length} {playlist.movies.length === 1 ? 'film' : 'films'}
                                            </span>
                                            {alreadyAdded && (
                                                <span className="add-to-playlist-modal__item-badge">✓ Déjà ajouté</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {!showCreateForm ? (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="add-to-playlist-modal__create-btn"
                            >
                                ➕ Créer une nouvelle playlist
                            </button>
                        ) : (
                            <div className="add-to-playlist-modal__create-form">
                                <input
                                    type="text"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="Nom de la nouvelle playlist"
                                    className="add-to-playlist-modal__input"
                                    maxLength={50}
                                    autoFocus
                                />
                                {error && <p className="add-to-playlist-modal__error">{error}</p>}
                                <div className="add-to-playlist-modal__create-actions">
                                    <button
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setNewPlaylistName('');
                                            setError('');
                                        }}
                                        className="add-to-playlist-modal__btn add-to-playlist-modal__btn--cancel"
                                        disabled={isCreating}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleCreateAndAdd}
                                        className="add-to-playlist-modal__btn add-to-playlist-modal__btn--submit"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Création...' : 'Créer et ajouter'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
