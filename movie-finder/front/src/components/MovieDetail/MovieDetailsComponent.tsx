import { useNavigate, useParams } from "react-router-dom";
import { MovieDetailsHook } from "../../hooks/movie-details.hook.ts";
import { ArrowLeft, Star, Plus } from "lucide-react";
import './MovieDetails.css';
import { useContext, useState } from "react";
import { FavoritesContext } from "../../Providers/FavoriteProvider.tsx";
import { useAuth } from "../../Providers/AuthProvider.tsx";
import AddToPlaylistModal from "../../components/AddToPlaylistModal/AddToPlaylistModal.tsx";

export default function MovieDetailsComponent() {
    const { id } = useParams<{ id: string }>();
    const { movie, loading, error } = MovieDetailsHook(id ? parseInt(id) : null);

    const navigate = useNavigate();
    const handleBack = () => navigate(-1);

    const { isAuthenticated } = useAuth();
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const { toggleFavorite, isFavorite } = useContext(FavoritesContext);


    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!movie) return <p>Film non trouvé.</p>;

    const favorite = isFavorite(movie.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

    const handleAddToPlaylistClick = () => {
        setShowPlaylistModal(true);
    };

    const stars = movie.vote_average ? Math.round(movie.vote_average / 2) : 0;

    return (
        <>
            <a className="movie-details__back" onClick={handleBack}>
                <ArrowLeft size={20} />
                Retour
            </a>

            <div className="movie-details__header">
                <div className="title-favorite">
                    <h1 className="movie-details__title">{movie.title}</h1>

                    <div className="header-actions">
                        <div
                            className={`favorite-btn-details ${favorite ? "active" : ""}`}
                            onClick={handleFavoriteClick}
                            aria-label="Ajouter aux favoris"
                        >
                            Favoris
                            <Star
                                size={20}
                                style={{ marginLeft: "0.5rem" }}
                                fill={favorite ? "#facc15" : "transparent"}
                                color={favorite ? "#facc15" : "black"}
                            />
                        </div>

                        {isAuthenticated && (
                            <button
                                className="add-playlist-btn"
                                onClick={handleAddToPlaylistClick}
                            >
                                <Plus size={20} style={{ marginRight: "0.5rem" }} />
                                Ajouter à une playlist
                            </button>
                        )}
                    </div>
                </div>

                {movie.release_date && (
                    <p className="movie-details__release-date">
                        {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                )}
            </div>

            <div className="movie-details__content">
                {movie.poster_path && (
                    <img
                        className="movie-details__poster"
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                    />
                )}

                <div className="movie-details__data">
                    <p className="movie-details__overview">{movie.overview}</p>

                    {movie.vote_average && (
                        <div className="movie-details__rating">
                            <span>Note :</span>
                            <div className="movie-card__stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < stars ? "#facc15" : "transparent"}
                                        color={i < stars ? "#facc15" : "#ccc"}
                                    />
                                ))}
                            </div>
                            <span>({movie.vote_average.toFixed(2)}/10)</span>
                        </div>
                    )}

                    <div className="movie-details__stats">
                        {movie.runtime && (
                            <div className="movie-details__stat">
                                <strong>Durée :</strong> {movie.runtime} min
                            </div>
                        )}
                        <div className="movie-details__stat">
                            <strong>Budget :</strong> {(movie.budget ?? 0).toLocaleString("fr-FR")} $
                        </div>
                        <div className="movie-details__stat">
                            <strong>Recettes :</strong> {(movie.revenue ?? 0).toLocaleString("fr-FR")} $
                        </div>
                        {movie.vote_count && (
                            <div className="movie-details__stat">
                                <strong>Avis :</strong> {movie.vote_count.toLocaleString("fr-FR")}
                            </div>
                        )}
                    </div>

                    {movie.genres && movie.genres.length > 0 && (
                        <div className="movie-details__genres">
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className="movie-details__genre-badge">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showPlaylistModal && (
                <AddToPlaylistModal
                    movie={movie}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </>
    );
}
