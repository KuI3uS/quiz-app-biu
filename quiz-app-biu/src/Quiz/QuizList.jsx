import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase.js';
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const location = useLocation();
    const shareUrl = window.location.origin + location.pathname;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link skopiowany!");
    };

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'quizzes'),
                    where('uid', '==', user.uid)
                );
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map((doc) => ({
                    docId: doc.id,
                    ...doc.data(),
                }));
                setQuizzes(list);
            } catch (err) {
                alert('Błąd pobierania quizów: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [user]);

    const handleDelete = async (docId) => {
        if (confirm('Czy na pewno chcesz usunąć quiz?')) {
            await deleteDoc(doc(db, 'quizzes', docId));
            setQuizzes((prev) => prev.filter((q) => q.docId !== docId));
        }
    };

    const downloadJson = (quiz) => {
        const blob = new Blob([JSON.stringify(quiz, null, 2)], {
            type: 'application/json',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${quiz.title}.json`;
        link.click();
    };

    if (loading) return <p>Ładowanie quizów...</p>;

    return (
        <div>
            <h1>Twoje quizy (z Firestore)</h1>
            {quizzes.length === 0 ? (
                <p>Brak quizów w chmurze.</p>
            ) : (
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.docId}>
                            <strong>{quiz.title}</strong> ({quiz.questions?.length || 0} pyt.)
                            {' '}
                            <Link to={`/quiz/${quiz.docId}`}>▶️ Rozwiąż</Link>{' '}
                            <Link to={`/quiz/edit/${quiz.docId}`}>✏️ Edytuj</Link>{' '}
                            <button onClick={() => handleDelete(quiz.docId)}>🗑️ Usuń</button>
                            {' '}
                            <button onClick={() => downloadJson(quiz)}>⬇️ Pobierz JSON</button>
                            <button onClick={handleCopyLink}>🔗 Kopiuj link</button>
                            <button onClick={handleShareFacebook}>📘 Udostępnij na Facebooku</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}