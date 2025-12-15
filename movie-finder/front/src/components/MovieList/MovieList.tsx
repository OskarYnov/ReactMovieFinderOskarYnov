import type { Movie } from "../../types/movie.type.ts";
import MovieCard from "../MovieCard/MovieCard.tsx";
import "./movie-list.css";

interface MovieListProps {
    movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
    if (!movies.length) {
        return <p className="movie-list__empty">Aucun film trouvé.</p>;
    }

    return (
        <div className="movie-list">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}
