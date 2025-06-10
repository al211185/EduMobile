import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProjectPlanning from "./PlanningPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import EvaluationPhase from "./EvaluationPhase";
import AddParticipantModal from "./AddParticipantModal";
import TeamList from "./TeamList";
import PhaseAssignmentEditor from "./PhaseAssignmentEditor";

const ProjectPhase = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const isProfessor = user?.role === "Profesor"; // Si es profesor, se activa el modo readOnly

    const [project, setProject] = useState(null);
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTeamList, setShowTeamList] = useState(false);
    // Estado para mostrar el editor de asignaciones, visible solo para el creador
    const [showPhaseAssignmentEditor, setShowPhaseAssignmentEditor] = useState(false);
    // 1: Planeación, 2: Diseño, 3: Desarrollo, 4: Evaluación
    const [currentPhase, setCurrentPhase] = useState(1);
    const [currentUserId, setCurrentUserId] = useState("");

    const [professorId, setProfessorId] = useState(null);

    // Estado para almacenar la retroalimentación del profesor por fase
    const [teacherFeedback, setTeacherFeedback] = useState({
        1: "",
        2: "",
        3: "",
        4: ""
    });

    // Si la URL incluye un parámetro ?phase, ajusta la fase inicial
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const phaseParam = parseInt(params.get("phase"), 10);
        if (phaseParam >= 1 && phaseParam <= 4) {
            setCurrentPhase(phaseParam);
        }
    }, [location.search]);


    useEffect(() => {
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId) setCurrentUserId(storedUserId);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Usamos el mismo endpoint para todos los usuarios
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                    setProfessorId(data.semesterProfessorId);  // guardas el prof ID
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
        // Si el usuario es profesor en modo readOnly, no se actualizan los datos principales
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
        // Permite la navegación entre fases incluso en modo readOnly
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

    // Nueva función para confirmar el cierre del proyecto
    const handleFinish = async () => {
        const ok = window.confirm(
            "¿Estás seguro de finalizar? Se notificará al profesor que has terminado el proyecto."
        );
        if (!ok) return;
        // 1) enviar notificación
        try {
            await fetch("/api/Notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserId: professorId,
                    Message: `El alumno ${user.nombre} ha finalizado el proyecto "${project.title}".`
                })
            });
        } catch (_) {
            console.error("No se pudo enviar la notificación.");
        }
        // 2) navegar de vuelta
        navigate("/my-projects");
    };

    // Se definen las props comunes para cada fase. Si el usuario es profesor se incluye feedback.
    const commonProps = {
        projectId,
        phaseData,
        readOnly: isProfessor,
        ...(isProfessor && {
            feedback: teacherFeedback[currentPhase],
            onFeedbackChange: (newFeedback) =>
                setTeacherFeedback((prev) => ({ ...prev, [currentPhase]: newFeedback }))
        })
    };

    // Renderiza el componente de la fase según el estado actual
    const renderPhaseComponent = () => {
        switch (currentPhase) {
            case 1:
                return (
                    <ProjectPlanning
                        projectData={project}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        onNext={handleNextPhase}
                        {...commonProps}
                    />
                );
            case 2:
                return (
                    <DesignPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        {...commonProps}
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
                        {...commonProps}
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
                        {...commonProps}
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
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="sticky top-0 bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-md z-10">
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
                            className="bg-[#4F46E5] h-2 rounded-full absolute top-0 left-0 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2">
                    
                    {/* El botón "Agregar Participante" solo se muestra para alumnos */}
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
                    {/* Botón para abrir el editor de asignación de fases, solo para el creador */}
                    {isCreator && (
                        <button
                            onClick={() => setShowPhaseAssignmentEditor(true)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Asignar Fases
                        </button>
                    )}
                    {showTeamList && (
                        <div className="absolute top-12 right-2 bg-white border border-gray-300 rounded shadow-md p-2 w-64 z-20">
                            <TeamList isCreator={isCreator} refreshProject={() => { }} />
                        </div>
                    )}

                    {currentPhase > 1 && (
                        <button
                            onClick={handlePrevPhase}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Fase Anterior
                        </button>
                    )}
                    <button
                        onClick={currentPhase < 4 ? handleNextPhase : handleFinish}
                        disabled={currentPhase >= 4 && !professorId}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                        {currentPhase < 4 ? "Siguiente Fase" : "Finalizar"}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-y-auto p-6">
                {renderPhaseComponent()}
            </main>

      
            {/* Modal para editar asignaciones de fase */}
            {showPhaseAssignmentEditor && (
                <PhaseAssignmentEditor
                    projectId={projectId}
                    onClose={() => setShowPhaseAssignmentEditor(false)}
                    onAssignmentsSaved={() => {
                        // Aquí podrías refrescar la información del proyecto o del equipo si es necesario.
                    }}
                />
            )}
        </div>
    );
};

export default ProjectPhase;
