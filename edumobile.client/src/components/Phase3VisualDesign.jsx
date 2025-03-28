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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Fase 3: Diseño Visual</h2>
            <p className="text-gray-700">
                Define el aspecto estético y gráfico de tu sitio web. Sube el diseño visual y responde las preguntas para completar esta fase.
            </p>

            <div className="space-y-4">
                <label className="block text-gray-700 font-medium">
                    Sube el diseño visual:
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded p-2"
                />
                {formData.visualDesignPreviewUrl ? (
                    <div className="mt-4 image-preview">
                        <img
                            src={formData.visualDesignPreviewUrl}
                            alt="Diseño Visual"
                            className="max-w-full max-h-64 object-contain rounded mx-auto"
                        />
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500 text-sm">
                        No se ha seleccionado ninguna imagen.
                    </p>
                )}
            </div>

            <div className="checklist space-y-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="areVisualElementsBeneficialForSmallScreens"
                        checked={formData.areVisualElementsBeneficialForSmallScreens}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿Los elementos visuales contribuyen a una buena experiencia en pantallas pequeñas?
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="doesDesignPrioritizeContentForMobile"
                        checked={formData.doesDesignPrioritizeContentForMobile}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿El diseño visual prioriza el contenido para dispositivos móviles?
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="doesDesignImproveLoadingSpeed"
                        checked={formData.doesDesignImproveLoadingSpeed}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿El diseño visual ayuda a mejorar la velocidad de carga en dispositivos móviles?
                    </span>
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!formData.visualDesignFilePath}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6 text-sm"
            >
                Completar Fase 3
            </button>
        </div>
    );

};

export default Phase3VisualDesign;
