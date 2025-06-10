import React, { useState } from "react";

const AddParticipantModal = ({ projectId, onClose, onParticipantAdded }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Colaborador");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`/api/projects/${projectId}/team/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CollaboratorEmail: email,
                    RoleInProject: role,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Error al agregar el participante");
            } else {
                setMessage("Participante agregado correctamente.");
                onParticipantAdded && onParticipantAdded();
                setTimeout(() => {
                    onClose && onClose();
                }, 2000);
            }
        } catch {
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
                <div className="p-6 space-y-6">
                    <h2 className="text-xl font-bold text-[#4F46E5]">
                        Agregar Participante
                    </h2>

                    {error && (
                        <p className="text-red-500 bg-red-50 border border-red-200 rounded-2xl p-2">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-600 bg-green-50 border border-green-200 rounded-2xl p-2">
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-1">
                                Email del participante:
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">
                                Rol en el proyecto:
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border border-gray-200 rounded-2xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                            >
                                <option value="Colaborador">Colaborador</option>
                                <option value="Profesor">Profesor</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`font-semibold py-2 px-4 rounded-2xl transition-colors ${loading
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                    }`}
                            >
                                {loading ? "Agregando..." : "Agregar"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-2xl transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddParticipantModal;