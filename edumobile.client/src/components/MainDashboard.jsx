import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProjectsPanel from "./ProjectsPanel";
import ProfessorCoursesDashboard from "./ProfessorCoursesDashboard";

const MainDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Bienvenido, {user.nombre}
                </h1>
            </header>
            {user.role === "Profesor" ? (
                <div className="space-y-12">
                    <ProjectsPanel />
                    <ProfessorCoursesDashboard />
                </div>
            ) : (
                <ProjectsPanel />
            )}
        </div>
    );
};

export default MainDashboard;
