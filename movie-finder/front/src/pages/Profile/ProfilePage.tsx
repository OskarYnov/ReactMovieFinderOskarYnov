import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, getUserFavorites, getUserPlaylists, type PublicUserProfile, type UserFavoritesResponse, type UserPlaylistsResponse } from '../../proxy/usersApi';
import { Star, List } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const userId = id ? parseInt(id) : null;

    const [profile, setProfile] = useState<PublicUserProfile | null>(null);
    const [favorites, setFavorites] = useState<UserFavoritesResponse | null>(null);
    const [playlists, setPlaylists] = useState<UserPlaylistsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            loadData(userId);
        }
    }, [userId]);

    const loadData = async (uid: number) => {
        setLoading(true);
        try {
            const [profileData, favData, playlistData] = await Promise.all([
                getUserProfile(uid),
                getUserFavorites(uid),
                getUserPlaylists(uid)
            ]);
            setProfile(profileData);
            setFavorites(favData);
            setPlaylists(playlistData);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger le profil.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="profile-loading"><div className="spinner"></div> Chargement du profil...</div>;
    if (error || !profile) return <div className="profile-error">{error || 'Introuvable'}</div>;

    const topFavorites = favorites?.favorites.slice(0, 3) || [];

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{profile.name}</h1>
                    <p className="profile-meta">
                        Membre depuis {new Date(profile.createdAt || Date.now()).getFullYear()}
                    </p>
                    <div className="profile-stats">
                        <span className="stat-item">
                            <strong>{favorites?.count || 0}</strong> Favoris
                        </span>
                        <span className="stat-item">
                            <strong>{playlists?.count || 0}</strong> Playlists
                        </span>
                    </div>
                </div>
            </header>

            <section className="profile-section">
                <div className="section-header">
                    <h2><Star className="icon" size={24} fill="#facc15" color="#facc15" /> Top Favoris</h2>
                    {favorites && favorites.count > 3 && (
                        <span className="see-more">Voir les {favorites.count} favoris</span>
                    )}
                </div>

                {topFavorites.length > 0 ? (
                    <div className="favorites-grid">
                        {topFavorites.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="favorite-card">
                                {movie.poster_path ? (
                                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                                ) : (
                                    <div className="no-poster">🎬</div>
                                )}
                                <div className="favorite-info">
                                    <h3>{movie.title}</h3>
                                    <span className="rating">★ {movie.vote_average?.toFixed(1)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">Aucun favori pour le moment.</p>
                )}
            </section>

            <section className="profile-section">
                <div className="section-header">
                    <h2><List className="icon" size={24} /> Playlists Publiques</h2>
                </div>

                {playlists && playlists.playlists.length > 0 ? (
                    <div className="playlists-grid">
                        {playlists.playlists.map(playlist => (
                            <Link to={`/playlists/${playlist.id}`} key={playlist.id} className="playlist-mini-card">
                                <div className="playlist-icon">🎵</div>
                                <div className="playlist-content">
                                    <h3>{playlist.name}</h3>
                                    <p>{playlist.movies.length} films</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">Aucune playlist créée.</p>
                )}
            </section>
        </div>
    );
}
