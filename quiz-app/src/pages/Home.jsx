import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import styles from '../styles/Home.module.scss';


const GET_QUIZZES = gql`
  query GetQuizzes {
    quizzes {
      id
      title
      description
    }
  }
`;

export default function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDocs(collection(db, 'quizzes'))
            .then(snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizzes(data);
            })
            .catch(err => setError(err));
    }, []);

    if (error) return <p>Błąd: {error.message}</p>;
    if (!quizzes.length) return <p>Ładowanie quizów...</p>;

    return (
        <div className={styles['quiz-grid']}>
            {quizzes.map((quiz) => (
                <div className={styles['quiz-card']} key={quiz.id}>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description || 'Brak opisu quizu.'}</p>
                    <a className="button" href={`/quiz/${quiz.id}`}>Rozpocznij</a>
                </div>
            ))}
        </div>
    );
}