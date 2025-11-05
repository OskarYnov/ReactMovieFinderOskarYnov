import { useState, type FormEvent } from "react";
import { useSearch } from "../../Providers/SearchProvider.tsx";
import { useGenres } from "../../hooks/genre.hook.ts";
import "./search-movie-bar.css";

interface SearchFilters {
    query: string;
    year?: string;
    genreId?: number;
}

interface SearchMovieBarProps {
    onSearch: (filters: SearchFilters) => void;
}

export default function SearchMovieBar({ onSearch }: SearchMovieBarProps) {
    const { searchText, setSearchText } = useSearch();
    const [year, setYear] = useState<string>("");
    const [genreId, setGenreId] = useState<number | undefined>(undefined);

    const { genres, loading: loadingGenres } = useGenres();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const query = searchText.trim();
        onSearch({
            query,
            year: year || undefined,
            genreId: genreId || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                value={searchText.query}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Rechercher un film..."
                className="search-bar__input"
            />

            <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Année"
                className="search-bar__input"
                min={1900}
                max={2100}
            />

            <select
                value={genreId ?? ""}
                onChange={(e) => setGenreId(e.target.value ? Number(e.target.value) : undefined)}
                className="search-bar__input"
                disabled={loadingGenres}
            >
                <option value="">Tous les genres</option>
                {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                        {g.name}
                    </option>
                ))}
            </select>

            <button type="submit" className="search-bar__button">
                Chercher
            </button>
        </form>
    );
}
