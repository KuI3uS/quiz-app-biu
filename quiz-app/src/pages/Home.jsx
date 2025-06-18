import { gql, useQuery } from '@apollo/client';

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
    const { loading, error, data } = useQuery(GET_QUIZZES);
    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error.message}</p>;

    return (
        <div>
            <h2>Quizy (GraphQL)</h2>
            <ul>
                {data.quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <strong>{quiz.title}</strong><br />
                        <small>{quiz.description}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}