import type { User } from '../types/auth.type';
import type { Movie } from '../types/movie.type';
import type { Playlist } from '../types/playlist.type';

export interface PublicUserProfile extends User {
    _links: any;
}

export interface UserFavoritesResponse {
    userId: number;
    count: number;
    favorites: (Movie & { addedAt: string })[];
}

export interface UserPlaylistsResponse {
    userId: number;
    count: number;
    playlists: Playlist[];
}

export interface PublicUserListResponse {
    users: { id: number; name: string; createdAt: string }[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const getUsers = async (): Promise<PublicUserListResponse> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
    return response.json();
};

export const getUserProfile = async (id: number): Promise<PublicUserProfile> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Utilisateur non trouvé');
    return response.json();
};

export const getUserFavorites = async (id: number): Promise<UserFavoritesResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/favorites`);
    if (!response.ok) throw new Error('Erreur lors du chargement des favoris');
    return response.json();
};

export const getUserPlaylists = async (id: number): Promise<UserPlaylistsResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/playlists`);
    if (!response.ok) throw new Error('Erreur lors du chargement des playlists');
    return response.json();
};
