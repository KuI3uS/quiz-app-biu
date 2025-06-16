import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

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

    // 🔢 Oblicz skuteczność według kategorii
    const categoryStats = [];
    const categoriesMap = {};

    results.forEach(res => {
        const quiz = quizzes.find(q => q.id === res.quizId);
        const category = quiz?.category || 'inne';

        if (!categoriesMap[category]) {
            categoriesMap[category] = { total: 0, correct: 0 };
        }

        categoriesMap[category].total += res.total;
        categoriesMap[category].correct += res.score;
    });

    for (const cat in categoriesMap) {
        const { total, correct } = categoriesMap[cat];
        categoryStats.push({
            category: cat,
            accuracy: total > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 0
        });
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">👤 Panel użytkownika</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">📊 Statystyki</h2>
                <p>Liczba rozwiązanych quizów: {results.length}</p>
                <p>Średni wynik: {avgScore}%</p>
                <p>Liczba stworzonych quizów: {quizzes.length}</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">📝 Moje quizy</h2>
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id}>
                            <Link to={`/quiz/${quiz.id}`} className="text-blue-600 hover:underline">
                                {quiz.title}
                            </Link>{' '}
                            |{' '}
                            <Link to={`/quiz/edit/${quiz.id}`} className="text-green-600 hover:underline">
                                ✏️ Edytuj
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">📈 Moje wyniki</h2>
                <ul>
                    {results.map((res, idx) => (
                        <li key={idx}>
                            Quiz ID: {res.quizId} – {res.score} / {res.total} ({((res.score / res.total) * 100).toFixed(0)}%)
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">📉 Skuteczność według kategorii</h2>
                {categoryStats.length === 0 ? (
                    <p>Brak danych do wyświetlenia wykresu.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryStats}>
                            <XAxis dataKey="category" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="accuracy" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </section>
        </div>
    );
}