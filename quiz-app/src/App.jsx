import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import QuizCreate from './Quiz/QuizCreate.jsx';
import QuizEngine from './Quiz/QuizEngine.jsx';
import QuizList from './Quiz/QuizList.jsx';
import QuizEdit from './Quiz/QuizEdit.jsx';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from "./user/UserDashboard.jsx";
import QuizRandom from "./Quiz/QuizRandom.jsx";
import Leaderboard from './pages/Leaderboard';
import Badges from './pages/Badges';
import DuelRoom from "./duel/DuelRoom.jsx";
import SearchQuizzes from './Quiz/SearchQuizzes.jsx';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';


const QuizInfo = lazy(() => import('./Quiz/QuizInfo.jsx'));

function App() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="quiz/:id" element={<QuizEngine />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="quiz/edit/:id" element={<QuizEdit />} />
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
                        path="quiz/info/:id"
                        element={
                            <RequireAuth>
                                <Suspense fallback={<div>Ładowanie quizu...</div>}>
                                    <QuizInfo />
                                </Suspense>
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
        </ErrorBoundary>
    );
}
export default App