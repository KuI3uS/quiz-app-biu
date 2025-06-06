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
import QuizEdit from './pages/QuizEdit';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="quiz/:id" element={<QuizEngine />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="quiz/edit/:id" element={<QuizEdit />} />
                <Route path="reset" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

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
                <Route
                    path="quiz/list"
                    element={
                        <RequireAuth>
                            <QuizList />
                        </RequireAuth>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App