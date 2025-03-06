import React, { useState } from "react";

const RequirementsSection = ({
    functionalRequirements,
    customRequirements,
    onRequirementsChange,
    readOnly, // Nueva prop para controlar el modo de solo lectura
}) => {
    const [customRequirement, setCustomRequirement] = useState("");

    // Lista predefinida de requisitos funcionales
    const predefinedRequirements = [
        { name: "formularios_contacto", label: "Formularios de contacto", checked: false },
        { name: "formularios_registro", label: "Formularios de registro de usuarios", checked: false },
        { name: "conexion_bd", label: "Conexión a bases de datos", checked: false },
        { name: "autenticacion_usuarios", label: "Sistema de autenticación de usuarios (login/registro)", checked: false },
        { name: "buscador_interno", label: "Buscador interno en el sitio web", checked: false },
        { name: "panel_administracion", label: "Panel de administración para gestión de contenido", checked: false },
        { name: "soporte_multimedia", label: "Soporte para archivos multimedia (imágenes, videos, audio)", checked: false },
        { name: "seguridad_ssl", label: "Implementación de seguridad SSL", checked: false },
        { name: "optimizacion_seo", label: "Optimización SEO para motores de búsqueda", checked: false },
        { name: "redes_sociales", label: "Integración con redes sociales", checked: false },
        { name: "diseño_responsive", label: "Diseño responsive (adaptado a dispositivos móviles)", checked: false },
        { name: "normas_accesibilidad", label: "Cumplimiento de normas de accesibilidad", checked: false },
        { name: "notificaciones_push", label: "Notificaciones push", checked: false },
        { name: "plataforma_ecommerce", label: "Plataforma de comercio electrónico", checked: false },
    ];

    // Actualizar el estado de un requisito funcional
    const handleRequirementChange = (index) => {
        const updatedRequirements = [...functionalRequirements];
        updatedRequirements[index].checked = !updatedRequirements[index].checked;
        onRequirementsChange({
            functionalRequirements: updatedRequirements,
            customRequirements,
        });
    };

    // Manejar cambios en el campo para agregar un requisito personalizado
    const handleCustomRequirementInput = (e) => {
        setCustomRequirement(e.target.value);
    };

    // Agregar un nuevo requisito personalizado
    const addCustomRequirement = () => {
        if (customRequirement.trim()) {
            const updatedCustomRequirements = [...customRequirements, customRequirement.trim()];
            onRequirementsChange({
                functionalRequirements,
                customRequirements: updatedCustomRequirements,
            });
            setCustomRequirement(""); // Limpia el campo de texto después de agregar
        }
    };

    // Eliminar un requisito personalizado
    const removeCustomRequirement = (index) => {
        const updatedCustomRequirements = customRequirements.filter((_, i) => i !== index);
        onRequirementsChange({
            functionalRequirements,
            customRequirements: updatedCustomRequirements,
        });
    };

    return (
        <fieldset>
            <section className="grid-container requisitos" id="req">
                <div className="item1 grid-item">
                    <h3>Requisitos del cliente</h3>
                </div>
                <div className="item3 grid-item">
                    {/* Lista de requisitos funcionales predefinidos */}
                    {predefinedRequirements.map((req, index) => (
                        <label key={req.name} style={{ display: "block", marginBottom: "0.5rem" }}>
                            <input
                                type="checkbox"
                                name={req.name}
                                checked={
                                    functionalRequirements.find((fr) => fr.name === req.name)?.checked || false
                                }
                                onChange={() => handleRequirementChange(index)}
                                disabled={readOnly} // Deshabilitar si está en modo solo lectura
                            />
                            {req.label}
                        </label>
                    ))}

                    {/* Campo para agregar requisitos personalizados */}
                    {!readOnly && (
                        <div style={{ marginTop: "1rem" }}>
                            <input
                                type="text"
                                placeholder="Escribe un nuevo requisito"
                                value={customRequirement}
                                onChange={handleCustomRequirementInput}
                            />
                            <button
                                type="button"
                                onClick={addCustomRequirement}
                                style={{
                                    marginLeft: "10px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "0.5rem",
                                }}
                            >
                                Agregar
                            </button>
                        </div>
                    )}

                    {/* Lista de requisitos personalizados */}
                    {customRequirements.length > 0 && (
                        <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
                            {customRequirements.map((req, index) => (
                                <li key={index} style={{ marginBottom: "0.5rem" }}>
                                    {req}
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            onClick={() => removeCustomRequirement(index)}
                                            style={{
                                                marginLeft: "10px",
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "0.3rem",
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </fieldset>
    );
};

export default RequirementsSection;