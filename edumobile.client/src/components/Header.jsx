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
                        <>
                            <a href="/dashboard" className="nav-courses">
                                Cursos
                            </a>
                            {/* Enlace para reportar errores visible para todos */}
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfzdi8RAKM6yQTqXl2SPa2D_-VRtd_KpN451ip-DNHTLIob4w/viewform?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-error-report"
                            >
                                Reporta un error
                            </a>
                        </>
                    )}
                    {user?.role === "Alumno" && (
                        <>
                            <a href="/my-projects" className="nav-projects">
                                Mis Proyectos
                            </a>
                            <a href="/media-game" className="nav-media-game">
                                Media Query Game
                            </a>
                            {/* También puedes incluir el enlace para alumnos, o dejarlo solo para profesores */}
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfzdi8RAKM6yQTqXl2SPa2D_-VRtd_KpN451ip-DNHTLIob4w/viewform?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-error-report"
                            >
                                Reporta un error
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
