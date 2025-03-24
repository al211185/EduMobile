import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import MainDashboard from "./components/MainDashboard"; // Dashboard centralizado para alumnos (u otros datos generales)
import Dashboard from "./components/Dashboard"; // Dashboard para profesores (gestión de cursos y registro de alumnos)
import CreateProject from "./components/CreateProject";
import Profile from "./components/Profile";
import MyProjects from "./components/MyProjects";
import ProjectPhase from "./components/ProjectPhase";
import DesignPhase from "./components/DesignPhase";
import DevelopmentPhase from "./components/DevelopmentPhase";
import ProjectDetailsProfessor from "./components/ProjectDetailsProfessor";
import MediaQueryDragAndDropWithReference from "./components/MediaQueryDragAndDropWithReference";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import "./globals.css";
import "./app.css";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeader = location.pathname === "/login" || location.pathname === "/register";
    return (
        <>
            {!hideHeader && <Header />}
            <main className="main-container">{children}</main>
        </>
    );
};

const App = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <p>Cargando...</p>;

    return (
        <Router>
            <ErrorBoundary>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    {/* Ruta raíz para todos (puede ser MainDashboard) */}
                                    <Route
                                        path="/"
                                        element={user ? <MainDashboard /> : <Navigate to="/login" replace />}
                                    />
                                    <Route path="/create-project" element={<CreateProject />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/media-game" element={<MediaQueryDragAndDropWithReference />} />
                                    {user?.role === "Profesor" && (
                                        <>
                                            {/* Ruta específica para el dashboard de cursos para profesores */}
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/projects/professor/:id" element={<ProjectDetailsProfessor />} />
                                        </>
                                    )}
                                    {user?.role === "Alumno" && (
                                        <>
                                            <Route path="/my-projects" element={<MyProjects />} />
                                            <Route path="/projects/:projectId" element={<ProjectPhase />} />
                                            <Route path="/fase-2-diseno/:projectId" element={<DesignPhase />} />
                                            <Route path="/development-phase/:projectId" element={<DevelopmentPhase />} />
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
