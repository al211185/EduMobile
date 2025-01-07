import React, { useState } from "react";

const Phase3VisualDesign = ({ onNext }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChecklistChange = () => {
        const allChecked = document.querySelectorAll("input[type='checkbox']:checked").length === 3;
        setIsCompleted(allChecked);
    };

    return (
        <div className="phase-container">
            <h2>Fase 3: Diseño Visual</h2>
            <p>
                Define el aspecto estético y gráfico de tu sitio web. Sube el diseño visual y responde las preguntas para completar esta fase.
            </p>
            <div className="design-upload">
                <label>Sube el diseño visual:</label>
                <input type="file" accept="image/*" />
            </div>
            <div className="checklist">
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿Los elementos visuales contribuyen a una buena experiencia en pantallas pequeñas?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿El diseño visual prioriza el contenido para dispositivos móviles?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿El diseño visual ayuda a mejorar la velocidad de carga en dispositivos móviles?
                </label>
            </div>
            <button onClick={onNext} disabled={!isCompleted}>
                Completar Fase 3
            </button>
        </div>
    );
};

export default Phase3VisualDesign;
