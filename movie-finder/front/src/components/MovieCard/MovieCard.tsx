import type {Movie} from "../../types/movie.type.ts";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {FavoritesContext} from "../../Providers/FavoriteProvider.tsx";
import {Star} from "lucide-react";
import "./movie-card.css";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
    const favorite = isFavorite(movie.id);

    const handleClick = () => navigate(`/movie/${movie.id}`);
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

    const hasImage = Boolean(movie.poster_path);
    const imgUrl = hasImage
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

    // Format de date en français
    const releaseDate = movie.release_date
        ? new Date(movie.release_date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "";

    const stars = movie.vote_average ? Math.round(movie.vote_average / 2) : 0;

    return (
        <div className="movie-card" onClick={handleClick}>
            {hasImage ? (
                <img src={imgUrl} alt={movie.title} className="movie-card__image" />
            ) : (
                <div className="movie-card__no-image">
                    <h3 className="movie-card__title">{movie.title}</h3>
                    <p className="movie-card__no-image-text">
                        *L'image n'a pas pu être chargée*
                    </p>
                </div>
            )}

            <div className="movie-card__info">
                <div
                    className={`favorite-btn ${favorite ? "active" : ""}`}
                    onClick={handleFavoriteClick}
                    aria-label="Ajouter aux favoris"
                >
                    <Star
                        size={20}
                        fill={favorite ? "#facc15" : "transparent"}
                        color={favorite ? "#facc15" : "black"}
                    />
                </div>

                <h3 className="movie-card__title">{movie.title}</h3>
                {releaseDate && <p className="movie-card__year">{releaseDate}</p>}

                {movie.vote_average && (
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
                )}
            </div>
        </div>
    );
}
