import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function SearchQuizzes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const snapshot = await getDocs(collection(db, 'quizzes'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuizzes(data);
            setFiltered(data);
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const lowered = searchTerm.toLowerCase();
        const results = quizzes.filter(
            quiz =>
                quiz.title.toLowerCase().includes(lowered) ||
                quiz.description?.toLowerCase().includes(lowered) ||
                quiz.category?.toLowerCase().includes(lowered) ||
                quiz.difficulty?.toLowerCase().includes(lowered)
        );
        setFiltered(results);
    }, [searchTerm, quizzes]);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🔍 Szukaj quizów</h1>
            <input
                type="text"
                placeholder="Wpisz tytuł, kategorię lub poziom trudności..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            {filtered.length === 0 ? (
                <p>Nie znaleziono quizów pasujących do zapytania.</p>
            ) : (
                <ul>
                    {filtered.map(quiz => (
                        <li key={quiz.id} className="mb-3 border-b pb-2">
                            <Link to={`/quiz/info/${quiz.id}`} className="text-blue-600 font-semibold hover:underline">
                                {quiz.title}
                            </Link>
                            <p className="text-sm">{quiz.description}</p>
                            <p className="text-xs text-gray-500">
                                Kategoria: {quiz.category || 'brak'}, Trudność: {quiz.difficulty || 'brak'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}