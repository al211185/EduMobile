import React, { useState, useEffect, useCallback } from "react";
import GeneralInformation from "./GeneralInformation";
import ObjectiveSection from "./ObjectiveSection";
import RequirementsSection from "./RequirementsSection";
import PreferencesSection from "./PreferencesSection";
import ReflectiveExercise from "./ReflectiveExercise";
import DesignPhase from "./DesignPhase";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectPlanning = ({ projectData = {} }) => {
    const { user } = useAuth(); // Acceso al usuario autenticado
    const navigate = useNavigate();
    const parseCorporateColors = (colors) => {
        if (Array.isArray(colors)) {
            const [primary, secondary1, secondary2] = colors;
            return {
                primary: primary || "#000000",
                secondary1: secondary1 || "#000000",
                secondary2: secondary2 || "#000000",
            };
        } else if (typeof colors === "string" && colors.includes(",")) {
            const [primary, secondary1, secondary2] = colors.split(",");
            return {
                primary: primary || "#000000",
                secondary1: secondary1 || "#000000",
                secondary2: secondary2 || "#000000",
            };
        }
        console.warn("Formato no válido de colores. Usando valores predeterminados.");
        return { primary: "#000000", secondary1: "#000000", secondary2: "#000000" };
    };

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

    const predefinedTechnologies = [
        { name: "javascript", label: "JavaScript", checked: false, description: "Para interacción en el lado del cliente." },
        { name: "php", label: "PHP", checked: false, description: "Para el manejo de formularios y procesamiento de datos del lado del servidor." },
        { name: "mysql", label: "MySQL", checked: false, description: "Para bases de datos en sitios que requieren almacenamiento de datos estructurados." },
        { name: "frameworks", label: "Frameworks", checked: false, description: "Para un desarrollo rápido de sitios web responsivos." },
        { name: "sass", label: "SASS", checked: false, description: "Para una mejor organización y mantenimiento de CSS en proyectos grandes." },
        { name: "wordpress", label: "WordPress", checked: false, description: "Para sitios que requieren fácil autogestión por parte del cliente." },
        { name: "nodejs", label: "Node.js", checked: false, description: "Para aplicaciones en tiempo real o de alta concurrencia." },
        { name: "ssl_tls", label: "SSL/TLS", checked: false, description: "Para garantizar la seguridad y protección de datos en sitios sensibles." },
        { name: "python", label: "Python", checked: false, description: "Para procesamiento avanzado de datos o IA." },
        { name: "rest_apis", label: "REST APIs", checked: false, description: "Para integrar servicios externos como pagos en línea, autenticación o servicios de terceros." },
    ];



    // Combina los requisitos funcionales predefinidos con los datos del proyecto cargados
    const initializeFunctionalRequirements = (predefined, loaded) => {
        return predefined.map((req) => ({
            ...req,
            checked: loaded?.includes(req.name) || false, // Marca como seleccionado si está en los datos cargados
        }));
    };

    const initializeAllowedTechnologies = (predefined, loaded) => {
        return predefined.map((tech) => ({
            ...tech,
            checked: loaded?.includes(tech.name) || false, // Marca como seleccionadas las tecnologías cargadas
        }));
    };

    const initialFormData = {
        title: projectData.title || "",
        clienteName: projectData.clienteName || "",
        responsable: projectData.responsable || "",
        startDate: projectData.startDate && projectData.startDate !== "0001-01-01T00:00:00"
            ? projectData.startDate.split("T")[0]
            : "",
        generalObjective: projectData.generalObjective || "",
        specificObjectives: Array.isArray(projectData.specificObjectives)
            ? projectData.specificObjectives
            : [],
        functionalRequirements: initializeFunctionalRequirements(predefinedRequirements, projectData.functionalRequirements),
        customRequirements: projectData.customRequirements || [],
        corporateColors: parseCorporateColors(projectData.corporateColors),
        corporateFont: projectData.corporateFont || "Arial",
        allowedTechnologies: initializeAllowedTechnologies(predefinedTechnologies, projectData.allowedTechnologies),
        customTechnologies: projectData.customTechnologies || [],
        customTechnology: "",
        reflectiveAnswers: (() => {
            try {
                return projectData.reflectiveAnswers
                    ? JSON.parse(projectData.reflectiveAnswers)
                    : { designFocus: "", functionalRequirements: "", frameworks: "" };
            } catch {
                console.error("Error al analizar reflectiveAnswers:", projectData.reflectiveAnswers);
                return { designFocus: "", functionalRequirements: "", frameworks: "" };
            }
        })(),
        description: projectData.description || "",
    };



    const [formData, setFormData] = useState(initialFormData);
    const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const handlePreferencesChange = useCallback((updatedPreferences) => {
        setFormData((prev) => ({
            ...prev,
            ...updatedPreferences,
        }));
    }, []);
    const handleRequirementsChange = (updatedRequirements) => {
        setFormData((prev) => ({
            ...prev,
            ...updatedRequirements,
        }));
    };


    // Prellenar el campo Responsable si está vacío
    useEffect(() => {
        if (!formData.responsable && user?.nombre) {
            setFormData((prev) => ({
                ...prev,
                responsable: `${user.nombre} ${user.apellidoPaterno || ""}`,
            }));
        }
    }, [formData.responsable, user]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleArrayInputChange = useCallback((key, index, value) => {
        const updatedArray = [...formData[key]];
        updatedArray[index] = value;
        setFormData((prev) => ({ ...prev, [key]: updatedArray }));
    }, [formData]);

    const handleAddToArray = useCallback((key) => {
        setFormData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
    }, []);

    const handleRemoveFromArray = useCallback((key, index) => {
        const updatedArray = formData[key].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, [key]: updatedArray }));
    }, [formData]);

    const handleReflectiveAnswersChange = useCallback((newAnswers) => {
        setFormData((prev) => ({ ...prev, reflectiveAnswers: newAnswers }));
    }, []);


    useEffect(() => {
        const validateFields = () => {
            const errors = [];
            if (!formData.title.trim()) errors.push("El título del proyecto es obligatorio.");
            if (!formData.clienteName.trim()) errors.push("El nombre del cliente es obligatorio.");
            if (!formData.responsable.trim()) errors.push("El responsable del proyecto es obligatorio.");
            if (!formData.startDate) errors.push("La fecha de inicio es obligatoria.");
            if (!formData.generalObjective.trim()) errors.push("El objetivo general es obligatorio.");
            if (formData.specificObjectives.some((obj) => !obj.trim()))
                errors.push("Todos los objetivos específicos son obligatorios.");
            if (Object.values(formData.reflectiveAnswers).some((answer) => !answer.trim()))
                errors.push("Es necesario completar todas las respuestas reflexivas.");

            setErrorMessages(errors);
            return errors.length === 0;
        };

        setAllFieldsCompleted(validateFields());
    }, [formData]);

    const saveProgress = async () => {
        if (!projectData.id) {
            alert("Error: No se encontró el ID del proyecto.");
            return;
        }

        setIsSaving(true);

        const payload = {
            projectId: projectData.id,
            title: formData.title,
            description: formData.description || "",
            startDate: formData.startDate || null,
            generalObjective: formData.generalObjective || "",
            specificObjectives: formData.specificObjectives || [],
            functionalRequirements: formData.functionalRequirements
                .filter((req) => req.checked)
                .map((req) => req.name),
            customRequirements: formData.customRequirements || [],
            corporateColors: {
                primary: formData.corporateColors.primary,
                secondary1: formData.corporateColors.secondary1,
                secondary2: formData.corporateColors.secondary2,
            },
            corporateFont: formData.corporateFont || "Arial",
            allowedTechnologies: formData.allowedTechnologies
                .filter((tech) => tech.checked)
                .map((tech) => tech.name),
            customTechnologies: formData.customTechnologies || [],
            reflectiveAnswers: JSON.stringify(formData.reflectiveAnswers || {}),
            clienteName: formData.clienteName || "",
            responsable: formData.responsable || "Sin responsable",
        };

        console.log("Datos enviados al servidor (Guardar Progreso):", payload);

        try {
            const response = await fetch("/api/projects/save-phase-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Progreso guardado exitosamente");
            } else {
                const errorData = await response.json();
                console.error("Error al guardar progreso:", errorData);
                alert(errorData.message || "Error desconocido al guardar el progreso.");
            }
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
            alert("Hubo un error al guardar el progreso.");
        } finally {
            setIsSaving(false);
        }
    };

    const completePhase = async () => {
        if (!allFieldsCompleted) {
            alert("Por favor, completa todos los campos antes de completar la fase.");
            return;
        }

        try {
            await saveProgress(); // Guarda los datos
            console.log("Fase 1 completada. Redirigiendo a Fase 2 (Diseño)...");
            navigate(`/fase-2-diseno/${projectData.id}`); // Incluye el projectId en la URL
        } catch (error) {
            console.error("Error al completar la fase:", error);
            alert("Ocurrió un error al completar la fase. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="project-planning-container">
            <GeneralInformation formData={formData} handleInputChange={handleInputChange} />
            <ObjectiveSection
                generalObjective={formData.generalObjective}
                specificObjectives={formData.specificObjectives}
                handleGeneralObjectiveChange={(value) =>
                    setFormData((prev) => ({ ...prev, generalObjective: value }))
                }
                handleSpecificObjectiveChange={(index, value) =>
                    handleArrayInputChange("specificObjectives", index, value)
                }
                handleAddSpecificObjective={() => handleAddToArray("specificObjectives")}
                handleRemoveSpecificObjective={(index) =>
                    handleRemoveFromArray("specificObjectives", index)
                }
            />
            <RequirementsSection
                functionalRequirements={formData.functionalRequirements}
                customRequirements={formData.customRequirements}
                onRequirementsChange={handleRequirementsChange}
            />

            <PreferencesSection
                preferences={{
                    corporateColors: formData.corporateColors,
                    corporateFont: formData.corporateFont,
                    allowedTechnologies: formData.allowedTechnologies,
                    customTechnologies: formData.customTechnologies,
                    customTechnology: formData.customTechnology,
                }}
                handlePreferencesChange={handlePreferencesChange}
            />

            <ReflectiveExercise
                answers={formData.reflectiveAnswers}
                onAnswersChange={handleReflectiveAnswersChange}
            />

            <div className="buttons-container">
                <button
                    disabled={isSaving}
                    onClick={saveProgress}
                    className="btn-secondary"
                >
                    {isSaving ? "Guardando..." : "Guardar Progreso"}
                </button>
                <button
                    disabled={!allFieldsCompleted || isSaving}
                    onClick={completePhase}
                    className={`btn-primary ${isSaving ? "saving" : ""}`}
                >
                    {isSaving ? "Guardando..." : "Completar Fase"}
                </button>
            </div>

            {errorMessages.length > 0 && (
                <ul className="error-messages">
                    {errorMessages.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default ProjectPlanning;
