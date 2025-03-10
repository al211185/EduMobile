import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phase1Brief from "./Phase1Brief";
import Phase2Benchmarking from "./Phase2Benchmarking";
import Phase3Audience from "./Phase3Audience";

const PlanningPhase = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener la fase de planeación al montar
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

    // Función para guardar la fase (POST o PUT)
    const savePhaseData = async (updatedData) => {
        try {
            const phaseId = phaseData?.id;
            if (!phaseId) {
                // No existe: crear (POST)
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
                // Ya existe: actualizar (PUT)
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

    // Manejador para avanzar de fase
    const handleNextPhase = async (updatedData, saveData = true) => {
        console.log("handleNextPhase invocado. updatedData=", updatedData);
        if (updatedData) {
            const newData = { ...phaseData, ...updatedData };
            if (saveData) {
                const saved = await savePhaseData(newData);
                if (!saved) {
                    alert("Error al guardar datos, intenta nuevamente.");
                    return;
                }
            } else {
                setPhaseData(newData);
            }
        }
        if (currentPhase === 3) {
            // Al terminar la fase 3, navegamos a DesignPhase usando la ruta correcta
            navigate(`/fase-2-diseno/${projectId}`);
        } else {
            setCurrentPhase((prev) => prev + 1);
        }
    };

    const handlePrevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    if (loading) return <p>Cargando fase de planeación...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="planning-phase-container">
            <h2>Etapa de Planeación</h2>
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${(currentPhase / 3) * 100}%` }}
                ></div>
            </div>

            {currentPhase === 1 && (
                <Phase1Brief
                    data={phaseData}
                    onNext={(data) => handleNextPhase(data, true)}
                />
            )}
            {currentPhase === 2 && (
                <Phase2Benchmarking
                    data={phaseData}
                    onNext={(data) => handleNextPhase(data, true)}
                    onPrev={handlePrevPhase}
                />
            )}
            {currentPhase === 3 && (
                <Phase3Audience
                    data={phaseData}
                    onNext={(data) => handleNextPhase(data, true)}
                    onPrev={handlePrevPhase}
                />
            )}

            <div className="navigation-buttons">
                {currentPhase > 1 && (
                    <button onClick={handlePrevPhase} className="btn-secondary">
                        Anterior
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanningPhase;
