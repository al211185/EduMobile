import React, { useState } from "react";

const Phase1SiteMap = ({ onNext }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChecklistChange = () => {
        const allChecked = document.querySelectorAll("input[type='checkbox']:checked").length === 4;
        setIsCompleted(allChecked);
    };

    return (
        <div className="phase-container">
            <h2>Fase 1: Mapa del Sitio</h2>
            <p>Define la estructura de navegación de tu sitio web. Sube el mapa de sitio y responde las preguntas.</p>
            <input type="file" accept="image/*" />
            <div className="checklist">
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿La jerarquía es clara?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿Las secciones están identificadas?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿Los enlaces son claros?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿Usaste elementos visuales útiles?
                </label>
            </div>
            <button onClick={onNext} disabled={!isCompleted}>
                Completar Fase 1
            </button>
        </div>
    );
};

export default Phase1SiteMap;
