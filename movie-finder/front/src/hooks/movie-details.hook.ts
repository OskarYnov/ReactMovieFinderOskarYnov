import { useState, useEffect } from "react";
import type { Movie } from "../types/movie.type.ts";
import {getMovieById} from "../proxy/movie-details.proxy.ts";

export const MovieDetailsHook = (id: number | null) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id === null) return;

        const controller = new AbortController();

        const fetchMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getMovieById(id);
                if (!controller.signal.aborted) setMovie(result);
            } catch {
                if (!controller.signal.aborted) setError("Erreur lors du chargement du film");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchMovie();

        return () => controller.abort();
    }, [id]);

    return { movie, loading, error };
};
