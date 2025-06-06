import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div>
            <nav style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>
                <Link to="/quiz/create">Stwórz quiz</Link>
                <Link to="/quiz/list">Moje quizy</Link>
                <Link to="/about">About</Link>
                <Link to="/register">Zarejestruj się</Link>
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