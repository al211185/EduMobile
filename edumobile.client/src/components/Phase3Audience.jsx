import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Preguntas predefinidas por categoría
const demographicsQuestions = [
    "¿Cuál es su edad?",
    "¿Cuál es su género?",
    "¿Cuál es su ocupación actual?",
    "¿En qué país o región reside?",
    "¿Cuál es su nivel educativo?",
    "¿Cuál es su estado civil?",
    "¿Cuál es su nivel socioeconómico?",
    "¿Cuáles son sus intereses o aficiones?"
];

const behaviorQuestions = [
    "¿Cuántas horas al día pasa navegando en internet?",
    "¿Con qué frecuencia utiliza su dispositivo móvil para navegar?",
    "¿Qué dispositivos utiliza principalmente para navegar?",
    "¿En qué tipo de sitios web pasa más tiempo? (redes sociales, noticias, entretenimiento, compras, educación, otros)",
    "¿Con qué frecuencia compra productos o servicios desde su móvil?",
    "¿Utiliza principalmente redes Wi-Fi o su plan de datos?",
    "¿Prefiere aplicaciones móviles o navegar desde el navegador?"
];

const expectationsQuestions = [
    "¿Qué es lo que más le gusta al navegar en un sitio móvil?",
    "¿Qué le molesta más al navegar en un sitio móvil?",
    "¿Qué características espera de un sitio web optimizado para móviles?",
    "¿Cuáles son sus principales expectativas al usar un sitio móvil?",
    "¿Qué tan importante es que un sitio esté optimizado para móviles?",
    "¿Qué tipo de contenido le resulta más útil en sitios móviles?",
    "¿Cuán satisfecho está con su experiencia en sitios móviles?",
    "¿Ha dejado de usar algún sitio por no estar optimizado para móviles?",
    "¿Qué tan probable es que recomiende un sitio móvil bien diseñado?"
];

const preferencesQuestions = [
    "¿Prefiere sitios web con modo oscuro o claro?",
    "¿Con qué frecuencia actualiza sus aplicaciones?",
    "¿Le gustan las notificaciones de los sitios móviles?"
];

// Función para parsear el string audienceQuestions (guardado en la BD en formato JSON)
const parseAudienceQuestions = (audienceQuestions) => {
    try {
        return JSON.parse(audienceQuestions);
    } catch (error) {
        console.error("Error al parsear audienceQuestions:", error);
        return {
            demographics: [],
            behavior: [],
            expectations: [],
            preferences: [],
            custom: []
        };
    }
};

