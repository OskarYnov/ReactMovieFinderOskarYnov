import type {Movie} from "../types/movie.type.ts";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
        );
        if (!response.ok) throw new Error("Erreur API");

        const data = await response.json();
        return data.results as Movie[];
    } catch (error) {
        console.error("Erreur TMDB:", error);
        return [];
    }
};
