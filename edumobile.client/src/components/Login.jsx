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
                login(data.user);
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
        <div className="bg-[#575757] min-h-screen flex items-center justify-center relative">
            {/* Fondo */}
            <div className="absolute inset-0 bg-[#e4e4e4]"></div>
            {/* Card de Login */}
            <div className="bg-white rounded-[20px] shadow-lg p-8 z-10 max-w-sm w-full min-h-[450px] flex flex-col justify-center items-center">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-medium text-slate-500">Ingresar</h2>
                </div>
                <form onSubmit={handleLogin} className="w-full space-y-6">
                    {message && (
                        <div className="text-center text-red-500">{message}</div>
                    )}
                    {/* Campo de email */}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg bg-[#E5E5E5] focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Campo de contraseña */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg bg-[#E5E5E5] focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Checkbox y enlace de "Olvidaste tu contraseña" */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-slate-500 text-sm">Recuérdame</label>
                        </div>
                        <a href="/forgot-password" className="text-[#b0b0b0] text-sm">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    {/* Botón de envío */}
                    {/* Para cambiar el color del botón, modifica las clases bg-[#64748B] y hover:bg-[#5a6370] */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#64748B] text-white rounded-lg hover:bg-[#5a6370] transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
