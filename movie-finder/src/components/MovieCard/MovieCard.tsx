import type {Movie} from "../../types/movie.type.ts";
import {useNavigate} from "react-router-dom";
import "./movie-card.css";
import {useContext} from "react";
import {FavoritesContext} from "../../Providers/FavoriteProvider.tsx";
import {Star} from "lucide-react";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate();
    const hasImage = Boolean(movie.poster_path);
    const imgUrl = hasImage
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

    const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
    const favorite = isFavorite(movie.id);

    const handleClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

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

                    <button
                        className={`favorite-btn ${favorite ? "active" : ""}`}
                        onClick={handleFavoriteClick}
                        aria-label="Ajouter aux favoris"
                    >
                        <Star
                            size={20}
                            fill={favorite ? "#facc15" : "transparent"}
                            color={favorite ? "#facc15" : "#ccc"}
                        />
                    </button>
                </div>
            )}

            {hasImage && (
                <div className="movie-card__info">
                    <button
                        className={`favorite-btn ${favorite ? "active" : ""}`}
                        onClick={handleFavoriteClick}
                        aria-label="Ajouter aux favoris"
                    >
                        <Star
                            size={20}
                            fill={favorite ? "#facc15" : "transparent"}
                            color={favorite ? "#facc15" : "#ccc"}
                        />
                    </button>
                    <h3 className="movie-card__title">{movie.title}</h3>
                    {movie.release_date && (
                        <p className="movie-card__year">{movie.release_date.slice(0, 4)}</p>
                    )}
                </div>
            )}
        </div>
    );
}
