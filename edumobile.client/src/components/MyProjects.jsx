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
                    setProjects((prev) =>
                        prev.filter((project) => project.id !== projectId)
                    );
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Proyectos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="cursor-pointer bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            {project.title}
                        </h2>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded"
                                onClick={(event) => handleEditClick(event, project.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded"
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
