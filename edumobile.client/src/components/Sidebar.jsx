import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotificationHub } from "../hooks/useNotificationHub";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { notifications: realtimeNotifications, connectionState } = useNotificationHub();

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Cargar historial de notificaciones
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/Notifications");
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                // Manejo de errores (opcional)
            }
        };
        fetchNotifications();
    }, []);

    // Actualizar notificaciones con las recibidas en tiempo real
    useEffect(() => {
        if (realtimeNotifications && realtimeNotifications.length > 0) {
            setNotifications(prev => [...realtimeNotifications, ...prev]);
        }
    }, [realtimeNotifications]);

    // Función para eliminar una notificación
    const handleDeleteNotification = async (id) => {
        try {
            const response = await fetch(`/api/Notifications/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setNotifications((prev) => prev.filter((notif) => notif.id !== id));
            } else {
                alert("Error al eliminar la notificación.");
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    };

    // Función para marcar una notificación como leída
    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(`/api/Notifications/${id}/read`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === id ? { ...notif, IsRead: true } : notif
                    )
                );
            } else {
                alert("Error al marcar la notificación como leída.");
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    };

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
                        {notifications.map((notif) => (
                            <li key={notif.id} className="text-sm text-gray-300 flex justify-between items-center">
                                <span className={notif.IsRead ? "line-through" : ""}>
                                    {notif.message}
                                </span>
                                <div className="flex gap-1">
                                    {!notif.IsRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="text-green-400 hover:text-green-600 text-xs"
                                        >
                                            Marcar leída
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteNotification(notif.id)}
                                        className="text-red-400 hover:text-red-600 text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
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
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
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
