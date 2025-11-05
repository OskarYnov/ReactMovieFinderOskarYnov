export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    overview?: string;
    poster_path?: string;
    release_date?: string;
    vote_average?: number;
    genres: Genre[];
    runtime: number;
    vote_count: number;
    budget: number;
    revenue: number;
    genre_ids?: number[];
}