import {
    BrowserRouter as Router,
    Routes,
    Route,
    useSearchParams,
    useLocation,
} from "react-router-dom";

function Calculator({ operation }) {
    const [searchParams] = useSearchParams();
    const x = parseFloat(searchParams.get("x"));
    const y = parseFloat(searchParams.get("y"));

    let result;

    if (isNaN(x) || isNaN(y)) {
        result = "Błąd: niepoprawne dane";
    } else {
        switch (operation) {
            case "add":
                result = x + y;
                break;
            case "sub":
                result = x - y;
                break;
            case "mul":
                result = x * y;
                break;
            case "div":
                result = y === 0 ? "Nie można dzielić przez 0" : x / y;
                break;
            default:
                result = "Nieznana operacja";
        }
    }

    return (
        <div>
            <h2>Wynik operacji {operation}: {result}</h2>
        </div>
    );
}

function NotFound() {
    const location = useLocation();
    return <h2>Nie znaleziono operacji: {location.pathname}</h2>;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/add" element={<Calculator operation="add" />} />
                <Route path="/sub" element={<Calculator operation="sub" />} />
                <Route path="/mul" element={<Calculator operation="mul" />} />
                <Route path="/div" element={<Calculator operation="div" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;