import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function QuizEngine() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const found = quizzes.find((q) => q.id === Number(id));
        setQuiz(found);
    }, [id]);

    const handleAnswer = (index) => {
        setSelected(index);
        if (index === quiz.questions[currentQuestion].correctAnswerIndex) {
            setScore(score + 1);
        }
        setTimeout(() => {
            if (currentQuestion + 1 < quiz.questions.length) {
                setCurrentQuestion(currentQuestion + 1);
                setSelected(null);
            } else {
                setFinished(true);
            }
        }, 1000);
    };

    if (!quiz) return <p>Ładowanie quizu...</p>;
    if (finished) return <h2>Twój wynik: {score} / {quiz.questions.length}</h2>;

    const q = quiz.questions[currentQuestion];

    return (
        <div>
            <h1>{quiz.title}</h1>
            <h3>Pytanie {currentQuestion + 1} z {quiz.questions.length}</h3>
            <p>{q.text}</p>
            <ul>
                {q.answers.map((answer, idx) => (
                    <li key={idx}>
                        <button
                            disabled={selected !== null}
                            onClick={() => handleAnswer(idx)}
                            style={{
                                backgroundColor:
                                    selected === idx
                                        ? idx === q.correctAnswerIndex
                                            ? 'green'
                                            : 'red'
                                        : ''
                            }}
                        >
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
