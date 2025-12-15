import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PlaylistForm from '../../components/PlaylistForm/PlaylistForm';
import { getPlaylist, updatePlaylist, deletePlaylist, removeMovieFromPlaylist } from '../../proxy/playlistsApi';
import type { Playlist } from '../../types/playlist.type';
import type { Movie } from '../../types/movie.type';
import './PlaylistDetailsPage.css';

export default function PlaylistDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            loadPlaylist(parseInt(id));
        }
    }, [id]);

    const loadPlaylist = async (playlistId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPlaylist(playlistId);
            setPlaylist(data);
        } catch (err) {
            setError('Erreur lors du chargement de la playlist');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePlaylist = async (name: string) => {
        if (!playlist) return;

        try {
            setIsUpdating(true);
            const updated = await updatePlaylist(playlist.id, { name });
            setPlaylist(updated);
            setIsEditing(false);
        } catch (err) {
            alert('Erreur lors de la modification de la playlist');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!playlist) return;

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${playlist.name}" ?`)) {
            try {
                await deletePlaylist(playlist.id);
                navigate('/playlists');
            } catch (err) {
                alert('Erreur lors de la suppression de la playlist');
                console.error(err);
            }
        }
    };

    const handleRemoveMovie = async (movieId: number) => {
        if (!playlist) return;

        try {
            await removeMovieFromPlaylist(playlist.id, movieId);
            setPlaylist({
                ...playlist,
                movies: playlist.movies.filter(m => m.id !== movieId)
            });
        } catch (err) {
            alert('Erreur lors du retrait du film');
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="playlist-details">
                <div className="playlist-details__loading">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="playlist-details">
                <div className="playlist-details__error">
                    <p>❌ {error || 'Playlist non trouvée'}</p>
                    <Link to="/playlists" className="playlist-details__back-btn">
                        ← Retour aux playlists
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-details">
            <div className="playlist-details__header">
                <Link to="/playlists" className="playlist-details__back">
                    ← Retour
                </Link>

                <div className="playlist-details__title-section">
                    {isEditing ? (
                        <div className="playlist-details__edit-form">
                            <PlaylistForm
                                initialName={playlist.name}
                                onSubmit={handleUpdatePlaylist}
                                onCancel={() => setIsEditing(false)}
                                isLoading={isUpdating}
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="playlist-details__title">{playlist.name}</h1>
                            <p className="playlist-details__count">
                                {playlist.movies.length} {playlist.movies.length === 1 ? 'film' : 'films'}
                            </p>
                        </>
                    )}
                </div>

                {!isEditing && (
                    <div className="playlist-details__actions">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="playlist-details__btn playlist-details__btn--edit"
                        >
                            ✏️ Modifier
                        </button>
                        <button
                            onClick={handleDeletePlaylist}
                            className="playlist-details__btn playlist-details__btn--delete"
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                )}
            </div>

            {playlist.movies.length === 0 ? (
                <div className="playlist-details__empty">
                    <span className="playlist-details__empty-icon">🎬</span>
                    <h2>Aucun film dans cette playlist</h2>
                    <p>Ajoutez des films en naviguant dans l'application</p>
                    <Link to="/search" className="playlist-details__search-btn">
                        🔍 Rechercher des films
                    </Link>
                </div>
            ) : (
                <div className="playlist-details__movies">
                    {playlist.movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <Link to={`/movie/${movie.id}`} className="movie-card__link">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                        className="movie-card__poster"
                                    />
                                ) : (
                                    <div className="movie-card__poster-placeholder">
                                        <span>🎬</span>
                                    </div>
                                )}
                            </Link>
                            <div className="movie-card__content">
                                <Link to={`/movie/${movie.id}`} className="movie-card__title">
                                    {movie.title}
                                </Link>
                                {movie.release_date && (
                                    <p className="movie-card__year">
                                        {new Date(movie.release_date).getFullYear()}
                                    </p>
                                )}
                                <button
                                    onClick={() => handleRemoveMovie(movie.id)}
                                    className="movie-card__remove"
                                    title="Retirer de la playlist"
                                >
                                    ✕ Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
