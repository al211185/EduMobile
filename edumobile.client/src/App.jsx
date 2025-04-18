import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword"; // Importa el componente de recuperación
import MainDashboard from "./components/MainDashboard"; // Dashboard para alumnos o datos generales
import Dashboard from "./components/Dashboard"; // Dashboard para profesores (gestión de cursos)
import CreateProject from "./components/CreateProject";
import Profile from "./components/Profile";
import MyProjects from "./components/MyProjects";
import ProjectPhase from "./components/ProjectPhase";
import DesignPhase from "./components/DesignPhase";
import DevelopmentPhase from "./components/DevelopmentPhase";
import ProjectDetailsProfessor from "./components/ProjectDetailsProfessor";
import MediaQueryDragAndDropWithReference from "./components/MediaQueryDragAndDropWithReference";
import ErrorBoundary from "./components/ErrorBoundary";
import ResetPassword from "./components/ResetPassword";
import ProjectEdit from "./components/ProjectEdit";

import { useAuth } from "./contexts/AuthContext";
import "./globals.css";

const Layout = ({ children }) => {
    const location = useLocation();
    // Si la ruta es /login, /register o /forgot-password, no se muestra el sidebar
    const hideSidebar =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot-password";

    return hideSidebar ? (
        <main className="main-container">{children}</main>
    ) : (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
};

const App = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <p>Cargando...</p>;

    return (
        <Router>
            <ErrorBoundary>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Rutas protegidas dentro de Layout */}
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    {/* Ruta raíz ("/") */}
                                    <Route
                                        index
                                        element={
                                            user
                                                ? <MainDashboard />
                                                : <Navigate to="/login" replace />
                                        }
                                    />

                                    {/* Rutas comunes */}
                                    <Route path="create-project" element={<CreateProject />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="media-game" element={<MediaQueryDragAndDropWithReference />} />

                                    {/* Rutas para el profesor */}
                                    {user?.role === "Profesor" && (
                                        <>
                                            <Route path="dashboard" element={<Dashboard />} />
                                            <Route path="projects/professor/:id" element={<ProjectDetailsProfessor />} />
                                            <Route path="projects/:projectId" element={<ProjectPhase />} />
                                            <Route path="fase-2-diseno/:projectId" element={<DesignPhase />} />
                                            <Route path="development-phase/:projectId" element={<DevelopmentPhase />} />
                                        </>
                                    )}

                                    {/* Rutas para el alumno */}
                                    {user?.role === "Alumno" && (
                                        <>
                                            <Route path="my-projects" element={<MyProjects />} />
                                            <Route path="projects/edit/:projectId" element={<ProjectEdit />} />
                                            <Route path="projects/:projectId" element={<ProjectPhase />} />
                                            <Route path="fase-2-diseno/:projectId" element={<DesignPhase />} />
                                            <Route path="development-phase/:projectId" element={<DevelopmentPhase />} />
                                        </>
                                    )}
                                </Routes>
                            </Layout>
                        }
                    />
                </Routes>

            </ErrorBoundary>
        </Router>
    );
};

export default App;
