import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/projects");
                const data = await response.json();
                if (response.ok) {
                    setProjects(data);
                } else {
                    console.error("Error al obtener proyectos:", data.message);
                }
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const handleEditClick = (event, projectId) => {
        event.stopPropagation(); // Evita que se active el clic en la tarjeta
        navigate(`/projects/edit/${projectId}`);
    };

    const handleDeleteClick = async (event, projectId) => {
        event.stopPropagation(); // Evita que se active el clic en la tarjeta
        if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setProjects((prev) => prev.filter((project) => project.id !== projectId));
                    alert("Proyecto eliminado con éxito.");
                } else {
                    const data = await response.json();
                    console.error("Error al eliminar proyecto:", data.message);
                    alert(data.message || "Error al eliminar el proyecto.");
                }
            } catch (error) {
                console.error("Error al eliminar proyecto:", error);
                alert("Error al eliminar el proyecto.");
            }
        }
    };

    return (
        <div className="my-projects">
            <h1>Mis Proyectos</h1>
            <div className="project-cards">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <div className="card-buttons">
                            <button
                                className="edit-button"
                                onClick={(event) => handleEditClick(event, project.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="delete-button"
                                onClick={(event) => handleDeleteClick(event, project.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProjects;
