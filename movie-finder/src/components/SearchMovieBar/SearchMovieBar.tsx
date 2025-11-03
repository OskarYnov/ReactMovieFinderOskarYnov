import {type FormEvent, useState} from "react";
import "./search-movie-bar.css";

interface SearchMovieBarProps {
    onSearch: (query: string) => void;
}

export default function SearchMovieBar({ onSearch }: SearchMovieBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Rechercher un film..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-bar__input"
            />
            <button type="submit" className="search-bar__button">
                Chercher
            </button>
        </form>
    );
}
