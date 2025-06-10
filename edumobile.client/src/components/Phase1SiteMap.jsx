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
        <div className="w-full flex flex-col flex-1 rounded-2xl overflow-hidden">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="flex flex-col h-full">
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
                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            name="siteMapFilePath"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                        {formData.siteMapPreviewUrl ? (
                            <div className="mt-4 image-preview text-center">
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
                    </div>

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
                                    ¿Los enlaces a las secciones y páginas son fácilmente
                                    identificables en el gráfico?
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
                                    ¿Se utilizan elementos visuales que faciliten la comprensión
                                    del mapa?
                                </span>
                            </label>
                        </div>
                    </fieldset>
                </div>

                {/* Botón fijo */}
                <div className="sticky bottom-0 bg-white p-4">
                    <button
                        type="submit"
                        disabled={!formData.isHierarchyClear}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.isHierarchyClear
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        Completar Fase 1
                    </button>
                </div>
            </form>
        </div>
    );
};


export default Phase1SiteMap;