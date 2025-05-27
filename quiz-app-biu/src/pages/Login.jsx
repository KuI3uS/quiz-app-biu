import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Zalogowano!');
            navigate('/quiz');
        } catch (err) {
            alert('Błąd logowania: ' + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert('Zalogowano przez Google!');
            navigate('/quiz');
        } catch (err) {
            alert('Błąd Google: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Logowanie</h1>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleEmailLogin}>Zaloguj</button>
            <button onClick={handleGoogleLogin}>Zaloguj przez Google</button>
        </div>
    );
}