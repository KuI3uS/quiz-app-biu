import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function QuizComments({ quizId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchComments = async () => {
            const q = query(collection(db, 'comments'), where('quizId', '==', quizId));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => doc.data());
            setComments(list);
        };
        fetchComments();
    }, [quizId]);

    const handleSubmit = async () => {
        if (!text) return;

        await addDoc(collection(db, 'comments'), {
            quizId,
            uid: user.uid,
            displayName: user.displayName || 'Anonim',
            text,
            rating,
            timestamp: serverTimestamp()
        });

        setText('');
        setRating(5);
    };

    return (
        <div>
            <h3>Komentarze</h3>

            {user && (
                <div>
          <textarea
              placeholder="Napisz komentarz..."
              value={text}
              onChange={(e) => setText(e.target.value)}
          />
                    <label>
                        Ocena:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[5, 4, 3, 2, 1].map(r => (
                                <option key={r} value={r}>{r} ⭐</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={handleSubmit}>Dodaj komentarz</button>
                </div>
            )}

            <ul>
                {comments.map((c, idx) => (
                    <li key={idx}>
                        <strong>{c.displayName}</strong> ({c.rating}⭐): {c.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}