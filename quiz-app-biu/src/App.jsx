import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import About from './pages/About'

//PYT-131: Routing do co najmniej 3 podstron
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="about" element={<About />} />
            </Route>
        </Routes>
    )
}

export default App