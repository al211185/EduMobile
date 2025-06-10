import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import MainDashboard from "./components/MainDashboard";
import Dashboard from "./components/Dashboard";
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
    const hideSidebar =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot-password";

    return hideSidebar ? (
        <main className="main-container">{children}</main>
    ) : (
            <div className="flex h-screen">
            <Sidebar />
            {/* ml-64 = margin-left: 16rem, igual al ancho de tu sidebar fixed */}
                <main className="flex-1 flex flex-col overflow-hidden p-6 pt-16 md:pt-6 ml-0 md:ml-64">
                {children}
            </main>
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

                    {/* Rutas protegidas */}
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    <Route
                                        index
                                        element={user ? <MainDashboard /> : <Navigate to="/login" replace />}
                                    />

                                    {/* Rutas comunes */}
                                    <Route path="create-project" element={<CreateProject />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route
                                        path="media-game"
                                        element={<MediaQueryDragAndDropWithReference />}
                                    />

                                    {/* Profesor */}
                                    {user?.role === "Profesor" && (
                                        <>
                                            <Route path="dashboard" element={<Dashboard />} />
                                            <Route
                                                path="projects/professor/:id"
                                                element={<ProjectDetailsProfessor />}
                                            />
                                            <Route path="projects/:projectId" element={<ProjectPhase />} />
                                            <Route
                                                path="fase-2-diseno/:projectId"
                                                element={<DesignPhase />}
                                            />
                                            <Route
                                                path="development-phase/:projectId"
                                                element={<DevelopmentPhase />}
                                            />
                                        </>
                                    )}

                                    {/* Alumno */}
                                    {user?.role === "Alumno" && (
                                        <>
                                            <Route path="my-projects" element={<MyProjects />} />
                                            <Route
                                                path="projects/edit/:projectId"
                                                element={<ProjectEdit />}
                                            />
                                            <Route path="projects/:projectId" element={<ProjectPhase />} />
                                            <Route
                                                path="fase-2-diseno/:projectId"
                                                element={<DesignPhase />}
                                            />
                                            <Route
                                                path="development-phase/:projectId"
                                                element={<DevelopmentPhase />}
                                            />
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