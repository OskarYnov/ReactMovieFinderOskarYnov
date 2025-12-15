import express from 'express';
import { FavoriteModel } from '../models/favorite.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

// HATEOAS: Générer les liens pour un favori
const generateFavoriteLinks = (movieId) => ({
    self: { href: `/api/favorites`, method: 'GET' },
    add: { href: `/api/favorites`, method: 'POST' },
    remove: { href: `/api/favorites/${movieId}`, method: 'DELETE' },
    movie: { href: `/movie/${movieId}`, method: 'GET', description: 'Voir les détails du film' }
});

// GET /api/favorites - Obtenir tous les favoris de l'utilisateur
router.get('/', async (req, res) => {
    try {
        const favorites = FavoriteModel.getByUserId(req.user.id);

        res.json({
            count: favorites.length,
            favorites: favorites.map(fav => ({
                ...fav,
                _links: generateFavoriteLinks(fav.id)
            })),
            _links: {
                self: { href: '/api/favorites', method: 'GET' },
                add: { href: '/api/favorites', method: 'POST', description: 'Ajouter un favori' }
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de récupérer les favoris'
        });
    }
});

// POST /api/favorites - Ajouter un film aux favoris
router.post('/', async (req, res) => {
    try {
        const movie = req.body;

        // Validation
        if (!movie || !movie.id) {
            return res.status(400).json({
                error: 'Données invalides',
                message: 'Les données du film sont requises'
            });
        }

        const favorite = FavoriteModel.add(req.user.id, movie);

        res.status(201).json({
            message: 'Film ajouté aux favoris',
            favorite: {
                ...favorite,
                _links: generateFavoriteLinks(favorite.id)
            },
            _links: {
                self: { href: '/api/favorites', method: 'GET' },
                remove: { href: `/api/favorites/${favorite.id}`, method: 'DELETE' }
            }
        });
    } catch (error) {
        if (error.message === 'Film déjà dans les favoris') {
            return res.status(409).json({
                error: 'Déjà dans les favoris',
                message: 'Ce film est déjà dans vos favoris'
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible d\'ajouter le favori'
        });
    }
});

// DELETE /api/favorites/:movieId - Retirer un film des favoris
router.delete('/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;

        const removed = FavoriteModel.remove(req.user.id, movieId);

        if (!removed) {
            return res.status(404).json({
                error: 'Favori non trouvé',
                message: 'Ce film n\'est pas dans vos favoris'
            });
        }

        res.json({
            message: 'Film retiré des favoris',
            _links: {
                self: { href: '/api/favorites', method: 'GET' },
                add: { href: '/api/favorites', method: 'POST' }
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de retirer le favori'
        });
    }
});

export default router;