const Phase3Audience = ({ data, onSave }) => {
    // Estados para almacenar las preguntas seleccionadas por categoría
    const [selectedQuestions, setSelectedQuestions] = useState({
        demographics: [],
        behavior: [],
        expectations: [],
        preferences: []
    });
    // Estado para preguntas personalizadas
    const [customQuestion, setCustomQuestion] = useState("");
    const [customQuestions, setCustomQuestions] = useState([]);
    // Estado para el ejercicio reflexivo (manejado por separado, no se incluye en el PDF)
    const [reflectiveAnswers, setReflectiveAnswers] = useState([]);

    // Precargar datos previos (asegúrate de que el backend envíe "audienceQuestions" y "reflectionPhase3" en minúsculas)
    useEffect(() => {
        if (data) {
            if (data.audienceQuestions) {
                const parsed = parseAudienceQuestions(data.audienceQuestions);
                setSelectedQuestions({
                    demographics: parsed.demographics || [],
                    behavior: parsed.behavior || [],
                    expectations: parsed.expectations || [],
                    preferences: parsed.preferences || []
                });
                setCustomQuestions(parsed.custom || []);
            }
            if (data.reflectionPhase3) {
                const reflex = data.reflectionPhase3
                    .split(";")
                    .map((x) => x.trim())
                    .filter((x) => x !== "");
                setReflectiveAnswers(reflex);
            }
        }
    }, [data]);

    // Función para alternar la selección de una pregunta en una categoría
    const toggleQuestion = (category, question) => {
        setSelectedQuestions((prev) => {
            const current = prev[category] || [];
            if (current.includes(question)) {
                return { ...prev, [category]: current.filter((q) => q !== question) };
            } else {
                return { ...prev, [category]: [...current, question] };
            }
        });
    };

    // Agregar pregunta personalizada
    const addCustomQuestion = () => {
        if (customQuestion.trim() !== "") {
            setCustomQuestions((prev) => [...prev, customQuestion.trim()]);
            setCustomQuestion("");
        }
    };

    // Alternar selección del ejercicio reflexivo
    const toggleQuestionReflective = (question) => {
        setReflectiveAnswers((prev) => {
            if (prev.includes(question)) {
                return prev.filter((q) => q !== question);
            } else {
                return [...prev, question];
            }
        });
    };

    // Función para generar y descargar el PDF (sin incluir el ejercicio reflexivo)
    const generatePDF = () => {
        const doc = new jsPDF("p", "pt", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 40;

        // Encabezado con fondo oscuro y título centrado
        doc.setFillColor(52, 73, 94);
        doc.rect(0, 0, pageWidth, 60, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Encuesta de Investigación de Audiencia", pageWidth / 2, 35, { align: "center" });
        y = 80;

        // Función para agregar secciones con formato moderno y espaciado
        const addSection = (title, questions) => {
            if (questions.length === 0) return;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(52, 73, 94);
            doc.text(title, 40, y);
            y += 25;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            questions.forEach((q, idx) => {
                doc.text(`${idx + 1}. ${q}`, 50, y);
                y += 20;
                if (y > 750) {
                    doc.addPage();
                    y = 40;
                }
            });
            y += 20;
        };

        addSection("Datos Demográficos", selectedQuestions.demographics);
        addSection("Preguntas sobre Comportamiento", selectedQuestions.behavior);
        addSection("Expectativas y Opiniones", selectedQuestions.expectations);
        addSection("Preferencias Tecnológicas", selectedQuestions.preferences);
        addSection("Preguntas Personalizadas", customQuestions);

        // Pie de página con línea y fecha
        const footerY = doc.internal.pageSize.getHeight() - 40;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(1);
        doc.line(40, footerY, pageWidth - 40, footerY);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        const currentDate = new Date().toLocaleDateString();
        doc.text(`Generado el: ${currentDate}`, 40, footerY + 15);

        doc.save("cuestionario_audiencia.pdf");
    };

    // Al enviar, se serializa el cuestionario en JSON para guardarlo en la BD
    const handleSubmit = (e) => {
        e.preventDefault();
        const audienceData = {
            demographics: selectedQuestions.demographics,
            behavior: selectedQuestions.behavior,
            expectations: selectedQuestions.expectations,
            preferences: selectedQuestions.preferences,
            custom: customQuestions
        };
        const updatedData = {
            audienceQuestions: JSON.stringify(audienceData),
            reflectionPhase3: reflectiveAnswers.join(";")
        };
        onSave(updatedData);
    };

    return (
        <div className="project-planning-container">
            <h2>Fase 3: Investigación de la Audiencia</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        <h3>Introducción</h3>
                    </legend>
                    <p>
                        Seleccione las preguntas que considere útiles para formar el cuestionario de investigación de audiencia. También puede agregar preguntas personalizadas.
                    </p>
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Datos Demográficos</h3>
                    </legend>
                    {demographicsQuestions.map((q, idx) => (
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.demographics.includes(q)}
                                    onChange={() => toggleQuestion("demographics", q)}
                                />
                                {q}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Preguntas sobre Comportamiento</h3>
                    </legend>
                    {behaviorQuestions.map((q, idx) => (
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.behavior.includes(q)}
                                    onChange={() => toggleQuestion("behavior", q)}
                                />
                                {q}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Expectativas y Opiniones</h3>
                    </legend>
                    {expectationsQuestions.map((q, idx) => (
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.expectations.includes(q)}
                                    onChange={() => toggleQuestion("expectations", q)}
                                />
                                {q}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Preferencias Tecnológicas</h3>
                    </legend>
                    {preferencesQuestions.map((q, idx) => (
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.preferences.includes(q)}
                                    onChange={() => toggleQuestion("preferences", q)}
                                />
                                {q}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Preguntas Personalizadas</h3>
                    </legend>
                    <input
                        type="text"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Escribe tu pregunta personalizada"
                    />
                    <button type="button" onClick={addCustomQuestion}>
                        Agregar Pregunta
                    </button>
                    {customQuestions.length > 0 && (
                        <ul>
                            {customQuestions.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                    )}
                </fieldset>

                <fieldset>
                    <legend>
                        <h3>Resumen de Preguntas Seleccionadas</h3>
                    </legend>
                    <div>
                        <h4>Datos Demográficos:</h4>
                        <ul>
                            {selectedQuestions.demographics.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                        <h4>Preguntas sobre Comportamiento:</h4>
                        <ul>
                            {selectedQuestions.behavior.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                        <h4>Expectativas y Opiniones:</h4>
                        <ul>
                            {selectedQuestions.expectations.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                        <h4>Preferencias Tecnológicas:</h4>
                        <ul>
                            {selectedQuestions.preferences.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                        <h4>Preguntas Personalizadas:</h4>
                        <ul>
                            {customQuestions.map((q, idx) => (
                                <li key={idx}>{q}</li>
                            ))}
                        </ul>
                    </div>
                </fieldset>

                {/* Bloque del ejercicio reflexivo (fuera del PDF) */}
                <fieldset>
                    <legend>
                        <h3>Ejercicio reflexivo</h3>
                    </legend>
                    <p>
                        Responde a las siguientes preguntas marcando las opciones que consideres que mejor describen la situación:
                    </p>
                    <div className="checklist">
                        <label>
                            <input
                                type="checkbox"
                                checked={reflectiveAnswers.includes("formularios_contacto")}
                                onChange={() => toggleQuestionReflective("formularios_contacto")}
                            />
                            ¿Las preguntas seleccionadas ayudan a entender mejor las necesidades de los usuarios con dispositivos móviles?
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={reflectiveAnswers.includes("formularios_registro")}
                                onChange={() => toggleQuestionReflective("formularios_registro")}
                            />
                            ¿Las preguntas elegidas ayudan a identificar los elementos de diseño que podrían mejorar la navegación en móviles?
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={reflectiveAnswers.includes("conexion_bd")}
                                onChange={() => toggleQuestionReflective("conexion_bd")}
                            />
                            ¿Las preguntas demográficas elegidas aportan información relevante para personalizar la experiencia en móviles?
                        </label>
                    </div>
                </fieldset>

                <div className="navigation-buttons">
                    <button type="button" onClick={generatePDF}>
                        Descargar PDF
                    </button>
                    <button type="submit">Guardar</button>
                </div>
            </form>
        </div>
    );
};

export default Phase3Audience;
