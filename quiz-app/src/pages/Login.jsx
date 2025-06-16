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
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (!result.user.emailVerified) {
                await auth.signOut();
                alert('Zweryfikuj e-mail zanim się zalogujesz.');
                return;
            }
            alert('Zalogowano!');
            navigate('/quiz');
        } catch (err) {
            alert('Błąd logowania: ' + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Google loginy są domyślnie zweryfikowane
            alert('Zalogowano przez Google!');
            navigate('/quiz');
        } catch (err) {
            alert('Błąd Google: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Logowanie</h1>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleEmailLogin}>Zaloguj</button>
            <p>
                <a href="/forgot-password">Zapomniałeś hasła?</a>
            </p>
            <button onClick={handleGoogleLogin}>Zaloguj przez Google</button>
        </div>
    );
}