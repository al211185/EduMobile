import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="nav-left">
                    <a href="/" className="nav-logo">
                        Inicio
                    </a>
                    {user?.role === "Profesor" && (
                        <a href="/dashboard" className="nav-courses">
                            Cursos
                        </a>
                    )}
                    {user?.role === "Alumno" && (
                        <>
                            <a href="/my-projects" className="nav-projects">
                                Mis Proyectos
                            </a>
                            <a href="/media-game" className="nav-media-game">
                                Media Query Game
                            </a>
                        </>
                    )}
                </div>
                <div className="nav-actions">
                    {!user ? (
                        <>
                            <a href="/login" className="nav-link">
                                Iniciar Sesión
                            </a>
                            <a href="/register" className="nav-link">
                                Registrarse
                            </a>
                        </>
                    ) : (
                        <>
                            {user?.role === "Alumno" && (
                                <a href="/create-project" className="create-project-button">
                                    Crear Proyecto
                                </a>
                            )}
                            <div className="user-menu">
                                <button className="user-name" onClick={toggleDropdown}>
                                    {user.nombre} {user.apellidoPaterno}
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <a href="/profile" className="dropdown-item">
                                            Perfil
                                        </a>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
