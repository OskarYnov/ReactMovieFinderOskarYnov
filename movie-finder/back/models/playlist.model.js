// In-memory storage pour les playlists
// Structure: Map<playlistId, { id, userId, name, movies: [], createdAt, updatedAt }>
const playlists = new Map();
let nextId = 1;

export const PlaylistModel = {
    // Créer une nouvelle playlist
    create(userId, name) {
        if (!name || name.trim().length === 0) {
            throw new Error('Le nom de la playlist est requis');
        }

        if (name.length > 50) {
            throw new Error('Le nom de la playlist ne peut pas dépasser 50 caractères');
        }

        const playlist = {
            id: nextId++,
            userId,
            name: name.trim(),
            movies: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        playlists.set(playlist.id, playlist);
        return playlist;
    },

    // Obtenir toutes les playlists d'un utilisateur
    getByUserId(userId) {
        const userPlaylists = [];
        for (const playlist of playlists.values()) {
            if (playlist.userId === userId) {
                userPlaylists.push(playlist);
            }
        }
        return userPlaylists;
    },

    // Obtenir une playlist par ID
    getById(playlistId) {
        return playlists.get(playlistId) || null;
    },

    // Vérifier si l'utilisateur est propriétaire de la playlist
    isOwner(playlistId, userId) {
        const playlist = this.getById(playlistId);
        return playlist && playlist.userId === userId;
    },

    // Mettre à jour le nom d'une playlist
    update(playlistId, userId, name) {
        const playlist = this.getById(playlistId);

        if (!playlist) {
            throw new Error('Playlist non trouvée');
        }

        if (playlist.userId !== userId) {
            throw new Error('Non autorisé');
        }

        if (!name || name.trim().length === 0) {
            throw new Error('Le nom de la playlist est requis');
        }

        if (name.length > 50) {
            throw new Error('Le nom de la playlist ne peut pas dépasser 50 caractères');
        }

        playlist.name = name.trim();
        playlist.updatedAt = new Date();

        return playlist;
    },

    // Supprimer une playlist
    delete(playlistId, userId) {
        const playlist = this.getById(playlistId);

        if (!playlist) {
            return false;
        }

        if (playlist.userId !== userId) {
            throw new Error('Non autorisé');
        }

        return playlists.delete(playlistId);
    },

    // Ajouter un film à une playlist
    addMovie(playlistId, userId, movie) {
        const playlist = this.getById(playlistId);

        if (!playlist) {
            throw new Error('Playlist non trouvée');
        }

        if (playlist.userId !== userId) {
            throw new Error('Non autorisé');
        }

        // Vérifier si le film n'est pas déjà dans la playlist
        const exists = playlist.movies.some(m => m.id === movie.id);
        if (exists) {
            throw new Error('Film déjà dans la playlist');
        }

        playlist.movies.push({
            ...movie,
            addedAt: new Date()
        });
        playlist.updatedAt = new Date();

        return playlist;
    },

    // Retirer un film d'une playlist
    removeMovie(playlistId, userId, movieId) {
        const playlist = this.getById(playlistId);

        if (!playlist) {
            throw new Error('Playlist non trouvée');
        }

        if (playlist.userId !== userId) {
            throw new Error('Non autorisé');
        }

        const initialLength = playlist.movies.length;
        playlist.movies = playlist.movies.filter(m => m.id !== parseInt(movieId));
        
        if (playlist.movies.length < initialLength) {
            playlist.updatedAt = new Date();
            return true;
        }

        return false;
    },

    // Pour le développement - obtenir toutes les playlists
    getAll() {
        return Array.from(playlists.values());
    }
};
