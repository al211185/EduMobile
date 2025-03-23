import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.user); // Guarda el usuario en el contexto

                // Almacena el ID del usuario en localStorage para poder usarlo en otros componentes
                localStorage.setItem("currentUserId", data.user.id);

                setMessage("Inicio de sesión exitoso.");
                window.location.href = "/";
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error al iniciar sesión.");
            }
        } catch (error) {
            setMessage("Ocurrió un error. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="container">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
                {message && <div className="alert alert-danger">{message}</div>}
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Correo Electrónico</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Contraseña</label>
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label>Recuérdame</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default Login;
