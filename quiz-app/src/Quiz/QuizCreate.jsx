import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/QuizCreate.scss';

export default function QuizCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [timeLimit, setTimeLimit] = useState(60);
    const [coverImage, setCoverImage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('single');
    const [answers, setAnswers] = useState(['']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleAddAnswer = () => {
        setAnswers([...answers, '']);
    };

    const handleAnswerChange = (value, index) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleEditQuestion = (index) => {
        const q = questions[index];
        setQuestionText(q.text);
        setQuestionType(q.type);
        setAnswers(q.answers || []);
        if (q.type === 'multiple') {
            setCorrectAnswerIndex(Array.isArray(q.correctAnswerIndex) ? q.correctAnswerIndex : []);
        } else {
            setCorrectAnswerIndex(q.correctAnswerIndex ?? 0);
        }
        setEditingIndex(index);
    };

    const handleDeleteQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };

    const handleAddQuestion = () => {
        const trimmedQuestion = questionText.trim();
        const filteredAnswers = answers.map((a) => a.trim()).filter((a) => a !== '');

        if ((questionType === 'single' || questionType === 'multiple') && filteredAnswers.length < 2) {
            alert("W pytaniach jednokrotnego i wielokrotnego wyboru muszą być przynajmniej 2 odpowiedzi.");
            return;
        }
        if ((questionType === 'single' || questionType === 'multiple') && correctAnswerIndex == null) {
            alert("Wybierz poprawną odpowiedź.");
            return;
        }

        const newQuestion = { text: trimmedQuestion, type: questionType };

        if (questionType === 'single') {
            if (filteredAnswers.length < 2 || correctAnswerIndex === null) {
                alert("Dodaj przynajmniej 2 odpowiedzi i zaznacz poprawną.");
                return;
            }
            newQuestion.answers = filteredAnswers;
            newQuestion.correctAnswerIndex = Number(correctAnswerIndex);
        }

        if (questionType === 'multiple') {
            if (filteredAnswers.length < 2 || !Array.isArray(correctAnswerIndex) || correctAnswerIndex.length === 0) {
                alert("Dodaj przynajmniej 2 odpowiedzi i zaznacz poprawne.");
                return;
            }
            newQuestion.answers = filteredAnswers;
            newQuestion.correctAnswerIndex = correctAnswerIndex;
        }

        if (questionType === 'boolean') {
            newQuestion.answers = ['Prawda', 'Fałsz'];
            newQuestion.correctAnswer = correctAnswerIndex === 'true';
        }

        if (questionType === 'open') {
            if (!correctAnswerIndex || correctAnswerIndex.trim() === '') {
                alert("Wpisz poprawną odpowiedź.");
                return;
            }
            newQuestion.correctAnswer = correctAnswerIndex.trim();
        }

        const updatedQuestions = [...questions];
        if (editingIndex !== null) {
            updatedQuestions[editingIndex] = newQuestion;
        } else {
            updatedQuestions.push(newQuestion);
        }

        setQuestions(updatedQuestions);
        setQuestionText('');
        setQuestionType('single');
        setAnswers(['']);
        setCorrectAnswerIndex([]);
        setEditingIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert('Dodaj przynajmniej jedno pytanie!');
            return;
        }

        const newQuiz = {
            title,
            description,
            category,
            difficulty,
            timeLimit,
            coverImage,
            questions,
            uid: user?.uid || null,
        };

        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'quizzes'), newQuiz);
            alert('Quiz zapisany!');
            navigate(`/quiz/${docRef.id}`);
        } catch (err) {
            alert('Błąd zapisu: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="quiz-create" style={{maxWidth: 700, margin: '0 auto'}}>
            <h1>Stwórz nowy quiz</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Tytuł" value={title} onChange={(e) => setTitle(e.target.value)}
                       required/>
                <textarea placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)}
                          required/>
                <input type="text" placeholder="Kategoria" value={category}
                       onChange={(e) => setCategory(e.target.value)}/>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Łatwy</option>
                    <option value="medium">Średni</option>
                    <option value="hard">Trudny</option>
                </select>
                <input type="number" placeholder="Czas (sekundy)" value={timeLimit}
                       onChange={(e) => setTimeLimit(Number(e.target.value))}/>
                <input type="text" placeholder="Link do obrazu" value={coverImage}
                       onChange={(e) => setCoverImage(e.target.value)}/>

                {coverImage && (
                    <div style={{marginTop: 'center'}}>
                        <img src={coverImage} alt="Podglad obrazu" style={{maxWidth: '300px'}}/>
                    </div>
                )}

                <h2>Dodaj pytanie</h2>
                <div style={{marginBottom: '1rem'}}>
                    <ReactQuill theme="snow" value={questionText} onChange={setQuestionText}/>
                </div>
                <select value={questionType} onChange={(e) => {
                    const type = e.target.value;
                    setQuestionType(type);
                    setCorrectAnswerIndex(type === 'multiple' ? [] : 0);
                }}>
                    <option value="single">Jednokrotny wybór</option>
                    <option value="multiple">Wielokrotny wybór</option>
                    <option value="boolean">Prawda / Fałsz</option>
                    <option value="open">Otwarta odpowiedź</option>
                </select>

                {(questionType === 'single' || questionType === 'multiple') && answers.map((answer, idx) => (
                    <div className="answer-group" key={idx}>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => handleAnswerChange(e.target.value, idx)}
                            placeholder={`Odpowiedź ${idx + 1}`}
                        />
                        <label>
                            <input
                                type={questionType === 'multiple' ? 'checkbox' : 'radio'}
                                name="correct"
                                checked={
                                    questionType === 'multiple'
                                        ? correctAnswerIndex.includes(idx)
                                        : correctAnswerIndex === idx
                                }
                                onChange={() => {
                                    if (questionType === 'multiple') {
                                        const newIndices = [...correctAnswerIndex];
                                        if (newIndices.includes(idx)) {
                                            setCorrectAnswerIndex(newIndices.filter((i) => i !== idx));
                                        } else {
                                            setCorrectAnswerIndex([...newIndices, idx]);
                                        }
                                    } else {
                                        setCorrectAnswerIndex(idx);
                                    }
                                }}
                            /> Poprawna
                        </label>
                    </div>
                ))}

                {questionType === 'boolean' && (
                    <select value={correctAnswerIndex} onChange={(e) => setCorrectAnswerIndex(e.target.value)}>
                        <option value="">Wybierz</option>
                        <option value="true">Prawda</option>
                        <option value="false">Fałsz</option>
                    </select>
                )}

                {questionType === 'open' && (
                    <input
                        type="text"
                        placeholder="Poprawna odpowiedź"
                        value={correctAnswerIndex}
                        onChange={(e) => setCorrectAnswerIndex(e.target.value)}
                    />
                )}

                {(questionType === 'single' || questionType === 'multiple') && (
                    <button type="button" onClick={handleAddAnswer}>Dodaj odpowiedź</button>
                )}

                <button type="button" onClick={handleAddQuestion}>
                    {editingIndex !== null ? 'Zapisz zmiany' : 'Dodaj pytanie'}
                </button>

                <ul className="question-list">
                    {questions.map((q, idx) => (
                        <li key={idx}>
                            {q.text} ({q.type}) – {q.answers?.length || 0} odp.
                            <button type="button" onClick={() => handleEditQuestion(idx)}>zapisz</button>
                            <button type="button" onClick={() => handleDeleteQuestion(idx)}>usun</button>
                        </li>
                    ))}
                </ul>

                <button type="submit" disabled={loading}>
                    {loading ? 'Zapisywanie...' : 'Zapisz quiz'}
                </button>
            </form>
        </div>
    );
}