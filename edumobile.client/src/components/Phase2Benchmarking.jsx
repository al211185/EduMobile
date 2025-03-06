import React, { useState } from "react";

const Phase2Benchmarking = ({ data, onNext, onPrev }) => {
    const [benchmarkData, setBenchmarkData] = useState({
        benchmarkObjective: data?.benchmarkObjective || "",
        benchmarkSector: data?.benchmarkSector || "",
        benchmarkResponsable: data?.benchmarkResponsable || "",
        competitor1Name: data?.competitor1Name || "",
        competitor1ScreenshotPath: data?.competitor1ScreenshotPath || "",
        competitor1Url: data?.competitor1Url || "",
        competitor1Positives: data?.competitor1Positives || "",
        competitor1Negatives: data?.competitor1Negatives || "",
        competitor1EaseOfUse: data?.competitor1EaseOfUse || 3,
        competitor1Difficulties: data?.competitor1Difficulties || "",
        competitor1UsefulFeatures: data?.competitor1UsefulFeatures || "",
        competitor2Name: data?.competitor2Name || "",
        competitor2ScreenshotPath: data?.competitor2ScreenshotPath || "",
        competitor2Url: data?.competitor2Url || "",
        competitor2Positives: data?.competitor2Positives || "",
        competitor2Negatives: data?.competitor2Negatives || "",
        competitor2EaseOfUse: data?.competitor2EaseOfUse || 3,
        competitor2Difficulties: data?.competitor2Difficulties || "",
        competitor2UsefulFeatures: data?.competitor2UsefulFeatures || "",
        benchmarkFindings: data?.benchmarkFindings || "",
        benchmarkImprovements: data?.benchmarkImprovements || "",
        benchmarkUsedSmartphoneForScreens: data?.benchmarkUsedSmartphoneForScreens || false,
        benchmarkUsedSmartphoneForComparative: data?.benchmarkUsedSmartphoneForComparative || false,
        benchmarkConsideredMobileFirst: data?.benchmarkConsideredMobileFirst || false,
    });

    // Manejo de cambios para inputs y checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBenchmarkData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Manejo de archivos (capturas de pantalla)
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            // Aquí implementarías la lógica para subir el archivo y obtener su URL.
            // Por ahora, se asigna el nombre del archivo.
            setBenchmarkData((prev) => ({ ...prev, [fieldName]: file.name }));
        }
    };

    // Función para enviar datos de Benchmarking al componente padre
    const handleSubmit = () => {
        // Validación básica de campos obligatorios de la Introducción
        if (
            !benchmarkData.benchmarkObjective.trim() ||
            !benchmarkData.benchmarkSector.trim() ||
            !benchmarkData.benchmarkResponsable.trim()
        ) {
            alert("Completa los campos obligatorios de la sección de Introducción.");
            return;
        }
        onNext(benchmarkData);
    };

    return (
        <div className="phase-container">
            <h2>Fase 2: Benchmarking</h2>
            <fieldset>
                <legend>
                    <h3>Introducción</h3>
                </legend>
                <label htmlFor="benchmarkObjective">Objetivo del análisis:</label>
                <textarea
                    name="benchmarkObjective"
                    id="benchmarkObjective"
                    value={benchmarkData.benchmarkObjective}
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="benchmarkSector">Descripción general del sector:</label>
                <textarea
                    name="benchmarkSector"
                    id="benchmarkSector"
                    placeholder="Breve descripción del sector de mercado"
                    value={benchmarkData.benchmarkSector}
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="benchmarkResponsable">Responsable del proyecto:</label>
                <input
                    type="text"
                    id="benchmarkResponsable"
                    name="benchmarkResponsable"
                    value={benchmarkData.benchmarkResponsable}
                    onChange={handleChange}
                />
            </fieldset>

            <fieldset>
                <legend>
                    <h3>Competidores</h3>
                </legend>
                <div className="competitor">
                    <h4>Competidor 1</h4>
                    <label htmlFor="competitor1Name">Nombre de la empresa:</label>
                    <input
                        type="text"
                        id="competitor1Name"
                        name="competitor1Name"
                        value={benchmarkData.competitor1Name}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor1ScreenshotPath">Captura de pantalla:</label>
                    <input
                        type="file"
                        id="competitor1ScreenshotPath"
                        onChange={(e) => handleFileChange(e, "competitor1ScreenshotPath")}
                    />
                    <label htmlFor="competitor1Url">URL del sitio web:</label>
                    <input
                        type="url"
                        id="competitor1Url"
                        name="competitor1Url"
                        value={benchmarkData.competitor1Url}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor1Positives">Aspectos positivos:</label>
                    <textarea
                        id="competitor1Positives"
                        name="competitor1Positives"
                        value={benchmarkData.competitor1Positives}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor1Negatives">Aspectos negativos:</label>
                    <textarea
                        id="competitor1Negatives"
                        name="competitor1Negatives"
                        value={benchmarkData.competitor1Negatives}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor1EaseOfUse">Facilidad de uso (1-5):</label>
                    <input
                        type="range"
                        id="competitor1EaseOfUse"
                        name="competitor1EaseOfUse"
                        min="1"
                        max="5"
                        value={benchmarkData.competitor1EaseOfUse}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor1Difficulties">Dificultades encontradas:</label>
                    <textarea
                        id="competitor1Difficulties"
                        name="competitor1Difficulties"
                        value={benchmarkData.competitor1Difficulties}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor1UsefulFeatures">Características útiles:</label>
                    <textarea
                        id="competitor1UsefulFeatures"
                        name="competitor1UsefulFeatures"
                        value={benchmarkData.competitor1UsefulFeatures}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="competitor">
                    <h4>Competidor 2</h4>
                    <label htmlFor="competitor2Name">Nombre de la empresa:</label>
                    <input
                        type="text"
                        id="competitor2Name"
                        name="competitor2Name"
                        value={benchmarkData.competitor2Name}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor2ScreenshotPath">Captura de pantalla:</label>
                    <input
                        type="file"
                        id="competitor2ScreenshotPath"
                        onChange={(e) => handleFileChange(e, "competitor2ScreenshotPath")}
                    />
                    <label htmlFor="competitor2Url">URL del sitio web:</label>
                    <input
                        type="url"
                        id="competitor2Url"
                        name="competitor2Url"
                        value={benchmarkData.competitor2Url}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor2Positives">Aspectos positivos:</label>
                    <textarea
                        id="competitor2Positives"
                        name="competitor2Positives"
                        value={benchmarkData.competitor2Positives}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor2Negatives">Aspectos negativos:</label>
                    <textarea
                        id="competitor2Negatives"
                        name="competitor2Negatives"
                        value={benchmarkData.competitor2Negatives}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor2EaseOfUse">Facilidad de uso (1-5):</label>
                    <input
                        type="range"
                        id="competitor2EaseOfUse"
                        name="competitor2EaseOfUse"
                        min="1"
                        max="5"
                        value={benchmarkData.competitor2EaseOfUse}
                        onChange={handleChange}
                    />
                    <label htmlFor="competitor2Difficulties">Dificultades encontradas:</label>
                    <textarea
                        id="competitor2Difficulties"
                        name="competitor2Difficulties"
                        value={benchmarkData.competitor2Difficulties}
                        onChange={handleChange}
                    ></textarea>
                    <label htmlFor="competitor2UsefulFeatures">Características útiles:</label>
                    <textarea
                        id="competitor2UsefulFeatures"
                        name="competitor2UsefulFeatures"
                        value={benchmarkData.competitor2UsefulFeatures}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h3>Conclusiones</h3>
                </legend>
                <label htmlFor="findings">Principales hallazgos:</label>
                <textarea
                    id="findings"
                    name="benchmarkFindings"
                    value={benchmarkData.benchmarkFindings}
                    onChange={handleChange}
                ></textarea>
                <label htmlFor="improvements">Oportunidades de mejora:</label>
                <textarea
                    id="improvements"
                    name="benchmarkImprovements"
                    value={benchmarkData.benchmarkImprovements}
                    onChange={handleChange}
                ></textarea>
            </fieldset>

            <fieldset>
                <legend>
                    <h3>Ejercicio reflexivo</h3>
                </legend>
                <p>Marca las casillas si se realizaron las actividades según lo esperado:</p>
                <label>
                    <input
                        type="checkbox"
                        name="benchmarkUsedSmartphoneForScreens"
                        checked={benchmarkData.benchmarkUsedSmartphoneForScreens}
                        onChange={handleChange}
                    />
                    ¿La captura de pantalla se realizó usando un teléfono inteligente?
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="benchmarkUsedSmartphoneForComparative"
                        checked={benchmarkData.benchmarkUsedSmartphoneForComparative}
                        onChange={handleChange}
                    />
                    ¿El análisis comparativo se realizó usando un teléfono inteligente?
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        name="benchmarkConsideredMobileFirst"
                        checked={benchmarkData.benchmarkConsideredMobileFirst}
                        onChange={handleChange}
                    />
                    ¿Se consideró el enfoque Mobile First en las oportunidades de mejora?
                </label>
            </fieldset>

            <div className="phase-navigation">
                <button onClick={onPrev}>Anterior</button>
                <button onClick={handleSubmit}>Guardar y Siguiente</button>
            </div>
        </div>
    );
};

export default Phase2Benchmarking;
