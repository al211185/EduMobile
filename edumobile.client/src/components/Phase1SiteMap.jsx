import { useState, useEffect, useMemo, useCallback } from "react";
import ImageDropZone from "./ImageDropZone";
import useAutoSave from "../hooks/useAutoSave";
import usePropagateDataChange from "../hooks/usePropagateDataChange";
import { buildPreviewUrl, extractFilePath } from "../utils/fileHelpers";

const Phase1SiteMap = ({ data, onNext, readOnly = false, onAutoSave, onDataChange }) => {
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";


    const getPreviewUrl = useCallback(
        (filePath) => buildPreviewUrl(fileImageEndpoint, filePath),
        [fileImageEndpoint]
    );

    const initialState = useMemo(
        () => ({
            siteMapFilePath: data?.siteMapFilePath || "",
            siteMapPreviewUrl: data?.siteMapFilePath
                ? getPreviewUrl(data.siteMapFilePath)
                : data?.siteMapPreviewUrl || "",
            isHierarchyClear: data?.isHierarchyClear || false,
            areSectionsIdentified: data?.areSectionsIdentified || false,
            areLinksClear: data?.areLinksClear || false,
            areVisualElementsUseful: data?.areVisualElementsUseful || false,
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

    // Maneja los cambios en los inputs (checkbox o texto)
    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Maneja la carga del archivo
    usePropagateDataChange(formData, onDataChange, initialSnapshot);

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
            // Si no hay archivo, reiniciamos la ruta y la vista previa
            setFormData((prev) => ({
                ...prev,
                siteMapFilePath: "",
                siteMapPreviewUrl: "",
            }));
            return;
        }

        const previousPath = formData.siteMapFilePath;
        const previousPreview = formData.siteMapPreviewUrl;
        const localUrl = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            siteMapPreviewUrl: localUrl,
        }));

        const fileData = new FormData();
        fileData.append("file", file);

        const query = previousPath ? `?oldFilePath=${encodeURIComponent(previousPath)}` : "";

        try {
            const response = await fetch(`${fileUploadEndpoint}${query}`, {
                method: "POST",
                body: fileData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorMessage = await response
                    .json()
                    .then((res) => res.message || "Error al subir el archivo. Inténtalo nuevamente.")
                    .catch(() => "Error al subir el archivo. Inténtalo nuevamente.");
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const serverPath = extractFilePath(result);

            if (!serverPath) {
                throw new Error("No se pudo obtener la ruta del archivo.");
            }

            setFormData((prev) => ({
                ...prev,
                siteMapFilePath: serverPath,
                siteMapPreviewUrl: getPreviewUrl(serverPath),
            }));
        } catch (error) {
            console.error("Error al subir el archivo:", error);

            alert(error.message || "Error al subir el archivo.");
            setFormData((prev) => ({
                ...prev,
                siteMapFilePath: previousPath,
                siteMapPreviewUrl: previousPreview,
            }));
        } finally {
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
            }
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async () => {
        if (!formData.siteMapFilePath) {
            alert("Por favor, sube un archivo antes de continuar.");
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
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    {/* Título */}
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 1: Mapa del Sitio
                        </legend>
                        <p className="text-gray-700">
                            Define la estructura de navegación de tu sitio web.
                        </p>
                    </fieldset>

                    {/* Carga de imagen */}
                    <ImageDropZone
                        id="phase1-site-map"
                        label="Sube el mapa del sitio"
                        previewUrl={formData.siteMapPreviewUrl}
                        onFileSelected={handleFileChange}
                        disabled={readOnly}
                        emptyMessage={
                            readOnly
                                ? "No se ha cargado ninguna imagen."
                                : "No se ha seleccionado ninguna imagen para la vista previa."
                        }
                    />

                    {/* Checklist */}
                    <fieldset className="rounded-2xl ">
                        <div className="mt-4 space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isHierarchyClear"
                                    checked={formData.isHierarchyClear}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿La jerarquía de la información es clara?
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="areSectionsIdentified"
                                    checked={formData.areSectionsIdentified}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿Las secciones principales están claramente identificadas?
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="areLinksClear"
                                    checked={formData.areLinksClear}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿Los enlaces a las secciones y páginas son fácilmente identificables en el gráfico?
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="areVisualElementsUseful"
                                    checked={formData.areVisualElementsUseful}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">
                                    ¿Se utilizan elementos visuales que faciliten la comprensión del mapa?
                                </span>
                            </label>
                        </div>
                    </fieldset>
                </div>

                {/* Botón fijo */}
                <div className="sticky bottom-0 bg-white p-4">
                    <button
                        type="submit"
                        disabled={!formData.isHierarchyClear || isSaving}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.isHierarchyClear && !isSaving
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {isSaving ? "Guardando..." : "Completar Fase 1"}
                    </button>
                </div>
            </form>
        </div>
    );
};


export default Phase1SiteMap;