import React, { useState, useEffect, useMemo } from "react";
import seedrandom from "seedrandom";
import { useAuth } from "../contexts/AuthContext";

// Convierte camelCase a kebab-case
const cssPropertyName = (prop) =>
    prop.replace(/([A-Z])/g, "-$1").toLowerCase();

const MediaQueryGameMinWidth = () => {
    const { user } = useAuth();

    // 1) Traer puntaje histórico (“mejor”)
    const [bestScore, setBestScore] = useState({ correct: 0, attempts: 0 });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/GameScores");
                if (res.ok) {
                    const data = await res.json();
                    setBestScore({ correct: data.correctCount, attempts: data.attemptCount });
                }
            } catch { }
        })();
    }, []);

    // 2) Semilla + ejercicios determinísticos
    const rng = useMemo(() => seedrandom(user.id), [user.id]);
    const allProps = useMemo(
        () => [
            { property: "flexDirection", defaultValue: "column", activatedValue: "row" },
            { property: "backgroundColor", defaultValue: "gray", activatedValue: "blue" },
            { property: "fontSize", defaultValue: "14px", activatedValue: "24px" },
            { property: "padding", defaultValue: "10px", activatedValue: "30px" },
            { property: "opacity", defaultValue: "0.5", activatedValue: "1" },
            { property: "justifyContent", defaultValue: "flex-start", activatedValue: "center" },
            { property: "alignItems", defaultValue: "stretch", activatedValue: "flex-end" },
            { property: "color", defaultValue: "black", activatedValue: "white" },
            { property: "flexWrap", defaultValue: "nowrap", activatedValue: "wrap" },
            { property: "display", defaultValue: "block", activatedValue: "flex" },
        ],
        []
    );
    const breakpoints = useMemo(
        () => [320, 480, 600, 768, 992, 1200, 1400, 1600, 1800, 2000],
        []
    );
    const shuffle = (arr) => [...arr].sort(() => rng() - 0.5);

    const exercises = useMemo(() => {
        const props = shuffle(allProps).slice(0, 10);
        const bps = shuffle(breakpoints).slice(0, 10);
        return props.map((item, i) => ({
            ...item,
            target: bps[i],
            description: `A partir de ${bps[i]}px, ${cssPropertyName(
                item.property
            )} cambia de ${item.defaultValue} a ${item.activatedValue}.`,
        }));
    }, [allProps, breakpoints, rng]);

    // 3) Puntaje de sesión (siempre arranca en 0)
    const [sessionScore, setSessionScore] = useState({ correct: 0, attempts: 0 });

    // 4) Lógica de juego (igual que antes)
    const [current, setCurrent] = useState(0);
    const ex = exercises[current];

    const initCorrectOrder = useMemo(
        () => [
            "@media",
            "screen",
            "and",
            `(min-width:${ex.target}px){`,
            `.boxes{${cssPropertyName(ex.property)}:${ex.activatedValue};}`,
            "}",
        ],
        [ex]
    );
    const [slots, setSlots] = useState(Array(initCorrectOrder.length).fill(null));
    const [tokensPool, setTokensPool] = useState(shuffle(initCorrectOrder));
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        setSlots(Array(initCorrectOrder.length).fill(null));
        setTokensPool(shuffle(initCorrectOrder));
        setSolved(false);
    }, [initCorrectOrder, rng]);

    const handleDragStart = (e, token) => e.dataTransfer.setData("token", token);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e, idx) => {
        e.preventDefault();
        const token = e.dataTransfer.getData("token");
        setSlots((old) => {
            const next = [...old];
            if (next[idx]) setTokensPool((p) => [...p, next[idx]]);
            next[idx] = token;
            return next;
        });
        setTokensPool((p) => p.filter((t) => t !== token));
    };
    const handleSlotClick = (idx) => {
        setSlots((old) => {
            const next = [...old];
            const t = next[idx];
            if (t) {
                setTokensPool((p) => [...p, t]);
                next[idx] = null;
            }
            return next;
        });
    };
    const handleReset = () => {
        setSlots(Array(initCorrectOrder.length).fill(null));
        setTokensPool(shuffle(initCorrectOrder));
        setSolved(false);
    };

    // 5) Comprobar, pero **solo** incrementar el sessionScore
    const checkAnswer = () => {
        const correct = slots.join(" ") === initCorrectOrder.join(" ");
        setSolved(correct);

        setSessionScore((old) => ({
            correct: old.correct + (correct ? 1 : 0),
            attempts: old.attempts + 1,
        }));
    };

    // 6) Al terminar los 10 ejercicios, permite **guardar** mejor puntaje
    const finish = async () => {
        // ¿fue esta sesión mejor que el histórico?
        const oldPct = bestScore.attempts
            ? bestScore.correct / bestScore.attempts
            : 0;
        const newPct = sessionScore.attempts
            ? sessionScore.correct / sessionScore.attempts
            : 0;

        if (newPct > oldPct) {
            // Llama a tu endpoint para **reemplazar** el mejor score
            await fetch("/api/GameScores", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CorrectCount: sessionScore.correct,
                    AttemptCount: sessionScore.attempts,
                    SetAbsolute: true // sugiere al controller que reemplace, no que sume
                }),
            });
            setBestScore({ ...sessionScore });
            alert("🎉 Nuevo récord guardado!");
        } else {
            alert("Sigue practicando para superar tu mejor marca.");
        }
        // Reiniciar sesión
        setSessionScore({ correct: 0, attempts: 0 });
        setCurrent(0);
    };

    // Vista previa
    const previewStyle = {
        [cssPropertyName(ex.property)]: solved
            ? ex.activatedValue
            : ex.defaultValue,
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl shadow-xl">
            {/* Cabecera con ambos puntajes */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-indigo-700">
                    Media Query Game
                </h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow space-y-1">
                    <div>
                        <strong className="text-indigo-600">Mejor:</strong>{" "}
                        {bestScore.correct} / {bestScore.attempts}
                    </div>
                    <div>
                        <strong className="text-indigo-600">Sesión:</strong>{" "}
                        {sessionScore.correct} / {sessionScore.attempts}
                    </div>
                </div>
            </header>

            {/* Ejercicio */}
            <h2 className="text-xl text-indigo-600 mb-2">
                Ejercicio {current + 1} de {exercises.length}
            </h2>
            <p className="mb-6 text-indigo-800">{ex.description}</p>

            {/* Tokens Pool */}
            <section className="mb-4">
                <h3 className="font-medium text-indigo-700 mb-2">Tokens Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                    {tokensPool.map((t) => (
                        <div
                            key={t}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t)}
                            className="px-3 py-1 bg-indigo-200 border-indigo-300 rounded-lg cursor-move select-none"
                        >
                            {t}
                        </div>
                    ))}
                </div>
            </section>

            {/* Slots */}
            <section className="mb-4">
                <h3 className="font-medium text-indigo-700 mb-2">Arma tu media query</h3>
                <div className="flex flex-wrap gap-2">
                    {slots.map((slot, i) => (
                        <div
                            key={i}
                            onDrop={(e) => handleDrop(e, i)}
                            onDragOver={handleDragOver}
                            onClick={() => handleSlotClick(i)}
                            className="w-40 h-12 border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-lg flex items-center justify-center cursor-pointer select-none"
                        >
                            {slot}
                        </div>
                    ))}
                </div>
            </section>

            {/* Controles */}
            <section className="flex gap-4 mb-6">
                <button
                    onClick={checkAnswer}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Comprobar
                </button>
                <button
                    onClick={handleReset}
                    className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                    Reset
                </button>
            </section>

            {/* Siguiente ejercicio o terminar */}
            {solved && current < exercises.length - 1 && (
                <button
                    onClick={() => setCurrent((i) => i + 1)}
                    className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 mb-6"
                >
                    Siguiente Ejercicio
                </button>
            )}
            {solved && current === exercises.length - 1 && (
                <button
                    onClick={finish}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-6"
                >
                    Terminar y Guardar Récord
                </button>
            )}

            {/* Vista Previa */}
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-700 mb-2">Vista Previa</h3>
                <div className="boxes flex space-x-4 p-4 bg-indigo-50 rounded">
                    <div className="box p-4 bg-white rounded border">Box 1</div>
                    <div className="box p-4 bg-white rounded border">Box 2</div>
                    <div className="box p-4 bg-white rounded border">Box 3</div>
                </div>
                <style>
                    {`.boxes { ${cssPropertyName(
                        ex.property
                    )}: ${previewStyle[cssPropertyName(ex.property)]}; }`}
                </style>
            </div>
        </div>
    );
};

export default MediaQueryGameMinWidth;
