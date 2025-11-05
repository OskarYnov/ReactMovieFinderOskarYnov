import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.type.ts";
import { getTrendingMovies } from "../proxy/trending-movies.proxy.ts";

export const useTrendingMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            const results = await getTrendingMovies();
            setMovies(results);
            setLoading(false);
        };

        fetchTrending();
    }, []);

    return { movies, loading };
};
