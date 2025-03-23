import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetailsProfessor = () => {
    const { id } = useParams(); // Extrae el parámetro "id"
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Función para obtener los detalles del proyecto usando el endpoint para profesores
    const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`/api/projects/professor/${id}`);
            const data = await response.json();
            if (response.ok) {
                setProject(data);
            } else {
                setError(data.message || "Error al obtener los detalles del proyecto.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    if (loading) return <p>Cargando detalles del proyecto...</p>;
    if (error) return <p>{error}</p>;
    if (!project) return <p>Proyecto no encontrado.</p>;

    return (
        <div className="project-details">
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="project-meta">
                <p>
                    <strong>Creado el:</strong>{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>Fase actual:</strong> {project.currentPhase}
                </p>
                <p>
                    <strong>Semestre:</strong>{" "}
                    {project.semester ? project.semester.name : "Sin semestre"}
                </p>
                <p>
                    <strong>Creado por:</strong>{" "}
                    {project.createdBy
                        ? `${project.createdBy.nombre} ${project.createdBy.apellidoPaterno}`
                        : "Desconocido"}
                </p>
            </div>
            <div className="team-section">
                <h3>Equipo del Proyecto</h3>
                {project.team && project.team.length > 0 ? (
                    <ul>
                        {project.team.map((member) => (
                            <li key={member.applicationUserId}>
                                {member.name} - {member.roleInProject}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay miembros en el equipo.</p>
                )}
            </div>
            <button
                onClick={() => navigate(`/projects/${id}/read-only`)}
                className="btn btn-primary"
            >
                Ver Fases en Modo Lectura
            </button>
        </div>
    );
};

export default ProjectDetailsProfessor;
