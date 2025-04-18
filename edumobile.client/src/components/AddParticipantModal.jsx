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
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Agregar Participante</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">
                            Email del participante:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">
                            Rol en el proyecto:
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 bg-white"
                        >
                            <option value="Colaborador">Colaborador</option>
                            <option value="Profesor">Profesor</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddParticipantModal;
