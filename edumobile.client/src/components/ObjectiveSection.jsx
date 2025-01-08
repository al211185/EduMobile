import React from "react";

const ObjectiveSection = ({
    generalObjective,
    specificObjectives,
    handleGeneralObjectiveChange,
    handleSpecificObjectiveChange,
    handleAddSpecificObjective,
    handleRemoveSpecificObjective,
    readOnly, // Nueva prop para controlar el modo de solo lectura
}) => (
    <fieldset>
        <section className="grid-container objetivos" id="obj">
            <div className="item1 grid-item">
                <h3>Objetivos del proyecto</h3>
            </div>
            <div className="item2 grid-item">
                <label htmlFor="generalObjective">
                    <b>Objetivo general:</b>
                </label>
            </div>
            <div className="item3 grid-item">
                <textarea
                    id="generalObjective"
                    name="generalObjective"
                    value={generalObjective}
                    onChange={(e) => handleGeneralObjectiveChange(e.target.value)}
                    readOnly={readOnly} // Modo solo lectura
                />
            </div>
            <div className="item4 grid-item">
                <label>
                    <b>Objetivos específicos:</b> Escribir objetivos claros y medibles.
                </label>
            </div>
            <div id="item5" className="item5 grid-item">
                {specificObjectives.map((objective, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                        <label htmlFor={`specificObjective${index}`}>Objetivo {index + 1}:</label>
                        <input
                            type="text"
                            id={`specificObjective${index}`}
                            value={objective}
                            onChange={(e) => handleSpecificObjectiveChange(index, e.target.value)}
                            readOnly={readOnly} // Modo solo lectura
                        />
                        {!readOnly && ( // Mostrar el botón de eliminar solo si no es de solo lectura
                            <button
                                type="button"
                                onClick={() => handleRemoveSpecificObjective(index)}
                                style={{
                                    marginLeft: "10px",
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                ))}
                {!readOnly && ( // Mostrar el botón de agregar solo si no es de solo lectura
                    <button
                        type="button"
                        onClick={handleAddSpecificObjective}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "0.5rem 1rem",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Agregar Objetivo
                    </button>
                )}
            </div>
        </section>
    </fieldset>
);

export default ObjectiveSection;
