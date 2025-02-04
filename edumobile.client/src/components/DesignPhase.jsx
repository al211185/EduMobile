import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Phase1SiteMap from "./Phase1SiteMap";
import Phase2Wireframes from "./Phase2Wireframes";
import Phase3VisualDesign from "./Phase3VisualDesign";
import Phase4ContentCreation from "./Phase4ContentCreation";

const DesignPhase = () => {
    const { projectId } = useParams(); // Obtén projectId de la URL
    const [currentPhase, setCurrentPhase] = useState(1);
    const [phaseData, setPhaseData] = useState(null);

    useEffect(() => {
        const fetchDesignPhaseData = async () => {
            if (!projectId) {
                console.error("El projectId es undefined");
                return;
            }

            try {
                const response = await fetch(`https://localhost:50408/api/designphases/${projectId}`, {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Datos de la fase obtenidos de la API:", data);
                    setPhaseData(data); // Asigna los datos al estado
                } else {
                    console.error("Error al cargar los datos de la fase", await response.json());
                }
            } catch (error) {
                console.error("Error al cargar los datos de la fase", error);
            }
        };

        fetchDesignPhaseData();
    }, [projectId, currentPhase]);



    const savePhaseData = async (updatedData) => {
        try {
            const designPhaseId = phaseData.id || phaseData.PhaseId || phaseData.Id;
            let endpoint = `https://localhost:50408/api/designphases/${designPhaseId}`;

            if (currentPhase === 2) {
                endpoint = `https://localhost:50408/api/designphases/Phase2/${designPhaseId}`;
            } else if (currentPhase === 3) {
                endpoint = `https://localhost:50408/api/designphases/Phase3/${designPhaseId}`;
            } else if (currentPhase === 4) {
                endpoint = `https://localhost:50408/api/designphases/Phase4/${designPhaseId}`;
            }

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al guardar los datos de la fase:", errorData);
                return;
            }

            const data = await response.json();
            setPhaseData(data);
        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
        }
    };


    const handleNextPhase = (updatedData) => {
        savePhaseData(updatedData); // Guarda los datos antes de avanzar
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            alert("¡Has completado todas las fases!");
        }
    };

    const handlePrevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    const restartProcess = () => {
        setCurrentPhase(1);
    };

    if (!projectId) {
        return <div>Error: El ID del proyecto es indefinido</div>;
    }

    return (
        <div className="design-phase-container">
            <h1>EduMobile Web Design</h1>
            <h2>Etapa de Diseño</h2>

            {/* Barra de progreso */}
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${(currentPhase / 4) * 100}%` }}
                ></div>
            </div>

            {/* Renderizado condicional de fases */}
            {currentPhase === 1 && phaseData && (
                <Phase1SiteMap data={phaseData} onNext={handleNextPhase} />
            )}
            {currentPhase === 2 && phaseData && (
                <Phase2Wireframes
                    data={phaseData}
                    onNext={(updatedData) => handleNextPhase(updatedData)} />
            )}

            {currentPhase === 3 && (
                <Phase3VisualDesign
                    data={phaseData}
                    onNext={(updatedData) => handleNextPhase(updatedData)}
                />
            )}
            {currentPhase === 4 && (
                <Phase4ContentCreation
                    data={phaseData}
                    onNext={(updatedData) => handleNextPhase(updatedData)}
                />
            )}

            {/* Controles de navegación */}
            <div className="navigation-buttons">
                <button
                    onClick={handlePrevPhase}
                    disabled={currentPhase === 1}
                    className="btn-secondary"
                >
                    Anterior
                </button>
                {currentPhase < 4 ? (
                    <button
                        onClick={() => handleNextPhase(phaseData)}
                        className="btn-primary"
                    >
                        Siguiente
                    </button>
                ) : (
                    <button onClick={restartProcess} className="btn-primary">
                        Reiniciar
                    </button>
                )}
            </div>
        </div>
    );
};

export default DesignPhase;
