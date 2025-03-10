import React, { useState } from "react";

const Phase3VisualDesign = ({ data, onNext }) => {
    // Endpoints usando rutas relativas
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";

    const [formData, setFormData] = useState({
        visualDesignFilePath: data?.visualDesignFilePath || "",
        visualDesignPreviewUrl: data?.visualDesignFilePath
            ? `${fileImageEndpoint}/${data.visualDesignFilePath.split("/").pop()}`
            : "",
        areVisualElementsBeneficialForSmallScreens:
            data?.areVisualElementsBeneficialForSmallScreens || false,
        doesDesignPrioritizeContentForMobile:
            data?.doesDesignPrioritizeContentForMobile || false,
        doesDesignImproveLoadingSpeed:
            data?.doesDesignImproveLoadingSpeed || false,
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
        if (!file) {
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: "",
                visualDesignPreviewUrl: "",
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
                    visualDesignFilePath: dataResponse.filePath,
                    visualDesignPreviewUrl: `${fileImageEndpoint}/${dataResponse.filePath.split("/").pop()}`,
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
            <h2>Fase 3: Diseño Visual</h2>
            <p>
                Define el aspecto estético y gráfico de tu sitio web. Sube el diseño visual y responde las preguntas
                para completar esta fase.
            </p>
            <div className="design-upload">
                <label>Sube el diseño visual:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {formData.visualDesignPreviewUrl && (
                    <div className="image-preview">
                        <img
                            src={formData.visualDesignPreviewUrl}
                            alt="Diseño Visual"
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                )}
            </div>
            <div className="checklist">
                <label>
                    <input
                        type="checkbox"
                        name="areVisualElementsBeneficialForSmallScreens"
                        checked={formData.areVisualElementsBeneficialForSmallScreens}
                        onChange={handleInputChange}
                    />
                    ¿Los elementos visuales contribuyen a una buena experiencia en pantallas pequeñas?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="doesDesignPrioritizeContentForMobile"
                        checked={formData.doesDesignPrioritizeContentForMobile}
                        onChange={handleInputChange}
                    />
                    ¿El diseño visual prioriza el contenido para dispositivos móviles?
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="doesDesignImproveLoadingSpeed"
                        checked={formData.doesDesignImproveLoadingSpeed}
                        onChange={handleInputChange}
                    />
                    ¿El diseño visual ayuda a mejorar la velocidad de carga en dispositivos móviles?
                </label>
            </div>
            <button onClick={handleSubmit} disabled={!formData.visualDesignFilePath}>
                Completar Fase 3
            </button>
        </div>
    );
};

export default Phase3VisualDesign;
