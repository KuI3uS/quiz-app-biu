import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PhotoDetails from "../components/PhotoDetails.jsx";
import { photos } from "../data/photos.js";

export default function App() {
    const randomId = photos[Math.floor(Math.random() * photos.length)].id;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/photo/${randomId}`} />} />
                <Route path="/photo/:id" element={<PhotoDetails />} />
                <Route path="*" element={<h2>Nie znaleziono strony</h2>} />
            </Routes>
        </BrowserRouter>
    );
}