import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import type { Movie } from "../types/movie.type.ts";
import { useAuth } from "./AuthProvider";
import * as favoritesApi from "../proxy/favoritesApi";

interface FavoritesContextType {
    favorites: Movie[];
    toggleFavorite: (movie: Movie) => void;
    isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: () => { },
    isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<Movie[]>([]);

    // Effet pour charger les favoris (Local ou API)
    useEffect(() => {
        if (isAuthenticated) {
            favoritesApi.fetchFavorites()
                .then(serverFavorites => {
                    setFavorites(serverFavorites);
                })
                .catch(err => console.error("Erreur chargement favoris API:", err));
        } else {
            const stored = localStorage.getItem("favorites");
            if (stored) {
                setFavorites(JSON.parse(stored));
            } else {
                setFavorites([]);
            }
        }
    }, [isAuthenticated]);

    // Effet pour sauvegarder en local (seulement si non connecté)
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }, [favorites, isAuthenticated]);

    const toggleFavorite = async (movie: Movie) => {
        const exists = favorites.some((m) => m.id === movie.id);

        // Mise à jour optimiste et locale
        setFavorites((prev) => {
            if (exists) return prev.filter((m) => m.id !== movie.id);
            return [...prev, movie];
        });

        // Si connecté, synchroniser avec le backend
        if (isAuthenticated) {
            try {
                if (exists) {
                    await favoritesApi.removeFavorite(movie.id);
                } else {
                    await favoritesApi.addFavorite(movie);
                }
            } catch (err) {
                console.error("Erreur sync favoris:", err);
                // En cas d'erreur API, on pourrait rollback ici, 
                // mais pour l'instant on laisse l'optimiste.
            }
        }
    };

    const isFavorite = (id: number) => favorites.some((m) => m.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};
