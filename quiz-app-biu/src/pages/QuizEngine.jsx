import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function QuizEngine() {
    const { id } = useParams(); // To jest docId z Firestore
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const ref = doc(db, 'quizzes', id);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    setQuiz({ docId: snapshot.id, ...snapshot.data() });
                } else {
                    alert('Quiz nie istnieje');
                }
            } catch (err) {
                alert('Błąd pobierania quizu: ' + err.message);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleAnswer = (index) => {
        setSelected(index);
        const correctIndex = quiz.questions[currentQuestion].correctAnswerIndex;
        if (index === correctIndex) {
            setScore((prev) => prev + 1);
        }
        setTimeout(() => {
            if (currentQuestion + 1 < quiz.questions.length) {
                setCurrentQuestion((prev) => prev + 1);
                setSelected(null);
            } else {
                setFinished(true);

                // ⬇️ Zapisz wynik do Firestore
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
