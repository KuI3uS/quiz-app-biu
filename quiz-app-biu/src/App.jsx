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
import Leaderboard from './pages/Leaderboard';
import Badges from './pages/Badges';
import DuelRoom from "./duel/DuelRoom.jsx";
import SearchQuizzes from './Quiz/SearchQuizzes.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="quiz/:id" element={<QuizEngine />} />
                <Route path="quiz/info/:id" element={<RequireAuth><Quiz /></RequireAuth>} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="quiz/edit/:id" element={<QuizEdit />} />
                <Route path="reset" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/random" element={<QuizRandom />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/badges" element={<Badges />} />
                <Route path="/duel/:id" element={<DuelRoom />} />
                <Route path="duel/quiz/:duelId/:id" element={<QuizEngine />} />
                <Route path="/search" element={<SearchQuizzes />} />

                {/* 🔒 Chronione */}
                <Route
                    path="quiz"
                    element={
                        <RequireAuth>
                            <QuizCreate />
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