import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectsPanel = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects"); // O un endpoint diferente según el rol
            const data = await response.json();
            if (response.ok) {
                setProjects(data);
            } else {
                console.error("Error al cargar proyectos:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loadingProjects) return <p>Cargando proyectos...</p>;

    return (
        <div className="projects-panel">
            <h2>Proyectos Activos</h2>
            {projects.length > 0 ? (
                <table className="projects-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Creado Por</th>
                            <th>Semestre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.title}</td>
                                <td>{project.description}</td>
                                <td>{project.createdBy || "Desconocido"}</td>
                                <td>{project.semesterName || "Sin Semestre"}</td>
                                <td>
                                    <button
                                        className="btn-secondary"
                                        onClick={() =>
                                            navigate(
                                                project.createdById
                                                    ? `/projects/professor/${project.id}`
                                                    : `/projects/${project.id}`
                                            )
                                        }
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay proyectos activos en este momento.</p>
            )}
        </div>
    );
};

export default ProjectsPanel;
