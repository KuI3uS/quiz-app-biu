import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function DuelRoom() {
    const { id } = useParams(); // id pojedynku
    const navigate = useNavigate();
    const { user } = useAuth();

    const [duel, setDuel] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

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

            // Pobierz quiz jeśli jeszcze nie jest pobrany
            if (data?.quizId && !quiz) {
                const quizSnap = await getDoc(doc(db, 'quizzes', data.quizId));
                if (quizSnap.exists()) {
                    setQuiz({ docId: quizSnap.id, ...quizSnap.data() });
                }
            }

            setLoading(false);
        });

        return () => unsub();
    }, [id, user, quiz]);

    if (loading || !duel) return <p>⏳ Ładowanie pojedynku...</p>;

    const userResult = duel?.results?.[user.uid];
    const opponentUid = user.uid === duel.hostUid ? duel.guestUid : duel.hostUid;
    const opponentResult = duel?.results?.[opponentUid];

    const bothFinished = userResult && opponentResult;

    if (duel.status === 'waiting') {
        return (
            <div className="p-4">
                <h2>🕓 Oczekiwanie na przeciwnika...</h2>
                <p>Udostępnij ten link drugiemu graczowi:</p>
                <code>{window.location.href}</code>
            </div>
        );
    }

    if (duel.status === 'started' && quiz) {
        const host = duel.results?.[duel.hostUid];
        const guest = duel.results?.[duel.guestUid];
        const bothFinished = host && guest;

        if (!bothFinished) {
            return (
                <div className="p-4">
                    <h2>👊 Pojedynek rozpoczęty!</h2>
                    <h3 className="text-lg font-bold mb-2">Quiz: {quiz.title}</h3>
                    <p className="mb-4">{quiz.description}</p>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={() =>
                            navigate(`/quiz/${quiz.docId}`, {
                                state: { duelId: id }
                            })
                        }
                    >
                        ▶️ Rozpocznij quiz
                    </button>
                    <p className="mt-4 text-sm">Po zakończeniu zobaczysz wyniki obydwu graczy.</p>
                </div>
            );
        } else if (!opponentResult) {
            // Gracz już zrobił quiz, czeka na przeciwnika
            return (
                <div className="p-4">
                    <h2>✅ Ukończyłeś quiz!</h2>
                    <p>⏳ Czekamy, aż przeciwnik ukończy swój quiz...</p>
                </div>
            );
        } else {
            // Obaj gracze ukończyli
            return (
                <div className="p-4">
                    <h2>🏁 Pojedynek zakończony!</h2>
                    <div className="mt-4">
                        <p><strong>{userResult.displayName || 'Gracz Ty'}:</strong> {userResult.score} / {userResult.total}</p>
                        <p><strong>{opponentResult.displayName || 'Przeciwnik'}:</strong> {opponentResult.score} / {opponentResult.total}</p>
                    </div>
                </div>
            );
        }
    }

    return <p>✅ Pojedynek zakończony.</p>;
}