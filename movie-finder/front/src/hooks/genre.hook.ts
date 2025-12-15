import { useEffect, useState } from "react";

interface Genre {
    id: number;
    name: string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;

export const useGenres = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
                const data = await res.json();
                setGenres(data.genres);
            } catch (error) {
                console.error("Erreur TMDB genres:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return { genres, loading };
};
