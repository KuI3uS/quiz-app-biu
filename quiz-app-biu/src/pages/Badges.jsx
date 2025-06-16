import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Badges() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const q = query(collection(db, 'results'), where('uid', '==', user.uid));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => doc.data());
            setResults(data);
        };
        if (user) fetchResults();
    }, [user]);

    const completed = results.length;
    const perfect = results.filter(r => r.score === r.total).length;

    return (
        <div>
            <h2>🎖️ Twoje odznaki</h2>
            <ul>
                <li>✅ Ukończone quizy: {completed}</li>
                <li>🏅 100% wynik: {perfect}</li>
            </ul>
        </div>
    );
}