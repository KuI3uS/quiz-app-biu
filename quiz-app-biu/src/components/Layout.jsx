import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
    return (
        <div>
            <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>
                <Link to="/about">About</Link>
            </nav>
            <Outlet />
        </div>
    )
}