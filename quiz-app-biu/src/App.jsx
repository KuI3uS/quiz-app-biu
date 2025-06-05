import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import QuizCreate from './pages/QuizCreate';
import QuizEngine from './pages/QuizEngine';
import QuizList from './pages/QuizList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="quiz/:id" element={<QuizEngine />} />
                <Route path="quiz/list" element={<QuizList />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* 🔒 Chroniona trasa */}
                <Route
                    path="quiz"
                    element={
                        <RequireAuth>
                            <Quiz />
                        </RequireAuth>
                    }
                />
                <Route
                    path="quiz/create"
                    element={
                        <RequireAuth>
                            <QuizCreate />
                        </RequireAuth>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App