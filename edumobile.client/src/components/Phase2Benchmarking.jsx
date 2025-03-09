import React, { useState } from "react";

// Opciones para los checkbox de características útiles
const usefulFeaturesOptions = [
    { value: "navegacion_clara", label: "Navegación clara" },
    { value: "busqueda_intuitiva", label: "Búsqueda intuitiva" },
    { value: "contraste_adecuado", label: "Contraste adecuado" },
    { value: "iconos_faciles", label: "Iconos y botones fáciles de entender" },
    { value: "tipografia_legible", label: "Tipografía legible" },
    { value: "diseno_atractivo", label: "Diseño atractivo" },
    { value: "modo_oscuro", label: "Modo oscuro disponible" },
    { value: "integracion_redes", label: "Integración con redes sociales" },
    { value: "colores_identidad", label: "Colores que reflejan la identidad de la marca" },
    { value: "tonos_agradables", label: "Tonos suaves y agradables para la vista" },
];

// Función para parsear la data de la fase 2
function parsePhase2Data(data) {
    if (!data) {
        return {
            introduction: { analysisObjective: "", sectorDescription: "" },
            competitors: [
                { companyName: "", screenshot: "", url: "", positives: "", negatives: "" },
                { companyName: "", screenshot: "", url: "", positives: "", negatives: "" },
            ],
            analysis: [
                { easeOfUse: 3, difficulty: "", usefulFeatures: [] },
                { easeOfUse: 3, difficulty: "", usefulFeatures: [] },
            ],
            conclusions: { findings: "", improvements: "" },
            reflectiveAnswers: [],
        };
    }

    // Para construir la URL usamos el endpoint centralizado del FilesController.
    // Ajusta baseURL si es necesario (por ejemplo, "https://localhost:5001")
    const baseURL = "";
    function buildImageUrl(path) {
        if (!path) return "";
        const fileName = path.split("/").pop();
        return `${baseURL}/api/Files/image/${fileName}`;
    }

    return {
        introduction: {
            analysisObjective: data.benchmarkObjective || "",
            sectorDescription: data.benchmarkSector || "",
        },
        competitors: [
            {
                companyName: data.competitor1Name || "",
                screenshot: data.competitor1ScreenshotPath
                    ? buildImageUrl(data.competitor1ScreenshotPath)
                    : "",
                url: data.competitor1Url || "",
                positives: data.competitor1Positives || "",
                negatives: data.competitor1Negatives || "",
            },
            {
                companyName: data.competitor2Name || "",
                screenshot: data.competitor2ScreenshotPath
                    ? buildImageUrl(data.competitor2ScreenshotPath)
                    : "",
                url: data.competitor2Url || "",
                positives: data.competitor2Positives || "",
                negatives: data.competitor2Negatives || "",
            },
        ],
        analysis: [
            {
                easeOfUse: data.competitor1EaseOfUse || 3,
                difficulty: data.competitor1Difficulties || "",
                usefulFeatures: data.competitor1UsefulFeatures
                    ? data.competitor1UsefulFeatures
                        .split(";")
                        .map(x => x.trim())
                        .filter(x => x !== "")
                    : [],
            },
            {
                easeOfUse: data.competitor2EaseOfUse || 3,
                difficulty: data.competitor2Difficulties || "",
                usefulFeatures: data.competitor2UsefulFeatures
                    ? data.competitor2UsefulFeatures
                        .split(";")
                        .map(x => x.trim())
                        .filter(x => x !== "")
                    : [],
            },
        ],
        conclusions: {
            findings: data.benchmarkFindings || "",
            improvements: data.benchmarkImprovements || "",
        },
        reflectiveAnswers: data.reflectionPhase2
            ? data.reflectionPhase2.split(";").map(x => x.trim()).filter(x => x !== "")
            : [],
    };
}

