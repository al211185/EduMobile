// ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que se muestre el mensaje de error
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Puedes registrar el error en un servicio de reporte de errores
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary capturó un error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Renderiza una UI de respaldo
            return (
                <div style={{ padding: "20px", color: "red" }}>
                    <h2>Algo salió mal.</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
