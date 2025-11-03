import { useState } from "react";
import {useFetchMovies} from "../../hooks/movie.hook.ts";
import SearchMovieBar from "../../components/SearchMovieBar/SearchMovieBar.tsx";
import MovieList from "../../components/MovieList/MovieList.tsx";

export default function Home() {
    const [query, setQuery] = useState("");
    const { movies, loading } = useFetchMovies(query);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">
                Recherche de films 🎬
            </h1>
            <SearchMovieBar onSearch={setQuery} />
            {loading ? (
                <p className="text-center mt-4">Chargement...</p>
            ) : (
                <MovieList movies={movies} />
            )}
        </div>
    );
}
