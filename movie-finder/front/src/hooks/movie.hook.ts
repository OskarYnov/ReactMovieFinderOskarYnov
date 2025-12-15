import { useState, useEffect } from "react";
import { searchMovies } from "../proxy/search-movies.proxy.ts";
import type { Movie } from "../types/movie.type.ts";

interface SearchFilters {
    query?: string;
    year?: string;
    genreId?: number;
}

export const useFetchMovies = (filters: SearchFilters) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!filters.query && !filters.genreId && !filters.year) {
                setMovies([]);
                return;
            }

            setLoading(true);
            try {
                const results = await searchMovies(filters);
                setMovies(results);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    return { movies, loading };
};
