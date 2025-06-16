import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(result.user);
            alert('Zarejestrowano! Sprawdź e-mail w celu potwierdzenia konta.');
            navigate('/login');
        } catch (err) {
            alert('Błąd rejestracji: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Zarejestruj</button>
        </div>
    );
}