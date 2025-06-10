import React, { useState, useEffect } from "react";

const ReflectiveExercise = ({
    answers = { designFocus: "", functionalRequirements: "", frameworks: "" },
    onAnswersChange = () => { },
    onStatusChange = () => { },
}) => {
    const [localAnswers, setLocalAnswers] = useState(answers);

    useEffect(() => {
        // Validar si todas las preguntas están respondidas
        const allQuestionsAnswered = Object.values(localAnswers).every((answer) => answer.trim() !== "");
        onStatusChange(allQuestionsAnswered); // Notifica al componente padre
    }, [localAnswers, onStatusChange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedAnswers = { ...localAnswers, [name]: value };
        setLocalAnswers(updatedAnswers); // Actualiza el estado local
        onAnswersChange(updatedAnswers); // Notifica al componente padre
    };

    return (
        <fieldset>
            <legend>
                <h3>Ejercicio reflexivo</h3>
            </legend>
            <p>Responde a las siguientes preguntas llenando los campos.</p>
            <div className="reflective-exercise">
                <label htmlFor="designFocus">
                    ¿Dentro de los objetivos, se consideró importante el diseño para los dispositivos móviles como
                    primera opción?
                </label>
                <textarea
                    id="designFocus"
                    name="designFocus"
                    value={localAnswers.designFocus}
                    onChange={handleInputChange}
                    placeholder="Escribe tu respuesta aquí..."
                ></textarea>

                <label htmlFor="functionalRequirements">
                    ¿En los requisitos funcionales, se consideró el enfoque Mobile First en opciones como la
                    optimización para motores de búsqueda?
                </label>
                <textarea
                    id="functionalRequirements"
                    name="functionalRequirements"
                    value={localAnswers.functionalRequirements}
                    onChange={handleInputChange}
                    placeholder="Escribe tu respuesta aquí..."
                ></textarea>

                <label htmlFor="frameworks">
                    ¿En las tecnologías permitidas, se contempló el uso de frameworks con el enfoque Mobile First?
                </label>
                <textarea
                    id="frameworks"
                    name="frameworks"
                    value={localAnswers.frameworks}
                    onChange={handleInputChange}
                    placeholder="Escribe tu respuesta aquí..."
                ></textarea>
            </div>

            {Object.values(localAnswers).every((answer) => answer.trim() !== "") && (
                <p className="completion-message">¡Has respondido todas las preguntas!</p>
            )}
        </fieldset>
    );
};

export default ReflectiveExercise;
