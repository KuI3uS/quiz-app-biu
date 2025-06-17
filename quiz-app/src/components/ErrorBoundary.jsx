import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Ustaw stan na błąd
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Logowanie błędów do serwera, np. Sentry
        console.error('Błąd złapany przez ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'crimson' }}>
                    <h2>😵 Coś poszło nie tak.</h2>
                    <p>Spróbuj odświeżyć stronę lub wróć później.</p>
                </div>
            );
        }

        return this.props.children;
    }
}