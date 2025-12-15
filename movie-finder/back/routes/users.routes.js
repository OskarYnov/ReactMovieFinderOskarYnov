import express from 'express';
import { UserModel } from '../models/user.model.js';
import { FavoriteModel } from '../models/favorite.model.js';
import { PlaylistModel } from '../models/playlist.model.js';

const router = express.Router();

// Obtenir la liste de tous les utilisateurs (pour la découverte par les invités)
router.get('/', async (req, res) => {
    try {
        const users = UserModel.getAllUsers().map(user => ({
            id: user.id,
            name: user.name,
            createdAt: user.createdAt
        }));

        res.json({
            users,
            _links: users.map(u => ({
                href: `/api/users/${u.id}`,
                method: 'GET'
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir le profil public d'un utilisateur
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // On ne renvoie que les données publiques
        const publicProfile = {
            id: user.id,
            name: user.name,
            createdAt: user.createdAt,
            _links: {
                self: { href: `/api/users/${user.id}`, method: 'GET' },
                favorites: { href: `/api/users/${user.id}/favorites`, method: 'GET' },
                playlists: { href: `/api/users/${user.id}/playlists`, method: 'GET' }
            }
        };

        res.json(publicProfile);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir les favoris d'un utilisateur (Public)
router.get('/:id/favorites', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Vérifier si l'utilisateur existe
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const favorites = FavoriteModel.getByUserId(userId);

        res.json({
            userId,
            count: favorites.length,
            favorites,
            _links: {
                user: { href: `/api/users/${userId}`, method: 'GET' }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir les playlists d'un utilisateur (Public)
router.get('/:id/playlists', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Vérifier si l'utilisateur existe
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const playlists = PlaylistModel.getByUserId(userId);

        res.json({
            userId,
            count: playlists.length,
            playlists,
            _links: {
                user: { href: `/api/users/${userId}`, method: 'GET' }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
