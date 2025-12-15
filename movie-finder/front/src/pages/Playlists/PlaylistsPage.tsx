import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import PlaylistForm from '../../components/PlaylistForm/PlaylistForm';
import { getPlaylists, createPlaylist, deletePlaylist } from '../../proxy/playlistsApi';
import type { Playlist } from '../../types/playlist.type';
import './PlaylistsPage.css';

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPlaylists();
            setPlaylists(data);
        } catch (err) {
            setError('Erreur lors du chargement des playlists');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlaylist = async (name: string) => {
        try {
            setIsCreating(true);
            const newPlaylist = await createPlaylist({ name });
            setPlaylists([...playlists, newPlaylist]);
            setShowCreateForm(false);
        } catch (err) {
            alert('Erreur lors de la création de la playlist');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePlaylist = async (id: number) => {
        try {
            await deletePlaylist(id);
            setPlaylists(playlists.filter(p => p.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression de la playlist');
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="playlists-page">
                <div className="playlists-page__loading">
                    <div className="spinner"></div>
                    <p>Chargement des playlists...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlists-page">
                <div className="playlists-page__error">
                    <p>❌ {error}</p>
                    <button onClick={loadPlaylists} className="playlists-page__retry">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="playlists-page">
            <div className="playlists-page__header">
                <h1 className="playlists-page__title">Mes Playlists</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="playlists-page__create-btn"
                >
                    ➕ Créer une playlist
                </button>
            </div>

            {showCreateForm && (
                <div className="playlists-page__modal">
                    <div className="playlists-page__modal-content">
                        <h2 className="playlists-page__modal-title">Nouvelle playlist</h2>
                        <PlaylistForm
                            onSubmit={handleCreatePlaylist}
                            onCancel={() => setShowCreateForm(false)}
                            isLoading={isCreating}
                        />
                    </div>
                </div>
            )}

            {playlists.length === 0 ? (
                <div className="playlists-page__empty">
                    <span className="playlists-page__empty-icon">📁</span>
                    <h2>Aucune playlist</h2>
                    <p>Créez votre première playlist pour commencer à organiser vos films préférés</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="playlists-page__create-btn"
                    >
                        ➕ Créer une playlist
                    </button>
                </div>
            ) : (
                <div className="playlists-page__grid">
                    {playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            playlist={playlist}
                            onDelete={handleDeletePlaylist}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
