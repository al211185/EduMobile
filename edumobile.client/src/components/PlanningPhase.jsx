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

    // Función genérica que hace POST o PUT según corresponda
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

    // onSaveData se usará en cada hijo para "Guardar" sin cambiar de subfase.
    const handleSaveData = async (childData) => {
        // Fusionar con lo que ya teníamos
        const newData = { ...phaseData, ...childData };
        const saved = await savePhaseData(newData);
        if (saved) {
            alert("Datos guardados exitosamente.");
        } else {
            alert("Error al guardar datos, intenta nuevamente.");
        }
    };

    // Maneja el avance (botón "Siguiente" o "Completar Fase N") en el contenedor
    const handleNext = async () => {
        // Primero guardamos la data actual (phaseData) antes de avanzar
        const saved = await savePhaseData(phaseData);
        if (!saved) {
            alert("Error al guardar datos, intenta nuevamente.");
            return;
        }
        if (currentPhase < 3) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            // Si ya vamos a la 4, pasamos a la fase de diseño
            navigate(`/fase-2-diseno/${projectId}`);
        }
    };

    // Maneja retroceso (botón "Anterior")
    const handlePrev = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    // Renderiza el hijo correspondiente
    const renderPhaseChild = () => {
        if (currentPhase === 1) {
            return (
                <Phase1Brief
                    data={phaseData}
                    onSave={handleSaveData}   // Nuevo prop para "Guardar"
                />
            );
        } else if (currentPhase === 2) {
            return (
                <Phase2Benchmarking
                    data={phaseData}
                    onSave={handleSaveData}
                />
            );
        } else if (currentPhase === 3) {
            return (
                <Phase3Audience
                    data={phaseData}
                    onSave={handleSaveData}
                />
            );
        }
        return null;
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

            {renderPhaseChild()}

            {/* Botones de navegación en el padre */}
            <div className="navigation-buttons">
                {currentPhase > 1 && (
                    <button onClick={handlePrev} className="btn-secondary">
                        Anterior
                    </button>
                )}
                <button onClick={handleNext} className="btn-primary">
                    {currentPhase < 3 ? "Siguiente" : "Finalizar Planeación"}
                </button>
            </div>
        </div>
    );
};

export default PlanningPhase;
