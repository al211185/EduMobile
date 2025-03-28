import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            {/* Logo o enlace principal */}
            <div className="p-6 border-b border-gray-700">
                <a href="/" className="text-2xl font-bold">
                    Inicio
                </a>
            </div>

            {/* Menú de navegación */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {user?.role === "Profesor" && (
                    <>
                        <a
                            href="/dashboard"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Cursos
                        </a>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfzdi8RAKM6yQTqXl2SPa2D_-VRtd_KpN451ip-DNHTLIob4w/viewform?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Reporta un error
                        </a>
                    </>
                )}

                {user?.role === "Alumno" && (
                    <>
                        <a
                            href="/my-projects"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Mis Proyectos
                        </a>
                        <a
                            href="/media-game"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Media Query Game
                        </a>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfzdi8RAKM6yQTqXl2SPa2D_-VRtd_KpN451ip-DNHTLIob4w/viewform?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Reporta un error
                        </a>
                    </>
                )}
            </nav>

            {/* Sección de acciones de usuario */}
            <div className="px-4 py-4 border-t border-gray-700">
                {!user ? (
                    <div className="space-y-2">
                        <a
                            href="/login"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Iniciar Sesión
                        </a>
                        <a
                            href="/register"
                            className="block py-2 px-4 rounded hover:bg-gray-700"
                        >
                            Registrarse
                        </a>
                    </div>
                ) : (
                    <>
                        {user?.role === "Alumno" && (
                            <a
                                href="/create-project"
                                className="block py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-center"
                            >
                                Crear Proyecto
                            </a>
                        )}
                        <div className="relative mt-4">
                            <button
                                onClick={toggleDropdown}
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
                            >
                                {user.nombre} {user.apellidoPaterno}
                            </button>
                            {isDropdownOpen && (
                                <div className="mt-2 bg-gray-700 rounded shadow-lg">
                                    <a
                                        href="/profile"
                                        className="block py-2 px-4 hover:bg-gray-600"
                                    >
                                        Perfil
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block py-2 px-4 hover:bg-gray-600"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
