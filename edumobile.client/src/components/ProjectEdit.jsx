import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PhaseAssignmentEditor from "./PhaseAssignmentEditor";

const ProjectEdit = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados para el formulario de edición
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Controla la visibilidad del editor de asignaciones de fases
    const [showAssignmentEditor, setShowAssignmentEditor] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                    setTitle(data.title);           // Pre-cargar el título actual
                    setDescription(data.description); // Pre-cargar la descripción actual
                } else {
                    setError(data.message || "No se pudo cargar el proyecto.");
                }
            } catch (err) {
                setError("Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Title: title, Description: description }),
            });
            if (response.ok) {
                alert("Proyecto actualizado exitosamente.");
                navigate(`/projects/${projectId}`);
            } else {
                const data = await response.json();
                alert(data.message || "Error al actualizar el proyecto.");
            }
        } catch (err) {
            alert("Error al conectar con el servidor.");
        }
    };

    if (loading) return <p>Cargando proyecto...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!project) return <p>Proyecto no encontrado.</p>;

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h1 className="text-2xl font-bold text-[#4F46E5]">Editar Proyecto</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <div>
                    <label className="block text-gray-700 mb-1">Título:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="
              w-full
              border border-gray-200
              rounded-2xl
              p-3
              focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
            "
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-gray-700 mb-1">Descripción:</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="
              w-full
              border border-gray-200
              rounded-2xl
              p-3
              focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
            "
                    />
                </div>

                {/* Botón Guardar */}
                <button
                    type="submit"
                    className="
            bg-[#4F46E5] hover:bg-[#3730A3]
            text-white font-semibold
            px-6 py-2
            rounded-2xl
            shadow
            transition-colors
          "
                >
                    Guardar Cambios
                </button>
            </form>

            {/* Editar Asignaciones de Fase */}
            <div>
                <button
                    onClick={() => setShowAssignmentEditor(true)}
                    className="
            bg-purple-500 hover:bg-purple-600
            text-white font-semibold
            px-6 py-2
            rounded-2xl
            shadow
            transition-colors
          "
                >
                    Editar Asignaciones de Fase
                </button>
            </div>

            {/* Modal de asignación de fases */}
            {showAssignmentEditor && (
                <PhaseAssignmentEditor
                    projectId={projectId}
                    onClose={() => setShowAssignmentEditor(false)}
                // handleSave lo define internamente
                />
            )}
        </div>
    );
};

export default ProjectEdit;