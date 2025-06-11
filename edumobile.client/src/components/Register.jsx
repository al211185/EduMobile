import React, { useState } from "react";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
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
            apellidoMaterno
        };

        try {
            const response = await fetch("/api/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setNombre("");
                setApellidoPaterno("");
                setApellidoMaterno("");
            } else {
                const data = await response.json();
                setMessage(`⚠️ ${data.message || "Error al registrarse."}`);
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error en el registro. Inténtalo nuevamente.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-semibold text-[#64748B] text-center mb-6">
                Registro de Profesores
            </h1>
            <p className="text-center text-sm text-gray-600 mb-4">
                Si eres alumno, espera a que tu profesor te registre
            </p>

            {message && (
                <div
                    className={`px-4 py-2 rounded-md text-sm mb-6 ${message.startsWith("✅")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
                {[
                    { label: "Nombre", value: nombre, setter: setNombre, type: "text", id: "nombre", autoComplete: "given-name" },
                    { label: "Apellido Paterno", value: apellidoPaterno, setter: setApellidoPaterno, type: "text", id: "apellidoPaterno", autoComplete: "family-name" },
                    { label: "Apellido Materno", value: apellidoMaterno, setter: setApellidoMaterno, type: "text", id: "apellidoMaterno", autoComplete: "additional-name" },
                    { label: "Correo Electrónico", value: email, setter: setEmail, type: "email", id: "email", autoComplete: "email" },
                    { label: "Contraseña", value: password, setter: setPassword, type: "password", id: "password", autoComplete: "new-password" },
                    { label: "Confirmar Contraseña", value: confirmPassword, setter: setConfirmPassword, type: "password", id: "confirmPassword", autoComplete: "new-password" },
                ].map(({ label, value, setter, type, id, autoComplete }) => (
                    <div key={id} className="flex flex-col">
                        <label htmlFor={id} className="mb-2 font-medium text-gray-700">
                            {label}
                        </label>
                        {type !== "textarea" ? (
                            <input
                                id={id}
                                type={type}
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                required
                                autoComplete={autoComplete}
                                className="
                  border border-gray-300
                  rounded-lg
                  px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
                  transition
                "
                            />
                        ) : (
                            <textarea
                                id={id}
                                rows={4}
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                    required
                                    autoComplete={autoComplete}
                                className="
                  border border-gray-300
                  rounded-lg
                  px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
                  transition
                "
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="
            w-full
            bg-[#4F46E5] hover:bg-[#4338CA]
            text-white font-semibold
            py-2 rounded-full
            focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-opacity-50
            transition
          "
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;