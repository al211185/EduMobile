import { useState, useEffect, useMemo, useCallback } from "react";
import ImageDropZone from "./ImageDropZone";
import useAutoSave from "../hooks/useAutoSave";
import { buildPreviewUrl, extractFilePath } from "../utils/fileHelpers";

const Phase4ContentCreation = ({ data, onNext, readOnly = false, onAutoSave, onDataChange }) => {
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";

    const getPreviewUrl = useCallback(
        (filePath) => buildPreviewUrl(fileImageEndpoint, filePath),
        [fileImageEndpoint]
    );

    const initialState = useMemo(
        () => ({
            contentFilePath: data?.contentFilePath || "",
            contentPreviewUrl: data?.contentFilePath ? getPreviewUrl(data.contentFilePath) : "",
            areContentsRelevantForMobile: data?.areContentsRelevantForMobile || false,
            areContentsClearAndNavigable: data?.areContentsClearAndNavigable || false,
            doContentsGuideUserAttention: data?.doContentsGuideUserAttention || false,
        }),
        [data, getPreviewUrl]
    );

    const initialSnapshot = useMemo(() => JSON.stringify(initialState), [initialState]);

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        setFormData((prev) => {
            const prevSnapshot = JSON.stringify(prev);
            return prevSnapshot === initialSnapshot ? prev : initialState;
        });
    }, [initialState, initialSnapshot]);

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
            setFormData((prev) => ({
                ...prev,
                contentFilePath: "",
                contentPreviewUrl: "",
            }));
            return;
        }

        // preview local
        const previousPath = formData.contentFilePath;
        const previousPreview = formData.contentPreviewUrl;
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            contentPreviewUrl: localUrl,
        }));

        // subir al servidor
        const payload = new FormData();
        payload.append("file", file);
        const query = previousPath ? `?oldFilePath=${encodeURIComponent(previousPath)}` : "";

        try {
            const res = await fetch(`${fileUploadEndpoint}${query}`, {
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
                contentFilePath: serverPath,
                contentPreviewUrl: getPreviewUrl(serverPath),
            }));
        } catch (err) {
            console.error(err);
            alert(err.message);
            setFormData((prev) => ({
                ...prev,
                contentFilePath: previousPath,
                contentPreviewUrl: previousPreview,
            }));
        } finally {
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
            }
        }
    };

    const handleSubmit = async () => {
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
                {/* Scroll interno */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 4: Creación de Contenidos
                        </legend>
                        <p className="text-gray-700">
                            Organiza y crea el contenido necesario para tu sitio web, como textos, imágenes y otros elementos multimedia.
                        </p>
                    </fieldset>

                    {/* Upload */}
                    <ImageDropZone
                        id="content-creation-upload"
                        label="Sube el contenido visual:"
                        previewUrl={formData.contentPreviewUrl}
                        onFileSelected={handleFileChange}
                        disabled={readOnly}
                        emptyMessage={
                            readOnly
                                ? "No se ha cargado ninguna imagen."
                                : "No se ha seleccionado ninguna imagen."
                        }
                        imageClassName="max-h-60 object-contain rounded-lg"
                    />

                    {/* Checklist */}
                    <fieldset className="rounded-2xl p-4 space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="areContentsRelevantForMobile"
                                checked={formData.areContentsRelevantForMobile}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">
                                ¿Se priorizan los contenidos más relevantes para la versión móvil?
                            </span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="areContentsClearAndNavigable"
                                checked={formData.areContentsClearAndNavigable}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">
                                ¿Los contenidos son claros, concisos y navegables en pantallas pequeñas?
                            </span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="doContentsGuideUserAttention"
                                checked={formData.doContentsGuideUserAttention}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">
                                ¿El contenido guía la atención del usuario en dispositivos móviles?
                            </span>
                        </label>
                    </fieldset>
                </div>

                {/* Botón sticky */}
                <div className="sticky bottom-0 bg-white p-4">
                    <button
                        type="submit"
                        disabled={!formData.contentFilePath || isSaving}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.contentFilePath && !isSaving
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {isSaving ? "Guardando..." : "Completar Fase 4"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase4ContentCreation;
