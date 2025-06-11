import React, { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useNotificationHub } from "../hooks/useNotificationHub";

const NotificationBell = () => {
    const { notifications: realtimeNotifications } = useNotificationHub();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/Notifications", { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };
        fetchNotifications();
    }, []);

    // Merge realtime notifications
    useEffect(() => {
        if (realtimeNotifications?.length) {
            setNotifications(prev => [...realtimeNotifications, ...prev]);
        }
    }, [realtimeNotifications]);

    const markAsRead = async (id) => {
        try {
            const response = await fetch(`/api/Notifications/${id}/read`, {
                method: "PUT",
                credentials: "include"
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const response = await fetch(`/api/Notifications/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };


    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button onClick={() => setOpen(o => !o)} className="relative focus:outline-none">
                <FaBell className="w-5 h-5 text-[#4F46E5]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded shadow-lg z-50 p-3">
                    <h3 className="text-sm font-semibold text-[#4F46E5] mb-2">Notificaciones</h3>
                    {notifications.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center">No hay notificaciones</p>
                    ) : (
                        <ul className="max-h-60 overflow-y-auto text-sm space-y-2">
                            {notifications.map(n => (
                                <li
                                    key={n.id}
                                    className={`flex items-start justify-between ${n.isRead ? "text-gray-500" : "text-[#4F46E5]"}`}
                                >
                                    <span onClick={() => markAsRead(n.id)} className="cursor-pointer flex-1">
                                        {n.message}
                                    </span>
                                    <button onClick={() => deleteNotification(n.id)} className="ml-2 text-gray-400 hover:text-red-500">
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;