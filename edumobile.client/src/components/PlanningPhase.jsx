import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phase1Brief from "./Phase1Brief";
import Phase2Benchmarking from "./Phase2Benchmarking";
import Phase3Audience from "./Phase3Audience";
import StepNavigation from "./StepNavigation";

const PlanningPhase = ({ readOnly = false, feedback = "", onFeedbackChange = () => { } }) => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const steps = ["Brief", "Benchmarking", "Audiencia"];
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado local para manejar el feedback del profesor
    const [localFeedback, setLocalFeedback] = useState(feedback);

    // Al montar, obtener la fase de planeación
    useEffect(() => {
        const fetchPlanningPhase = async () => {
            try {
                const response = await fetch(`/api/planningphases/${projectId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhaseData(data);
                } else {
                    console.warn("No se encontró fase de planeación; se creará al guardar.");
                    setPhaseData({});
                }
            } catch (err) {
                setError("Error al obtener datos de la fase de planeación.");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchPlanningPhase();
        }
    }, [projectId]);

    // Cargar la retroalimentación guardada (para profesor y alumno)
    useEffect(() => {
        if (projectId) {
            const fetchFeedback = async () => {
                try {
                    const response = await fetch(`/api/Feedbacks/${projectId}/1`);
                    console.log("GET Feedback response:", response);
                    if (response.ok) {
                        const data = await response.json();
                        // Ajusta el nombre de la propiedad según lo que retorna tu API (por ejemplo, "feedbackText")
                        setLocalFeedback(data.feedbackText || "");
                    } else if (response.status === 404) {
                        setLocalFeedback("");
                    } else {
                        console.error("Error al obtener la retroalimentación.");
                    }
                } catch (error) {
                    console.error("Error en fetchFeedback:", error);
                }
            };
            fetchFeedback();
        }
    }, [projectId]);

    // Función genérica para guardar (POST si no existe, PUT si ya existe)
    const savePhaseData = async (updatedData) => {
        try {
            const phaseId = phaseData?.id;
            if (!phaseId) {
                // Crear (POST)
                const response = await fetch(`/api/planningphases`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al crear fase:", errorData);
                    return false;
                }
                const data = await response.json();
                const newId = data.PlanningPhaseId;
                const merged = { ...updatedData, id: newId };
                setPhaseData(merged);
                return true;
            } else {
                // Actualizar (PUT)
                let endpoint = "";
                if (currentPhase === 1) {
                    endpoint = `/api/planningphases/Phase1/${phaseId}`;
                } else if (currentPhase === 2) {
                    endpoint = `/api/planningphases/Phase2/${phaseId}`;
                } else if (currentPhase === 3) {
                    endpoint = `/api/planningphases/Phase3/${phaseId}`;
                }
                const response = await fetch(endpoint, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al guardar fase:", errorData);
                    return false;
                }
                const data = await response.json();
                const partial = {
                    ...updatedData,
                    id: data.id,
                    updatedAt: data.updatedAt,
                };
                setPhaseData((prev) => ({ ...prev, ...partial }));
                return true;
            }
        } catch (err) {
            console.error("Error en savePhaseData:", err);
            return false;
        }
    };

    // Para alumnos, no se deben guardar datos de la fase; la función se ignora
    const handleSaveData = async (childData) => {
        if (readOnly) {
            return true;
        }
        const newData = { ...phaseData, ...childData };
        const saved = await savePhaseData(newData);
        if (saved) {
            alert("Datos guardados exitosamente.");
            setPhaseData(newData);
        } else {
            alert("Error al guardar datos, intenta nuevamente.");
        }
        return saved;
    };

    // Función para guardar la retroalimentación del profesor en el controlador
    const handleFeedbackSave = async () => {
        try {
            // Primero se intenta obtener la retroalimentación existente para este proyecto y fase (fase 1)
            const getResponse = await fetch(`/api/Feedbacks/${projectId}/1`);
            if (getResponse.ok) {
                // Ya existe retroalimentación: actualizarla
                const existingFeedback = await getResponse.json();
                const feedbackId = existingFeedback.id;
                const putResponse = await fetch(`/api/Feedbacks/${feedbackId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 1,
                        FeedbackText: localFeedback,
                    }),
                });
                if (!putResponse.ok) {
                    const errData = await putResponse.json();
                    console.error("Error al actualizar feedback:", errData);
                    alert("Error al actualizar la retroalimentación.");
                } else {
                    alert("Retroalimentación actualizada correctamente.");
                }
            } else if (getResponse.status === 404) {
                // No existe retroalimentación: crear una nueva
                const postResponse = await fetch("/api/Feedbacks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 1,
                        FeedbackText: localFeedback,
                    }),
                });
                if (!postResponse.ok) {
                    const errData = await postResponse.json();
                    console.error("Error al crear feedback:", errData);
                    alert("Error al crear la retroalimentación.");
                } else {
                    alert("Retroalimentación creada correctamente.");
                }
            } else {
                alert("Error al obtener la retroalimentación.");
            }
        } catch (error) {
            console.error("Error en handleFeedbackSave:", error);
            alert("Error al guardar la retroalimentación.");
        }
    };

    // Navegación: Avanza o retrocede entre subfases
    const handleNext = async () => {
        if (!readOnly) {
            const saved = await savePhaseData(phaseData);
            if (!saved) {
                alert("Error al guardar datos, intenta nuevamente.");
                return;
            }
        }
        if (currentPhase < 3) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            if (!readOnly) {
                alert("Planeación finalizada y datos guardados exitosamente.");
            }
        }
    };

    const handlePrev = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    // Navegación con flechas del teclado
    useEffect(() => {
        const handler = (e) => {
            const tag = document.activeElement.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return;
            if (e.key === "ArrowRight") {
                setCurrentPhase(p => Math.min(p + 1, 3));
            } else if (e.key === "ArrowLeft") {
                setCurrentPhase(p => Math.max(p - 1, 1));
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Renderiza el componente hijo correspondiente según la fase actual
    const renderPhaseChild = () => {
        if (currentPhase === 1) {
            return <Phase1Brief data={phaseData} onSave={handleSaveData} readOnly={readOnly} />;
        } else if (currentPhase === 2) {
            return <Phase2Benchmarking data={phaseData} onSave={handleSaveData} readOnly={readOnly} />;
        } else if (currentPhase === 3) {
            return <Phase3Audience data={phaseData} onSave={handleSaveData} readOnly={readOnly} />;
        }
        return null;
    };

    if (loading) return <p className="text-center">Cargando fase de planeación...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
            {/* Header fijo */}
            <header className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Etapa de Planeación</h2>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className="bg-[#4F46E5] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPhase / 3) * 100}%` }}
                    ></div>
                </div>
                <StepNavigation
                    steps={steps}
                    currentStep={currentPhase}
                    onStepChange={(step) => setCurrentPhase(step)}
                />
            </header>

            {/* Contenedor scrollable para el contenido */}
            <main className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
                {renderPhaseChild()}

                {/* Bloque de retroalimentación para ambos perfiles */}
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <label htmlFor="teacherFeedback" className="block mb-2 font-bold text-gray-700">
                        Retroalimentación del Profesor:
                    </label>
                    {readOnly ? (
                        // Para el profesor: textarea editable con botón para guardar
                        <>
                            <textarea
                                id="teacherFeedback"
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={3}
                                value={localFeedback}
                                onChange={(e) => setLocalFeedback(e.target.value)}
                            />
                            <button
                                onClick={handleFeedbackSave}
                                className="mt-2 bg-blue-500 hover:bg-[#4F46E5] text-white px-4 py-2 rounded"
                            >
                                Guardar Retroalimentación
                            </button>
                        </>
                    ) : (
                        // Para el alumno: solo se muestra en modo lectura
                        <textarea
                            id="teacherFeedback"
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            rows={3}
                            value={localFeedback}
                            disabled
                        />
                    )}
                </div>
            </main>

            {/* Botones de navegación */}
            <footer className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 z-10">
                <div className="flex justify-between">
                    {currentPhase > 1 && (
                        <button
                            onClick={handlePrev}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Anterior
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="bg-[#4F46E5] hover:bg-[#64748B] text-white px-4 py-2 rounded"
                    >
                        {currentPhase < 3 ? "Siguiente" : "Finalizar Planeación"}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default PlanningPhase;