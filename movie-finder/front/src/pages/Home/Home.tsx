import MovieList from "../../components/MovieList/MovieList.tsx";
import {useTrendingMovies} from "../../hooks/movie-trending.hook.ts";

export default function Home() {
    const { movies, loading } = useTrendingMovies();

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Films tendances 🎬</h1>

            {loading ? (
                <p className="text-center mt-4">Chargement...</p>
            ) : (
                <MovieList movies={movies} />
            )}
        </div>
    );
}
