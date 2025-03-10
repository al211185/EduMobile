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
        <div className="phase-container">
            <h2>Fase 1: Mapa del Sitio</h2>
            <p>Define la estructura de navegación de tu sitio web.</p>

            <input
                type="file"
                accept="image/*"
                name="siteMapFilePath"
                onChange={handleFileChange}
            />

            {formData.siteMapPreviewUrl ? (
                <div className="image-preview">
                    <img
                        src={formData.siteMapPreviewUrl}
                        alt="Mapa del sitio"
                        style={{ maxWidth: "100%" }}
                    />
                </div>
            ) : (
                <p>No se ha seleccionado ninguna imagen para la vista previa.</p>
            )}

            <div className="checklist">
                <label>
                    <input
                        type="checkbox"
                        name="isHierarchyClear"
                        checked={formData.isHierarchyClear}
                        onChange={handleInputChange}
                    />
                    ¿La jerarquía de la información es clara?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="areSectionsIdentified"
                        checked={formData.areSectionsIdentified}
                        onChange={handleInputChange}
                    />
                    ¿Las secciones principales están claramente identificadas?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="areLinksClear"
                        checked={formData.areLinksClear}
                        onChange={handleInputChange}
                    />
                    ¿Los enlaces a las secciones y páginas son fácilmente identificables en el gráfico?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="areVisualElementsUseful"
                        checked={formData.areVisualElementsUseful}
                        onChange={handleInputChange}
                    />
                    ¿Se utilizan elementos visuales que faciliten la comprensión del mapa?
                </label>
            </div>

            <button onClick={handleSubmit} disabled={!formData.isHierarchyClear}>
                Completar Fase 1
            </button>
        </div>
    );
};

export default Phase1SiteMap;
