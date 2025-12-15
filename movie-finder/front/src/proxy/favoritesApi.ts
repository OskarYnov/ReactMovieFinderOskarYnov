import type { Movie } from "../types/movie.type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchFavorites = async (): Promise<Movie[]> => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch favorites');
    const data = await response.json();
    return data.favorites;
};

export const addFavorite = async (movie: Movie): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(movie)
    });
    if (!response.ok) {
        const error = await response.json();
        // Ignorer l'erreur si c'est "déjà favori"
        if (response.status === 409) return;
        throw new Error(error.message || 'Failed to add favorite');
    }
};

export const removeFavorite = async (movieId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        if (response.status === 404) return;
        throw new Error('Failed to remove favorite');
    }
};
