import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function QuizList() {
    const [quizzes, setQuizzes] = useState(
        JSON.parse(localStorage.getItem('quizzes') || '[]')
    );

    const handleDelete = (id) => {
        const updated = quizzes.filter((q) => q.id !== id);
        localStorage.setItem('quizzes', JSON.stringify(updated));
        setQuizzes(updated);
    };

    return (
        <div>
            <h1>Dostępne quizy</h1>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <strong>{quiz.title}</strong> – {quiz.questions.length} pyt.
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/quiz/${quiz.id}`}>Rozwiąż</Link>
                            <Link to={`/quiz/edit/${quiz.id}`}>✏️ Edytuj</Link>
                            <button onClick={() => handleDelete(quiz.id)}>🗑️ Usuń</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}