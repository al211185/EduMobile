import React from "react";

const PreferencesSection = ({
    preferences: { corporateColors, corporateFont, allowedTechnologies, customTechnologies },
    handlePreferencesChange,
    readOnly = false,
}) => {
    return (
        <fieldset>
            <legend>
                <h3>Preferencias del proyecto</h3>
            </legend>
            <div className="preferences-container">
                {/* Colores corporativos */}
                <label htmlFor="primaryColor">Color primario:</label>
                <input
                    type="color"
                    id="primaryColor"
                    value={corporateColors.primary}
                    onChange={(e) =>
                        handlePreferencesChange({
                            corporateColors: { ...corporateColors, primary: e.target.value },
                        })
                    }
                    readOnly={readOnly}
                />

                <label htmlFor="secondaryColor1">Color secundario 1:</label>
                <input
                    type="color"
                    id="secondaryColor1"
                    value={corporateColors.secondary1}
                    onChange={(e) =>
                        handlePreferencesChange({
                            corporateColors: { ...corporateColors, secondary1: e.target.value },
                        })
                    }
                    readOnly={readOnly}
                />

                <label htmlFor="secondaryColor2">Color secundario 2:</label>
                <input
                    type="color"
                    id="secondaryColor2"
                    value={corporateColors.secondary2}
                    onChange={(e) =>
                        handlePreferencesChange({
                            corporateColors: { ...corporateColors, secondary2: e.target.value },
                        })
                    }
                    readOnly={readOnly}
                />

                {/* Tecnologías permitidas */}
                <fieldset>
                    <legend>Tecnologías permitidas:</legend>
                    {allowedTechnologies.map((tech, index) => (
                        <label key={tech.name || index}>
                            <input
                                type="checkbox"
                                name={tech.name}
                                checked={tech.checked}
                                onChange={(e) => {
                                    const updatedTechnologies = allowedTechnologies.map((t) =>
                                        t.name === tech.name ? { ...t, checked: e.target.checked } : t
                                    );
                                    handlePreferencesChange({ allowedTechnologies: updatedTechnologies });
                                }}
                                disabled={readOnly}
                            />
                            {tech.label}
                        </label>
                    ))}
                </fieldset>

                {/* Tecnologías personalizadas */}
                <fieldset>
                    <legend>Tecnologías personalizadas:</legend>
                    <ul>
                        {customTechnologies.map((customTech, index) => (
                            <li key={index}>
                                {customTech}
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedCustomTechnologies = customTechnologies.filter(
                                                (_, i) => i !== index
                                            );
                                            handlePreferencesChange({
                                                customTechnologies: updatedCustomTechnologies,
                                            });
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {!readOnly && (
                        <input
                            type="text"
                            placeholder="Agregar nueva tecnología"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target.value.trim()) {
                                    handlePreferencesChange({
                                        customTechnologies: [...customTechnologies, e.target.value.trim()],
                                    });
                                    e.target.value = "";
                                }
                            }}
                        />
                    )}
                </fieldset>
            </div>
        </fieldset>
    );
};

export default PreferencesSection;
