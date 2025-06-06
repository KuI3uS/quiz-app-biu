import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ResetPassword() {
    const [email, setEmail] = useState('');

    const handleReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('E-mail z linkiem do resetowania hasła został wysłany!');
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Resetuj hasło</h2>
            <input
                type="email"
                placeholder="Podaj swój e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleReset}>Wyślij link do resetu</button>
        </div>
    );
}