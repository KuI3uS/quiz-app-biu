import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function QuizRandom() {
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        let q = collection(db, 'quizzes');

        let filters = [];
        if (category) filters.push(where('category', '==', category));
        if (difficulty) filters.push(where('difficulty', '==', difficulty));
        if (maxTime) filters.push(where('timeLimit', '<=', Number(maxTime)));

        if (filters.length) {
            q = query(q, ...filters);
        }

        const snapshot = await getDocs(q);
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(all);
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleRandomPick = () => {
        if (quizzes.length === 0) {
            alert('Brak quizów spełniających kryteria.');
            return;
        }

        const random = quizzes[Math.floor(Math.random() * quizzes.length)];
        navigate(`/quiz/${random.id}`);
    };

    return (
        <div>
            <h1>🎲 Losuj quiz</h1>

            <div>
                <input
                    type="text"
                    placeholder="Kategoria (np. Historia)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="">Dowolna trudność</option>
                    <option value="easy">Łatwy</option>
                    <option value="medium">Średni</option>
                    <option value="hard">Trudny</option>
                </select>
                <input
                    type="number"
                    placeholder="Max. czas (sekundy)"
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                />
                <button onClick={fetchQuizzes}>🔍 Filtruj</button>
                <button onClick={handleRandomPick}>🎯 Wylosuj quiz</button>
            </div>

            <p>Znaleziono: {quizzes.length} quizów</p>
            <ul>
                {quizzes.map(q => (
                    <li key={q.id}>{q.title} – {q.category} – {q.difficulty} – {q.timeLimit}s</li>
                ))}
            </ul>
        </div>
    );
}