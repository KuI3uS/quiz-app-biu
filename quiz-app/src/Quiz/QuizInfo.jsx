import { Link } from 'react-router-dom';

export default function QuizInfo({ quiz }) {
    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>

            <button
                onClick={createDuel}
                className="bg-yellow-200 px-4 py-2 rounded"
            >
                🤝 Rozpocznij pojedynek
            </button>

            <Link
                to={`/quiz/${quiz.docId}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
            >
                ▶️ Rozpocznij quiz
            </Link>
        </div>
    );
}