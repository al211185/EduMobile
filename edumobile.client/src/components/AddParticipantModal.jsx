import React, { useState } from "react";

const AddParticipantModal = ({ projectId, onClose, onParticipantAdded }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
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
                    RoleInProject: role || "Colaborador",
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                // Accedemos a data.message en minúsculas, ya que el JSON probablemente lo serializa así
                setError(data.message || "Error al agregar el participante");
            } else {
                setMessage("Participante agregado correctamente.");
                onParticipantAdded && onParticipantAdded();
                setTimeout(() => {
                    onClose && onClose();
                }, 2000);
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Agregar Participante</h2>
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email del participante:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Rol en el proyecto:</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Colaborador"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddParticipantModal;
