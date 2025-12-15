import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';

// Charger les variables d'environnement
dotenv.config({ path: '.env.backend' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express.json());

// Logger pour le développement
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Route de base avec HATEOAS
app.get('/api', (req, res) => {
    res.json({
        message: 'Movie Finder API',
        version: '1.0.0',
        _links: {
            self: { href: '/api', method: 'GET' },
            auth: {
                register: { href: '/api/auth/register', method: 'POST' },
                login: { href: '/api/auth/login', method: 'POST' },
                me: { href: '/api/auth/me', method: 'GET', protected: true },
                logout: { href: '/api/auth/logout', method: 'POST', protected: true }
            },
            favorites: {
                list: { href: '/api/favorites', method: 'GET', protected: true },
                add: { href: '/api/favorites', method: 'POST', protected: true },
                remove: { href: '/api/favorites/:movieId', method: 'DELETE', protected: true }
            }
        }
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        message: `La route ${req.method} ${req.path} n'existe pas`,
        _links: {
            api: { href: '/api', method: 'GET', description: 'Découvrir l\'API' }
        }
    });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({
        error: 'Erreur serveur',
        message: err.message || 'Une erreur interne est survenue'
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 API disponible sur http://localhost:${PORT}/api\n`);
});
