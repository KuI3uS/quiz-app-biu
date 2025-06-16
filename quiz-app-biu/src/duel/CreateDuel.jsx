import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateDuel({ quizId }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const createDuel = async () => {
        const docRef = await addDoc(collection(db, 'duels'), {
            quizId,
            hostUid: user.uid,
            guestUid: null,
            status: 'waiting',
            createdAt: serverTimestamp(),
        });
        navigate(`/duel/${docRef.id}`);
    };

    return (
        <button onClick={createDuel}>
            🤝 Rozpocznij pojedynek
        </button>
    );
}