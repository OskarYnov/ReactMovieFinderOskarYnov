import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Inscription
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'inscription');
    }

    return result;
};

// Connexion
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la connexion');
    }

    return result;
};

// Récupérer l'utilisateur courant
export const getMe = async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Erreur de session');
    }

    return result.user;
};

// Déconnexion (optionnel côté serveur si stateless, mais bonne pratique)
export const logout = async (token: string): Promise<void> => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion serveur', error);
    }
};
