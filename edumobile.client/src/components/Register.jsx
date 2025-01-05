import React, { useState } from "react";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [matricula, setMatricula] = useState("");
    const [message, setMessage] = useState("");

    // Manejar el registro
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("⚠️ Las contraseñas no coinciden.");
            return;
        }

        const newUser = {
            email,
            password,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            matricula
        };

        try {
            const response = await fetch("/api/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.");
            } else {
                const data = await response.json();
                setMessage(`⚠️ ${data.message || "Error al registrarse."}`);
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error en el registro. Inténtalo nuevamente.");
        }
    };

    return (
        <div className="container">
            <h1 className="main-heading">Registrarse</h1>
            <form onSubmit={handleRegister}>
                <h2>Crea una nueva cuenta</h2>
                {message && (
                    <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <label htmlFor="nombre">Nombre</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="apellidoPaterno"
                        placeholder="Apellido Paterno"
                        value={apellidoPaterno}
                        onChange={(e) => setApellidoPaterno(e.target.value)}
                        required
                    />
                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="apellidoMaterno"
                        placeholder="Apellido Materno"
                        value={apellidoMaterno}
                        onChange={(e) => setApellidoMaterno(e.target.value)}
                        required
                    />
                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="matricula"
                        placeholder="Matrícula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                    <label htmlFor="matricula">Matrícula</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Correo Electrónico</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Contraseña</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
