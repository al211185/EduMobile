import React, { useState } from "react";

const Phase4ContentCreation = ({ onNext }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChecklistChange = () => {
        const allChecked = document.querySelectorAll("input[type='checkbox']:checked").length === 3;
        setIsCompleted(allChecked);
    };

    return (
        <div className="phase-container">
            <h2>Fase 4: Creación de Contenidos</h2>
            <p>
                Organiza y crea el contenido necesario para tu sitio web, como textos, imágenes y otros elementos multimedia.
            </p>
            <div className="content-upload">
                <label>Sube el contenido visual:</label>
                <input type="file" accept="image/*" />
            </div>
            <div className="checklist">
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿Se priorizan los contenidos más relevantes para la versión móvil?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿Los contenidos son claros, concisos y navegables en pantallas pequeñas?
                </label>
                <label>
                    <input type="checkbox" onChange={handleChecklistChange} />
                    ¿El contenido guía la atención del usuario en dispositivos móviles?
                </label>
            </div>
            <button onClick={onNext} disabled={!isCompleted}>
                Completar Fase 4
            </button>
        </div>
    );
};

export default Phase4ContentCreation;
