import React, { useState } from "react";

const Phase4ContentCreation = ({ data, onNext }) => {
    // Endpoints usando rutas relativas
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        contentFilePath: data?.contentFilePath || "",
        contentPreviewUrl: data?.contentFilePath
            ? `${fileImageEndpoint}/${data.contentFilePath.split("/").pop()}`
            : "",
        areContentsRelevantForMobile: data?.areContentsRelevantForMobile || false,
        areContentsClearAndNavigable: data?.areContentsClearAndNavigable || false,
        doContentsGuideUserAttention: data?.doContentsGuideUserAttention || false,
    });

    // Helper para generar la URL de vista previa a partir de la ruta del archivo
    const getPreviewUrl = (filePath) =>
        filePath ? `${fileImageEndpoint}/${filePath.split("/").pop()}` : "";

    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFormData((prev) => ({
                ...prev,
                contentFilePath: "",
                contentPreviewUrl: "",
            }));
            return;
        }

        const formDataFile = new FormData();
        formDataFile.append("file", file);

        try {
            const response = await fetch(fileUploadEndpoint, {
                method: "POST",
                body: formDataFile,
            });

            if (!response.ok) {
                alert("Error al subir el archivo. Inténtalo nuevamente.");
                return;
            }

            const dataResponse = await response.json();
            if (dataResponse.filePath) {
                setFormData((prev) => ({
                    ...prev,
                    contentFilePath: dataResponse.filePath,
                    contentPreviewUrl: getPreviewUrl(dataResponse.filePath),
                }));
            } else {
                alert("Error: No se pudo obtener la ruta del archivo.");
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            alert("Error al subir el archivo.");
        }
    };

    const handleSubmit = () => {
        onNext(formData);
    };

    return (
        <div className="phase-container">
            <h2>Fase 4: Creación de Contenidos</h2>
            <p>
                Organiza y crea el contenido necesario para tu sitio web, como textos, imágenes y otros elementos
                multimedia.
            </p>
            <div className="content-upload">
                <label>Sube el contenido visual:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {formData.contentPreviewUrl && (
                    <div className="image-preview">
                        <img
                            src={formData.contentPreviewUrl}
                            alt="Contenido Visual"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}
            </div>
            <div className="checklist">
                <label>
                    <input
                        type="checkbox"
                        name="areContentsRelevantForMobile"
                        checked={formData.areContentsRelevantForMobile}
                        onChange={handleInputChange}
                    />
                    ¿Se priorizan los contenidos más relevantes para la versión móvil?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="areContentsClearAndNavigable"
                        checked={formData.areContentsClearAndNavigable}
                        onChange={handleInputChange}
                    />
                    ¿Los contenidos son claros, concisos y navegables en pantallas pequeñas?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="doContentsGuideUserAttention"
                        checked={formData.doContentsGuideUserAttention}
                        onChange={handleInputChange}
                    />
                    ¿El contenido guía la atención del usuario en dispositivos móviles?
                </label>
            </div>
            <button onClick={handleSubmit} disabled={!formData.contentFilePath}>
                Completar Fase 4
            </button>
        </div>
    );
};

export default Phase4ContentCreation;
