import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaUserCircle } from "react-icons/fa";

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
        <div className="space-y-6">
            {/* — Avatar y Nombre — */}
            <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 shadow">
                <FaUserCircle className="w-16 h-16 text-[#64748B]" />
                <div>
                    <h2 className="text-xl font-semibold text-[#64748B]">
                        {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            {/* — Tabs + Contenido — */}
            <div className="bg-white rounded-2xl p-6 shadow ">
                {/* — Navigation Tabs — */}
                <nav className="border-b border-gray-200 mb-4">
                    <ul className="flex space-x-4">
                        {["profile", "email", "change-password"].map(tab => {
                            const labels = {
                                profile: "Perfil",
                                email: "Email",
                                "change-password": "Cambiar Contraseña"
                            };
                            return (
                                <li key={tab}>
                                    <button
                                        onClick={() => setCurrentTab(tab)}
                                        className={`px-4 py-2 font-medium ${currentTab === tab
                                                ? "border-b-2 border-[#64748B] text-[#64748B]"
                                                : "text-gray-600 hover:text-[#64748B]"
                                            }`}
                                    >
                                        {labels[tab]}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* — Content Area — */}
                <div>
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
                                        className="w-full bg-[#E5E5E5] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#64748B] hover:bg-[#5a6370] text-white font-semibold py-2 rounded-md transition-colors"
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
                                {[
                                    { id: "currentPassword", label: "Contraseña Actual", val: currentPassword, setter: setCurrentPassword },
                                    { id: "newPassword", label: "Nueva Contraseña", val: newPassword, setter: setNewPassword },
                                    { id: "confirmPassword", label: "Confirmar Contraseña", val: confirmPassword, setter: setConfirmPassword }
                                ].map(({ id, label, val, setter }) => (
                                    <div key={id}>
                                        <label
                                            htmlFor={id}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            {label}:
                                        </label>
                                        <input
                                            type="password"
                                            id={id}
                                            value={val}
                                            onChange={e => setter(e.target.value)}
                                            placeholder={id === "currentPassword"
                                                ? "Ingresa tu contraseña actual"
                                                : id === "newPassword"
                                                    ? "Ingresa tu nueva contraseña"
                                                    : "Confirma tu nueva contraseña"}
                                            required
                                            className="w-full bg-[#E5E5E5] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    className="w-full bg-[#64748B] hover:bg-[#5a6370] text-white font-semibold py-2 rounded-md transition-colors"
                                >
                                    Actualizar
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );



};

export default Profile;
