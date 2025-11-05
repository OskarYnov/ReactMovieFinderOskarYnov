import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.tsx";
import Search from "./pages/Search/Search.tsx";
import Favorites from "./pages/Favorites/Favorites.tsx";
import {FavoritesProvider} from "./Providers/FavoriteProvider.tsx";
import {SearchProvider} from "./Providers/SearchProvider.tsx";
import Home from "./pages/Home/Home.tsx";
import MovieDetails from "./pages/MovieDetails/MovieDetails.tsx";
import {ThemeProvider} from "./Providers/ThemeProvider.tsx";

function App() {
    return (
        <ThemeProvider>
            <SearchProvider>
                <FavoritesProvider>
                    <Router>
                        <Navbar />
                        <main className="app-content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/recherche" element={<Search />} />
                                <Route path="/movie/:id" element={<MovieDetails />} />
                                <Route path="/favorites" element={<Favorites />} />
                            </Routes>
                        </main>
                    </Router>
                </FavoritesProvider>
            </SearchProvider>
        </ThemeProvider>
    );
}

export default App;
