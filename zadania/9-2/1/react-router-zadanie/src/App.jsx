import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Link,
} from "react-router-dom";

const NotFound = () => {
    const location = useLocation();
    return <h2>Nie znaleziono elementu: {location.pathname}</h2>;
};

const Home = () => <h2>Strona główna</h2>;
const About = () => <h2>O nas</h2>;
const Services = () => <h2>Usługi</h2>;
const Contact = () => <h2>Kontakt</h2>;
const ContactUs = () => <h2>Kontakt - US</h2>;
const ContactPL = () => <h2>Kontakt - Polska</h2>;
const ContactDE = () => <h2>Kontakt - Niemcy</h2>;

function App() {
    return (
        <Router>
            <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/contact/us">US</Link>
                <Link to="/contact/pl">PL</Link>
                <Link to="/contact/de">DE</Link>
                <Link to="/nie-istnieje">Błąd test</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact/us" element={<ContactUs />} />
                <Route path="/contact/pl" element={<ContactPL />} />
                <Route path="/contact/de" element={<ContactDE />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;