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
        <div className="profile-container">
            <nav className="profile-nav">
                <ul>
                    <li>
                        <button
                            onClick={() => setCurrentTab("profile")}
                            className={currentTab === "profile" ? "active" : ""}
                        >
                            Perfil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setCurrentTab("email")}
                            className={currentTab === "email" ? "active" : ""}
                        >
                            Email
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setCurrentTab("change-password")}
                            className={currentTab === "change-password" ? "active" : ""}
                        >
                            Cambiar Contraseña
                        </button>
                    </li>
                </ul>
            </nav>
            <div className="profile-content">{renderContent()}</div>
        </div>
    );
};

export default Profile;
