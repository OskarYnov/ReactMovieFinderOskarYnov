import { useState, useEffect } from "react";
import {searchMovies} from "../proxy/search-movies.proxy.ts";
import type {Movie} from "../types/movie.type.ts";

export const useFetchMovies = (query: string) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLoading(true);
            const results = await searchMovies(query);
            setMovies(results);
            setLoading(false);
        };

        fetchData();
    }, [query]);

    return { movies, loading };
};
