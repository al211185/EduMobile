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
import ProjectPhase from "./components/ProjectPhase"; // Importa el componente para las fases del proyecto
import DesignPhase from "./components/DesignPhase"; // Nueva importación
import { useAuth } from "./contexts/AuthContext";
import "./globals.css";
import "./app.css";

const App = () => {
    const { user } = useAuth(); // Obtener el usuario desde el contexto

    return (
        <Router>
            <Header />
            <main className="main-container">
                <Routes>
                    {/* Página principal */}
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

                    {/* Ruta para crear proyecto */}
                    <Route path="/create-project" element={<CreateProject />} />

                    {/* Ruta de inicio de sesión */}
                    <Route path="/login" element={<Login />} />

                    {/* Ruta de registro */}
                    <Route path="/register" element={<Register />} />

                    {/* Ruta de perfil */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Rutas específicas por rol */}
                    {user?.role === "Profesor" && (
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/create-semester" element={<CreateSemester />} />
                        </>
                    )}

                    {user?.role === "Alumno" && (
                        <>
                            <Route path="/my-projects" element={<MyProjects />} />
                            <Route path="/projects/:projectId" element={<ProjectPhase />} />
                            <Route path="/fase-2-diseno" element={<DesignPhase />} /> {/* Nueva ruta */}
                        </>
                    )}
                </Routes>
            </main>
        </Router>
    );
};

export default App;
