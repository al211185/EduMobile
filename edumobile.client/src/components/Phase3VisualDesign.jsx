import { useState, useEffect, useMemo, useCallback } from "react";
import ImageDropZone from "./ImageDropZone";
import useAutoSave from "../hooks/useAutoSave";
import usePropagateDataChange from "../hooks/usePropagateDataChange";
import { buildPreviewUrl, extractFilePath } from "../utils/fileHelpers";

const Phase3VisualDesign = ({ data, onNext, readOnly = false, onAutoSave, onDataChange }) => {
    const FILE_UPLOAD_ENDPOINT = "/api/Files/upload";
    const FILE_IMAGE_ENDPOINT = "/api/Files/image";

    const getPreviewUrl = useCallback(
        (filePath) => buildPreviewUrl(FILE_IMAGE_ENDPOINT, filePath),
        [FILE_IMAGE_ENDPOINT]
    );

    const initialState = useMemo(
        () => ({
            visualDesignFilePath: data?.visualDesignFilePath || "",
            visualDesignPreviewUrl: data?.visualDesignFilePath
                ? getPreviewUrl(data.visualDesignFilePath)
                : "",
            areVisualElementsBeneficialForSmallScreens:
                data?.areVisualElementsBeneficialForSmallScreens || false,
            doesDesignPrioritizeContentForMobile:
                data?.doesDesignPrioritizeContentForMobile || false,
            doesDesignImproveLoadingSpeed: data?.doesDesignImproveLoadingSpeed || false,
        }),
        [data, getPreviewUrl]
    );

    const initialSnapshot = useMemo(() => JSON.stringify(initialState), [initialState]);

    const [formData, setFormData] = useState(initialState);

    // Carga inicial si vienen datos preexistentes
    usePropagateDataChange(formData, onDataChange, initialSnapshot);

    const handleInputChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : prev[name],
        }));
    };

    useEffect(() => {
        if (onDataChange) {
            onDataChange(formData);
        }
    }, [formData, onDataChange]);

    const autoSaveEnabled = !readOnly && typeof onAutoSave === "function";

    const buildPayload = useCallback(() => formData, [formData]);

    const { isSaving, saveNow } = useAutoSave({
        data: formData,
        buildPayload,
        onSave: onAutoSave || (async () => true),
        delay: 2000,
        enabled: autoSaveEnabled,
        initialSnapshot,
    });

    const handleFileChange = async (file) => {
        if (readOnly) {
            return;
        }
        if (!file) {
            // Reset
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: "",
                visualDesignPreviewUrl: "",
            }));
            return;
        }

        // Vista previa local inmediata
        const previousPath = formData.visualDesignFilePath;
        const previousPreview = formData.visualDesignPreviewUrl;
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            visualDesignPreviewUrl: localUrl,
        }));

        // Subida al servidor
        const payload = new FormData();
        payload.append("file", file);
        const query = previousPath ? `?oldFilePath=${encodeURIComponent(previousPath)}` : "";

        try {
            const res = await fetch(`${FILE_UPLOAD_ENDPOINT}${query}`, {
                method: "POST",
                body: payload,
                credentials: "include",
            });
            if (!res.ok) {
                const errorMessage = await res
                    .json()
                    .then((error) => error.message || "Error al subir el archivo. Inténtalo nuevamente.")
                    .catch(() => "Error al subir el archivo. Inténtalo nuevamente.");
                throw new Error(errorMessage);
            }
            const result = await res.json();
            const serverPath = extractFilePath(result);
            if (!serverPath) {
                throw new Error("No se pudo obtener la ruta del archivo.");
            }
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: serverPath,
                visualDesignPreviewUrl: getPreviewUrl(serverPath),
            }));
        } catch (err) {
            console.error(err);
            alert(err.message);
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: previousPath,
                visualDesignPreviewUrl: previousPreview,
            }));
        } finally {
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.visualDesignFilePath) {
            alert("Por favor, sube el diseño visual antes de continuar.");
            return;
        }
        if (autoSaveEnabled) {
            const saved = await saveNow({ showAlerts: true, force: true });
            if (!saved) {
                return;
            }
        }
        onNext(formData);
    };

    return (
        <div className="w-full flex flex-col flex-1 rounded-2xl overflow-hidden">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit();
                }}
                className="flex flex-col h-full"
            >
                {/* Contenido con scroll */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 3: Diseño Visual
                        </legend>
                        <p className="text-gray-700">
                            Define el aspecto estético y gráfico de tu sitio web. Sube el diseño visual y responde las preguntas para completar esta fase.
                        </p>
                    </fieldset>

                    {/* Upload de imagen */}
                    <ImageDropZone
                        id="visual-design-upload"
                        label="Sube el diseño visual:"
                        previewUrl={formData.visualDesignPreviewUrl}
                        onFileSelected={handleFileChange}
                        disabled={readOnly}
                        emptyMessage={
                            readOnly
                                ? "No se ha cargado ninguna imagen."
                                : "No se ha seleccionado ninguna imagen."
                        }
                    />

                    {/* Checklist */}
                    <fieldset className="rounded-2xl">
                        <div className="mt-4 space-y-2">
                        
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="areVisualElementsBeneficialForSmallScreens"
                                    checked={formData.areVisualElementsBeneficialForSmallScreens}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿Los elementos visuales contribuyen a una buena experiencia en pantallas pequeñas?
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="doesDesignPrioritizeContentForMobile"
                                    checked={formData.doesDesignPrioritizeContentForMobile}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿El diseño visual prioriza el contenido para dispositivos móviles?
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="doesDesignImproveLoadingSpeed"
                                    checked={formData.doesDesignImproveLoadingSpeed}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿El diseño visual ayuda a mejorar la velocidad de carga en dispositivos móviles?
                                </span>
                            </label>
                        </div>
                    </fieldset>
                </div>

                {/* Botón sticky al fondo */}
                <div className="sticky bottom-0 p-4">
                    <button
                        type="submit"
                        disabled={!formData.visualDesignFilePath || isSaving}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.visualDesignFilePath && !isSaving
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {isSaving ? "Guardando..." : "Completar Fase 3"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase3VisualDesign;
