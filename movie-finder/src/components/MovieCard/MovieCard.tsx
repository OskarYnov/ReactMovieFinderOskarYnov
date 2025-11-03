import type { Movie } from "../../types/movie.type.ts";
import { useNavigate } from "react-router-dom";
import "./movie-card.css";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate();
    const hasImage = Boolean(movie.poster_path);
    const imgUrl = hasImage
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

    const handleClick = () => {
        navigate(`/movie/${movie.id}`); // route vers la page détails
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
                </div>
            )}

            {hasImage && (
                <div className="movie-card__info">
                    <h3 className="movie-card__title">{movie.title}</h3>
                    {movie.release_date && (
                        <p className="movie-card__year">{movie.release_date.slice(0, 4)}</p>
                    )}
                </div>
            )}
        </div>
    );
}
