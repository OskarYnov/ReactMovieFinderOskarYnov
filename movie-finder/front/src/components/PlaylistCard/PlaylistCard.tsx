import { Link } from 'react-router-dom';
import type { Playlist } from '../../types/playlist.type';
import './PlaylistCard.css';

interface PlaylistCardProps {
    playlist: Playlist;
    onDelete?: (id: number) => void;
}

export default function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${playlist.name}" ?`)) {
            onDelete?.(playlist.id);
        }
    };

    // Prendre les 4 premiers films pour l'aperçu
    const previewMovies = playlist.movies.slice(0, 4);
    const movieCount = playlist.movies.length;

    return (
        <Link to={`/playlists/${playlist.id}`} className="playlist-card">
            <div className="playlist-card__preview">
                {previewMovies.length > 0 ? (
                    <div className="playlist-card__grid">
                        {previewMovies.map((movie, index) => (
                            <div key={movie.id} className="playlist-card__movie">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                        className="playlist-card__poster"
                                    />
                                ) : (
                                    <div className="playlist-card__poster-placeholder">
                                        <span>🎬</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Remplir les espaces vides si moins de 4 films */}
                        {[...Array(Math.max(0, 4 - previewMovies.length))].map((_, index) => (
                            <div key={`empty-${index}`} className="playlist-card__movie playlist-card__movie--empty">
                                <div className="playlist-card__poster-placeholder">
                                    <span>+</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="playlist-card__empty">
                        <span className="playlist-card__empty-icon">📽️</span>
                        <p>Aucun film</p>
                    </div>
                )}
            </div>

            <div className="playlist-card__content">
                <h3 className="playlist-card__title">{playlist.name}</h3>
                <p className="playlist-card__count">
                    {movieCount} {movieCount === 1 ? 'film' : 'films'}
                </p>

                <div className="playlist-card__actions">
                    <Link
                        to={`/playlists/${playlist.id}`}
                        className="playlist-card__btn playlist-card__btn--view"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Voir
                    </Link>
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="playlist-card__btn playlist-card__btn--delete"
                            title="Supprimer la playlist"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
