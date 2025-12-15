import type { Movie } from "../types/movie.type.ts";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;

export const getTrendingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=fr-FR`
        );

        if (!response.ok) throw new Error("Erreur API TMDB");

        const data = await response.json();
        return data.results as Movie[];
    } catch (error) {
        console.error("Erreur TMDB:", error);
        return [];
    }
};
