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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Editar Proyecto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Título:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Descripción:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        rows="4"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Guardar Cambios
                </button>
            </form>
            <div className="mt-6">
                {/* Botón para abrir el editor de asignaciones, solo para el creador */}
                <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => setShowAssignmentEditor(true)}
                >
                    Editar Asignaciones de Fase
                </button>
            </div>
            {showAssignmentEditor && (
                <PhaseAssignmentEditor
                    projectId={projectId}
                    onClose={() => setShowAssignmentEditor(false)}
                    onAssignmentsSaved={() => {
                        // Opcional: refrescar la información del proyecto o notificar al usuario
                    }}
                />
            )}
        </div>
    );
};

export default ProjectEdit;
