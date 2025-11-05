import { createContext, type ReactNode, useContext, useState } from "react";
import type { Movie } from "../types/movie.type.ts";

interface SearchContextType {
    searchText: string;
    setSearchText: (text: string) => void;
    movies: Movie[];
    setMovies: (movies: Movie[]) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchText, setSearchTextState] = useState<string>(() => {
        const stored = localStorage.getItem("searchText");
        return stored ? JSON.parse(stored) : "";
    });

    const [movies, setMoviesState] = useState<Movie[]>(() => {
        const stored = localStorage.getItem("searchMovies");
        return stored ? JSON.parse(stored) : [];
    });

    const setSearchText = (text: string) => {
        setSearchTextState(text);
        localStorage.setItem("searchText", JSON.stringify(text));
    };

    const setMovies = (list: Movie[]) => {
        setMoviesState(list);
        localStorage.setItem("searchMovies", JSON.stringify(list));
    };

    return (
        <SearchContext.Provider value={{ searchText, setSearchText, movies, setMovies }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
};
