import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.tsx";
import Search from "./pages/Search/Search.tsx";
import Favorites from "./pages/Favorites/Favorites.tsx";
import { FavoritesProvider } from "./Providers/FavoriteProvider.tsx";
import { SearchProvider } from "./Providers/SearchProvider.tsx";
import { AuthProvider } from "./Providers/AuthProvider.tsx";
import Home from "./pages/Home/Home.tsx";
import MovieDetails from "./pages/MovieDetails/MovieDetails.tsx";
import { ThemeProvider } from "./Providers/ThemeProvider.tsx";
import PlaylistsPage from "./pages/Playlists/PlaylistsPage.tsx";
import PlaylistDetailsPage from "./pages/Playlists/PlaylistDetailsPage.tsx";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import UsersPage from "./pages/Users/UsersPage.tsx";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
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
                                    <Route path="/playlists" element={<PlaylistsPage />} />
                                    <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/user/:id" element={<ProfilePage />} />
                                    <Route path="/community" element={<UsersPage />} />
                                </Routes>
                            </main>
                        </Router>
                    </FavoritesProvider>
                </SearchProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
