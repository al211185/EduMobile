import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ text: "", type: "" });

    useEffect(() => {
        if (alert.text) {
            const id = setTimeout(() => setAlert({ text: "", type: "" }), 5000);
            return () => clearTimeout(id);
        }
    }, [alert]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
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
                setAlert({ text: "Inicio de sesión exitoso.", type: "success" });
                navigate("/");
            } else {
                const errorData = await response.json();
                setAlert({
                    text: errorData.message || "Error al iniciar sesión.",
                    type: "error",
                });
            }
        } catch (error) {
            setAlert({
                text: "Ocurrió un error. Por favor, inténtalo de nuevo.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-gray)] min-h-screen flex items-center justify-center relative">
            {/* Fondo */}
            <div className="absolute inset-0 bg-[var(--color-bg)]"></div>
            {/* Card de Login */}
            <div className="bg-white rounded-[20px] shadow-lg p-8 z-10 max-w-sm w-full min-h-[450px] flex flex-col justify-center items-center">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-medium text-slate-500">Ingresar</h2>
                </div>
                <form onSubmit={handleLogin} className="w-full space-y-6">
                    {alert.text && (
                        <div className={`text-center ${alert.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{alert.text}</div>
                    )}
                    {/* Campo de email */}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg bg-[var(--color-bg)] focus:outline-none focus:border-blue-500"
                            autoComplete="email"
                            required
                        />
                    </div>
                    {/* Campo de contraseña */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 pl-3 pr-10 border border-gray-300 rounded-lg bg-[var(--color-bg)] focus:outline-none focus:border-blue-500"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <FaEyeSlash className="w-4 h-4" />
                            ) : (
                                <FaEye className="w-4 h-4" />
                            )}
                        </button>
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
                        <Link to="/forgot-password" className="text-[var(--color-gray)] text-sm">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    {/* Botón de envío */}
                    {/* Para cambiar el color del botón, modifica las clases bg-[#64748B] y hover:bg-[#5a6370] */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-[var(--color-gray)] text-white rounded-lg hover:bg-[var(--color-bg)] transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                    <div className="text-center">
                        <Link to="/register" className="text-[var(--color-gray)] text-sm hover:underline">
                            Registrar Maestro
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
