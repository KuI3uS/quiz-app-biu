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
            <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Globalna wyszukiwarka */}
                <form onSubmit={handleSearch} style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Szukaj quizów..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit">🔍</button>
                </form>
                <Link to="/">Home</Link>
                <Link to="/random">Losowy quiz</Link>
                <Link to="/search">Szukaj quizów</Link>
                <Link to="/quiz/create">Stwórz quiz</Link>
                <Link to="/quiz/list">Moje quizy</Link>
                {!user && <Link to="/register">Zarejestruj się</Link>}
                <Link to="/leaderboard">Ranking</Link>
                <Link to="/badges">Odznaki</Link>
                {user && <Link to="/dashboard">Panel użytkownika</Link>}
                {user ? (
                    <>
                        <span>Zalogowany jako: {user.email}</span>
                        <button onClick={logout}>Wyloguj</button>
                    </>
                ) : (
                    <Link to="/login">Zaloguj</Link>
                )}
            </nav>
            <Outlet/>
        </div>
    );
}