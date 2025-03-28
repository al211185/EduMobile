import React, { useState, useEffect, useCallback } from "react";

const Phase2Wireframes = ({ data, onNext }) => {
    // Endpoints usando rutas relativas
    const FILE_UPLOAD_ENDPOINT = "/api/Files/upload";
    const FILE_IMAGE_ENDPOINT = "/api/Files/image";

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        wireframe480pxPath: "",
        wireframe480pxPreviewUrl: "",
        wireframe768pxPath: "",
        wireframe768pxPreviewUrl: "",
        wireframe1024pxPath: "",
        wireframe1024pxPreviewUrl: "",
        isMobileFirst: false,
        isNavigationClear: false,
        isDesignFunctional: false,
        isVisualConsistencyMet: false,
    });

    // Helper: Construye la URL de vista previa usando la ruta relativa
    const getPreviewUrl = useCallback(
        (filePath) =>
            filePath ? `${FILE_IMAGE_ENDPOINT}/${filePath.split("/").pop()}` : "",
        [FILE_IMAGE_ENDPOINT]
    );

    // Sincroniza la data recibida con el estado del formulario
    useEffect(() => {
        if (data) {
            setFormData({
                wireframe480pxPath: data.wireframe480pxPath || "",
                wireframe480pxPreviewUrl: getPreviewUrl(data.wireframe480pxPath),
                wireframe768pxPath: data.wireframe768pxPath || "",
                wireframe768pxPreviewUrl: getPreviewUrl(data.wireframe768pxPath),
                wireframe1024pxPath: data.wireframe1024pxPath || "",
                wireframe1024pxPreviewUrl: getPreviewUrl(data.wireframe1024pxPath),
                isMobileFirst: data.isMobileFirst || false,
                isNavigationClear: data.isNavigationClear || false,
                isDesignFunctional: data.isDesignFunctional || false,
                isVisualConsistencyMet: data.isVisualConsistencyMet || false,
            });
        }
    }, [data, getPreviewUrl]);

    // Maneja los cambios en inputs (texto o checkbox)
    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Función para subir el archivo
    const uploadFile = async (file) => {
        const payload = new FormData();
        payload.append("file", file);

        const response = await fetch(FILE_UPLOAD_ENDPOINT, {
            method: "POST",
            body: payload,
        });
        if (!response.ok) {
            throw new Error("Error al subir el archivo. Inténtalo nuevamente.");
        }
        const result = await response.json();
        if (!result.filePath) {
            throw new Error("No se pudo obtener la ruta del archivo.");
        }
        return result.filePath;
    };

    // Maneja la carga de archivos para cada input, mostrando una vista previa local y luego la URL final
    const handleFileChange = async (e, key) => {
        const file = e.target.files[0];
        if (!file) {
            setFormData((prev) => ({
                ...prev,
                [key]: "",
                [`${key}PreviewUrl`]: "",
            }));
            return;
        }

        // Vista previa local inmediata
        const localPreviewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            [`${key}PreviewUrl`]: localPreviewUrl,
        }));

        try {
            const filePath = await uploadFile(file);
            setFormData((prev) => ({
                ...prev,
                [key]: filePath,
                [`${key}PreviewUrl`]: getPreviewUrl(filePath),
            }));
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // Envía el formulario validando que se hayan subido todos los archivos requeridos
    const handleSubmit = () => {
        if (
            !formData.wireframe480pxPath ||
            !formData.wireframe768pxPath ||
            !formData.wireframe1024pxPath
        ) {
            alert("Por favor, sube todos los archivos requeridos antes de continuar.");
            return;
        }
        onNext(formData);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Fase 2: Wireframes</h2>
            <p className="text-gray-700">
                Sube los wireframes para los diferentes tamaños de pantalla y responde las preguntas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Wireframes 480px:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "wireframe480pxPath")}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {formData.wireframe480pxPreviewUrl ? (
                        <div className="mt-2">
                            <img
                                src={formData.wireframe480pxPreviewUrl}
                                alt="Wireframe 480px"
                                className="max-w-full max-h-40 object-contain rounded mx-auto"
                            />
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 text-sm">No se ha seleccionado imagen.</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Wireframes 768px:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "wireframe768pxPath")}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {formData.wireframe768pxPreviewUrl ? (
                        <div className="mt-2">
                            <img
                                src={formData.wireframe768pxPreviewUrl}
                                alt="Wireframe 768px"
                                className="max-w-full max-h-40 object-contain rounded mx-auto"
                            />
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 text-sm">No se ha seleccionado imagen.</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Wireframes 1024px:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "wireframe1024pxPath")}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {formData.wireframe1024pxPreviewUrl ? (
                        <div className="mt-2">
                            <img
                                src={formData.wireframe1024pxPreviewUrl}
                                alt="Wireframe 1024px"
                                className="max-w-full max-h-40 object-contain rounded mx-auto"
                            />
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 text-sm">No se ha seleccionado imagen.</p>
                    )}
                </div>
            </div>

            <div className="checklist space-y-4 mt-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isMobileFirst"
                        checked={formData.isMobileFirst}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">¿Cumple con Mobile First?</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isNavigationClear"
                        checked={formData.isNavigationClear}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">¿La navegación es clara?</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isDesignFunctional"
                        checked={formData.isDesignFunctional}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">¿El diseño es funcional?</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isVisualConsistencyMet"
                        checked={formData.isVisualConsistencyMet}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">¿Es visualmente consistente?</span>
                </label>
                <p className="text-sm text-red-500">
                    * Debe seleccionar todos los checkbox antes de guardar.
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={
                    !formData.wireframe480pxPath ||
                    !formData.wireframe768pxPath ||
                    !formData.wireframe1024pxPath ||
                    !formData.isMobileFirst ||
                    !formData.isNavigationClear ||
                    !formData.isDesignFunctional ||
                    !formData.isVisualConsistencyMet
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6 text-sm"
            >
                Completar Fase 2
            </button>
        </div>
    );

};

export default Phase2Wireframes;
