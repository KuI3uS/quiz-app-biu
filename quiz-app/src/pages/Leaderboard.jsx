import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Leaderboard({ quizId = null }) {
    const [results, setResults] = useState([]);



    useEffect(() => {
        const fetchResults = async () => {
            let q;
            if (quizId) {
                q = query(collection(db, 'results'), where('quizId', '==', quizId), orderBy('score', 'desc'), limit(5));
            } else {
                q = query(collection(db, 'results'), orderBy('score', 'desc'), limit(10));
            }
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => doc.data());
            setResults(data);
        };

        fetchResults();
    }, [quizId]);

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2>{quizId ? '🏆 Top 5 tego quizu' : '🌍 Globalny ranking (Top 10)'}</h2>
            <ol>
                {results.map((r, idx) => (
                    <li key={idx}>
                        {r.displayName || 'Anonim'} – {r.score} / {r.total}
                    </li>
                ))}
            </ol>
        </div>
    );
}