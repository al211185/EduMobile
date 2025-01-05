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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProjects;
