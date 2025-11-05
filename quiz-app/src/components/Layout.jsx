import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.scss';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    return (
        <div className="layout">
            <header className="navbar">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Szukaj quizów..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit">Szukaj</button>
                </form>

                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/random">Losowy quiz</Link>
                    <Link to="/search">Szukaj</Link>
                    <Link to="/quiz/create">Stwórz</Link>
                    <Link to="/quiz/list">Moje quizy</Link>
                    <Link to="/leaderboard">Ranking</Link>
                    <Link to="/badges">Odznaki</Link>
                    {user && <Link to="/dashboard">Panel</Link>}
                </nav>

                <div className="auth-block">
                    {user ? (
                        <>
                            <span>{user.email}</span>
                            <button onClick={logout}>Wyloguj</button>
                        </>
                    ) : (
                        <>
                            <Link to="/register">Rejestracja</Link>
                            <Link to="/login">Logowanie</Link>
                        </>
                    )}
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}