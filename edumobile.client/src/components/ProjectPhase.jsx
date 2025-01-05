import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectPlanning from "./ProjectPlanning";

const ProjectPhase = () => {
    const { projectId } = useParams(); // Obtener el projectId de la URL
    const [project, setProject] = useState(null); // Estado para los datos del proyecto
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (project) return; // Evita solicitudes adicionales si los datos ya están cargados

                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();

                if (response.ok) {
                    setProject(data); // Establece los datos del proyecto
                } else {
                    console.error("Error al cargar proyecto:", data.message);
                    setError(data.message || "No se pudo cargar el proyecto.");
                }
            } catch (error) {
                console.error("Error al obtener proyecto:", error);
                setError("Error al obtener los datos del proyecto.");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchProject();
    }, [projectId, project]); // `project` agregado para evitar múltiples solicitudes innecesarias

    if (loading) return <p>Cargando proyecto...</p>;
    if (error) return <p>{error}</p>;
    if (!project) return <p>Error: Proyecto no encontrado.</p>;

    return (
        <div className="project-phase-container">
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {/* Renderiza el componente de planeación y pasa los datos del proyecto */}
            <ProjectPlanning projectData={project} />
        </div>
    );
};

export default ProjectPhase;
