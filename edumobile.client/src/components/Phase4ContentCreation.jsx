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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Fase 4: Creación de Contenidos</h2>
            <p className="text-gray-700">
                Organiza y crea el contenido necesario para tu sitio web, como textos, imágenes y otros elementos multimedia.
            </p>
            <div className="space-y-4">
                <div className="content-upload space-y-2">
                    <label className="block text-gray-700 font-medium">Sube el contenido visual:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {formData.contentPreviewUrl && (
                        <div className="image-preview mt-2">
                            <img
                                src={formData.contentPreviewUrl}
                                alt="Contenido Visual"
                                className="max-w-full max-h-60 object-contain rounded mx-auto"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="checklist space-y-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="areContentsRelevantForMobile"
                        checked={formData.areContentsRelevantForMobile}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿Se priorizan los contenidos más relevantes para la versión móvil?
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="areContentsClearAndNavigable"
                        checked={formData.areContentsClearAndNavigable}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿Los contenidos son claros, concisos y navegables en pantallas pequeñas?
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="doContentsGuideUserAttention"
                        checked={formData.doContentsGuideUserAttention}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                    />
                    <span className="text-gray-700 text-sm">
                        ¿El contenido guía la atención del usuario en dispositivos móviles?
                    </span>
                </label>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!formData.contentFilePath}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6 text-sm"
            >
                Completar Fase 4
            </button>
        </div>
    );

};

export default Phase4ContentCreation;
