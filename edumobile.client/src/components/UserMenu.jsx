import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Hook para obtener usuario y cerrar sesión
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return (
        <div className="user-menu">
            <button className="user-button" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
                <span>{user?.nombre} {user?.apellidoPaterno}</span>
            </button>

            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                        <FontAwesomeIcon icon={faCog} /> Perfil
                    </Link>
                    <Link to="/change-password" className="dropdown-item">
                        <FontAwesomeIcon icon={faCog} /> Cambiar Contraseña
                    </Link>
                    <Link to="/email-settings" className="dropdown-item">
                        <FontAwesomeIcon icon={faCog} /> Configuración de Correo
                    </Link>
                    <hr />
                    <button className="dropdown-item logout" onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
