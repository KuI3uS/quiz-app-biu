import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import QuizComments from '../components/QuizComments';
import Leaderboard from "../pages/Leaderboard.jsx";
import { jsPDF } from 'jspdf';

export default function QuizEngine() {
    const { id, duelId: routeDuelId } = useParams();
    const location = useLocation();
    const duelId = routeDuelId || location.state?.duelId || null;
    const navigate = useNavigate();


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
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (finished && duelId && user && quiz) {
            updateDoc(doc(db, 'duels', duelId), {
                [`results.${user.uid}`]: {
                    score,
                    total: quiz.questions.length,
                    displayName: user.displayName || 'Anonim',
                    uid: user.uid,
                    finishedAt: new Date()
                }
            });
        }
    }, [finished, duelId, user, quiz]);

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
        const fetchAverageRating = async () => {
            const q = query(collection(db, 'comments'), where('quizId', '==', id));
            const snapshot = await getDocs(q);
            const ratings = snapshot.docs.map(doc => doc.data().rating);
            const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
            setAverageRating(avg.toFixed(1));
        };
        fetchAverageRating();
    }, [id]);

    useEffect(() => {
        if (finished || !quiz) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setFinished(true);
                    if (duelId) {
                        setTimeout(() => navigate(`/duel/${duelId}`), 1000); // małe opóźnienie, aby zdążyło zapisać wynik
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [quiz, finished]);

    const generatePDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        doc.setFontSize(22);
        doc.text('Certyfikat ukończenia quizu', 20, 30);
        doc.setFontSize(16);
        doc.text(`Użytkownik: ${user?.displayName || 'Anonim'}`, 20, 50);
        doc.text(`Quiz: ${quiz.title}`, 20, 60);
        doc.text(`Wynik: ${score} / ${quiz.questions.length}`, 20, 70);
        doc.text(`Data: ${date}`, 20, 80);
        doc.save(`certyfikat-${quiz.title}.pdf`);
    };

    const handleAnswer = (answer) => {
        const current = quiz.questions[currentQuestion];
        let isCorrect = false;

        switch (current.type) {
            case 'single':
                isCorrect = answer === current.correctAnswerIndex;
                break;
            case 'multiple':
                isCorrect = JSON.stringify([...answer].sort()) === JSON.stringify([...current.correctAnswerIndex].sort());
                break;
            case 'boolean':
                isCorrect = answer === current.correctAnswer;
                break;
            case 'open':
                isCorrect = answer.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase();
                break;
        }

        setIsCorrectAnswer(isCorrect);
        setSelected(answer);
        if (isCorrect) setScore(prev => prev + 1);

        clearInterval(timerRef.current);

        const isLast = currentQuestion + 1 >= quiz.questions.length;

        setTimeout(async () => {
            if (isLast) {
                setFinished(true);
                const finalScore = isCorrect ? score + 1 : score;

                if (user) {
                    await addDoc(collection(db, 'results'), {
                        uid: user.uid,
                        displayName: user.displayName || 'Anonim',
                        quizId: quiz.docId,
                        score: finalScore,
                        total: quiz.questions.length,
                        timestamp: new Date()
                    });
                }

                if (duelId && user) {
                    const duelRef = doc(db, 'duels', duelId);
                    await updateDoc(duelRef, {
                        [`results.${user.uid}`]: {
                            score: finalScore,
                            total: quiz.questions.length,
                            displayName: user.displayName || 'Anonim',
                            uid: user.uid,
                            finishedAt: new Date()
                        }
                    });
                    navigate(`/duel/${duelId}`);
                }
            }else {
                setCurrentQuestion(prev => prev + 1);
                setSelected(null);
                setIsCorrectAnswer(null);
                setMultiSelected([]);
                setOpenAnswer('');
                setTimeLeft(quiz.timeLimit || 60);
                timerRef.current = setInterval(() => {
                    setTimeLeft(prev =>
                        prev <= 1
                            ? (clearInterval(timerRef.current), setFinished(true), 0)
                            : prev - 1
                    );
                }, 1000);
            }
        }, 1000);
    };

    if (!quiz) return <p>Ładowanie quizu...</p>;

    if (finished) {
        const percent = ((score / quiz.questions.length) * 100).toFixed(0);
        return (
            <div>
                <h2>Twój wynik: {score} / {quiz.questions.length} ({percent}%)</h2>
                <p>⭐ Średnia ocena: {averageRating} / 5</p>
                {!duelId && (score / quiz.questions.length) >= 0.51 && (
                    <button onClick={generatePDF}>📄 Pobierz certyfikat PDF</button>
                )}
                {(score / quiz.questions.length) < 0.51 && (
                    <p style={{ color: 'crimson', marginTop: '1rem' }}>
                        Aby pobrać certyfikat, musisz uzyskać co najmniej 51% poprawnych odpowiedzi.
                    </p>
                )}
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)}>📋 Skopiuj link do quizu</button>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ marginLeft: '1rem' }}>📤 Udostępnij na Facebooku</a>
                </div>
                <QuizComments quizId={quiz.docId} />
                <Leaderboard quizId={quiz.docId} />
            </div>
        );
    }

    const q = quiz.questions[currentQuestion];
    return (
        <div className="max-w-screen-md mx-auto p-4">
            <h1 className="text-2xl text-center font-bold">{quiz.title}</h1>
            <p>Pozostały czas: {timeLeft}s</p>
            <AnimatePresence mode="wait">
                <motion.div key={currentQuestion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <h3 className="text-lg font-semibold mb-2">Pytanie {currentQuestion + 1} z {quiz.questions.length}</h3>
                    <p className="mb-4">{q.text}</p>
                </motion.div>
            </AnimatePresence>

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
                        disabled={selected !== null || multiSelected.length === 0}
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
                        disabled={selected !== null || openAnswer.trim() === ''}
                        onClick={() => handleAnswer(openAnswer)}
                    >
                        Zatwierdź
                    </button>

                </div>
            )}
        </div>
    );
}