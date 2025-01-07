import React, { useState } from "react";

const Phase2Wireframes = ({ onNext }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChecklistChange = () => {
        const allChecked = document.querySelectorAll("input[type='checkbox']:checked").length === 4;
        setIsCompleted(allChecked);
    };

    return (
        <div className="phase-container">
            <h2>Fase 2: Wireframes</h2>
            <p>Sube los wireframes para los diferentes tamaños de pantalla y responde las preguntas.</p>
            <div className="wireframe-upload">
                <label>Wireframes 480px:</label>
                <input type="file" accept="image/*" />
                <label>Wireframes 768px:</label>
                <input type="file" accept="image/*" />
                <label>Wireframes 1024px:</label>
                <input type="file" accept="image/*" />
            </div>
            <div className="checklist">
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿Cumple con Mobile First?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿La navegación es clara?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿El diseño es funcional?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} /> ¿Es visualmente consistente?
                </label>
            </div>
            <button onClick={onNext} disabled={!isCompleted}>
                Completar Fase 2
            </button>
        </div>
    );
};

export default Phase2Wireframes;
