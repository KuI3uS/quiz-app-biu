import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await sendEmailVerification(result.user);
            alert('Zarejestrowano! Sprawdź e-mail.');
            navigate('/login');
        } catch (err) {
            alert('Błąd rejestracji: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    placeholder="Email"
                    {...register("email", { required: "Email jest wymagany" })}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="Hasło"
                    {...register("password", { required: "Hasło jest wymagane", minLength: 6 })}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

                <button type="submit">Zarejestruj</button>
            </form>
        </div>
    );
}