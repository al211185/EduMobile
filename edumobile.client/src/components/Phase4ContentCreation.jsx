import React, { useState } from "react";

const Phase4ContentCreation = ({ data, onNext }) => {
    const [formData, setFormData] = useState({
        contentFilePath: data?.contentFilePath || "",
        contentPreviewUrl: data?.contentFilePath
            ? `https://localhost:50408/api/designphases/image/${data.contentFilePath.split("/").pop()}`
            : "",
        areContentsRelevantForMobile: data?.areContentsRelevantForMobile || false,
        areContentsClearAndNavigable: data?.areContentsClearAndNavigable || false,
        doContentsGuideUserAttention: data?.doContentsGuideUserAttention || false,
    });

    const handleInputChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : e.target.value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataFile = new FormData();
            formDataFile.append("file", file);

            try {
                const response = await fetch("https://localhost:50408/api/designphases/upload", {
                    method: "POST",
                    body: formDataFile,
                });

                if (!response.ok) {
                    alert("Error al subir el archivo. Inténtalo nuevamente.");
                    return;
                }

                const dataResponse = await response.json();
                if (dataResponse.filePath) {
                    const apiBaseUrl = "https://localhost:50408/api/designphases/image";
                    setFormData((prev) => ({
                        ...prev,
                        contentFilePath: dataResponse.filePath,
                        contentPreviewUrl: `${apiBaseUrl}/${dataResponse.filePath.split("/").pop()}`,
                    }));
                } else {
                    alert("Error: No se pudo obtener la ruta del archivo.");
                }
            } catch (error) {
                console.error("Error al subir el archivo:", error);
                alert("Error al subir el archivo.");
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                contentFilePath: "",
                contentPreviewUrl: "",
            }));
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
