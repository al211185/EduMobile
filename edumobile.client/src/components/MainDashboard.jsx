import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProjectsPanel from "./ProjectsPanel"; // Panel con proyectos activos, etc.
import ProfessorCoursesDashboard from "./ProfessorCoursesDashboard"; // Lógica actual de Dashboard para cursos y registro de alumnos

const MainDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Bienvenido, {user.nombre}</h1>

            {user.role === "Profesor" ? (
                <>
                    {/* Panel central de proyectos, informes generales, etc. */}
                    <ProjectsPanel />
                    {/* Lógica específica para cursos y registro de alumnos */}
                    <ProfessorCoursesDashboard />
                </>
            ) : (
                // Para alumnos, quizás mostrar un panel con sus proyectos, etc.
                <ProjectsPanel />
            )}
        </div>
    );
};

export default MainDashboard;
