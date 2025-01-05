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
        <div className="create-project-container">
            <h1>Crear Nuevo Proyecto</h1>
            <form onSubmit={handleSubmit} className="create-project-form">
                <div className="form-group">
                    <label htmlFor="title">Nombre del Proyecto</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                {errorMessages.length > 0 && (
                    <ul className="error-messages">
                        {errorMessages.map((error, index) => (
                            <li key={index} className="error-message">
                                {error}
                            </li>
                        ))}
                    </ul>
                )}
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear Proyecto"}
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
