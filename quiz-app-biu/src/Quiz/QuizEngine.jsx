import { useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuizEngine() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [multiSelected, setMultiSelected] = useState([]);
    const [openAnswer, setOpenAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
    const { user } = useAuth();
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            const ref = doc(db, 'quizzes', id);
            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
                const quizData = { docId: snapshot.id, ...snapshot.data() };
                setQuiz(quizData);
                setTimeLeft(quizData.timeLimit || 60);
            } else {
                alert('Quiz nie istnieje');
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (finished || !quiz) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [quiz, finished]);

    const handleAnswer = (answer) => {
        const current = quiz.questions[currentQuestion];
        let isCorrect = false;

        switch (current.type) {
            case 'single':
                isCorrect = answer === current.correctAnswerIndex;
                break;
            case 'multiple':
                if (Array.isArray(answer) && Array.isArray(current.correctAnswerIndex)) {
                    isCorrect = JSON.stringify([...answer].sort()) === JSON.stringify([...current.correctAnswerIndex].sort());
                } else {
                    console.error('Pytanie wielokrotnego wyboru ma niepoprawny format danych.');
                }
                break;
            case 'boolean':
                isCorrect = answer === current.correctAnswer;
                break;
            case 'open':
                isCorrect = answer.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase();
                break;
            default:
                break;
        }

        setIsCorrectAnswer(isCorrect);
        setSelected(answer);
        if (isCorrect) setScore(prev => prev + 1);

        clearInterval(timerRef.current);

        const isLastQuestion = currentQuestion + 1 >= quiz.questions.length;

        setTimeout(() => {
            if (isLastQuestion) {
                setFinished(true);
                if (user) {
                    addDoc(collection(db, 'results'), {
                        uid: user.uid,
                        quizId: quiz.docId,
                        score: isCorrect ? score + 1 : score,
                        total: quiz.questions.length,
                        timestamp: new Date()
                    });
                }
            } else {
                setCurrentQuestion(prev => prev + 1);
                setSelected(null);
                setIsCorrectAnswer(null);
                setMultiSelected([]);
                setOpenAnswer('');
                setTimeLeft(quiz.timeLimit || 60);
                timerRef.current = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setFinished(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }, 1000);
    };

    if (!quiz) return <p>Ładowanie quizu...</p>;

    if (finished) {
        const percent = ((score / quiz.questions.length) * 100).toFixed(0);
        return <h2>Twój wynik: {score} / {quiz.questions.length} ({percent}%)</h2>;
    }

    const q = quiz.questions[currentQuestion];

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>Pozostały czas: {timeLeft}s</p>
            <h3>Pytanie {currentQuestion + 1} z {quiz.questions.length}</h3>
            <p>{q.text}</p>

            {q.type === 'single' && (
                <ul>
                    {q.answers.map((answer, idx) => (
                        <li key={idx}>
                            <button
                                disabled={selected !== null}
                                onClick={() => handleAnswer(idx)}
                                style={{
                                    backgroundColor:
                                        selected === idx
                                            ? isCorrectAnswer ? 'green' : 'red'
                                            : ''
                                }}
                            >
                                {answer}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {q.type === 'multiple' && (
                <div>
                    <ul>
                        {q.answers.map((answer, idx) => (
                            <li key={idx}>
                                <label
                                    style={{
                                        backgroundColor:
                                            selected !== null
                                                ? quiz.questions[currentQuestion].correctAnswerIndex.includes(idx)
                                                    ? 'green'
                                                    : multiSelected.includes(idx)
                                                        ? 'red'
                                                        : ''
                                                : ''
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={multiSelected.includes(idx)}
                                        onChange={() => {
                                            if (selected !== null) return;
                                            setMultiSelected(prev =>
                                                prev.includes(idx)
                                                    ? prev.filter(i => i !== idx)
                                                    : [...prev, idx]
                                            );
                                        }}
                                        disabled={selected !== null}
                                    />
                                    {answer}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        disabled={selected !== null}
                        onClick={() => {
                            setSelected('answered');
                            handleAnswer(multiSelected);
                        }}
                    >
                        Zatwierdź
                    </button>
                </div>
            )}

            {q.type === 'boolean' && (
                <div>
                    {['Prawda', 'Fałsz'].map((label, idx) => {
                        const val = label === 'Prawda';
                        return (
                            <button
                                key={label}
                                disabled={selected !== null}
                                onClick={() => handleAnswer(val)}
                                style={{
                                    backgroundColor:
                                        selected === val
                                            ? isCorrectAnswer ? 'green' : 'red'
                                            : ''
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            {q.type === 'open' && (
                <div>
                    <input
                        type="text"
                        value={openAnswer}
                        onChange={(e) => setOpenAnswer(e.target.value)}
                        disabled={selected !== null}
                        style={{
                            backgroundColor:
                                selected !== null
                                    ? isCorrectAnswer ? 'lightgreen' : '#f88'
                                    : ''
                        }}
                    />
                    <button
                        disabled={selected !== null}
                        onClick={() => handleAnswer(openAnswer)}
                    >
                        Zatwierdź
                    </button>
                </div>
            )}
        </div>
    );
}