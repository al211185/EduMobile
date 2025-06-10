// src/components/MainDashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProjectsPanel from "./ProjectsPanel";
import ProfessorCoursesDashboard from "./ProfessorCoursesDashboard";
import StudentDashboard from "./StudentDashboard";

const MainDashboard = () => {
    const { user } = useAuth();

    return (
        // contenedor raíz sin bg-white, con padding igual al de ProjectsPanel
        <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
            {user.role === "Profesor" ? (
                <>
                    <ProjectsPanel />
                    <ProfessorCoursesDashboard />
                </>
            ) : user.role === "Alumno" ? (
                // StudentDashboard ya no mostrará su propio header ni bg blanco
                <StudentDashboard />
            ) : (
                <ProjectsPanel />
            )}
        </div>
    );
};

export default MainDashboard;
