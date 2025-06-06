import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function QuizEdit() {
    const { id } = useParams(); // docId z Firestore
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [timeLimit, setTimeLimit] = useState(60);
    const [coverImage, setCoverImage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const ref = doc(db, 'quizzes', id);
                const snapshot = await getDoc(ref);
                if (!snapshot.exists()) return navigate('/quiz/list');
                const data = snapshot.data();
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setDifficulty(data.difficulty);
                setTimeLimit(data.timeLimit);
                setCoverImage(data.coverImage);
                setQuestions(data.questions || []);
            } catch (err) {
                alert('Błąd pobierania quizu: ' + err.message);
            }
        };
        fetchQuiz();
    }, [id, navigate]);

    const handleAnswerChange = (value, index) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleEditQuestion = (index) => {
        const q = questions[index];
        setQuestionText(q.text);
        setAnswers(q.answers);
        setCorrectAnswerIndex(q.correctAnswerIndex);
        setEditingIndex(index);
    };

    const handleDeleteQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };

    const handleSaveEditedQuestion = () => {
        const trimmed = questionText.trim();
        const filteredAnswers = answers.map((a) => a.trim()).filter((a) => a);
        if (!trimmed || filteredAnswers.length < 2 || correctAnswerIndex == null) {
            alert("Uzupełnij wszystkie dane pytania");
            return;
        }
        const newQuestion = {
            text: trimmed,
            answers: filteredAnswers,
            correctAnswerIndex,
            type: 'single'
        };
        const updated = [...questions];
        if (editingIndex !== null) {
            updated[editingIndex] = newQuestion;
        } else {
            updated.push(newQuestion);
        }
        setQuestions(updated);
        setQuestionText('');
        setAnswers(['', '', '', '']);
        setCorrectAnswerIndex(null);
        setEditingIndex(null);
    };

    const handleAddAnswerField = () => {
        setAnswers([...answers, '']);
    };

    const handleDownload = () => {
        const quiz = {
            id,
            title,
            description,
            category,
            difficulty,
            timeLimit,
            coverImage,
            questions,
        };
        const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title || 'quiz'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const ref = doc(db, 'quizzes', id);
            await updateDoc(ref, {
                title,
                description,
                category,
                difficulty,
                timeLimit,
                coverImage,
                questions,
            });
            alert('Quiz zaktualizowany!');
            navigate('/quiz/list');
        } catch (err) {
            alert('Błąd zapisu: ' + err.message);
        }
    };

    return (
        <div>
            <h1>Edytuj quiz</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opis" required />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategoria" />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Łatwy</option>
                    <option value="medium">Średni</option>
                    <option value="hard">Trudny</option>
                </select>
                <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} />
                <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Link do okładki" />

                <ul>
                    {questions.map((q, idx) => (
                        <li key={idx}>
                            {q.text} ({q.answers?.length || 0} odp.)
                            <button type="button" onClick={() => handleEditQuestion(idx)}>✏️</button>
                            <button type="button" onClick={() => handleDeleteQuestion(idx)}>🗑️</button>
                        </li>
                    ))}
                </ul>

                <h3>{editingIndex !== null ? 'Edytuj pytanie' : 'Dodaj pytanie'}</h3>
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Treść pytania"
                />
                <div>
                    {answers.map((answer, idx) => (
                        <div key={idx}>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(e.target.value, idx)}
                                placeholder={`Odpowiedź ${idx + 1}`}
                            />
                            <label>
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={correctAnswerIndex === idx}
                                    onChange={() => setCorrectAnswerIndex(idx)}
                                /> Poprawna
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAnswerField}>Dodaj odpowiedź</button>
                </div>
                <button type="button" onClick={handleSaveEditedQuestion}>
                    {editingIndex !== null ? 'Zapisz pytanie' : 'Dodaj pytanie'}
                </button>

                <button type="submit">💾 Zapisz zmiany</button>
                <button type="button" onClick={handleDownload}>📥 Pobierz jako JSON</button>
            </form>
        </div>
    );
}