import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import CreateDuel from '../duel/CreateDuel.jsx';

export default function Quiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            console.error("Brak ID quizu w URL");
            return;
        }

        const fetchQuiz = async () => {
            try {
                const ref = doc(db, 'quizzes', id);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    const quizData = { docId: snapshot.id, ...snapshot.data() };
                    setQuiz(quizData);
                } else {
                    alert('Quiz nie istnieje');
                }
            } catch (err) {
                console.error("Błąd podczas pobierania quizu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    if (loading) return <p>Ładowanie quizu...</p>;
    if (!quiz) return <p>Nie znaleziono quizu.</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <p className="mb-4">{quiz.description}</p>

            {/* 🔥 Multiplayer: Pojedynek */}
            <CreateDuel quizId={quiz.docId} />

            <Link
                to={`/quiz/info/${quiz.docId}`}
                className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                ▶️ Rozpocznij quiz
            </Link>
        </div>
    );
}