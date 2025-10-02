import React, { useState } from "react";
import { buildPreviewUrl, extractFilePath } from "../utils/fileHelpers";

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

// Define el array de preguntas reflexivas con valores y etiquetas correctas
const reflectiveQuestions = [
    {
        value: "captura_telefono",
        label:
            "¿La fase de competidores, la captura de pantalla se realizó utilizando un teléfono inteligente?"
    },
    {
        value: "analisis_telefono",
        label:
            "¿La fase del análisis comparativo se realizó utilizando un teléfono inteligente?"
    },
    {
        value: "diseño_mobile_first",
        label:
            "¿En las oportunidades de mejora, se consideró el diseño Mobile First?"
    }
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



    return {
        introduction: {
            analysisObjective: data.benchmarkObjective || "",
            sectorDescription: data.benchmarkSector || "",
        },
        competitors: [
            {
                companyName: data.competitor1Name || "",
                screenshot: data.competitor1ScreenshotPath
                    ? buildPreviewUrl("/api/Files/image", data.competitor1ScreenshotPath)
                    : "",
                url: data.competitor1Url || "",
                positives: data.competitor1Positives || "",
                negatives: data.competitor1Negatives || "",
            },
            {
                companyName: data.competitor2Name || "",
                screenshot: data.competitor2ScreenshotPath
                    ? buildPreviewUrl("/api/Files/image", data.competitor2ScreenshotPath)
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

const Phase2Benchmarking = ({ data, onSave }) => {
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
            const serverPath = extractFilePath(result);
            if (serverPath) {
                const imageUrl = buildPreviewUrl("/api/Files/image", serverPath);
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
            const serverPath = extractFilePath(result);
            if (serverPath) {
                const imageUrl = buildPreviewUrl("/api/Files/image", serverPath);
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

        onSave(updatedData);
    };

    return (
        <div className="w-full flex flex-col flex-1 rounded-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                {/* Introducción */}
                    <fieldset className="rounded-2xl">
                    <legend className="text-xl font-bold text-[#4F46E5] mb-2 px-2">
                        Introducción (Fase 2)
                    </legend>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col space-y-1">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                Objetivo del análisis:
                                </label>
                            <textarea
                                name="analysisObjective"
                                value={formData.introduction.analysisObjective}
                                onChange={handleIntroChange}
                                className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            ></textarea>
                            </div>
                            <div className="flex flex-col space-y-1">
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                Descripción general del sector:
                            </label>
                            <textarea
                                name="sectorDescription"
                                value={formData.introduction.sectorDescription}
                                onChange={handleIntroChange}
                                className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            ></textarea>
                        </div>
                    </div>
                </fieldset>

                {/* Competidores */}
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                        Competidores
                    </legend>
                    {/* Competidor 1 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#4F46E5] mb-2">Competidor 1</h3>
                        <div className="flex flex-col space-y-1">
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                value={formData.competitors[0].companyName}
                                onChange={(e) =>
                                    handleCompetitorChange(0, "companyName", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                Subir imagen (Captura):
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChangeCompetitor1}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {formData.competitors[0].screenshot && (
                                <div className="mt-2">
                                    <img
                                        src={formData.competitors[0].screenshot}
                                        alt="Screenshot Competidor 1"
                                        className="max-w-xs"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                URL:
                            </label>
                            <input
                                type="url"
                                value={formData.competitors[0].url}
                                onChange={(e) =>
                                    handleCompetitorChange(0, "url", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                Aspectos positivos:
                            </label>
                            <textarea
                                value={formData.competitors[0].positives}
                                onChange={(e) =>
                                    handleCompetitorChange(0, "positives", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div>
                            <label className="flex items-center space-x-2 text-[#64748B]">
                                Aspectos negativos:
                            </label>
                            <textarea
                                value={formData.competitors[0].negatives}
                                onChange={(e) =>
                                    handleCompetitorChange(0, "negatives", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                    </div>

                    {/* Competidor 2 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#4F46E5] mb-4">Competidor 2</h3>
                            <div className="flex flex-col space-y-1">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                value={formData.competitors[1].companyName}
                                onChange={(e) =>
                                    handleCompetitorChange(1, "companyName", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                Subir imagen (Captura):
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChangeCompetitor2}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {formData.competitors[1].screenshot && (
                                <div className="mt-2">
                                    <img
                                        src={formData.competitors[1].screenshot}
                                        alt="Screenshot Competidor 2"
                                        className="max-w-xs"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                URL:
                            </label>
                            <input
                                type="url"
                                value={formData.competitors[1].url}
                                onChange={(e) =>
                                    handleCompetitorChange(1, "url", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                Aspectos positivos:
                            </label>
                            <textarea
                                value={formData.competitors[1].positives}
                                onChange={(e) =>
                                    handleCompetitorChange(1, "positives", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div>
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                Aspectos negativos:
                            </label>
                            <textarea
                                value={formData.competitors[1].negatives}
                                onChange={(e) =>
                                    handleCompetitorChange(1, "negatives", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Análisis comparativo */}
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                        Análisis comparativo
                    </legend>
                    {/* Competidor 1 */}
                    <div className="mb-6">
                            <h3 className="text-lg font-semibold text-[#4F46E5] mb-2">
                            Competidor 1
                        </h3>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Facilidad de uso (1-5):</strong>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={formData.analysis[0].easeOfUse}
                                onChange={(e) =>
                                    handleAnalysisChange(0, "easeOfUse", e.target.value)
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Dificultades:</strong>
                            </label>
                            <textarea
                                value={formData.analysis[0].difficulty}
                                onChange={(e) =>
                                    handleAnalysisChange(0, "difficulty", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div>
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Características útiles (Comp1):</strong>
                            </label>
                            {usefulFeaturesOptions.map((opt) => (
                                <label key={opt.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.analysis[0].usefulFeatures.includes(opt.value)}
                                        onChange={() => handleUsefulFeaturesChange(0, opt.value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Competidor 2 */}
                    <div>
                            <h3 className="text-lg font-semibold text-[#4F46E5] mb-2">
                            Competidor 2
                        </h3>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Facilidad de uso (1-5):</strong>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={formData.analysis[1].easeOfUse}
                                onChange={(e) =>
                                    handleAnalysisChange(1, "easeOfUse", e.target.value)
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="mb-2">
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Dificultades:</strong>
                            </label>
                            <textarea
                                value={formData.analysis[1].difficulty}
                                onChange={(e) =>
                                    handleAnalysisChange(1, "difficulty", e.target.value)
                                }
                                    className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                            />
                        </div>
                        <div>
                                <label className="flex items-center space-x-2 text-[#64748B]">
                                    <strong>Características útiles (Comp2):</strong>
                            </label>
                            {usefulFeaturesOptions.map((opt) => (
                                <label key={opt.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.analysis[1].usefulFeatures.includes(opt.value)}
                                        onChange={() => handleUsefulFeaturesChange(1, opt.value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </fieldset>

                {/* Conclusiones */}
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                        Conclusiones
                    </legend>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            Hallazgos:
                        </label>
                        <textarea
                            name="findings"
                            value={formData.conclusions.findings}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    conclusions: { ...prev.conclusions, findings: e.target.value },
                                }))
                            }
                                className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Oportunidades de mejora:
                        </label>
                        <textarea
                            name="improvements"
                            value={formData.conclusions.improvements}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    conclusions: { ...prev.conclusions, improvements: e.target.value },
                                }))
                            }
                                className="w-full bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                        />
                    </div>
                </fieldset>

                {/* Ejercicio reflexivo */}
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                        Ejercicio reflexivo (Fase 2)
                    </legend>
                    <p className="text-gray-700">
                        Responde a las siguientes preguntas marcando en el cuadro.
                    </p>
                        <div className="mt-4 space-y-2">
                        {reflectiveQuestions.map((question) => (
                            <label key={question.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={question.value}
                                    checked={formData.reflectiveAnswers.includes(question.value)}
                                    onChange={() => handleReflectiveChange(question.value)}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">{question.label}</span>
                            </label>
                        ))}
                    </div>
                    </fieldset>
                </div>

                {/* Contenedor fijo para los botones de navegación */}
                <div className="sticky bottom-0 p-4">
                    <button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#64748B] text-white font-semibold py-2 rounded transition-colors">
                        Guardar
                    </button>
                </div>
            </form>

        </div>
    );
};

export default Phase2Benchmarking;
