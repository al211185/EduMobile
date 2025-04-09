import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotificationHub } from "../hooks/useNotificationHub";
import * as signalR from "@microsoft/signalr"; // Para acceder al enum de estados (opcional)

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    // El hook retorna tanto las notificaciones en tiempo real como el estado de la conexión.
    const { notifications: realtimeNotifications, connectionState } = useNotificationHub();

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Efecto para cargar notificaciones iniciales desde /api/Notifications (historial)
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/Notifications");
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                // Manejo de errores si es necesario
            }
        };
        fetchNotifications();
    }, []);

    // Efecto para actualizar notificaciones cuando se reciben mensajes en tiempo real
    useEffect(() => {
        if (realtimeNotifications && realtimeNotifications.length > 0) {
            setNotifications(prev => [...realtimeNotifications, ...prev]);
        }
    }, [realtimeNotifications]);

    // Log cada vez que cambia el estado de notificaciones (removido)

    // Función para enviar una notificación de prueba (removida la llamada y el botón)

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            {/* Encabezado */}
            <div className="p-6 border-b border-gray-700">
                <a href="/" className="text-2xl font-bold">
                    Inicio
                </a>
            </div>

            {/* Menú de navegación */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {user?.role === "Profesor" ? (
                    <>
                        <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
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
                ) : (
                    <>
                        <a href="/my-projects" className="block py-2 px-4 rounded hover:bg-gray-700">
                            Mis Proyectos
                        </a>
                        <a href="/media-game" className="block py-2 px-4 rounded hover:bg-gray-700">
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

            {/* Sección de notificaciones */}
            <div className="px-4 py-4 border-t border-gray-700">
                <h3 className="text-lg font-bold">Notificaciones</h3>
                {notifications.length === 0 ? (
                    <p className="text-sm text-gray-300 mt-2">No hay notificaciones.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {notifications.map((notif, index) => (
                            <li key={index} className="text-sm text-gray-300">
                                {notif.message ? notif.message : notif}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Sección de acciones de usuario */}
            <div className="px-4 py-4 border-t border-gray-700">
                {!user ? (
                    <div className="space-y-2">
                        <a href="/login" className="block py-2 px-4 rounded hover:bg-gray-700">
                            Iniciar Sesión
                        </a>
                        <a href="/register" className="block py-2 px-4 rounded hover:bg-gray-700">
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
                                    <a href="/profile" className="block py-2 px-4 hover:bg-gray-600">
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
