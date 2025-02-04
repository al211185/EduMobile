import React, { useState, useEffect } from "react";

const Phase1SiteMap = ({ data, onNext }) => {
    const [formData, setFormData] = useState({
        siteMapFilePath: "",
        siteMapPreviewUrl: "", // Nueva propiedad para la vista previa
        isHierarchyClear: false,
        areSectionsIdentified: false,
        areLinksClear: false,
        areVisualElementsUseful: false,
    });

    // Sincroniza `data` con el estado inicial del formulario
    useEffect(() => {
        if (data) {
            const apiBaseUrl = "https://localhost:50408/api/DesignPhases/image"; // Endpoint base
            setFormData({
                siteMapFilePath: data.siteMapFilePath || "",
                siteMapPreviewUrl: data.siteMapFilePath
                    ? `${apiBaseUrl}/${data.siteMapFilePath.split("/").pop()}` // Solo el nombre del archivo
                    : "",
                isHierarchyClear: data.isHierarchyClear || false,
                areSectionsIdentified: data.areSectionsIdentified || false,
                areLinksClear: data.areLinksClear || false,
                areVisualElementsUseful: data.areVisualElementsUseful || false,
            });
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : e.target.value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.siteMapFilePath) {
            alert("Por favor, sube un archivo antes de continuar.");
            return;
        }
        onNext(formData);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("https://localhost:50408/api/designphases/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    alert("Error al subir el archivo. Inténtalo nuevamente.");
                    return;
                }

                const data = await response.json();
                if (data.filePath) {
                    const apiBaseUrl = "https://localhost:50408/api/DesignPhases/image";
                    setFormData((prev) => ({
                        ...prev,
                        siteMapFilePath: data.filePath,
                        siteMapPreviewUrl: `${apiBaseUrl}/${data.filePath.split("/").pop()}`, // Solo el nombre del archivo
                    }));
                } else {
                    console.error("El servidor no devolvió una ruta válida para el archivo:", data);
                    alert("Error: No se pudo obtener la ruta del archivo.");
                }
            } catch (error) {
                console.error("Error al subir el archivo:", error);
                alert("Error al subir el archivo.");
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                siteMapFilePath: "",
                siteMapPreviewUrl: "",
            }));
        }
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
