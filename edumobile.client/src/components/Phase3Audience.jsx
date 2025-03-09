import React, { useState, useEffect } from "react";

const Phase3Audience = ({ data, onNext, onPrev }) => {
    // Estado inicial: si hay data, la usamos para precargar las respuestas
    const [audienceResponses, setAudienceResponses] = useState("");
    const [reflectiveAnswers, setReflectiveAnswers] = useState([]);
    const [responsesSaved, setResponsesSaved] = useState(false);

    // Opciones para el ejercicio reflexivo
    const reflectiveOptions = [
        { value: "formularios_contacto", label: "¿Las preguntas seleccionadas ayudan a entender mejor las necesidades de los usuarios con dispositivos móviles?" },
        { value: "formularios_registro", label: "¿Las preguntas elegidas ayudan a identificar los elementos de diseño que podrían mejorar la navegación en móviles?" },
        { value: "conexion_bd", label: "¿Las preguntas demográficas elegidas aportan información relevante para personalizar la experiencia en móviles?" }
    ];

    // Al montar, si hay data precargada, la usamos para inicializar el estado
    useEffect(() => {
        if (data) {
            setAudienceResponses(data.AudienceQuestions || "");
            // Asumimos que ReflectionPhase3 es una cadena separada por ";"
            setReflectiveAnswers(
                data.ReflectionPhase3
                    ? data.ReflectionPhase3.split(";").map(x => x.trim()).filter(x => x !== "")
                    : []
            );
        }
    }, [data]);

    // Maneja el cambio en el textarea de respuestas de la investigación
    const handleResponsesChange = (e) => {
        setAudienceResponses(e.target.value);
        // Si el usuario edita, se desactiva la confirmación de guardado
        setResponsesSaved(false);
    };

    // Guarda las respuestas de la investigación (puedes hacer validaciones adicionales)
    const handleSaveResponses = () => {
        if (!audienceResponses.trim()) {
            alert("Por favor, escribe tus respuestas a la investigación de la audiencia.");
            return;
        }
        setResponsesSaved(true);
        alert("Respuestas guardadas correctamente.");
    };

    // Maneja los cambios en el ejercicio reflexivo (checkboxes)
    const handleReflectiveChange = (value) => {
        setReflectiveAnswers(prev => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    // Al enviar (Completar Fase 3)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!responsesSaved) {
            alert("Por favor, guarda primero tus respuestas de investigación.");
            return;
        }
        // Prepara el objeto que se enviará al padre
        const updatedData = {
            // Guardamos lo ingresado en la fase 3
            AudienceQuestions: audienceResponses,
            ReflectionPhase3: reflectiveAnswers.join(";")
        };
        onNext(updatedData);
    };

    return (
        <div className="project-planning-container">
            <form onSubmit={handleSubmit}>
                {/* Sección de Investigación de la Audiencia */}
                <fieldset>
                    <legend>
                        <h2>Fase 3: Investigación de la audiencia</h2>
                    </legend>
                    <section className="grid-container objetivo" id="intro">
                        <div className="item1 grid-item">
                            <h3>Introducción</h3>
                            <p>
                                A continuación se brinda una lista de preguntas para la etapa de Investigación de la Audiencia.
                                Lee atentamente cada sección y, al final, redacta un resumen o tus respuestas en el recuadro.
                            </p>
                        </div>
                        <div id="demograficos" className="item2 grid-item">
                            <p><b>Datos demográficos:</b></p>
                        </div>
                        <div className="item3 grid-item">
                            <p>¿Cuál es su edad?</p>
                            <p>¿Cuál es su género?</p>
                            <p>¿Cuál es su ocupación actual?</p>
                            <p>¿En qué país o región reside actualmente?</p>
                            <p>¿Cuál es su nivel educativo?</p>
                            <p>¿Cuál es su estado civil?</p>
                            <p>¿Cuál es el nivel socioeconómico?</p>
                            <p>¿Cuáles son sus intereses o aficiones?</p>
                        </div>
                        <div id="comportamiento" className="item4 grid-item">
                            <p><b>Preguntas sobre comportamiento:</b></p>
                        </div>
                        <div className="item5 grid-item">
                            <p>¿Cuántas horas al día pasa navegando en internet?</p>
                            <p>¿Con qué frecuencia utiliza su dispositivo móvil para navegar en sitios web?</p>
                            <p>¿Cuáles dispositivos utiliza con mayor frecuencia para navegar en internet?</p>
                            <p>
                                ¿En qué tipo de sitios web pasa más tiempo? (Redes sociales, noticias, entretenimiento, compras en línea,
                                educación y aprendizaje, otros)
                            </p>
                            <p>¿Con qué frecuencia compra productos o servicios desde su dispositivo móvil?</p>
                            <p>¿Suele utilizar redes Wi-Fi o su plan de datos móviles para navegar en su teléfono?</p>
                            <p>¿Utiliza aplicaciones móviles o prefiere acceder a servicios directamente desde el navegador?</p>
                        </div>
                        <div id="expectativas" className="item6 grid-item">
                            <p><b>Expectativas y opiniones:</b></p>
                        </div>
                        <div className="item7 grid-item">
                            <p>¿Qué es lo que más le gusta al navegar en un sitio web móvil?</p>
                            <p>¿Qué le molesta más al navegar en un sitio web desde su móvil?</p>
                            <p>¿Qué características espera de un sitio web optimizado para móviles?</p>
                            <p>¿Cuáles son sus principales expectativas al usar un sitio web móvil?</p>
                            <p>¿Qué tan importante es para usted que un sitio web esté optimizado para dispositivos móviles?</p>
                            <p>¿Qué tipo de contenido le resulta más útil o relevante en sitios web móviles?</p>
                            <p>¿Cuán satisfecho está con la experiencia que ha tenido en sitios web móviles?</p>
                            <p>¿Ha dejado de usar algún sitio web porque no estaba bien optimizado para su dispositivo móvil?</p>
                            <p>¿Qué tan probable es que recomiende un sitio web móvil a otras personas si está bien diseñado?</p>
                        </div>
                        <div id="preferencias" className="item8 grid-item">
                            <p><b>Preguntas sobre preferencias tecnológicas:</b></p>
                        </div>
                        <div className="item9 grid-item">
                            <p>¿Prefiere sitios web con modo oscuro o claro en su dispositivo móvil?</p>
                            <p>¿Con qué frecuencia actualiza las aplicaciones en su dispositivo móvil?</p>
                            <p>¿Le gusta que los sitios web móviles utilicen funciones como notificaciones?</p>
                        </div>
                        <div className="item10 grid-item">
                            {/* Puedes incluir aquí otros controles si lo requieres */}
                            <button type="button" onClick={handleSaveResponses}>
                                Guardar respuestas de investigación
                            </button>
                        </div>
                    </section>
                    <div style={{ marginTop: "10px" }}>
                        <label>
                            Resumen / Respuestas:
                            <textarea
                                value={audienceResponses}
                                onChange={handleResponsesChange}
                                placeholder="Escribe aquí tus respuestas o resumen de la investigación de la audiencia..."
                                style={{ width: "100%", height: "100px" }}
                            />
                        </label>
                    </div>
                </fieldset>

                {/* Ejercicio reflexivo */}
                <fieldset>
                    <legend>
                        <h3>Ejercicio reflexivo</h3>
                    </legend>
                    <p>
                        Responde a las siguientes preguntas marcando en el recuadro y presiona el botón para pasar a la siguiente sección.
                    </p>
                    <div className="checklist">
                        {reflectiveOptions.map((opt) => (
                            <label key={opt.value} style={{ display: "block" }}>
                                <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={reflectiveAnswers.includes(opt.value)}
                                    onChange={() => handleReflectiveChange(opt.value)}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div style={{ marginTop: "20px" }}>
                    {onPrev && (
                        <button type="button" onClick={onPrev}>
                            Anterior
                        </button>
                    )}
                    <button type="submit" disabled={!responsesSaved}>
                        Completar Fase 3
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase3Audience;
