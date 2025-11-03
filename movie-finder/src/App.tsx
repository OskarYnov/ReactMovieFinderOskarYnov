import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.tsx";
import Home from "./pages/Home/Home.tsx";
import MovieDetails from "./pages/MovieDetails/MovieDetails.tsx";
import Favorites from "./pages/Favorites/Favorites.tsx";

function App() {
    return (
        <Router>
            <Navbar />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
