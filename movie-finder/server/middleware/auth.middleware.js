import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Non authentifié',
                message: 'Token manquant ou invalide',
                code: 'NO_TOKEN'
            });
        }

        const token = authHeader.substring(7); // Retirer "Bearer "

        // Vérifier si le token est blacklisté (logout)
        if (UserModel.isTokenBlacklisted(token)) {
            return res.status(401).json({
                error: 'Token invalide',
                message: 'Session expirée, veuillez vous reconnecter',
                code: 'TOKEN_BLACKLISTED'
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                error: 'Utilisateur non trouvé',
                message: 'Veuillez vous reconnecter',
                code: 'USER_NOT_FOUND'
            });
        }

        // Attacher l'utilisateur et le token à la requête
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token invalide',
                message: 'Veuillez vous reconnecter',
                code: 'INVALID_TOKEN'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expiré',
                message: 'Votre session a expiré, veuillez vous reconnecter',
                code: 'TOKEN_EXPIRED'
            });
        }

        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Une erreur est survenue lors de l\'authentification'
        });
    }
};
