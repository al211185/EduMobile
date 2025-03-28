import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetailsProfessor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`/api/projects/professor/${id}`, {
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                } else {
                    setError(data.Message || "Error al cargar el proyecto.");
                }
            } catch (err) {
                setError("Error al conectarse al servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    if (loading) return <p>Cargando proyecto...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Volver
            </button>
            <h1 className="text-3xl font-bold mb-4">{project.Title}</h1>
            <p className="mb-6">{project.Description}</p>

            {/* Visualización del semestre */}
            {project.Semester && (
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Semestre</h2>
                    <p>
                        {project.Semester.Name} - {project.Semester.Period}{" "}
                        {project.Semester.Year}
                    </p>
                </div>
            )}

            {/* Información del creador */}
            {project.CreatedBy && (
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Creado por</h2>
                    <p>
                        {project.CreatedBy.Nombre} {project.CreatedBy.ApellidoPaterno}{" "}
                        {project.CreatedBy.ApellidoMaterno}
                    </p>
                    <p>Email: {project.CreatedBy.Email}</p>
                </div>
            )}

            {/* Visualización del equipo (colaboradores) */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Equipo</h2>
                <ul>
                    {project.Team && project.Team.length > 0 ? (
                        project.Team.map((member) => (
                            <li key={member.ApplicationUserId}>
                                {member.Name} - {member.RoleInProject}
                            </li>
                        ))
                    ) : (
                        <li>No hay colaboradores.</li>
                    )}
                </ul>
            </div>

            {/* Fases del proyecto */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Fases del Proyecto</h2>
                <div>
                    <h3 className="text-xl font-medium">Planeación</h3>
                    <pre className="bg-gray-100 p-4 rounded">
                        {JSON.stringify(project.PlanningPhase, null, 2)}
                    </pre>
                </div>
                <div>
                    <h3 className="text-xl font-medium">Diseño</h3>
                    <pre className="bg-gray-100 p-4 rounded">
                        {JSON.stringify(project.DesignPhase, null, 2)}
                    </pre>
                </div>
                <div>
                    <h3 className="text-xl font-medium">Desarrollo</h3>
                    <pre className="bg-gray-100 p-4 rounded">
                        {JSON.stringify(project.DevelopmentPhase, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsProfessor;
