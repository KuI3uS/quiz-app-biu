import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import CreateDuel from '../duel/CreateDuel';

export default function QuizInfo() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const ref = doc(db, 'quizzes', id);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setQuiz({ docId: snap.id, ...snap.data() });
                } else {
                    alert("Quiz nie istnieje");
                }
            } catch (err) {
                console.error('Błąd ładowania quizu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    if (loading) return <p>Ładowanie quizu...</p>;
    if (!quiz) return <p>Nie znaleziono quizu.</p>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>

            <CreateDuel quizId={quiz.docId} />

            <Link
                to={`/quiz/${quiz.docId}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
            >
                ▶️ Rozpocznij quiz
            </Link>
        </div>
    );
}