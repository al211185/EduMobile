import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

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
        event.stopPropagation(); // para que no dispare el onClick de la tarjeta
        navigate(`/projects/edit/${projectId}`);
    };

    const handleDeleteClick = async (event, projectId) => {
        event.stopPropagation();
        if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setProjects((prev) => prev.filter((p) => p.id !== projectId));
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
        <div className="flex-1 overflow-auto">
            {/* Cabecera estilo cápsula más grande y sin fondo blanco */}
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-8 w-full">
                <h1 className="text-2xl font-bold text-[#64748B]">Proyectos</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => {
                    const fecha = project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })
                        : "";

                    return (
                        <div
                            key={project.id}
                            className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-[#64748B] text-center mb-2">
                                    {project.title}
                                </h2>
                                {project.description && (
                                    <p className="text-[#64748B] text-center mb-2">
                                        {project.description}
                                    </p>
                                )}
                                {fecha && (
                                    <p className="text-[#64748B] text-center text-sm mb-4">
                                        Fecha de creación: {fecha}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2 self-center mt-4">
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-6 py-2 rounded"
                                    onClick={(event) => handleEditClick(event, project.id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-2 rounded"
                                    onClick={(e) => handleDeleteClick(e, project.id)}
                                >
                                    Eliminar
                                    </button>
                            </div>
                        </div>
                    );
                })}

                {/* Nueva tarjeta de crear */}
                <div
                    key="create"
                    className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center text-[#64748B]"
                    onClick={() => navigate("/create-project")}
                >
                    <h2 className="text-2xl font-bold mb-2 text-center">Crear Proyecto</h2>
                    <div className="mt-4">
                        <FaPlusCircle className="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProjects;
