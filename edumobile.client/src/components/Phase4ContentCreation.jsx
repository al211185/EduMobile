import React, { useState } from "react";

const Phase4ContentCreation = ({ data, onNext }) => {
    const fileUploadEndpoint = "/api/Files/upload";
    const fileImageEndpoint = "/api/Files/image";

    const [formData, setFormData] = useState({
        contentFilePath: data?.contentFilePath || "",
        contentPreviewUrl: data?.contentFilePath
            ? `${fileImageEndpoint}/${data.contentFilePath.split("/").pop()}`
            : "",
        areContentsRelevantForMobile: data?.areContentsRelevantForMobile || false,
        areContentsClearAndNavigable: data?.areContentsClearAndNavigable || false,
        doContentsGuideUserAttention: data?.doContentsGuideUserAttention || false,
    });

    const getPreviewUrl = (filePath) =>
        filePath ? `${fileImageEndpoint}/${filePath.split("/").pop()}` : "";

    const handleInputChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : prev[name],
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return setFormData((prev) => ({
                ...prev,
                contentFilePath: "",
                contentPreviewUrl: "",
            }));
        }

        // preview local
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            contentPreviewUrl: localUrl,
        }));

        // subir al servidor
        const payload = new FormData();
        payload.append("file", file);
        try {
            const res = await fetch(fileUploadEndpoint, {
                method: "POST",
                body: payload,
            });
            if (!res.ok) throw new Error("Error al subir el archivo. Inténtalo nuevamente.");
            const result = await res.json();
            if (!result.filePath) throw new Error("No se pudo obtener la ruta del archivo.");
            setFormData((prev) => ({
                ...prev,
                contentFilePath: result.filePath,
                contentPreviewUrl: getPreviewUrl(result.filePath),
            }));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleSubmit = () => {
        onNext(formData);
    };

    return (
        <div className="w-full flex flex-col flex-1 rounded-2xl overflow-hidden">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="flex flex-col h-full"
            >
                {/* Scroll interno */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 4: Creación de Contenidos
                        </legend>
                        <p className="text-gray-700">
                            Organiza y crea el contenido necesario para tu sitio web, como textos, imágenes y otros elementos multimedia.
                        </p>
                    </fieldset>

                    {/* Upload */}
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-medium">
                            Sube el contenido visual:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData.contentPreviewUrl ? (
                            <div className="mt-4 text-center">
                                <img
                                    src={formData.contentPreviewUrl}
                                    alt="Contenido Visual"
                                    className="max-w-full max-h-60 object-contain rounded mx-auto"
                                />
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-500 text-sm">
                                No se ha seleccionado ninguna imagen.
                            </p>
                        )}
                    </div>

                    {/* Checklist */}
                    <fieldset className="rounded-2xl p-4 space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="areContentsRelevantForMobile"
                                checked={formData.areContentsRelevantForMobile}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">
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
                            <span className="text-gray-700">
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
                            <span className="text-gray-700">
                                ¿El contenido guía la atención del usuario en dispositivos móviles?
                            </span>
                        </label>
                    </fieldset>
                </div>

                {/* Botón sticky */}
                <div className="sticky bottom-0 bg-white p-4">
                    <button
                        type="submit"
                        disabled={!formData.contentFilePath}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.contentFilePath
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        Completar Fase 4
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase4ContentCreation;
