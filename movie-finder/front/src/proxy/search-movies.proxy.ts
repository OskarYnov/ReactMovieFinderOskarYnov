import type { Movie } from "../types/movie.type.ts";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;

interface SearchOptions {
    query?: string; // texte de recherche
    year?: string;  // année de sortie
    genreId?: number; // id TMDB du genre
}

export const searchMovies = async (
    options: SearchOptions = {}
): Promise<Movie[]> => {
    try {
        const params = new URLSearchParams({
            api_key: API_KEY,
            language: "fr-FR",
            include_adult: "false",
            page: "1",
        });

        // Recherche par texte
        if (options.query) params.append("query", options.query);

        // Filtre par année
        if (options.year) params.append("primary_release_year", options.year);

        // Filtre par genre
        if (options.genreId) params.append("with_genres", options.genreId.toString());

        // Utiliser /discover/movie pour gérer genre + année proprement
        const url = options.query
            ? `${BASE_URL}/search/movie?${params.toString()}`
            : `${BASE_URL}/discover/movie?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API TMDB");

        const data = await res.json();
        return data.results as Movie[];
    } catch (error) {
        console.error("Erreur TMDB:", error);
        return [];
    }
};
