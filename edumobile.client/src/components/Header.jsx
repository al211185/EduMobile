// src/components/Header.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {
    FaHome,
    FaBook,
    FaProjectDiagram,
    FaUserFriends,
    FaCog,
    FaEnvelope,
    FaBell,
    FaLifeRing,
    FaUserCircle,
    FaChevronRight,
} from "react-icons/fa";

const Header = () => {
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

    // Clases base para NavLink cuando NO está activo
    const baseLinkClasses =
        "flex items-center gap-2 py-3 pl-6 pr-2 rounded-full transition-colors hover:bg-[#4F46E5]/10 hover:text-[#4F46E5]";
    // Clases cuando el NavLink SÍ está activo
    const activeLinkClasses =
        "flex items-center gap-2 py-3 pl-6 pr-2 rounded-full transition-colors bg-[#4F46E5]/10 text-[#4F46E5]";

    return (
        <aside
            className="fixed top-0 left-0 h-screen w-64 bg-white text-[#64748B] p-4 flex flex-col z-50 overflow-visible"
        >
            {/* Logo y título */}
            <div className="flex items-center gap-2 mb-8">
                <img src="/logo-2.svg" alt="Logo" className="w-6 h-6" />
                <span className="text-xl font-bold">Edumobile</span>
            </div>

            {/* Menú de navegación */}
            <nav className="flex-1 space-y-2 text-sm">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                >
                    <FaHome className="w-4 h-4 text-current" />
                    <span>Inicio</span>
                </NavLink>

                {user?.role === "Profesor" && (
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                    >
                        <FaBook className="w-4 h-4 text-current" />
                        <span>Cursos</span>
                    </NavLink>
                )}

                {user?.role === "Alumno" && (
                    <>
                        <NavLink
                            to="/my-projects"
                            className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                        >
                            <FaProjectDiagram className="w-4 h-4 text-current" />
                            <span>Proyectos</span>
                        </NavLink>

                        <NavLink
                            to="/media-game"
                            className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                        >
                            <FaEnvelope className="w-4 h-4 text-current" />
                            <span>Media Query Game</span>
                        </NavLink>
                    </>
                )}

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                >
                    <FaUserFriends className="w-4 h-4 text-current" />
                    <span>Equipo</span>
                </NavLink>

                <hr className="border-gray-300" />

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                >
                    <FaBell className="w-4 h-4 text-current" />
                    <span>Notificaciones</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                >
                    <FaCog className="w-4 h-4 text-current" />
                    <span>Configuración</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
                >
                    <FaLifeRing className="w-4 h-4 text-current" />
                    <span>Soporte</span>
                </NavLink>
            </nav>

            {/* Menú de usuario (abajo) */}
            {user && (
                <div className="mt-4 border-t border-gray-300 pt-4 text-xs pr-4">
                    <div className="relative flex items-center gap-2">
                        <NavLink
                            to="/profile"
                            className="flex items-center gap-2 hover:opacity-90 text-current"
                        >
                            <FaUserCircle className="w-4 h-4 text-current" />
                            <span>
                                {user.nombre} {user.apellidoPaterno}
                            </span>
                        </NavLink>
                        <button className="ml-auto" onClick={toggleDropdown}>
                            <FaChevronRight className="w-4 h-4 text-current" />
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-white text-black border rounded shadow w-32 z-50"
                            >
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 hover:bg-gray-200 text-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Header;
