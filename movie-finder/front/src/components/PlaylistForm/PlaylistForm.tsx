import { useState, useEffect } from 'react';
import './PlaylistForm.css';

interface PlaylistFormProps {
    initialName?: string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function PlaylistForm({ initialName = '', onSubmit, onCancel, isLoading = false }: PlaylistFormProps) {
    const [name, setName] = useState(initialName);
    const [error, setError] = useState('');

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError('Le nom de la playlist est requis');
            return;
        }

        if (name.length > 50) {
            setError('Le nom ne peut pas dépasser 50 caractères');
            return;
        }

        setError('');
        onSubmit(name.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="playlist-form">
            <div className="playlist-form__field">
                <label htmlFor="playlist-name" className="playlist-form__label">
                    Nom de la playlist
                </label>
                <input
                    id="playlist-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ma playlist de films..."
                    className="playlist-form__input"
                    maxLength={50}
                    disabled={isLoading}
                    autoFocus
                />
                <div className="playlist-form__char-count">
                    {name.length}/50
                </div>
                {error && (
                    <p className="playlist-form__error">{error}</p>
                )}
            </div>

            <div className="playlist-form__actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="playlist-form__btn playlist-form__btn--cancel"
                    disabled={isLoading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="playlist-form__btn playlist-form__btn--submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
