// In-memory storage pour les favoris
// Structure: { userId: [{ movie data }] }
const favorites = new Map();

export const FavoriteModel = {
    // Obtenir tous les favoris d'un utilisateur
    getByUserId(userId) {
        return favorites.get(userId) || [];
    },

    // Ajouter un film aux favoris
    add(userId, movie) {
        if (!favorites.has(userId)) {
            favorites.set(userId, []);
        }

        const userFavorites = favorites.get(userId);

        // Vérifier si le film n'est pas déjà dans les favoris
        const exists = userFavorites.some(fav => fav.id === movie.id);
        if (exists) {
            throw new Error('Film déjà dans les favoris');
        }

        userFavorites.push({
            ...movie,
            addedAt: new Date()
        });

        return movie;
    },

    // Retirer un film des favoris
    remove(userId, movieId) {
        if (!favorites.has(userId)) {
            return false;
        }

        const userFavorites = favorites.get(userId);
        const initialLength = userFavorites.length;

        const filtered = userFavorites.filter(fav => fav.id !== parseInt(movieId));
        favorites.set(userId, filtered);

        return filtered.length < initialLength;
    },

    // Vérifier si un film est dans les favoris
    isFavorite(userId, movieId) {
        const userFavorites = this.getByUserId(userId);
        return userFavorites.some(fav => fav.id === parseInt(movieId));
    },

    // Pour le développement - obtenir toutes les données
    getAll() {
        return Object.fromEntries(favorites);
    }
};
