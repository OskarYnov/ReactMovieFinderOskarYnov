import { useParams } from "react-router-dom";
import {MovieDetailsHook} from "../../hooks/movie-details.hook.ts";

export default function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const { movie, loading, error } = MovieDetailsHook(id ? parseInt(id) : null);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!movie) return <p>Film non trouvé.</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>{movie.title}</h1>
            <p>{movie.release_date}</p>
            <p>{movie.overview}</p>
            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                />
            )}
        </div>
    );
}
