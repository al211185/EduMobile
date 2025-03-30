import React, { useState, useEffect } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0 && buttonDisabled) {
            // Cuando el contador llega a 0, se reactiva el botón
            setButtonDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, buttonDisabled]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/Auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.Message);
                setError("");
                // Deshabilitamos el botón y activamos la cuenta regresiva
                setButtonDisabled(true);
                setCountdown(30);
            } else {
                setError(data.Message || "Error al enviar instrucciones.");
                setMessage("");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Recuperar Contraseña</h2>
                {message && <div className="mb-4 text-green-600">{message}</div>}
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full p-3 bg-blue-500 text-white rounded-lg transition-colors ${buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                    >
                        {buttonDisabled ? `Espera ${countdown} segundos` : "Enviar Instrucciones"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
