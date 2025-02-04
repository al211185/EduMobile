import React, { useState, useEffect } from "react";

const Phase2Wireframes = ({ data, onNext }) => {
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

    useEffect(() => {
        if (data) {
            const apiBaseUrl = "https://localhost:50408/api/DesignPhases/image";
            setFormData({
                wireframe480pxPath: data.wireframe480pxPath || "",
                wireframe480pxPreviewUrl: data.wireframe480pxPath
                    ? `${apiBaseUrl}/${data.wireframe480pxPath.split("/").pop()}`
                    : "",
                wireframe768pxPath: data.wireframe768pxPath || "",
                wireframe768pxPreviewUrl: data.wireframe768pxPath
                    ? `${apiBaseUrl}/${data.wireframe768pxPath.split("/").pop()}`
                    : "",
                wireframe1024pxPath: data.wireframe1024pxPath || "",
                wireframe1024pxPreviewUrl: data.wireframe1024pxPath
                    ? `${apiBaseUrl}/${data.wireframe1024pxPath.split("/").pop()}`
                    : "",
                isMobileFirst: data.isMobileFirst || false,
                isNavigationClear: data.isNavigationClear || false,
                isDesignFunctional: data.isDesignFunctional || false,
                isVisualConsistencyMet: data.isVisualConsistencyMet || false,
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

    const handleFileChange = async (e, key) => {
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
                        [key]: data.filePath,
                        [`${key}PreviewUrl`]: `${apiBaseUrl}/${data.filePath.split("/").pop()}`,
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
                [key]: "",
                [`${key}PreviewUrl`]: "",
            }));
        }
    };

    const handleSubmit = () => {
        if (!formData.wireframe480pxPath || !formData.wireframe768pxPath || !formData.wireframe1024pxPath) {
            alert("Por favor, sube todos los archivos requeridos antes de continuar.");
            return;
        }
        onNext(formData);
    };

    return (
        <div className="phase-container">
            <h2>Fase 2: Wireframes</h2>
            <p>Sube los wireframes para los diferentes tamaños de pantalla y responde las preguntas.</p>

            <div className="wireframe-upload">
                <label>Wireframes 480px:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "wireframe480pxPath")}
                />
                {formData.wireframe480pxPreviewUrl && (
                    <div className="image-preview">
                        <img
                            src={formData.wireframe480pxPreviewUrl}
                            alt="Wireframe 480px"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}

                <label>Wireframes 768px:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "wireframe768pxPath")}
                />
                {formData.wireframe768pxPreviewUrl && (
                    <div className="image-preview">
                        <img
                            src={formData.wireframe768pxPreviewUrl}
                            alt="Wireframe 768px"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}

                <label>Wireframes 1024px:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "wireframe1024pxPath")}
                />
                {formData.wireframe1024pxPreviewUrl && (
                    <div className="image-preview">
                        <img
                            src={formData.wireframe1024pxPreviewUrl}
                            alt="Wireframe 1024px"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}
            </div>

            <div className="checklist">
                <label>
                    <input
                        type="checkbox"
                        name="isMobileFirst"
                        checked={formData.isMobileFirst}
                        onChange={handleInputChange}
                    />
                    ¿Cumple con Mobile First?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="isNavigationClear"
                        checked={formData.isNavigationClear}
                        onChange={handleInputChange}
                    />
                    ¿La navegación es clara?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="isDesignFunctional"
                        checked={formData.isDesignFunctional}
                        onChange={handleInputChange}
                    />
                    ¿El diseño es funcional?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="isVisualConsistencyMet"
                        checked={formData.isVisualConsistencyMet}
                        onChange={handleInputChange}
                    />
                    ¿Es visualmente consistente?
                </label>
            </div>

            <button onClick={handleSubmit} disabled={!formData.isMobileFirst}>
                Completar Fase 2
            </button>
        </div>
    );
};

export default Phase2Wireframes;
