import type { Playlist, CreatePlaylistRequest, UpdatePlaylistRequest, AddMovieToPlaylistRequest } from '../types/playlist.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper pour obtenir le token d'authentification
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Helper pour les headers avec authentification
const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Obtenir toutes les playlists de l'utilisateur
export const getPlaylists = async (): Promise<Playlist[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des playlists');
        }

        const data = await response.json();
        return data.playlists || [];
    } catch (error) {
        console.error('Erreur getPlaylists:', error);
        throw error;
    }
};

// Obtenir une playlist par ID
export const getPlaylist = async (id: number): Promise<Playlist> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la playlist');
        }

        const data = await response.json();
        return data.playlist;
    } catch (error) {
        console.error('Erreur getPlaylist:', error);
        throw error;
    }
};

// Créer une nouvelle playlist
export const createPlaylist = async (request: CreatePlaylistRequest): Promise<Playlist> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de la playlist');
        }

        const data = await response.json();
        return data.playlist;
    } catch (error) {
        console.error('Erreur createPlaylist:', error);
        throw error;
    }
};

// Modifier une playlist
export const updatePlaylist = async (id: number, request: UpdatePlaylistRequest): Promise<Playlist> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la modification de la playlist');
        }

        const data = await response.json();
        return data.playlist;
    } catch (error) {
        console.error('Erreur updatePlaylist:', error);
        throw error;
    }
};

// Supprimer une playlist
export const deletePlaylist = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la playlist');
        }
    } catch (error) {
        console.error('Erreur deletePlaylist:', error);
        throw error;
    }
};

// Ajouter un film à une playlist
export const addMovieToPlaylist = async (playlistId: number, request: AddMovieToPlaylistRequest): Promise<Playlist> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/movies`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du film');
        }

        const data = await response.json();
        return data.playlist;
    } catch (error) {
        console.error('Erreur addMovieToPlaylist:', error);
        throw error;
    }
};

// Retirer un film d'une playlist
export const removeMovieFromPlaylist = async (playlistId: number, movieId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/movies/${movieId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erreur lors du retrait du film');
        }
    } catch (error) {
        console.error('Erreur removeMovieFromPlaylist:', error);
        throw error;
    }
};
