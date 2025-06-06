import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const resultsQuery = query(collection(db, 'results'), where('uid', '==', user.uid));
            const quizzesQuery = query(collection(db, 'quizzes'), where('uid', '==', user.uid));

            const [resultsSnap, quizzesSnap] = await Promise.all([
                getDocs(resultsQuery),
                getDocs(quizzesQuery),
            ]);

            setResults(resultsSnap.docs.map(doc => doc.data()));
            setQuizzes(quizzesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };

        fetchData();
    }, [user]);

    if (loading) return <p>Ładowanie danych...</p>;

    const avgScore = results.length > 0
        ? (results.reduce((sum, r) => sum + r.score / r.total, 0) / results.length * 100).toFixed(1)
        : 'Brak danych';

    return (
        <div>
            <h1>Panel użytkownika</h1>

            <section>
                <h2>📊 Statystyki</h2>
                <p>Liczba rozwiązanych quizów: {results.length}</p>
                <p>Średni wynik: {avgScore}%</p>
                <p>Liczba stworzonych quizów: {quizzes.length}</p>
            </section>

            <section>
                <h2>📝 Moje quizy</h2>
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id}>
                            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
                            {' | '}
                            <Link to={`/edit-quiz/${quiz.id}`}>✏️ Edytuj</Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>📈 Moje wyniki</h2>
                <ul>
                    {results.map((res, idx) => (
                        <li key={idx}>
                            Quiz ID: {res.quizId} – {res.score} / {res.total} ({((res.score / res.total) * 100).toFixed(0)}%)
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}