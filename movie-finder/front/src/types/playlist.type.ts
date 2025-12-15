import { Movie } from './movie.type';

export interface Playlist {
    id: number;
    userId: number;
    name: string;
    movies: Movie[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlaylistRequest {
    name: string;
}

export interface UpdatePlaylistRequest {
    name: string;
}

export interface AddMovieToPlaylistRequest {
    movie: Movie;
}
