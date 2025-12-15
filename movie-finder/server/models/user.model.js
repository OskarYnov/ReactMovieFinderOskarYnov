import bcrypt from 'bcryptjs';

// In-memory storage (remplacer par MongoDB en production)
const users = [];
const tokenBlacklist = new Set();

export const UserModel = {
    // Créer un nouvel utilisateur
    async create({ name, email, password }) {
        // Vérifier si l'email existe déjà
        if (users.find(u => u.email === email)) {
            throw new Error('Email déjà utilisé');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(user);
        return this.sanitize(user);
    },

    // Trouver un utilisateur par email
    async findByEmail(email) {
        return users.find(u => u.email === email);
    },

    // Trouver un utilisateur par ID
    async findById(id) {
        const user = users.find(u => u.id === id);
        return user ? this.sanitize(user) : null;
    },

    // Vérifier le mot de passe
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    // Retirer le mot de passe de l'objet user
    sanitize(user) {
        if (!user) return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // Ajouter un token à la blacklist (pour le logout)
    blacklistToken(token) {
        tokenBlacklist.add(token);
    },

    // Vérifier si un token est blacklisté
    isTokenBlacklisted(token) {
        return tokenBlacklist.has(token);
    },

    // Pour le développement - obtenir tous les utilisateurs
    getAllUsers() {
        return users.map(u => this.sanitize(u));
    }
};
