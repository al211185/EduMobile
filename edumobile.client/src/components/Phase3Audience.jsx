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

const reflectiveQuestions = [
    {
        value: "formularios_contacto",
        label: "¿Las preguntas seleccionadas ayudan a entender mejor las necesidades de los usuarios con dispositivos móviles?"
    },
    {
        value: "formularios_registro",
        label: "¿Las preguntas elegidas ayudan a identificar los elementos de diseño que podrían mejorar la navegación en móviles?"
    },
    {
        value: "conexion_bd",
        label: "¿Las preguntas demográficas elegidas aportan información relevante para personalizar la experiencia en móviles?"
    }
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg h-[90vh] flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Área scrollable para el contenido */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 px-2">Introducción</legend>
                        <p className="text-gray-700">
                            Seleccione las preguntas que considere útiles para formar el cuestionario de investigación de audiencia. También puede agregar preguntas personalizadas.
                        </p>
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Datos Demográficos</legend>
                        {demographicsQuestions.map((q, idx) => (
                            <div key={idx}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.demographics.includes(q)}
                                        onChange={() => toggleQuestion("demographics", q)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700 text-sm">{q}</span>
                                </label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Preguntas sobre Comportamiento</legend>
                        {behaviorQuestions.map((q, idx) => (
                            <div key={idx}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.behavior.includes(q)}
                                        onChange={() => toggleQuestion("behavior", q)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700 text-sm">{q}</span>
                                </label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Expectativas y Opiniones</legend>
                        {expectationsQuestions.map((q, idx) => (
                            <div key={idx}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.expectations.includes(q)}
                                        onChange={() => toggleQuestion("expectations", q)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700 text-sm">{q}</span>
                                </label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Preferencias Tecnológicas</legend>
                        {preferencesQuestions.map((q, idx) => (
                            <div key={idx}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.preferences.includes(q)}
                                        onChange={() => toggleQuestion("preferences", q)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700 text-sm">{q}</span>
                                </label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Preguntas Personalizadas</legend>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={customQuestion}
                                onChange={(e) => setCustomQuestion(e.target.value)}
                                placeholder="Escribe tu pregunta personalizada"
                                className="w-full border border-gray-300 rounded p-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={addCustomQuestion}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                            >
                                Agregar Pregunta
                            </button>
                        </div>
                        {customQuestions.length > 0 && (
                            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                                {customQuestions.map((q, idx) => (
                                    <li key={idx}>{q}</li>
                                ))}
                            </ul>
                        )}
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Resumen de Preguntas Seleccionadas</legend>
                        <div className="text-sm text-gray-700 space-y-2">
                            <div>
                                <h4 className="font-semibold">Datos Demográficos:</h4>
                                <ul className="list-disc pl-5">
                                    {selectedQuestions.demographics.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold">Preguntas sobre Comportamiento:</h4>
                                <ul className="list-disc pl-5">
                                    {selectedQuestions.behavior.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold">Expectativas y Opiniones:</h4>
                                <ul className="list-disc pl-5">
                                    {selectedQuestions.expectations.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold">Preferencias Tecnológicas:</h4>
                                <ul className="list-disc pl-5">
                                    {selectedQuestions.preferences.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold">Preguntas Personalizadas:</h4>
                                <ul className="list-disc pl-5">
                                    {customQuestions.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 mb-2">Ejercicio reflexivo</legend>
                        <p className="text-gray-700 mb-4">
                            Responde a las siguientes preguntas marcando las opciones que consideres que mejor describen la situación:
                        </p>
                        <div className="space-y-2">
                            {reflectiveQuestions.map((question) => (
                                <label key={question.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={question.value}
                                        checked={reflectiveAnswers.includes(question.value)}
                                        onChange={() => toggleQuestionReflective(question.value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700 text-sm">{question.label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>

                {/* Contenedor fijo para el botón de navegación */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex justify-between">
                        <button type="button" onClick={generatePDF} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm">
                            Descargar PDF
                        </button>
                        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

};

export default Phase3Audience;
