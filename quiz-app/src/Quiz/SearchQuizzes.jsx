import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/SearchQuizzes.scss';

export default function SearchQuizzes() {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query') || '';

    const [quizzes, setQuizzes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState(queryParam);
    const [category, setCategory] = useState('');
    const [favorites, setFavorites] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        const fetchQuizzes = async () => {
            const snapshot = await getDocs(collection(db, 'quizzes'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuizzes(data);
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            const q = query(collection(db, 'favorites'), where('uid', '==', user.uid));
            const snapshot = await getDocs(q);
            const ids = snapshot.docs.map(doc => doc.data().quizId);
            setFavorites(ids);
        };
        fetchFavorites();
    }, [user]);

    useEffect(() => {
        const lowered = searchTerm.toLowerCase();
        const results = quizzes.filter((quiz) => {
            const matchesSearch =
                quiz.title?.toLowerCase().includes(lowered) ||
                quiz.description?.toLowerCase().includes(lowered) ||
                quiz.category?.toLowerCase().includes(lowered) ||
                quiz.difficulty?.toLowerCase().includes(lowered);

            const matchesCategory =
                !category || quiz.category?.toLowerCase() === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });
        setFiltered(results);
    }, [searchTerm, category, quizzes]);

    const toggleFavorite = async (quizId) => {
        if (!user) return alert('Musisz być zalogowany');

        const q = query(collection(db, 'favorites'), where('uid', '==', user.uid), where('quizId', '==', quizId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            // Już w ulubionych – usuń
            const docRef = snapshot.docs[0].ref;
            await deleteDoc(docRef);
            setFavorites((prev) => prev.filter((id) => id !== quizId));
        } else {
            // Dodaj do ulubionych
            await addDoc(collection(db, 'favorites'), {
                uid: user.uid,
                quizId,
            });
            setFavorites((prev) => [...prev, quizId]);
        }
    };

    return (
        <div className="search-quizzes">
            <h1 className="text-2xl font-bold mb-4">🔍 Wyszukiwanie quizów</h1>

            <input
                type="text"
                placeholder="Wpisz tytuł, kategorię lub poziom trudności..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">Wszystkie kategorie</option>
                <option value="historia">Historia</option>
                <option value="nauka">Nauka</option>
                <option value="sport">Sport</option>
                <option value="programowanie">Programowanie</option>
                <option value="sztuka">Sztuka</option>
                <option value="muzyka">Muzyka</option>
                <option value="film">Film</option>
                <option value="literatura">Literatura</option>
                <option value="geografia">Geografia</option>
                <option value="technologia">Technologia</option>
            </select>

            {filtered.length === 0 ? (
                <p>Nie znaleziono quizów pasujących do zapytania.</p>
            ) : (
                <ul>
                    {filtered.map((quiz) => (
                        <li key={quiz.id} className="mb-4 border-b pb-3">
                            <Link
                                to={`/quiz/info/${quiz.id}`}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                {quiz.title}
                            </Link>
                            {user && (
                                <button
                                    onClick={() => toggleFavorite(quiz.id)}
                                    className="ml-2 text-red-500"
                                >
                                    {favorites.includes(quiz.id) ? '❤️ Ulubiony – kliknij, aby usunąć' : '🤍 Dodaj do ulubionych'}
                                </button>
                            )}

                            <p className="text-sm">{quiz.description}</p>
                            <p className="text-xs text-gray-500">
                                Kategoria: {quiz.category || 'brak'}, Trudność: {quiz.difficulty || 'brak'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}