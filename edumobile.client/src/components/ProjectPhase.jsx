import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectPlanning from "./PlanningPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import EvaluationPhase from "./EvaluationPhase";
import AddParticipantModal from "./AddParticipantModal";
import TeamList from "./TeamList";

const ProjectPhase = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [phaseData, setPhaseData] = useState({}); // Datos centralizados de la fase actual
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 1: Planeación, 2: Diseño, 3: Desarrollo (Kanban)
    const [currentPhase, setCurrentPhase] = useState(1);
    const [currentUserId, setCurrentUserId] = useState(""); // Asigna el id del usuario actual

    useEffect(() => {

        // Aquí podrías obtener el currentUserId desde un contexto o desde el localStorage tras el login.
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId) setCurrentUserId(storedUserId);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                    // Opcional: Si el proyecto ya tiene datos de fase, podrías inicializar phaseData
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

    // Esta función actualiza la fase actual llamando al endpoint correspondiente.
    const handleSaveData = async (updatedData) => {
        // Si estamos en la fase 4 (Evaluation), no llamamos a ningún endpoint
        if (currentPhase === 4) {
            setPhaseData(updatedData);
            alert("Evaluación guardada exitosamente.");
            return true;
        }

        try {
            // Determina el endpoint según la fase actual.
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
            // Suponemos que la API retorna la fase actualizada
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
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            alert("¡Has completado todas las fases!");
            // Puedes redirigir a otra ruta si es necesario:
            // navigate(`/final-phase/${projectId}`);
        }
    };

    const handlePrevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    const renderPhaseComponent = () => {
        switch (currentPhase) {
            case 1:
                return (
                    <ProjectPlanning
                        projectData={project}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                    />
                );
            case 2:
                return (
                    <DesignPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
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
                    />
                );
            default:
                return null;
        }
    };


    if (loading) return <p>Cargando proyecto...</p>;
    if (error) return <p>{error}</p>;
    if (!project) return <p>Error: Proyecto no encontrado.</p>;
    // Después de obtener el proyecto, calcula isCreator:
    const isCreator = project && currentUserId && project.createdById === currentUserId;
    console.log("isCreator:", isCreator, "currentUserId:", currentUserId, "project.createdById:", project?.createdById);



    return (
        <div className="project-phase-container">
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <button onClick={() => setIsModalOpen(true)}>Agregar Participante</button>
            {isModalOpen && (
                <AddParticipantModal
                    projectId={projectId}
                    onClose={() => setIsModalOpen(false)}
                    onParticipantAdded={() => {
                        // Opcional: refrescar la lista o la información del proyecto
                    }}
                />
            )}
            {/* Agrega el componente de lista de participantes */}
            <TeamList isCreator={isCreator} refreshProject={() => { /* Opcional: refrescar datos del proyecto */ }} />
            {renderPhaseComponent()}
            <div className="navigation-buttons">
                {currentPhase > 1 && (
                    <button onClick={handlePrevPhase} className="btn-secondary">
                        Fase Anterior
                    </button>
                )}
                {currentPhase < 4 && (
                    <button onClick={handleNextPhase} className="btn-primary">
                        Siguiente Fase
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProjectPhase;
