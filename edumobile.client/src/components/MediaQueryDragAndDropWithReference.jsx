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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
                Media Query Game (Mobile‑First: min‑width)
            </h1>
            {completed ? (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-green-600">
                        ¡Felicidades! Has completado todos los ejercicios.
                    </h2>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Ejercicio {currentExercise + 1} de {exercises.length}
                    </h2>
                    <p className="font-bold text-lg text-gray-800">
                        {exercises[currentExercise].description}
                    </p>
                    <p className="text-gray-700">
                        <strong>Instrucciones:</strong> Arrastra y suelta los tokens en el orden correcto para formar la media query que se activa cuando el ancho del dispositivo es mayor o igual al breakpoint indicado.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <label htmlFor="breakpoint" className="font-medium text-gray-700">
                            Ingresa el breakpoint (px):
                        </label>
                        <input
                            type="number"
                            id="breakpoint"
                            value={userBreakpoint}
                            onChange={(e) => setUserBreakpoint(Number(e.target.value))}
                            min="0"
                            className="w-24 p-2 border border-gray-300 rounded"
                        />
                        <button
                            onClick={checkAnswer}
                            className="text-lg mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Comprobar
                        </button>
                    </div>
                    {/* Área Drag & Drop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="tokens-pool">
                            <h2 className="text-xl font-medium text-gray-800 mb-2">
                                Tokens Disponibles
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {tokensPool.map((token) => (
                                    <div
                                        key={token}
                                        className="token px-3 py-1 bg-gray-100 border border-gray-300 rounded cursor-move"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, token)}
                                    >
                                        {token}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="slots-area">
                            <h2 className="text-xl font-medium text-gray-800 mb-2">
                                Arma tu Media Query
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {slots.map((slotToken, index) => (
                                    <div
                                        key={index}
                                        className="slot w-32 h-10 border border-dashed border-gray-300 flex items-center justify-center rounded"
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragOver={handleDragOver}
                                        onClick={() => handleSlotClick(slotToken, index)}
                                    >
                                        {slotToken && (
                                            <div
                                                className="token in-slot px-3 py-1 bg-gray-200 border border-gray-300 rounded cursor-move"
                                                draggable
                                            >
                                                {slotToken}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={checkAnswer}
                        className="block w-full text-lg px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Comprobar
                    </button>
                    <hr className="my-4" />
                    {/* Vista Previa */}
                    <div className="preview-container">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Vista Previa
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Cuando la media query se arme correctamente, verás que las cajas
                            cambian a:
                            <br />
                            <strong>
                                {cssPropertyName(exercises[currentExercise].property)}:{" "}
                                {exercises[currentExercise].activatedValue}
                            </strong>
                        </p>
                        <div className="boxes flex space-x-4" style={previewStyle}>
                            <div className="box p-4 bg-gray-100 rounded border border-gray-300">
                                Box 1
                            </div>
                            <div className="box p-4 bg-gray-100 rounded border border-gray-300">
                                Box 2
                            </div>
                            <div className="box p-4 bg-gray-100 rounded border border-gray-300">
                                Box 3
                            </div>
                        </div>
                    </div>
                    {slots.join(" ") === getCorrectOrder(exercises[currentExercise]).join(" ") && !completed && (
                        <button
                            onClick={nextExercise}
                            className="block w-full text-lg px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Siguiente Ejercicio
                        </button>
                    )}
                </div>
            )}
        </div>
    );

};

export default MediaQueryGameMinWidth;
