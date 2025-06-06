import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quiz from './Quiz/Quiz.jsx';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import QuizCreate from './Quiz/QuizCreate.jsx';
import QuizEngine from './Quiz/QuizEngine.jsx';
import QuizList from './Quiz/QuizList.jsx';
import QuizEdit from './Quiz/QuizEdit.jsx';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from "./user/UserDashboard.jsx";
import QuizRandom from "./Quiz/QuizRandom.jsx";

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
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/random" element={<QuizRandom />} />

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