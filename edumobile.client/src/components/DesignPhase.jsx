import React, { useState } from "react";
import Phase1SiteMap from "./Phase1SiteMap";
import Phase2Wireframes from "./Phase2Wireframes";
import Phase3VisualDesign from "./Phase3VisualDesign";
import Phase4ContentCreation from "./Phase4ContentCreation";

const DesignPhase = () => {
    const [currentPhase, setCurrentPhase] = useState(1);

    const nextPhase = () => {
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            alert("¡Has completado todas las fases!");
        }
    };

    const prevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    const restartProcess = () => {
        setCurrentPhase(1);
    };

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
            {currentPhase === 1 && <Phase1SiteMap onNext={nextPhase} />}
            {currentPhase === 2 && <Phase2Wireframes onNext={nextPhase} />}
            {currentPhase === 3 && <Phase3VisualDesign onNext={nextPhase} />}
            {currentPhase === 4 && <Phase4ContentCreation onNext={nextPhase} />}

            {/* Controles de navegación */}
            <div className="navigation-buttons">
                <button
                    onClick={prevPhase}
                    disabled={currentPhase === 1}
                    className="btn-secondary"
                >
                    Anterior
                </button>
                {currentPhase < 4 ? (
                    <button onClick={nextPhase} className="btn-primary">
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
