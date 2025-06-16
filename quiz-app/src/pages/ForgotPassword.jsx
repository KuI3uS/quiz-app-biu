import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('E-mail do resetowania hasła został wysłany.');
        } catch (err) {
            setMessage('Błąd: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Resetowanie hasła</h1>
            <input
                type="email"
                placeholder="Twój e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleReset}>Wyślij link resetujący</button>
            {message && <p>{message}</p>}
        </div>
    );
}