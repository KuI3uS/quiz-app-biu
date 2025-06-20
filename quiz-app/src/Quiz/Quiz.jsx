import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import CreateDuel from '../duel/CreateDuel';
import '../styles/Quiz.scss';

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            const ref = doc(db, 'quizzes', id);
            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
                setQuiz({ id: snapshot.id, ...snapshot.data() });
            } else {
                alert('Nie znaleziono quizu');
                navigate('/');
            }
        };

        fetchQuiz();
    }, [id, navigate]);

    if (!quiz) return <p>⏳ Ładowanie quizu...</p>;

    return (
        <div className="quiz-details">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p>{quiz.description}</p>

            <div className="meta">
                Kategoria: {quiz.category || 'brak'} | Poziom: {quiz.difficulty || 'brak'}
            </div>

            <div className="actions">
                <button
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    ▶️ Rozpocznij quiz solo
                </button>

                {user && (
                    <CreateDuel quizId={quiz.id}/>
                )}
            </div>
        </div>
    );
}