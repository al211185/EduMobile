import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Se extraen los parámetros 'email' y 'token' de la URL
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/Auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword,
                    confirmPassword,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.Message);
                setError("");
                // Opcional: redirigir al login después de unos segundos
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(data.Message || "Error al restablecer la contraseña.");
                setMessage("");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
            setMessage("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Restablecer Contraseña
                </h2>
                {message && <div className="mb-4 text-green-600">{message}</div>}
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {isSubmitting ? "Enviando..." : "Restablecer Contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
