import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phase1Brief from "./Phase1Brief";
import Phase2Benchmarking from "./Phase2Benchmarking";
import Phase3Audience from "./Phase3Audience";

const PlanningPhase = ({ readOnly = false }) => {
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

    // Si estamos en modo readOnly, evitamos intentar guardar datos
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

    // Renderiza el componente hijo correspondiente según la fase actual
    const renderPhaseChild = () => {
        // Se pasa readOnly para que cada componente hijo pueda deshabilitar la edición
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg h-[90vh] flex flex-col overflow-hidden">
            {/* Header fijo */}
            <header className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Etapa de Planeación</h2>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPhase / 3) * 100}%` }}
                    ></div>
                </div>
            </header>

            {/* Contenedor scrollable para el contenido */}
            <main className="flex-1 overflow-y-auto p-6">
                {renderPhaseChild()}
            </main>

            {/* Botones de navegación */}
            <footer className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                    {currentPhase > 1 && (
                        <button onClick={handlePrev} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                            Anterior
                        </button>
                    )}
                    <button onClick={handleNext} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        {currentPhase < 3 ? "Siguiente" : "Finalizar Planeación"}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default PlanningPhase;
