import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateDuel({ quizId }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const createDuel = async () => {
        if (!user) return alert('Musisz być zalogowany, aby rozpocząć pojedynek.');

        try {
            const docRef = await addDoc(collection(db, 'duels'), {
                quizId,
                hostUid: user.uid,
                guestUid: null,
                status: 'waiting',
                createdAt: serverTimestamp(),
                results: {},
            });

            navigate(`/duel/${docRef.id}`);
        } catch (error) {
            console.error('Błąd tworzenia pojedynku:', error);
            alert('Nie udało się utworzyć pojedynku.');
        }
    };

    return (
        <button
            onClick={createDuel}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
             Rozpocznij pojedynek
        </button>
    );
}