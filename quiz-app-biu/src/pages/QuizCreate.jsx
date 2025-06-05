import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [editingIndex, setEditingIndex] = useState(null);

    const navigate = useNavigate();

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
        setAnswers(q.answers);
        setCorrectAnswerIndex(q.correctAnswerIndex);
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

        if (!trimmedQuestion) {
            alert("Wpisz treść pytania.");
            return;
        }

        if (questionType !== 'text' && filteredAnswers.length < 2) {
            alert("Dodaj przynajmniej 2 odpowiedzi.");
            return;
        }

        if (
            questionType !== 'text' &&
            (correctAnswerIndex < 0 || correctAnswerIndex >= filteredAnswers.length)
        ) {
            alert("Zaznacz poprawną odpowiedź.");
            return;
        }

        const newQuestion = {
            text: trimmedQuestion,
            type: questionType,
            answers: filteredAnswers,
            correctAnswerIndex,
        };

        let updatedQuestions = [...questions];
        if (editingIndex !== null) {
            updatedQuestions[editingIndex] = newQuestion;
        } else {
            updatedQuestions.push(newQuestion);
        }

        setQuestions(updatedQuestions);
        setQuestionText('');
        setQuestionType('single');
        setAnswers(['']);
        setCorrectAnswerIndex(0);
        setEditingIndex(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert('Musisz dodać przynajmniej jedno pytanie!');
            return;
        }

        const newQuiz = {
            id: Date.now(),
            title,
            description,
            category,
            difficulty,
            timeLimit,
            coverImage,
            questions,
        };

        const savedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        localStorage.setItem('quizzes', JSON.stringify([...savedQuizzes, newQuiz]));

        alert('Quiz zapisany do localStorage!');
        navigate('/');
    };

    return (
        <div>
            <h1>Stwórz nowy quiz</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tytuł quizu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Opis quizu"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Kategoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Łatwy</option>
                    <option value="medium">Średni</option>
                    <option value="hard">Trudny</option>
                </select>
                <input
                    type="number"
                    placeholder="Limit czasu (sekundy)"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Link do obrazka okładki"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                />

                <h2>Dodaj pytania</h2>
                <input
                    type="text"
                    placeholder="Treść pytania"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
                <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                    <option value="single">Jednokrotny wybór</option>
                    <option value="multiple">Wielokrotny wybór</option>
                    <option value="boolean">Prawda / Fałsz</option>
                    <option value="text">Otwarta odpowiedź</option>
                </select>

                {questionType !== 'text' && (
                    <div>
                        <h4>Odpowiedzi</h4>
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
                        <button type="button" onClick={handleAddAnswer}>
                            Dodaj odpowiedź
                        </button>
                    </div>
                )}

                <button type="button" onClick={handleAddQuestion}>
                    {editingIndex !== null ? 'Zapisz zmiany' : 'Dodaj pytanie'}
                </button>

                <ul>
                    {questions.map((q, idx) => (
                        <li key={idx}>
                            {q.text} ({q.type}) – {q.answers?.length || 0} odp.
                            <button type="button" onClick={() => handleEditQuestion(idx)}>✏️ Edytuj</button>
                            <button type="button" onClick={() => handleDeleteQuestion(idx)}>🗑️ Usuń</button>
                        </li>
                    ))}
                </ul>

                <button type="submit">Zapisz quiz</button>
            </form>
        </div>
    );
}