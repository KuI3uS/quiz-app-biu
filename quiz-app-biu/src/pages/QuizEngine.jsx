import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const ref = doc(db, 'quizzes', id);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    const quizData = { docId: snapshot.id, ...snapshot.data() };
                    setQuiz(quizData);
                    setTimeLeft(quizData.timeLimit || 60);
                } else {
                    alert('Quiz nie istnieje');
                }
            } catch (err) {
                alert('Błąd pobierania quizu: ' + err.message);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (finished || !quiz) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [quiz, finished]);

    const handleAnswer = (answer) => {
        const current = quiz.questions[currentQuestion];
        let isCorrect = false;

        switch (current.type) {
            case 'single':
                isCorrect = answer === current.correctAnswerIndex;
                break;
            case 'multiple':
                isCorrect = JSON.stringify(answer.sort()) === JSON.stringify(current.correctAnswerIndex.sort());
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

        if (isCorrect) setScore(prev => prev + 1);

        setTimeout(() => {
            if (currentQuestion + 1 < quiz.questions.length) {
                setCurrentQuestion(prev => prev + 1);
                setSelected(null);
                setMultiSelected([]);
                setOpenAnswer('');
            } else {
                setFinished(true);
                if (user) {
                    addDoc(collection(db, 'results'), {
                        uid: user.uid,
                        quizId: quiz.docId,
                        score,
                        total: quiz.questions.length,
                        timestamp: new Date()
                    });
                }
            }
        }, 1000);
    };

    if (!quiz) return <p>Ładowanie quizu...</p>;

    if (finished) {
        const percent = ((score / quiz.questions.length) * 100).toFixed(0);
        return (
            <h2>
                Twój wynik: {score} / {quiz.questions.length} ({percent}%)
            </h2>
        );
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
                                onClick={() => {
                                    setSelected(idx);
                                    handleAnswer(idx);
                                }}
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
            )}

            {q.type === 'multiple' && (
                <div>
                    <ul>
                        {q.answers.map((answer, idx) => (
                            <li key={idx}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={multiSelected.includes(idx)}
                                        onChange={() => {
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
                    <button disabled={selected !== null} onClick={() => {
                        setSelected('answered');
                        handleAnswer(multiSelected);
                    }}>
                        Zatwierdź
                    </button>
                </div>
            )}

            {q.type === 'boolean' && (
                <div>
                    <button
                        disabled={selected !== null}
                        onClick={() => {
                            setSelected(true);
                            handleAnswer(true);
                        }}
                    >
                        Prawda
                    </button>
                    <button
                        disabled={selected !== null}
                        onClick={() => {
                            setSelected(false);
                            handleAnswer(false);
                        }}
                    >
                        Fałsz
                    </button>
                </div>
            )}

            {q.type === 'open' && (
                <div>
                    <input
                        type="text"
                        value={openAnswer}
                        onChange={(e) => setOpenAnswer(e.target.value)}
                        disabled={selected !== null}
                    />
                    <button
                        disabled={selected !== null}
                        onClick={() => {
                            setSelected('answered');
                            handleAnswer(openAnswer);
                        }}
                    >
                        Zatwierdź
                    </button>
                </div>
            )}
        </div>
    );
}
