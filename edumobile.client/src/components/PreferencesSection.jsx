import React from "react";
import Tooltip from "./Tooltip";

const PreferencesSection = ({ preferences, handlePreferencesChange }) => {
    const handleColorChange = (e) => {
        const { name, value } = e.target;
        handlePreferencesChange({
            corporateColors: { ...preferences.corporateColors, [name]: value },
        });
    };

    const handleFontChange = (e) => {
        handlePreferencesChange({ corporateFont: e.target.value });
    };

    const handleTechnologyChange = (index) => {
        const updatedTechnologies = [...preferences.allowedTechnologies];
        updatedTechnologies[index].checked = !updatedTechnologies[index].checked;
        handlePreferencesChange({ allowedTechnologies: updatedTechnologies });
    };

    const handleCustomTechnologyChange = (e) => {
        handlePreferencesChange({ customTechnology: e.target.value });
    };

    const addCustomTechnology = () => {
        if (preferences.customTechnology.trim()) {
            handlePreferencesChange({
                customTechnologies: [
                    ...preferences.customTechnologies,
                    preferences.customTechnology.trim(),
                ],
                customTechnology: "",
            });
        }
    };

    const removeCustomTechnology = (index) => {
        const updatedCustomTechnologies = preferences.customTechnologies.filter((_, i) => i !== index);
        handlePreferencesChange({ customTechnologies: updatedCustomTechnologies });
    };

    return (
        <fieldset>
            <section className="preferences-section">
                <div className="preferences-header">
                    <h3>Restricciones y preferencias</h3>
                </div>

                {/* Colores corporativos */}
                <div className="preferences-colors">
                    <label htmlFor="primary">Color primario:</label>
                    <input
                        type="color"
                        id="primary"
                        name="primary"
                        value={preferences.corporateColors.primary}
                        onChange={handleColorChange}
                    />
                    <label htmlFor="secondary1">Color secundario 1:</label>
                    <input
                        type="color"
                        id="secondary1"
                        name="secondary1"
                        value={preferences.corporateColors.secondary1}
                        onChange={handleColorChange}
                    />
                    <label htmlFor="secondary2">Color secundario 2:</label>
                    <input
                        type="color"
                        id="secondary2"
                        name="secondary2"
                        value={preferences.corporateColors.secondary2}
                        onChange={handleColorChange}
                    />
                </div>

                {/* Tipografías corporativas */}
                <div className="preferences-font">
                    <label htmlFor="font">Tipografías corporativas:</label>
                    <input
                        type="text"
                        id="font"
                        name="font"
                        placeholder="Tipografías"
                        value={preferences.corporateFont}
                        onChange={handleFontChange}
                    />
                </div>

                {/* Tecnologías permitidas */}
                <div className="preferences-technologies">
                    <h4>Tecnologías permitidas:</h4>
                    {preferences.allowedTechnologies.map((tech, index) => (
                        <label key={tech.name}>
                            <input
                                type="checkbox"
                                name={tech.name}
                                checked={tech.checked}
                                onChange={() => handleTechnologyChange(index)}
                            />
                            {tech.label}
                            <Tooltip description={tech.description} />
                        </label>
                    ))}

                    {/* Campo para agregar tecnologías personalizadas */}
                    <div className="custom-technologies">
                        <label htmlFor="customTechnology">Otras tecnologías:</label>
                        <input
                            type="text"
                            id="customTechnology"
                            value={preferences.customTechnology}
                            onChange={handleCustomTechnologyChange}
                            placeholder="Escribe una nueva tecnología"
                        />
                        <button type="button" onClick={addCustomTechnology}>
                            Agregar
                        </button>
                    </div>

                    {/* Lista de tecnologías personalizadas */}
                    {preferences.customTechnologies.length > 0 && (
                        <ul className="custom-technologies-list">
                            {preferences.customTechnologies.map((tech, index) => (
                                <li key={index}>
                                    {tech}
                                    <button type="button" onClick={() => removeCustomTechnology(index)}>
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </fieldset>
    );
};

export default PreferencesSection;
