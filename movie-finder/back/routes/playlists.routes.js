import express from 'express';
import { PlaylistModel } from '../models/playlist.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

// HATEOAS: Générer les liens pour une playlist
const generatePlaylistLinks = (playlistId) => ({
    self: { href: `/api/playlists/${playlistId}`, method: 'GET' },
    update: { href: `/api/playlists/${playlistId}`, method: 'PUT' },
    delete: { href: `/api/playlists/${playlistId}`, method: 'DELETE' },
    addMovie: { href: `/api/playlists/${playlistId}/movies`, method: 'POST' },
    movies: { href: `/api/playlists/${playlistId}/movies`, method: 'GET' }
});

// GET /api/playlists - Obtenir toutes les playlists de l'utilisateur
router.get('/', async (req, res) => {
    try {
        const playlists = PlaylistModel.getByUserId(req.user.id);

        res.json({
            playlists: playlists.map(playlist => ({
                ...playlist,
                _links: generatePlaylistLinks(playlist.id)
            })),
            _links: {
                self: { href: '/api/playlists', method: 'GET' },
                create: { href: '/api/playlists', method: 'POST' }
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de récupérer les playlists'
        });
    }
});

// POST /api/playlists - Créer une nouvelle playlist
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Données manquantes',
                message: 'Le nom de la playlist est requis'
            });
        }

        const playlist = PlaylistModel.create(req.user.id, name);

        res.status(201).json({
            message: 'Playlist créée avec succès',
            playlist,
            _links: generatePlaylistLinks(playlist.id)
        });
    } catch (error) {
        if (error.message.includes('50 caractères')) {
            return res.status(400).json({
                error: 'Nom trop long',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de créer la playlist'
        });
    }
});

// GET /api/playlists/:id - Obtenir une playlist spécifique
router.get('/:id', async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id);
        const playlist = PlaylistModel.getById(playlistId);

        if (!playlist) {
            return res.status(404).json({
                error: 'Playlist non trouvée',
                message: 'Cette playlist n\'existe pas'
            });
        }

        // Vérifier que l'utilisateur est propriétaire
        if (playlist.userId !== req.user.id) {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Vous n\'avez pas accès à cette playlist'
            });
        }

        res.json({
            playlist,
            _links: generatePlaylistLinks(playlist.id)
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de récupérer la playlist'
        });
    }
});

// PUT /api/playlists/:id - Modifier une playlist
router.put('/:id', async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id);
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Données manquantes',
                message: 'Le nom de la playlist est requis'
            });
        }

        const playlist = PlaylistModel.update(playlistId, req.user.id, name);

        res.json({
            message: 'Playlist modifiée avec succès',
            playlist,
            _links: generatePlaylistLinks(playlist.id)
        });
    } catch (error) {
        if (error.message === 'Playlist non trouvée') {
            return res.status(404).json({
                error: 'Playlist non trouvée',
                message: error.message
            });
        }

        if (error.message === 'Non autorisé') {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Vous n\'avez pas accès à cette playlist'
            });
        }

        if (error.message.includes('50 caractères')) {
            return res.status(400).json({
                error: 'Nom trop long',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de modifier la playlist'
        });
    }
});

// DELETE /api/playlists/:id - Supprimer une playlist
router.delete('/:id', async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id);
        const deleted = PlaylistModel.delete(playlistId, req.user.id);

        if (!deleted) {
            return res.status(404).json({
                error: 'Playlist non trouvée',
                message: 'Cette playlist n\'existe pas'
            });
        }

        res.json({
            message: 'Playlist supprimée avec succès',
            _links: {
                playlists: { href: '/api/playlists', method: 'GET' }
            }
        });
    } catch (error) {
        if (error.message === 'Non autorisé') {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Vous n\'avez pas accès à cette playlist'
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de supprimer la playlist'
        });
    }
});

// POST /api/playlists/:id/movies - Ajouter un film à une playlist
router.post('/:id/movies', async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id);
        const { movie } = req.body;

        if (!movie || !movie.id) {
            return res.status(400).json({
                error: 'Données manquantes',
                message: 'Les données du film sont requises'
            });
        }

        const playlist = PlaylistModel.addMovie(playlistId, req.user.id, movie);

        res.json({
            message: 'Film ajouté à la playlist',
            playlist,
            _links: generatePlaylistLinks(playlist.id)
        });
    } catch (error) {
        if (error.message === 'Playlist non trouvée') {
            return res.status(404).json({
                error: 'Playlist non trouvée',
                message: error.message
            });
        }

        if (error.message === 'Non autorisé') {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Vous n\'avez pas accès à cette playlist'
            });
        }

        if (error.message === 'Film déjà dans la playlist') {
            return res.status(409).json({
                error: 'Film déjà présent',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible d\'ajouter le film'
        });
    }
});

// DELETE /api/playlists/:id/movies/:movieId - Retirer un film d'une playlist
router.delete('/:id/movies/:movieId', async (req, res) => {
    try {
        const playlistId = parseInt(req.params.id);
        const movieId = parseInt(req.params.movieId);

        const removed = PlaylistModel.removeMovie(playlistId, req.user.id, movieId);

        if (!removed) {
            return res.status(404).json({
                error: 'Film non trouvé',
                message: 'Ce film n\'est pas dans la playlist'
            });
        }

        res.json({
            message: 'Film retiré de la playlist',
            _links: generatePlaylistLinks(playlistId)
        });
    } catch (error) {
        if (error.message === 'Playlist non trouvée') {
            return res.status(404).json({
                error: 'Playlist non trouvée',
                message: error.message
            });
        }

        if (error.message === 'Non autorisé') {
            return res.status(403).json({
                error: 'Accès refusé',
                message: 'Vous n\'avez pas accès à cette playlist'
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de retirer le film'
        });
    }
});

export default router;
