// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateProject from "./components/CreateProject";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import CreateSemester from "./components/CreateSemester";
import MyProjects from "./components/MyProjects";
import ProjectPhase from "./components/ProjectPhase";
import DesignPhase from "./components/DesignPhase";
import ProjectDetails from "./components/ProjectDetails";
import MediaQueryDragAndDropWithReference from "./components/MediaQueryDragAndDropWithReference";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import "./globals.css";
import "./app.css";

const App = () => {
    const { user } = useAuth();

    return (
        <Router>
            <Header />
            <main className="main-container">
                {/* Envolvemos las rutas con ErrorBoundary para capturar errores en cualquiera de los componentes */}
                <ErrorBoundary>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="welcome-container">
                                    {user ? (
                                        <h1 className="main-heading">
                                            Hola, {user.nombre} {user.apellidoPaterno}
                                        </h1>
                                    ) : (
                                        <>
                                            <h1 className="main-heading">Bienvenido</h1>
                                            <p className="main-description">
                                                Esta es la página principal provisional.
                                            </p>
                                        </>
                                    )}
                                </div>
                            }
                        />
                        <Route path="/create-project" element={<CreateProject />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/media-game"
                            element={<MediaQueryDragAndDropWithReference />}
                        />
                        {user?.role === "Profesor" && (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/create-semester" element={<CreateSemester />} />
                                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                            </>
                        )}
                        {user?.role === "Alumno" && (
                            <>
                                <Route path="/my-projects" element={<MyProjects />} />
                                <Route path="/projects/:projectId" element={<ProjectPhase />} />
                                <Route path="/fase-2-diseno/:projectId" element={<DesignPhase />} />
                            </>
                        )}
                    </Routes>
                </ErrorBoundary>
            </main>
        </Router>
    );
};

export default App;
