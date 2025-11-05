import MovieList from "../../components/MovieList/MovieList.tsx";
import {useFavorites} from "../../Providers/FavoriteProvider.tsx";

export default function Favorites() {
    const { favorites } = useFavorites();

    return (
        <div className="page">
            <h1>Mes Favoris</h1>
            <MovieList movies={favorites} />
        </div>
    );
}