const Phase2Benchmarking = ({ data, onNext, onPrev }) => {
    // Inicializa el estado solo una vez al montar
    const [formData, setFormData] = useState(() => parsePhase2Data(data));

    // --- SUBIDA DE IMÁGENES ---
    // Función auxiliar para subir un archivo al endpoint centralizado
    const uploadImage = async (file, oldFilePath = "") => {
        const fd = new FormData();
        fd.append("file", file);
        // Si oldFilePath se envía, el backend podrá eliminar la imagen antigua
        const query = oldFilePath ? `?oldFilePath=${encodeURIComponent(oldFilePath)}` : "";
        const response = await fetch(`/api/Files/upload${query}`, {
            method: "POST",
            body: fd,
        });
        if (!response.ok) {
            throw new Error("Error al subir el archivo.");
        }
        const result = await response.json();
        return result; // Se espera { filePath, FileName, ... }
    };

    // Manejador para subir imagen de Competidor 1
    const handleFileChangeCompetitor1 = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFormData((prev) => {
                const comps = [...prev.competitors];
                comps[0].screenshot = "";
                return { ...prev, competitors: comps };
            });
            return;
        }
        try {
            // Si ya existe una imagen, extrae la ruta relativa para enviarla como oldFilePath
            const oldFilePath =
                formData.competitors[0].screenshot &&
                    formData.competitors[0].screenshot.split("/").pop()
                    ? `/uploads/${formData.competitors[0].screenshot.split("/").pop()}`
                    : "";
            const result = await uploadImage(file, oldFilePath);
            if (result.filePath) {
                const fileName = result.FileName || result.fileName;
                const imageUrl = `/api/Files/image/${fileName}`;
                setFormData((prev) => {
                    const comps = [...prev.competitors];
                    comps[0].screenshot = imageUrl;
                    return { ...prev, competitors: comps };
                });
            }
        } catch (error) {
            console.error("Error al subir archivo para Competidor 1:", error);
            alert("Error al subir archivo para Competidor 1");
        }
    };

    // Manejador para subir imagen de Competidor 2
    const handleFileChangeCompetitor2 = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFormData((prev) => {
                const comps = [...prev.competitors];
                comps[1].screenshot = "";
                return { ...prev, competitors: comps };
            });
            return;
        }
        try {
            const oldFilePath =
                formData.competitors[1].screenshot &&
                    formData.competitors[1].screenshot.split("/").pop()
                    ? `/uploads/${formData.competitors[1].screenshot.split("/").pop()}`
                    : "";
            const result = await uploadImage(file, oldFilePath);
            if (result.filePath) {
                const fileName = result.FileName || result.fileName;
                const imageUrl = `/api/Files/image/${fileName}`;
                setFormData((prev) => {
                    const comps = [...prev.competitors];
                    comps[1].screenshot = imageUrl;
                    return { ...prev, competitors: comps };
                });
            }
        } catch (error) {
            console.error("Error al subir archivo para Competidor 2:", error);
            alert("Error al subir archivo para Competidor 2");
        }
    };

    // --- MANEJO DE CAMPOS ---
    const handleIntroChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            introduction: { ...prev.introduction, [name]: value },
        }));
    };

    const handleCompetitorChange = (index, field, value) => {
        setFormData((prev) => {
            const comps = [...prev.competitors];
            comps[index] = { ...comps[index], [field]: value };
            return { ...prev, competitors: comps };
        });
    };

    const handleAnalysisChange = (index, field, value) => {
        setFormData((prev) => {
            const analysisCopy = [...prev.analysis];
            analysisCopy[index] = { ...analysisCopy[index], [field]: value };
            return { ...prev, analysis: analysisCopy };
        });
    };

    const handleUsefulFeaturesChange = (index, featureValue) => {
        setFormData((prev) => {
            const newAnalysis = [...prev.analysis];
            const current = newAnalysis[index].usefulFeatures;
            let updated;
            if (current.includes(featureValue)) {
                updated = current.filter((x) => x !== featureValue);
            } else {
                updated = [...current, featureValue];
            }
            newAnalysis[index].usefulFeatures = updated;
            return { ...prev, analysis: newAnalysis };
        });
    };

    const handleConclusionsChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            conclusions: { ...prev.conclusions, [name]: value },
        }));
    };

    const handleReflectiveChange = (value) => {
        setFormData((prev) => {
            const current = prev.reflectiveAnswers;
            return current.includes(value)
                ? { ...prev, reflectiveAnswers: current.filter((v) => v !== value) }
                : { ...prev, reflectiveAnswers: [...current, value] };
        });
    };

    // --- AL ENVIAR ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.introduction.analysisObjective.trim() ||
            !formData.introduction.sectorDescription.trim()
        ) {
            alert("Completa los campos obligatorios de la Introducción (Fase 2).");
            return;
        }

        // Función para revertir la URL de vista previa a la ruta relativa para guardar en la BD
        const revertImageUrl = (imageUrl) => {
            if (!imageUrl) return "";
            const fileName = imageUrl.split("/").pop();
            return `/uploads/${fileName}`;
        };

        const updatedData = {
            BenchmarkObjective: formData.introduction.analysisObjective,
            BenchmarkSector: formData.introduction.sectorDescription,
            // Competidor 1
            Competitor1Name: formData.competitors[0].companyName,
            Competitor1ScreenshotPath: revertImageUrl(formData.competitors[0].screenshot),
            Competitor1Url: formData.competitors[0].url,
            Competitor1Positives: formData.competitors[0].positives,
            Competitor1Negatives: formData.competitors[0].negatives,
            Competitor1EaseOfUse: Number(formData.analysis[0].easeOfUse),
            Competitor1Difficulties: formData.analysis[0].difficulty,
            Competitor1UsefulFeatures: formData.analysis[0].usefulFeatures.join(";"),
            // Competidor 2
            Competitor2Name: formData.competitors[1].companyName,
            Competitor2ScreenshotPath: revertImageUrl(formData.competitors[1].screenshot),
            Competitor2Url: formData.competitors[1].url,
            Competitor2Positives: formData.competitors[1].positives,
            Competitor2Negatives: formData.competitors[1].negatives,
            Competitor2EaseOfUse: Number(formData.analysis[1].easeOfUse),
            Competitor2Difficulties: formData.analysis[1].difficulty,
            Competitor2UsefulFeatures: formData.analysis[1].usefulFeatures.join(";"),
            // Conclusiones
            BenchmarkFindings: formData.conclusions.findings,
            BenchmarkImprovements: formData.conclusions.improvements,
            // Reflexivos Fase 2
            ReflectionPhase2: formData.reflectiveAnswers.join(";"),
        };

        onNext(updatedData);
    };

    return (
        <div className="project-planning-container">
            <form onSubmit={handleSubmit}>
                {/* Introducción */}
                <fieldset>
                    <legend>
                        <h2>Introducción (Fase 2)</h2>
                    </legend>
                    <label>Objetivo del análisis:</label>
                    <textarea
                        name="analysisObjective"
                        value={formData.introduction.analysisObjective}
                        onChange={handleIntroChange}
                    />
                    <label>Descripción general del sector:</label>
                    <textarea
                        name="sectorDescription"
                        value={formData.introduction.sectorDescription}
                        onChange={handleIntroChange}
                    />
                </fieldset>

                {/* Competidores */}
                <fieldset>
                    <legend>
                        <h2>Competidores</h2>
                    </legend>

                    {/* Competidor 1 */}
                    <h3>Competidor 1</h3>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.competitors[0].companyName}
                        onChange={(e) =>
                            handleCompetitorChange(0, "companyName", e.target.value)
                        }
                    />
                    <label>Subir imagen (Captura) Competidor 1:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChangeCompetitor1}
                    />
                    {formData.competitors[0].screenshot && (
                        <div style={{ margin: "5px 0" }}>
                            <img
                                src={formData.competitors[0].screenshot}
                                alt="Screenshot Competidor 1"
                                style={{ maxWidth: "200px" }}
                            />
                        </div>
                    )}
                    <label>URL:</label>
                    <input
                        type="url"
                        value={formData.competitors[0].url}
                        onChange={(e) => handleCompetitorChange(0, "url", e.target.value)}
                    />
                    <label>Aspectos positivos:</label>
                    <textarea
                        value={formData.competitors[0].positives}
                        onChange={(e) =>
                            handleCompetitorChange(0, "positives", e.target.value)
                        }
                    />
                    <label>Aspectos negativos:</label>
                    <textarea
                        value={formData.competitors[0].negatives}
                        onChange={(e) =>
                            handleCompetitorChange(0, "negatives", e.target.value)
                        }
                    />

                    {/* Competidor 2 */}
                    <h3>Competidor 2</h3>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.competitors[1].companyName}
                        onChange={(e) =>
                            handleCompetitorChange(1, "companyName", e.target.value)
                        }
                    />
                    <label>Subir imagen (Captura) Competidor 2:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChangeCompetitor2}
                    />
                    {formData.competitors[1].screenshot && (
                        <div style={{ margin: "5px 0" }}>
                            <img
                                src={formData.competitors[1].screenshot}
                                alt="Screenshot Competidor 2"
                                style={{ maxWidth: "200px" }}
                            />
                        </div>
                    )}
                    <label>URL:</label>
                    <input
                        type="url"
                        value={formData.competitors[1].url}
                        onChange={(e) =>
                            handleCompetitorChange(1, "url", e.target.value)
                        }
                    />
                    <label>Aspectos positivos:</label>
                    <textarea
                        value={formData.competitors[1].positives}
                        onChange={(e) =>
                            handleCompetitorChange(1, "positives", e.target.value)
                        }
                    />
                    <label>Aspectos negativos:</label>
                    <textarea
                        value={formData.competitors[1].negatives}
                        onChange={(e) =>
                            handleCompetitorChange(1, "negatives", e.target.value)
                        }
                    />
                </fieldset>

                {/* Análisis comparativo */}
                <fieldset>
                    <legend>
                        <h2>Análisis comparativo</h2>
                    </legend>
                    {/* Competidor 1 */}
                    <h3>Competidor 1</h3>
                    <label>Facilidad de uso (1-5):</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.analysis[0].easeOfUse}
                        onChange={(e) =>
                            handleAnalysisChange(0, "easeOfUse", e.target.value)
                        }
                    />
                    <label>Dificultades:</label>
                    <textarea
                        value={formData.analysis[0].difficulty}
                        onChange={(e) =>
                            handleAnalysisChange(0, "difficulty", e.target.value)
                        }
                    />
                    <label>Características útiles (Comp1):</label>
                    {usefulFeaturesOptions.map((opt) => (
                        <label key={opt.value} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={formData.analysis[0].usefulFeatures.includes(opt.value)}
                                onChange={() => handleUsefulFeaturesChange(0, opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}

                    {/* Competidor 2 */}
                    <h3>Competidor 2</h3>
                    <label>Facilidad de uso (1-5):</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.analysis[1].easeOfUse}
                        onChange={(e) =>
                            handleAnalysisChange(1, "easeOfUse", e.target.value)
                        }
                    />
                    <label>Dificultades:</label>
                    <textarea
                        value={formData.analysis[1].difficulty}
                        onChange={(e) =>
                            handleAnalysisChange(1, "difficulty", e.target.value)
                        }
                    />
                    <label>Características útiles (Comp2):</label>
                    {usefulFeaturesOptions.map((opt) => (
                        <label key={opt.value} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={formData.analysis[1].usefulFeatures.includes(opt.value)}
                                onChange={() => handleUsefulFeaturesChange(1, opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </fieldset>

                {/* Conclusiones */}
                <fieldset>
                    <legend>
                        <h2>Conclusiones</h2>
                    </legend>
                    <label>Hallazgos:</label>
                    <textarea
                        name="findings"
                        value={formData.conclusions.findings}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                conclusions: { ...prev.conclusions, findings: e.target.value },
                            }))
                        }
                    />
                    <label>Oportunidades de mejora:</label>
                    <textarea
                        name="improvements"
                        value={formData.conclusions.improvements}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                conclusions: { ...prev.conclusions, improvements: e.target.value },
                            }))
                        }
                    />
                </fieldset>

                {/* Reflexivos Fase 2 */}
                <fieldset>
                    <legend>
                        <h3>Ejercicio reflexivo (Fase 2)</h3>
                    </legend>
                    {["formularios_contacto", "formularios_registro", "conexion_bd"].map(
                        (item) => (
                            <label key={item} style={{ display: "block" }}>
                                <input
                                    type="checkbox"
                                    checked={formData.reflectiveAnswers.includes(item)}
                                    onChange={() => handleReflectiveChange(item)}
                                />
                                {item}
                            </label>
                        )
                    )}
                </fieldset>

                <div>
                    {onPrev && (
                        <button type="button" onClick={onPrev}>
                            Anterior
                        </button>
                    )}
                    <button type="submit">Completar Fase 2</button>
                </div>
            </form>
        </div>
    );
};

export default Phase2Benchmarking;
