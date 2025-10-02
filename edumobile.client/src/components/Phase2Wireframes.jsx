import { useState, useEffect, useMemo, useCallback } from "react";
import ImageDropZone from "./ImageDropZone";
import useAutoSave from "../hooks/useAutoSave";
import { buildPreviewUrl, extractFilePath } from "../utils/fileHelpers";

const Phase2Wireframes = ({ data, onNext, readOnly = false, onAutoSave, onDataChange }) => {
    const FILE_UPLOAD_ENDPOINT = "/api/Files/upload";
    const FILE_IMAGE_ENDPOINT = "/api/Files/image";


    const getPreviewUrl = useCallback(
        (filePath) => buildPreviewUrl(FILE_IMAGE_ENDPOINT, filePath),
        [FILE_IMAGE_ENDPOINT]
    );

    const initialState = useMemo(
        () => ({
            wireframe480pxPath: data?.wireframe480pxPath || "",
            wireframe480pxPreviewUrl: data?.wireframe480pxPath
                ? getPreviewUrl(data.wireframe480pxPath)
                : "",
            wireframe768pxPath: data?.wireframe768pxPath || "",
            wireframe768pxPreviewUrl: data?.wireframe768pxPath
                ? getPreviewUrl(data.wireframe768pxPath)
                : "",
            wireframe1024pxPath: data?.wireframe1024pxPath || "",
            wireframe1024pxPreviewUrl: data?.wireframe1024pxPath
                ? getPreviewUrl(data.wireframe1024pxPath)
                : "",
            isMobileFirst: data?.isMobileFirst || false,
            isNavigationClear: data?.isNavigationClear || false,
            isDesignFunctional: data?.isDesignFunctional || false,
            isVisualConsistencyMet: data?.isVisualConsistencyMet || false,
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

    const uploadFile = async (file, previousPath = "") => {
        const payload = new FormData();
        payload.append("file", file);
        const query = previousPath ? `?oldFilePath=${encodeURIComponent(previousPath)}` : "";

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

            const result = await res.json();

            const filePath = extractFilePath(result);
            if (!filePath) {
                throw new Error("No se pudo obtener la ruta del archivo.");
            }
            return filePath;
        }
    };

    const handleFileChange = async (file, key) => {
        if (readOnly) {
            return;
        }
        // calculamos el campo preview correcto
        const previewKey = key.replace("Path", "PreviewUrl");

        if (!file) {
            setFormData((prev) => ({
                ...prev,
                [key]: "",
                [previewKey]: "",
            }));
            return;
        }

        // vista previa local inmediata
        const previousPath = formData[key];
        const previousPreview = formData[previewKey];
        setFormData((prev) => ({
            ...prev,
            [previewKey]: localUrl,
        }));

        try {
            const filePath = await uploadFile(file, previousPath);
            setFormData((prev) => ({
                ...prev,
                [key]: filePath,
                [previewKey]: getPreviewUrl(filePath),
            }));
        } catch (err) {
            console.error(err);
            alert(err.message);
            setFormData((prev) => ({
                ...prev,
                [key]: previousPath,
                [previewKey]: previousPreview,
            }));
        } finally {
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
            }
        }
    };

    const allUploaded =
        formData.wireframe480pxPath &&
        formData.wireframe768pxPath &&
        formData.wireframe1024pxPath;
    const allChecked =
        formData.isMobileFirst &&
        formData.isNavigationClear &&
        formData.isDesignFunctional &&
        formData.isVisualConsistencyMet;

    const handleSubmit = async () => {
        if (!allUploaded) {
            alert("Por favor, sube todos los archivos requeridos antes de continuar.");
            return;
        }
        if (!allChecked) {
            alert("Por favor, marca todas las opciones antes de continuar.");
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
                {/* Contenido scrollable */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 2: Wireframes
                        </legend>
                        <p className="text-gray-700">
                            Sube los wireframes para los diferentes tamaños de pantalla y responde las preguntas.
                        </p>
                    </fieldset>

                    {/* Tres inputs de file en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "480px", key: "wireframe480pxPath", preview: "wireframe480pxPreviewUrl" },
                            { label: "768px", key: "wireframe768pxPath", preview: "wireframe768pxPreviewUrl" },
                            { label: "1024px", key: "wireframe1024pxPath", preview: "wireframe1024pxPreviewUrl" },
                        ].map(({ label, key, preview }) => (
                            <ImageDropZone
                                key={key}
                                id={`wireframe-${label}`}
                                label={`Wireframe ${label}`}
                                previewUrl={formData[preview]}
                                onFileSelected={(file) => void handleFileChange(file, key)}
                                disabled={readOnly}
                                emptyMessage={
                                    readOnly
                                        ? "No se ha cargado ninguna imagen."
                                        : "No se ha seleccionado imagen."
                                }
                                imageClassName="max-h-40 object-contain rounded-lg"
                            />
                        ))}
                    </div>

                    {/* Checklist */}
                    <fieldset className="rounded-2xl">
                        <div className="mt-4 space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isMobileFirst"
                                    checked={formData.isMobileFirst}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">¿Cumple con Mobile First?</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isNavigationClear"
                                    checked={formData.isNavigationClear}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">¿La navegación es clara?</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isDesignFunctional"
                                    checked={formData.isDesignFunctional}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">¿El diseño es funcional?</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isVisualConsistencyMet"
                                    checked={formData.isVisualConsistencyMet}
                                    onChange={handleInputChange}
                                    className="h-4 w-4"
                                />
                                <span className="text-gray-700">¿Es visualmente consistente?</span>
                            </label>
                            <p className="text-sm text-red-500">
                                * Debes seleccionar todas las opciones antes de continuar.
                            </p>
                        </div>
                    </fieldset>
                </div>

                {/* Botón fijo abajo */}
                <div className="sticky bottom-0 p-4">
                    <button
                        type="submit"
                        disabled={!(allUploaded && allChecked) || isSaving}
                        className={`w-full font-semibold py-2 rounded transition-colors ${allUploaded && allChecked && !isSaving
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {isSaving ? "Guardando..." : "Completar Fase 2"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase2Wireframes;
