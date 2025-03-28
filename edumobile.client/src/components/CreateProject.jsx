import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessages([]);

        try {
            console.log("Datos enviados al servidor:", formData);

            const response = await fetch("/api/projects/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("✅ Proyecto creado exitosamente.");
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                console.error("Error en el servidor:", errorData);

                if (errorData.message) {
                    setErrorMessages([errorData.message]);
                } else if (errorData.errors) {
                    // Manejo de errores específicos de validación
                    const validationErrors = Object.values(errorData.errors).flat();
                    setErrorMessages(validationErrors);
                } else {
                    setErrorMessages(["⚠️ No se pudo crear el proyecto. Revisa los datos ingresados."]);
                }
            }
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
            setErrorMessages(["⚠️ Hubo un error al procesar la solicitud."]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Crear Nuevo Proyecto
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-1 font-medium text-gray-700">
                        Nombre del Proyecto
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="mb-1 font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                {errorMessages.length > 0 && (
                    <ul className="text-red-500 text-sm list-disc list-inside">
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-75"
                >
                    {isSubmitting ? "Creando..." : "Crear Proyecto"}
                </button>
            </form>
        </div>
    );

};

export default CreateProject;
