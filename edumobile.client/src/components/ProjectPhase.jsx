import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importa el contexto de autenticación
import ProjectPlanning from "./PlanningPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import EvaluationPhase from "./EvaluationPhase";
import AddParticipantModal from "./AddParticipantModal";
import TeamList from "./TeamList";

const ProjectPhase = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Obtenemos el usuario autenticado
    const isProfessor = user?.role === "Profesor"; // Define si el usuario es profesor

    const [project, setProject] = useState(null);
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTeamList, setShowTeamList] = useState(false);
    // 1: Planeación, 2: Diseño, 3: Desarrollo, 4: Evaluación
    const [currentPhase, setCurrentPhase] = useState(1);
    const [currentUserId, setCurrentUserId] = useState("");

    useEffect(() => {
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId) setCurrentUserId(storedUserId);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Si el profesor debe ver la información completa, puedes usar el mismo endpoint
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                } else {
                    setError(data.message || "No se pudo cargar el proyecto.");
                }
            } catch (err) {
                setError("Error al obtener los datos del proyecto.");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSaveData = async (updatedData) => {
        // Si el usuario es profesor, no se realizan cambios y se comporta en modo readonly.
        if (isProfessor) {
            return true;
        }
        if (currentPhase === 4) {
            setPhaseData(updatedData);
            alert("Evaluación guardada exitosamente.");
            return true;
        }
        try {
            let endpoint = "";
            switch (currentPhase) {
                case 1:
                    endpoint = `/api/planningphases/${projectId}`;
                    break;
                case 2:
                    endpoint = `/api/designphases/${projectId}`;
                    break;
                case 3:
                    endpoint = `/api/developmentphases/byproject/${projectId}`;
                    break;
                default:
                    throw new Error("Fase no válida");
            }
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la fase.");
            }
            const newPhaseData = await response.json();
            setPhaseData(newPhaseData);
            alert("Datos guardados exitosamente.");
            return true;
        } catch (error) {
            console.error("Error al guardar la fase:", error);
            alert("Error al guardar los datos. Inténtalo nuevamente.");
            return false;
        }
    };

    const handleNextPhase = () => {
        // Permite la navegación entre fases incluso en modo readonly (profesor)
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            navigate("/my-projects");
        }
    };

    const handlePrevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    const renderPhaseComponent = () => {
        // Pasa la prop readOnly (o isProfessor) a los componentes hijos para que se adapten al modo de solo lectura.
        switch (currentPhase) {
            case 1:
                return (
                    <ProjectPlanning
                        projectData={project}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        onNext={handleNextPhase}
                        readOnly={isProfessor}
                    />
                );
            case 2:
                return (
                    <DesignPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        readOnly={isProfessor}
                    />
                );
            case 3:
                return (
                    <DevelopmentPhase
                        projectId={projectId}
                        data={phaseData}
                        onSave={handleSaveData}
                        onPrev={handlePrevPhase}
                        onNext={handleNextPhase}
                        readOnly={isProfessor}
                    />
                );
            case 4:
                return (
                    <EvaluationPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        onPrev={handlePrevPhase}
                        onNext={handleNextPhase}
                        readOnly={isProfessor}
                    />
                );
            default:
                return null;
        }
    };

    if (loading)
        return <p className="text-center text-gray-600 mt-4">Cargando proyecto...</p>;
    if (error)
        return <p className="text-center text-red-500 mt-4">{error}</p>;
    if (!project)
        return <p className="text-center text-red-500 mt-4">Error: Proyecto no encontrado.</p>;

    const isCreator = project && currentUserId && project.createdById === currentUserId;
    const progress = (currentPhase / 4) * 100;

    return (
        <div className="container mx-auto bg-gray-50 rounded-lg shadow-lg relative">
            <header className="sticky top-0 bg-white z-10 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-gray-800 leading-tight">
                            {project.title}
                        </h1>
                        <p className="text-gray-600 text-xs leading-tight">
                            {project.description}
                        </p>
                    </div>
                    <div className="bg-gray-200 h-2 w-32 md:w-48 rounded-full relative">
                        <div
                            className="bg-blue-600 h-2 rounded-full absolute top-0 left-0 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Solo se muestra el botón "Agregar Participante" si no es profesor */}
                    {!isProfessor && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Agregar Participante
                        </button>
                    )}
                    {isModalOpen && !isProfessor && (
                        <AddParticipantModal
                            projectId={projectId}
                            onClose={() => setIsModalOpen(false)}
                            onParticipantAdded={() => { }}
                        />
                    )}
                    <button
                        onClick={() => setShowTeamList((prev) => !prev)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                        {showTeamList ? "Ocultar Equipo" : "Equipo del Proyecto"}
                    </button>
                    {showTeamList && (
                        <div className="absolute top-12 right-2 bg-white border border-gray-300 rounded shadow-md p-2 w-64 z-20">
                            <TeamList isCreator={isCreator} refreshProject={() => { }} />
                        </div>
                    )}
                    <button
                        onClick={handleNextPhase}
                        disabled={currentPhase >= 4}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                        {currentPhase < 4 ? "Siguiente Fase" : "Finalizar"}
                    </button>
                </div>
            </header>

            <main className="p-4">{renderPhaseComponent()}</main>

            {!isProfessor && currentPhase > 1 && (
                <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-2 flex justify-end">
                    <button
                        onClick={handlePrevPhase}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Fase Anterior
                    </button>
                </footer>
            )}
        </div>
    );
};

export default ProjectPhase;
