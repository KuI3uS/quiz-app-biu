import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import '../styles/DuelRoom.scss';

export default function DuelRoom() {
    const { id } = useParams(); // ID pojedynku
    const navigate = useNavigate();
    const { user } = useAuth();

    const [duel, setDuel] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subskrybuj pojedynek
    useEffect(() => {
        if (!user) return;

        const unsub = onSnapshot(doc(db, 'duels', id), async (snap) => {
            const data = snap.data();
            setDuel(data);

            // Dołącz jako gość jeśli nie jesteś gospodarzem
            if (data && data.status === 'waiting' && !data.guestUid && user.uid !== data.hostUid) {
                await updateDoc(doc(db, 'duels', id), {
                    guestUid: user.uid,
                    status: 'started',
                });
            }

            setLoading(false);
        });

        return () => unsub();
    }, [id, user]);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (duel?.quizId && !quiz) {
                const quizSnap = await getDoc(doc(db, 'quizzes', duel.quizId));
                if (quizSnap.exists()) {
                    setQuiz({ docId: quizSnap.id, ...quizSnap.data() });
                }
            }
        };

        fetchQuiz();
    }, [duel, quiz]);

    if (loading || !duel || !duel.status) return <p>⏳ Ładowanie pojedynku...</p>;

    const results = duel.results || {};
    const userResult = results[user.uid];
    const opponentUid = user.uid === duel.hostUid ? duel.guestUid : duel.hostUid;
    const opponentResult = results[opponentUid];

    if (duel.status === 'waiting') {
        return (
            <div className="duel-room p-4">
                <h2> Oczekiwanie na przeciwnika...</h2>
                <p>Udostępnij ten link drugiemu graczowi:</p>
                <code>{window.location.href}</code>
            </div>
        );
    }

    if (duel.status === 'started') {
        if (!quiz) {
            return <p> Ładowanie quizu...</p>;
        }

        const hostFinished = results[duel.hostUid];
        const guestFinished = results[duel.guestUid];
        const bothFinished = hostFinished && guestFinished;

        if (!bothFinished) {
            return (
                <div className="duel-room p-4">
                    <h2> Pojedynek rozpoczęty!</h2>
                    <h3 className="text-lg font-bold mb-2">Quiz: {quiz.title}</h3>
                    <p className="mb-4">{quiz.description}</p>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={() =>
                            navigate(`/quiz/${quiz.docId}`, {
                                state: { duelId: id },
                            })
                        }
                    >
                        Rozpocznij quiz
                    </button>
                    <p className="mt-4 text-sm">Po zakończeniu zobaczysz wyniki obydwu graczy.</p>
                </div>
            );
        } else if (!opponentResult) {
            return (
                <div className="duel-room p-4">
                    <h2> Ukończyłeś quiz!</h2>
                    <p> Czekamy, aż przeciwnik ukończy swój quiz...</p>
                </div>
            );
        } else {
            return (
                <div className="duel-room p-4">
                    <h2> Pojedynek zakończony!</h2>
                    <div className="duel-room p-4">
                        <p>
                            <strong>{userResult?.displayName || 'Gracz Ty'}:</strong> {userResult?.score} / {userResult?.total}
                        </p>
                        <p>
                            <strong>{opponentResult?.displayName || 'Przeciwnik'}:</strong> {opponentResult?.score} / {opponentResult?.total}
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <p> Pojedynek zakończony.</p>;
}