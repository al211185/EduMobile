import React, { useState, useEffect } from "react";

// Función para convertir camelCase a kebab-case (ej: flexDirection -> flex-direction)
const cssPropertyName = (prop) => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

// Definimos 5 ejercicios enfocados en min-width
const exercises = [
    {
        property: "flexDirection",
        target: 480,
        simulatedWidth: 480,
        description:
            "En dispositivos móviles, a partir de 480px se espera que las cajas se dispongan en fila (row) en lugar de apilarse (column).",
        activatedValue: "row",
        defaultValue: "column",
    },
    {
        property: "backgroundColor",
        target: 600,
        simulatedWidth: 600,
        description:
            "En dispositivos medianos, a partir de 600px las cajas deben cambiar su fondo a azul; en dispositivos menores, el fondo es gris.",
        activatedValue: "blue",
        defaultValue: "gray",
    },
    {
        property: "fontSize",
        target: 768,
        simulatedWidth: 768,
        description:
            "En tablets, a partir de 768px el tamaño de la fuente debe aumentar a 24px, mientras que en dispositivos menores es 14px.",
        activatedValue: "24px",
        defaultValue: "14px",
    },
    {
        property: "padding",
        target: 992,
        simulatedWidth: 992,
        description:
            "En laptops pequeñas, a partir de 992px se incrementa el padding a 30px; en dispositivos menores, es 10px.",
        activatedValue: "30px",
        defaultValue: "10px",
    },
    {
        property: "opacity",
        target: 1200,
        simulatedWidth: 1200,
        description:
            "En laptops grandes, a partir de 1200px las cajas deben mostrarse completamente opacas (opacity 1), mientras que en dispositivos menores son semitransparentes (opacity 0.5).",
        activatedValue: "1",
        defaultValue: "0.5",
    },
];

// Función que genera el arreglo de tokens correcto para formar la media query
const getCorrectOrder = (ex) => {
    return [
        "@media",
        "screen",
        "and",
        `(min-width:`,
        `${ex.target}px)`,
        "{",
        `.boxes { ${cssPropertyName(ex.property)}: ${ex.activatedValue}; }`,
        "}",
    ];
};

// Para este ejemplo, generamos el pool de tokens combinando los correctos con algunos distractores
const generateTokensPool = (correctTokens) => {
    const distractors = ["(max-width:", "480px)", "wrong-token", "@media:"];
    return shuffleTokens([...correctTokens, ...distractors]);
};

