import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// HATEOAS: Générer les liens pour les réponses
const generateAuthLinks = (userId) => ({
    self: { href: '/api/auth/me', method: 'GET' },
    logout: { href: '/api/auth/logout', method: 'POST' },
    favorites: { href: '/api/favorites', method: 'GET' }
});

// POST /api/auth/register - Inscription
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Données manquantes',
                message: 'Nom, email et mot de passe requis'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Mot de passe trop court',
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // Créer l'utilisateur
        const user = await UserModel.create({ name, email, password });

        // Générer le JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Compte créé avec succès',
            user,
            token,
            _links: generateAuthLinks(user.id)
        });
    } catch (error) {
        if (error.message === 'Email déjà utilisé') {
            return res.status(409).json({
                error: 'Email déjà utilisé',
                message: 'Un compte existe déjà avec cet email'
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de créer le compte'
        });
    }
});

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Données manquantes',
                message: 'Email et mot de passe requis'
            });
        }

        // Trouver l'utilisateur
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: 'Identifiants incorrects',
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await UserModel.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Identifiants incorrects',
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Connexion réussie',
            user: UserModel.sanitize(user),
            token,
            _links: generateAuthLinks(user.id)
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de se connecter'
        });
    }
});

// GET /api/auth/me - Obtenir l'utilisateur actuel (protégé)
router.get('/me', authMiddleware, async (req, res) => {
    res.json({
        user: req.user,
        _links: generateAuthLinks(req.user.id)
    });
});

// POST /api/auth/logout - Déconnexion (protégé)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        // Ajouter le token à la blacklist
        UserModel.blacklistToken(req.token);

        res.json({
            message: 'Déconnexion réussie',
            _links: {
                login: { href: '/api/auth/login', method: 'POST' },
                register: { href: '/api/auth/register', method: 'POST' }
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Impossible de se déconnecter'
        });
    }
});

export default router;
