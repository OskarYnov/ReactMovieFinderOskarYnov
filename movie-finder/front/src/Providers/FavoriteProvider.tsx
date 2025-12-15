import {createContext, useState, useEffect, type ReactNode, useContext} from "react";
import type {Movie} from "../types/movie.type.ts";

interface FavoritesContextType {
    favorites: Movie[];
    toggleFavorite: (movie: Movie) => void;
    isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: () => {},
    isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Movie[]>(() => {
        const stored = localStorage.getItem("favorites");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (movie: Movie) => {
        setFavorites((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            if (exists) {
                return prev.filter((m) => m.id !== movie.id);
            }
            return [...prev, movie];
        });
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
