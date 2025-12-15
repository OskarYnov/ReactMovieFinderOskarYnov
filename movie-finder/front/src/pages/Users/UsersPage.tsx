import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, type PublicUserListResponse } from '../../proxy/usersApi';
import { Users } from 'lucide-react';
import './UsersPage.css';

export default function UsersPage() {
    const [users, setUsers] = useState<PublicUserListResponse['users']>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data.users);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger les utilisateurs.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="users-loading"><div className="spinner"></div> Chargement de la communauté...</div>;
    if (error) return <div className="users-error">{error}</div>;

    return (
        <div className="users-page">
            <header className="users-header">
                <h1><Users size={32} className="icon" /> Communauté</h1>
                <p>Découvrez les profils des autres passionnés de cinéma</p>
            </header>

            <div className="users-grid">
                {users.map(user => (
                    <Link to={`/user/${user.id}`} key={user.id} className="user-card">
                        <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p>Membre depuis {new Date(user.createdAt).getFullYear()}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {users.length === 0 && (
                <div className="empty-state">
                    Aucun membre pour le moment. Soyez le premier !
                </div>
            )}
        </div>
    );
}
