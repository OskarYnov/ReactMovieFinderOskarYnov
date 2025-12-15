import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.type';
import * as authApi from '../proxy/authApi';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await authApi.getMe(token);
                    setUser(userData);
                } catch (error) {
                    console.error('Session invalide:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (data: LoginRequest) => {
        const result = await authApi.login(data);
        localStorage.setItem('authToken', result.token);
        setToken(result.token);
        setUser(result.user);
    };

    const register = async (data: RegisterRequest) => {
        const result = await authApi.register(data);
        localStorage.setItem('authToken', result.token);
        setToken(result.token);
        setUser(result.user);
    };

    const logout = () => {
        if (token) {
            authApi.logout(token);
        }
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
