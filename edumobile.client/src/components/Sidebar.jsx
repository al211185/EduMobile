import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationHub } from "../hooks/useNotificationHub";
import {
    FaHome,
    FaBook,
    FaProjectDiagram,
    FaGamepad,
    FaCog,
    FaLifeRing,
    FaUserCircle,
    FaChevronRight,
    FaBars,
} from "react-icons/fa";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { notifications: realtimeNotifications } = useNotificationHub();
    const [showPopup, setShowPopup] = useState(true);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Cargar historial de notificaciones
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/Notifications", { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    // Actualizar notificaciones con las recibidas en tiempo real
    useEffect(() => {
        if (realtimeNotifications?.length) {
            setNotifications((prev) => [...realtimeNotifications, ...prev]);
        }
    }, [realtimeNotifications]);

    // Link styles
    const baseLink =
        "flex items-center gap-3 py-2 pl-4 pr-2 rounded-full transition-colors hover:bg-[#4F46E5]/10 hover:text-[#4F46E5]";
    const activeLink =
        "flex items-center gap-3 py-2 pl-4 pr-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]";

    const navItems = (
        <>
            <NavLink to="/" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
                <FaHome className="w-5 h-5" />
                <span>Inicio</span>
            </NavLink>

            {user?.role === "Profesor" ? (
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
                    <FaBook className="w-5 h-5" />
                    <span>Cursos</span>
                </NavLink>
            ) : (
                <>
                    <NavLink to="/my-projects" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
                        <FaProjectDiagram className="w-5 h-5" />
                        <span>Mis Proyectos</span>
                    </NavLink>
                    <NavLink to="/media-game" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
                        <FaGamepad className="w-5 h-5" />
                        <span>Media Game</span>
                    </NavLink>
                </>
            )}

            <hr className="border-gray-200 my-4" />

            <NavLink to="/profile" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
                <FaCog className="w-5 h-5" />
                <span>Configuración</span>
            </NavLink>
            <a
                href="https://docs.google.com/forms/…"
                target="_blank"
                rel="noopener noreferrer"
                className={baseLink}
            >
                <FaLifeRing className="w-5 h-5" />
                <span>Reportar un error</span>
            </a>
        </>
    );

    return (
        <>
            {/* HAMBURGUESA SOLO EN MOBILE */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
            >
                <FaBars className="w-6 h-6 text-gray-700" />
            </button>

            {/* SIDEBAR DE ESCRITORIO */}
            <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white text-[#64748B] p-4 pt-8 flex-col justify-between overflow-visible">
                {/* LOGO + NAV */}
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        {/*<img src="/logo-2.svg" alt="Logo" className="w-6 h-6" />*/}
                        <span className="text-xl font-bold text-black">Edumobile</span>
                    </div>
                    <nav className="space-y-3 text-sm">{navItems}</nav>
                </div>

                {/* PERFIL / LOGIN */}
                <div className="pt-4 border-t border-gray-200">
                    {!user ? (
                        <>
                            <NavLink to="/login" className="block py-2 px-4 rounded hover:bg-gray-100">
                                Iniciar Sesión
                            </NavLink>
                            <NavLink to="/register" className="block py-2 px-4 rounded hover:bg-gray-100">
                                Registrarse
                            </NavLink>
                        </>
                    ) : (
                            <div className="relative flex items-center justify-between w-full overflow-visible">
                            <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-90">
                                <FaUserCircle className="w-6 h-6 text-gray-500" />
                                <span className="text-[#64748B]">
                                    {user.nombre} {user.apellidoPaterno}
                                </span>
                            </NavLink>
                            <button onClick={() => setIsDropdownOpen(o => !o)}>
                                <FaChevronRight className="w-4 h-4 text-gray-500" />
                            </button>
                            {isDropdownOpen && (
                                    <div className="absolute bottom-0 left-full ml-2 mb-2 bg-white border rounded shadow w-32 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* DRAWER MOBILE */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* fondo semitransparente */}
                    <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />

                    {/* drawer content */}
                    <aside className="relative w-64 bg-white p-4 pt-8 flex flex-col justify-between shadow-lg">
                        <div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 text-gray-600"
                            >
                                <FaChevronRight className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2 mb-10">
                                <img src="/logo-2.svg" alt="Logo" className="w-6 h-6" />
                                <span className="text-xl font-bold text-black">Edumobile</span>
                            </div>
                            <nav className="space-y-3 text-sm">{navItems}</nav>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            {!user ? (
                                <>
                                    <NavLink to="/login" className="block py-2 px-4 rounded hover:bg-gray-100">
                                        Iniciar Sesión
                                    </NavLink>
                                    <NavLink to="/register" className="block py-2 px-4 rounded hover:bg-gray-100">
                                        Registrarse
                                    </NavLink>
                                </>
                            ) : (
                                    <div className="relative flex items-center justify-between w-full overflow-visible">
                                    <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-90">
                                        <FaUserCircle className="w-6 h-6 text-gray-500" />
                                        <span className="text-[#64748B]">
                                            {user.nombre} {user.apellidoPaterno}
                                        </span>
                                    </NavLink>
                                    <button onClick={() => setIsDropdownOpen(o => !o)}>
                                        <FaChevronRight className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {isDropdownOpen && (
                                            <div className="absolute bottom-0 left-full ml-2 mb-2 bg-white border rounded shadow w-32 z-50">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            )}
            {/* Barra de notificaciones abajo-derecha */}
            {showPopup && (
                <div className="fixed bottom-4 right-4 z-50 w-80 bg-[#EEF2FF] rounded-2xl shadow-lg p-4">
                    {/* Header con título y botón de cerrar */}
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[#4F46E5] font-semibold text-lg">Notificaciones</h3>
                        <button onClick={() => setShowPopup(false)}
                            className="text-[#4F46E5] font-bold">X
                        </button>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-[#4F46E5] text-sm text-center">No hay notificaciones</p>
                    ) : (
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.map((n) => (
                                <li key={n.id} className="text-[#4F46E5] text-sm">
                                    {n.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div >
            )}
        </>
    );
};

export default Sidebar;