// Función para barajar los tokens
function shuffleTokens(tokens) {
    const array = [...tokens];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const MediaQueryGameMinWidth = () => {
    const [currentExercise, setCurrentExercise] = useState(0);
    const [userBreakpoint, setUserBreakpoint] = useState(exercises[0].target);
    const [message, setMessage] = useState("");
    const [completed, setCompleted] = useState(false);

    // Calculamos el arreglo de tokens correcto para el ejercicio actual
    const correctOrder = getCorrectOrder(exercises[currentExercise]);
    // Generamos el pool de tokens (mezclados) a partir de los tokens correctos + distractores
    const [tokensPool, setTokensPool] = useState(shuffleTokens([...correctOrder, "(min-width)", "9999px"]));
    // Estado para los slots, inicialmente vacíos
    const [slots, setSlots] = useState(Array(correctOrder.length).fill(null));
    // Estado para indicar si el puzzle está armado correctamente
    const [puzzleCorrect, setPuzzleCorrect] = useState(false);

    // Para mobile-first con min-width: la media query se activa si el ancho simulado es mayor o igual al breakpoint ingresado.
    const condition = exercises[currentExercise].simulatedWidth >= userBreakpoint;

    // Vista previa: se aplica el estilo activado si el puzzle es correcto; de lo contrario, se muestra el valor por defecto.
    const previewStyle = {
        [cssPropertyName(exercises[currentExercise].property)]:
            puzzleCorrect ? exercises[currentExercise].activatedValue : exercises[currentExercise].defaultValue,
    };

    // Manejo del drag and drop
    const handleDragStart = (e, token) => {
        e.dataTransfer.setData("token", token);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        const draggedToken = e.dataTransfer.getData("token");
        removeTokenFromSlots(draggedToken);
        setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[slotIndex] = draggedToken;
            return newSlots;
        });
        setTokensPool((prev) => prev.filter((t) => t !== draggedToken));
    };

    const removeTokenFromSlots = (token) => {
        setSlots((prev) =>
            prev.map((item) => (item === token ? null : item))
        );
    };

    const handleSlotClick = (token, index) => {
        if (!token) return;
        setTokensPool((prev) => [...prev, token]);
        setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[index] = null;
            return newSlots;
        });
    };

    // Verificar la respuesta
    const checkAnswer = () => {
        if (slots.join(" ") === correctOrder.join(" ")) {
            alert("¡Correcto! Has armado la media query correctamente.");
            setPuzzleCorrect(true);
        } else {
            alert("Hay un error. Revisa el orden o los tokens utilizados.");
            setPuzzleCorrect(false);
        }
    };

    // Avanzar al siguiente ejercicio
    const nextExercise = () => {
        if (currentExercise < exercises.length - 1) {
            const next = currentExercise + 1;
            setCurrentExercise(next);
            setUserBreakpoint(exercises[next].target);
            setMessage("");
            setPuzzleCorrect(false);
            setSlots(Array(getCorrectOrder(exercises[next]).length).fill(null));
            setTokensPool(shuffleTokens([...getCorrectOrder(exercises[next]), "(min-width)", "9999px"]));
        } else {
            setCompleted(true);
        }
    };

    return (
        <div className="media-query-dnd-container">
            <h1>Media Query Game (Mobile‑First: min‑width)</h1>
            {completed ? (
                <div>
                    <h2>¡Felicidades! Has completado todos los ejercicios.</h2>
                </div>
            ) : (
                <div>
                    <h2>
                        Ejercicio {currentExercise + 1} de {exercises.length}
                    </h2>
                    <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {exercises[currentExercise].description}
                    </p>
                    <p>
                        <strong>Instrucciones:</strong> Arrastra y suelta los tokens en el orden correcto para formar la media query que se activa cuando el ancho del dispositivo es mayor o igual al breakpoint indicado.
                    </p>
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="breakpoint" style={{ marginRight: "10px", fontSize: "16px" }}>
                            Ingresa el breakpoint (px):
                        </label>
                        <input
                            type="number"
                            id="breakpoint"
                            value={userBreakpoint}
                            onChange={(e) => setUserBreakpoint(Number(e.target.value))}
                            min="0"
                            style={{ width: "100px", fontSize: "16px", padding: "5px" }}
                        />
                        <button onClick={checkAnswer} style={{ fontSize: "16px", marginLeft: "10px", padding: "5px 10px" }}>
                            Comprobar
                        </button>
                    </div>
                    {/* Área Drag & Drop */}
                    <div className="dnd-content">
                        <div className="tokens-pool">
                            <h2>Tokens Disponibles</h2>
                            <div className="token-list">
                                {tokensPool.map((token) => (
                                    <div
                                        key={token}
                                        className="token"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, token)}
                                    >
                                        {token}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="slots-area">
                            <h2>Arma tu Media Query</h2>
                            <div className="slots-row">
                                {slots.map((slotToken, index) => (
                                    <div
                                        key={index}
                                        className="slot"
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragOver={handleDragOver}
                                        onClick={() => handleSlotClick(slotToken, index)}
                                    >
                                        {slotToken && (
                                            <div className="token in-slot" draggable>
                                                {slotToken}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="check-button" onClick={checkAnswer}>
                        Comprobar
                    </button>
                    <hr />
                    {/* Vista Previa en Mobile-first */}
                    <div className="preview-container">
                        <h2>Vista Previa</h2>
                        <p>
                            Cuando la media query se arme correctamente, verás que las cajas cambian a:
                            <br />
                            <strong>{cssPropertyName(exercises[currentExercise].property)}: {exercises[currentExercise].activatedValue}</strong>
                        </p>
                        <div className="boxes" style={previewStyle}>
                            <div className="box">Box 1</div>
                            <div className="box">Box 2</div>
                            <div className="box">Box 3</div>
                        </div>
                    </div>
                    {slots.join(" ") === getCorrectOrder(exercises[currentExercise]).join(" ") &&
                        !completed && (
                            <button onClick={nextExercise} className="check-button">
                                Siguiente Ejercicio
                            </button>
                        )}
                </div>
            )}
        </div>
    );
};

export default MediaQueryGameMinWidth;
