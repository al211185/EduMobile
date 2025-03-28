import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phase1SiteMap from "./Phase1SiteMap";
import Phase2Wireframes from "./Phase2Wireframes";
import Phase3VisualDesign from "./Phase3VisualDesign";
import Phase4ContentCreation from "./Phase4ContentCreation";

const DesignPhase = ({ readOnly = false }) => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [phaseData, setPhaseData] = useState(null);

    useEffect(() => {
        const fetchDesignPhaseData = async () => {
            if (!projectId) {
                console.error("El projectId es undefined");
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
                    console.error(
                        "Error al cargar los datos de la fase",
                        await response.json()
                    );
                }
            } catch (error) {
                console.error("Error al cargar los datos de la fase", error);
            }
        };

        fetchDesignPhaseData();
    }, [projectId, currentPhase]);

    const savePhaseData = async (updatedData) => {
        // En modo readonly no se guarda nada
        if (readOnly) return true;
        try {
            const designPhaseId =
                phaseData?.id || phaseData?.PhaseId || phaseData?.Id;
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

    if (!projectId) {
        return <div>Error: El ID del proyecto es indefinido</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Encabezado */}
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">EduMobile Web Design</h1>
                <h2 className="text-xl text-gray-700">Etapa de Diseño</h2>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPhase / 4) * 100}%` }}
                    ></div>
                </div>
            </header>

            {/* Renderizado condicional de fases */}
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

            {/* Controles de navegación */}
            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={handlePrevPhase}
                    disabled={currentPhase === 1}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Anterior
                </button>
                <button
                    onClick={() => handleNextPhase(phaseData)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    {currentPhase < 4 ? "Siguiente" : "Finalizar Diseño"}
                </button>
            </div>
        </div>
    );
};

export default DesignPhase;
