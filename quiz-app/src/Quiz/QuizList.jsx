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
import CreateDuel from '../duel/CreateDuel.jsx';
import ConfirmModal from '../model/ConfirmModal.jsx';
import '../styles/QuizList.scss';


export default function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const location = useLocation();

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, 'quizzes'), where('uid', '==', user.uid));
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

    const handleDelete = (docId) => {
        setPendingDeleteId(docId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        await deleteDoc(doc(db, 'quizzes', pendingDeleteId));
        setQuizzes((prev) => prev.filter((q) => q.docId !== pendingDeleteId));
        setShowConfirm(false);
        setPendingDeleteId(null);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setPendingDeleteId(null);
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

    const handleCopyLink = (docId) => {
        const link = `${window.location.origin}/quiz/${docId}`;
        navigator.clipboard.writeText(link);
        alert("Link skopiowany!");
    };

    const handleShareFacebook = (docId) => {
        const link = `${window.location.origin}/quiz/${docId}`;
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        window.open(fbUrl, '_blank');
    };

    if (loading) return <p>Ładowanie quizów...</p>;

    return (
        <div className="quiz-list">
            <h1>Twoje quizy (z Firestore)</h1>
            {quizzes.length === 0 ? (
                <p>Brak quizów w chmurze.</p>
            ) : (
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.docId} style={{ marginBottom: '1rem' }}>
                            <strong>{quiz.title}</strong> ({quiz.questions?.length || 0} pyt.)
                            <div className="quiz-actions">
                                <CreateDuel quizId={quiz.docId} />
                            </div>
                            <div className="quiz-actions">
                                <Link to={`/quiz/${quiz.docId}`}>Rozwiąż</Link>{' '}
                                <Link to={`/quiz/edit/${quiz.docId}`}> Edytuj</Link>{' '}
                                <button onClick={() => handleDelete(quiz.docId)}> Usuń</button>{' '}
                                <button onClick={() => downloadJson(quiz)}>Pobierz JSON</button>{' '}
                                <button onClick={() => handleCopyLink(quiz.docId)}>Kopiuj link</button>{' '}
                                <button onClick={() => handleShareFacebook(quiz.docId)}> Udostępnij na Facebooku</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal potwierdzenia usunięcia */}
            <ConfirmModal
                isOpen={showConfirm}
                message="Czy na pewno chcesz usunąć ten quiz?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
