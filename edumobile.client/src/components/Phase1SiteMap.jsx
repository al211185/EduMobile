import React, { useState, useEffect } from "react";

const Phase1SiteMap = ({ data, onNext }) => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        siteMapFilePath: "",
        siteMapPreviewUrl: "",
        isHierarchyClear: false,
        areSectionsIdentified: false,
        areLinksClear: false,
        areVisualElementsUseful: false,
    });

    // Endpoints usando el formato de rutas de Phase2Benchmarking
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";

    // Helper para obtener la URL de vista previa a partir de la ruta del archivo
    const getPreviewUrl = (filePath) =>
        filePath ? `${fileImageEndpoint}/${filePath.split("/").pop()}` : "";

    // Sincroniza la data recibida con el estado del formulario
    useEffect(() => {
        if (data) {
            setFormData({
                siteMapFilePath: data.siteMapFilePath || "",
                siteMapPreviewUrl: getPreviewUrl(data.siteMapFilePath),
                isHierarchyClear: data.isHierarchyClear || false,
                areSectionsIdentified: data.areSectionsIdentified || false,
                areLinksClear: data.areLinksClear || false,
                areVisualElementsUseful: data.areVisualElementsUseful || false,
            });
        }
    }, [data]);

    // Maneja los cambios en los inputs (checkbox o texto)
    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Maneja la carga del archivo
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            // Si no hay archivo, reiniciamos la ruta y la vista previa
            setFormData((prev) => ({
                ...prev,
                siteMapFilePath: "",
                siteMapPreviewUrl: "",
            }));
            return;
        }

        const fileData = new FormData();
        fileData.append("file", file);

        try {
            const response = await fetch(fileUploadEndpoint, {
                method: "POST",
                body: fileData,
            });

            if (!response.ok) {
                alert("Error al subir el archivo. Inténtalo nuevamente.");
                return;
            }

            const result = await response.json();
            if (result.filePath) {
                setFormData((prev) => ({
                    ...prev,
                    siteMapFilePath: result.filePath,
                    siteMapPreviewUrl: getPreviewUrl(result.filePath),
                }));
            } else {
                console.error("El servidor no devolvió una ruta válida para el archivo:", result);
                alert("Error: No se pudo obtener la ruta del archivo.");
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            alert("Error al subir el archivo.");
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = () => {
        if (!formData.siteMapFilePath) {
            alert("Por favor, sube un archivo antes de continuar.");
            return;
        }
        onNext(formData);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Fase 1: Mapa del Sitio</h2>
            <p className="text-gray-700">
                Define la estructura de navegación de tu sitio web.
            </p>

            <input
                type="file"
                accept="image/*"
                name="siteMapFilePath"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded p-2"
            />

            {formData.siteMapPreviewUrl ? (
                <div className="mt-4 image-preview">
                    <img
                        src={formData.siteMapPreviewUrl}
                        alt="Mapa del sitio"
                        className="max-w-full max-h-64 object-contain rounded mx-auto"
                    />
                </div>
            ) : (
                <p className="mt-4 text-gray-500">
                    No se ha seleccionado ninguna imagen para la vista previa.
                </p>
            )}

            <div className="mt-4 checklist space-y-2">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isHierarchyClear"
                        checked={formData.isHierarchyClear}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
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
                    <span className="text-gray-700 text-sm">
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
                    <span className="text-gray-700 text-sm">
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
                    <span className="text-gray-700 text-sm">
                        ¿Se utilizan elementos visuales que faciliten la comprensión del mapa?
                    </span>
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!formData.isHierarchyClear}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6"
            >
                Completar Fase 1
            </button>
        </div>
    );

};

export default Phase1SiteMap;
