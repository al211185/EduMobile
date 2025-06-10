import React, { useState, useEffect } from "react";

const Phase3VisualDesign = ({ data, onNext }) => {
    const FILE_UPLOAD_ENDPOINT = "/api/Files/upload";
    const FILE_IMAGE_ENDPOINT = "/api/Files/image";

    const [formData, setFormData] = useState({
        visualDesignFilePath: "",
        visualDesignPreviewUrl: "",
        areVisualElementsBeneficialForSmallScreens: false,
        doesDesignPrioritizeContentForMobile: false,
        doesDesignImproveLoadingSpeed: false,
    });

    // Carga inicial si vienen datos preexistentes
    useEffect(() => {
        if (data) {
            setFormData({
                visualDesignFilePath: data.visualDesignFilePath || "",
                visualDesignPreviewUrl: data.visualDesignFilePath
                    ? `${FILE_IMAGE_ENDPOINT}/${data.visualDesignFilePath.split("/").pop()}`
                    : "",
                areVisualElementsBeneficialForSmallScreens:
                    data.areVisualElementsBeneficialForSmallScreens || false,
                doesDesignPrioritizeContentForMobile:
                    data.doesDesignPrioritizeContentForMobile || false,
                doesDesignImproveLoadingSpeed:
                    data.doesDesignImproveLoadingSpeed || false,
            });
        }
    }, [data]);

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
            // Reset
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: "",
                visualDesignPreviewUrl: "",
            }));
            return;
        }

        // Vista previa local inmediata
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            visualDesignPreviewUrl: localUrl,
        }));

        // Subida al servidor
        const payload = new FormData();
        payload.append("file", file);
        try {
            const res = await fetch(FILE_UPLOAD_ENDPOINT, {
                method: "POST",
                body: payload,
            });
            if (!res.ok) throw new Error("Error al subir el archivo. Inténtalo nuevamente.");
            const result = await res.json();
            if (!result.filePath) throw new Error("No se pudo obtener la ruta del archivo.");
            setFormData((prev) => ({
                ...prev,
                visualDesignFilePath: result.filePath,
                visualDesignPreviewUrl: `${FILE_IMAGE_ENDPOINT}/${result.filePath.split("/").pop()}`,
            }));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleSubmit = () => {
        if (!formData.visualDesignFilePath) {
            alert("Por favor, sube el diseño visual antes de continuar.");
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
                className="flex flex-col h-full"
            >
                {/* Contenido con scroll */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="rounded-2xl">
                        <legend className="text-xl font-bold text-[#4F46E5] mb-4 px-2">
                            Fase 3: Diseño Visual
                        </legend>
                        <p className="text-gray-700">
                            Define el aspecto estético y gráfico de tu sitio web. Sube el diseño visual y responde las preguntas para completar esta fase.
                        </p>
                    </fieldset>

                    {/* Upload de imagen */}
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-medium">
                            Sube el diseño visual:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData.visualDesignPreviewUrl ? (
                            <div className="mt-4 text-center">
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

                    {/* Checklist */}
                    <fieldset className="rounded-2xl">
                        <div className="mt-4 space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="areVisualElementsBeneficialForSmallScreens"
                                checked={formData.areVisualElementsBeneficialForSmallScreens}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">
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
                            <span className="text-gray-700">
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
                            <span className="text-gray-700">
                                ¿El diseño visual ayuda a mejorar la velocidad de carga en dispositivos móviles?
                            </span>
                            </label>
                        </div>
                    </fieldset>
                </div>

                {/* Botón sticky al fondo */}
                <div className="sticky bottom-0 p-4">
                    <button
                        type="submit"
                        disabled={!formData.visualDesignFilePath}
                        className={`w-full font-semibold py-2 rounded transition-colors ${formData.visualDesignFilePath
                                ? "bg-[#4F46E5] hover:bg-[#3730A3] text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        Completar Fase 3
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase3VisualDesign;
