import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import About from './pages/About'
import Login from "./pages/Login.jsx";
import Register from './pages/Register';

//PYT-131: Routing do co najmniej 3 podstron
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="about" element={<About />} />
            </Route>
        </Routes>
    )
}

export default App