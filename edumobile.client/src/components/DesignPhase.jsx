import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phase1SiteMap from "./Phase1SiteMap";
import Phase2Wireframes from "./Phase2Wireframes";
import Phase3VisualDesign from "./Phase3VisualDesign";
import Phase4ContentCreation from "./Phase4ContentCreation";
import StepNavigation from "./StepNavigation";

const DesignPhase = ({ readOnly = false }) => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const steps = [
        "Mapa del Sitio",
        "Wireframes",
        "Diseño Visual",
        "Contenido"
    ];
    const [phaseData, setPhaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado local para retroalimentación (fase de diseño: fase 2)
    const [localFeedback, setLocalFeedback] = useState("");

    // Cargar datos de la fase de diseño
    useEffect(() => {
        const fetchDesignPhaseData = async () => {
            if (!projectId) {
                console.error("El projectId es indefinido");
                return;
            }
            try {
                const response = await fetch(`/api/designphases/${projectId}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Datos de la fase obtenidos:", data);
                    setPhaseData(data);
                } else {
                    console.error("Error al cargar los datos de la fase", await response.json());
                }
            } catch (error) {
                console.error("Error al cargar los datos de la fase", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDesignPhaseData();
    }, [projectId, currentPhase]);

    // Cargar la retroalimentación guardada para la fase de diseño (fase 2)
    useEffect(() => {
        if (projectId) {
            const fetchFeedback = async () => {
                try {
                    const response = await fetch(`/api/Feedbacks/${projectId}/2`);
                    console.log("GET Feedback response:", response);
                    if (response.ok) {
                        const data = await response.json();
                        // Ajusta el nombre de la propiedad según lo que retorne tu API
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

    // Función para guardar los datos de la fase
    const savePhaseData = async (updatedData) => {
        // En modo readonly (profesor) no guardamos datos de la fase
        if (readOnly) return true;
        try {
            const designPhaseId = phaseData?.id || phaseData?.PhaseId || phaseData?.Id;
            let endpoint = `/api/designphases/${designPhaseId}`;
            if (currentPhase === 2) {
                endpoint = `/api/designphases/Phase2/${designPhaseId}`;
            } else if (currentPhase === 3) {
                endpoint = `/api/designphases/Phase3/${designPhaseId}`;
            } else if (currentPhase === 4) {
                endpoint = `/api/designphases/Phase4/${designPhaseId}`;
            }

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al guardar los datos de la fase:", errorData);
                return false;
            }

            const data = await response.json();
            setPhaseData(data);
            return true;
        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
            return false;
        }
    };

    const handleNextPhase = async (updatedData) => {
        if (!readOnly) {
            const saved = await savePhaseData(updatedData);
            if (!saved) {
                alert("Error al guardar los datos, intenta nuevamente.");
                return;
            }
        }
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            if (!readOnly) {
                alert("Diseño finalizado y datos guardados exitosamente.");
            }
        }
    };

    const handlePrevPhase = () => {
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
                setCurrentPhase((p) => Math.min(p + 1, 4));
            } else if (e.key === "ArrowLeft") {
                setCurrentPhase((p) => Math.max(p - 1, 1));
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Función para guardar la retroalimentación del profesor para la fase de diseño (fase 2)
    const handleFeedbackSave = async () => {
        try {
            // Primero se intenta obtener la retroalimentación existente para este proyecto y fase (fase 2)
            const getResponse = await fetch(`/api/Feedbacks/${projectId}/2`);
            if (getResponse.ok) {
                // Ya existe retroalimentación: actualízala
                const existingFeedback = await getResponse.json();
                const feedbackId = existingFeedback.id;
                const putResponse = await fetch(`/api/Feedbacks/${feedbackId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 2,
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
                // Si no existe, crea una nueva
                const postResponse = await fetch("/api/Feedbacks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 2,
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

    if (!projectId) {
        return <div>Error: El ID del proyecto es indefinido</div>;
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
            {/* Encabezado */}
            <header className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Etapa de Diseño</h2>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className="bg-[#4F46E5] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPhase / 4) * 100}%` }}
                    ></div>
                </div>
                <StepNavigation
                    steps={steps}
                    currentStep={currentPhase}
                    onStepChange={(step) => setCurrentPhase(step)}
                />
            </header>

            {/* Renderizado condicional de fases */}
            <main className="flex-1 overflow-y-auto px-6 py-4 sm:px-8 space-y-6">
            {currentPhase === 1 && phaseData && (
                <Phase1SiteMap data={phaseData} onNext={handleNextPhase} readOnly={readOnly} />
            )}
            {currentPhase === 2 && phaseData && (
                <Phase2Wireframes data={phaseData} onNext={handleNextPhase} readOnly={readOnly} />
            )}
            {currentPhase === 3 && (
                <Phase3VisualDesign data={phaseData} onNext={handleNextPhase} readOnly={readOnly} />
            )}
            {currentPhase === 4 && (
                <Phase4ContentCreation data={phaseData} onNext={handleNextPhase} readOnly={readOnly} />
            )}

            {/* Bloque de retroalimentación */}
                <div className="mt-6 p-4 border rounded bg-gray-50">
                <label htmlFor="teacherFeedback" className="block mb-2 font-bold text-gray-700">
                    Retroalimentación del Profesor:
                </label>
                {readOnly ? (
                    // Para el profesor: textarea editable y botón para guardar
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
                                className="mt-2 bg-[#4F46E5] hover:bg-[#64748B] text-white px-4 py-2 rounded transition-colors"
                        >
                            Guardar Retroalimentación
                        </button>
                    </>
                ) : (
                    // Para el alumno: muestra la retroalimentación en modo de solo lectura
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

            {/* Controles de navegación */}
            <footer className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 z-10">
                <div className="flex justify-between">
                    {currentPhase > 1 && (
                <button
                    onClick={handlePrevPhase}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                    Anterior
                </button>
                    )}
                <button
                    onClick={() => handleNextPhase(phaseData)}
                        className="bg-[#4F46E5] hover:bg-[#64748B] text-white px-4 py-2 rounded transition-colors"
                >
                    {currentPhase < 4 ? "Siguiente" : "Finalizar Diseño"}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default DesignPhase;
