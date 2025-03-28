import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState("profile");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    if (!user) {
        return <p>Por favor, inicia sesión para acceder a tu perfil.</p>;
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("⚠️ Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch("/api/Auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Incluye el token si lo usas
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`✅ ${data.Message}`);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(`⚠️ ${data.Message || "Error al cambiar la contraseña."}`);
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al intentar cambiar la contraseña.");
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case "profile":
                return (
                    <div>
                        <h2>Información del Perfil</h2>
                        <p><strong>Nombre:</strong> {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Matrícula:</strong> {user.matricula}</p>
                    </div>
                );
            case "email":
                return (
                    <div>
                        <h2>Actualizar Email</h2>
                        <form>
                            <div>
                                <label htmlFor="newEmail">Nuevo Email:</label>
                                <input type="email" id="newEmail" placeholder="Ingresa tu nuevo email" required />
                            </div>
                            <button type="submit" className="btn-primary">Actualizar</button>
                        </form>
                    </div>
                );
            case "change-password":
                return (
                    <div>
                        <h2>Cambiar Contraseña</h2>
                        {message && (
                            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleChangePassword}>
                            <div>
                                <label htmlFor="currentPassword">Contraseña Actual:</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword">Nueva Contraseña:</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Ingresa tu nueva contraseña"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Actualizar</button>
                        </form>
                    </div>
                );
            default:
                return <p>Selecciona una opción del menú.</p>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Navigation Tabs */}
            <nav className="mb-4 border-b pb-2">
                <ul className="flex space-x-4">
                    <li>
                        <button
                            onClick={() => setCurrentTab("profile")}
                            className={`px-4 py-2 font-medium ${currentTab === "profile"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                        >
                            Perfil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setCurrentTab("email")}
                            className={`px-4 py-2 font-medium ${currentTab === "email"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                        >
                            Email
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setCurrentTab("change-password")}
                            className={`px-4 py-2 font-medium ${currentTab === "change-password"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                        >
                            Cambiar Contraseña
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Content Area */}
            <div className="profile-content">
                {currentTab === "profile" && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Información del Perfil
                        </h2>
                        <p className="text-gray-700 mb-2">
                            <strong>Nombre:</strong> {user.nombre} {user.apellidoPaterno}{" "}
                            {user.apellidoMaterno}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-gray-700">
                            <strong>Matrícula:</strong> {user.matricula}
                        </p>
                    </div>
                )}

                {currentTab === "email" && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Actualizar Email
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="newEmail"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nuevo Email:
                                </label>
                                <input
                                    type="email"
                                    id="newEmail"
                                    placeholder="Ingresa tu nuevo email"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                )}

                {currentTab === "change-password" && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Cambiar Contraseña
                        </h2>
                        {message && (
                            <div
                                className={`p-2 rounded mb-4 text-sm ${message.startsWith("✅")
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contraseña Actual:
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nueva Contraseña:
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Ingresa tu nueva contraseña"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirmar Contraseña:
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                )}

                {currentTab !== "profile" &&
                    currentTab !== "email" &&
                    currentTab !== "change-password" && <p>Selecciona una opción del menú.</p>}
            </div>
        </div>
    );

};

export default Profile;
