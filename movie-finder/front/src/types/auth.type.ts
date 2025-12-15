export interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
    _links?: any;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
