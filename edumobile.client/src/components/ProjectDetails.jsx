import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GeneralInformation from "./GeneralInformation";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isReadOnly = user?.role === "Profesor";

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
        { name: "javascript", label: "JavaScript", checked: false },
        { name: "php", label: "PHP", checked: false },
        { name: "mysql", label: "MySQL", checked: false },
        { name: "frameworks", label: "Frameworks", checked: false },
        { name: "sass", label: "SASS", checked: false },
        { name: "wordpress", label: "WordPress", checked: false },
        { name: "nodejs", label: "Node.js", checked: false },
        { name: "ssl_tls", label: "SSL/TLS", checked: false },
        { name: "python", label: "Python", checked: false },
        { name: "rest_apis", label: "REST APIs", checked: false },
    ];

    const initializeFunctionalRequirements = (predefined, loaded) => {
        return predefined.map((req) => ({
            ...req,
            checked: loaded?.some((fr) => fr === req.name) || false,
        }));
    };

    const initializeAllowedTechnologies = (predefined, loaded) => {
        return predefined.map((tech) => ({
            ...tech,
            checked: loaded?.some((at) => at === tech.name) || false,
        }));
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();

                    const parsedData = {
                        ...data,
                        functionalRequirements: initializeFunctionalRequirements(predefinedRequirements, data.functionalRequirements),
                        allowedTechnologies: initializeAllowedTechnologies(predefinedTechnologies, data.allowedTechnologies),
                        corporateColors: parseCorporateColors(data.corporateColors),
                        reflectiveAnswers: JSON.parse(data.reflectiveAnswers || "{}"),
                        responsable: data.createdByName || "No definido", // Asigna responsable explícitamente
                    };
                    setProjectData(parsedData);
                } else {
                    console.error("Error al cargar el proyecto.");
                }
            } catch (error) {
                console.error("Error al obtener los detalles del proyecto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    if (loading) {
        return <div>Cargando detalles del proyecto...</div>;
    }

    if (!projectData) {
        return <div>No se encontraron detalles para este proyecto.</div>;
    }

    return (
        <div className="project-details-container">
            <h1>Detalles del Proyecto</h1>
            <GeneralInformation formData={projectData} readOnly={isReadOnly} />
            <ObjectiveSection
                generalObjective={projectData.generalObjective}
                specificObjectives={projectData.specificObjectives}
                readOnly={isReadOnly}
            />
            <RequirementsSection
                functionalRequirements={projectData.functionalRequirements}
                customRequirements={projectData.customRequirements}
                readOnly={isReadOnly}
            />
            <PreferencesSection
                preferences={{
                    corporateColors: projectData.corporateColors,
                    corporateFont: projectData.corporateFont,
                    allowedTechnologies: projectData.allowedTechnologies,
                    customTechnologies: projectData.customTechnologies,
                }}
                readOnly={isReadOnly}
            />
            <ReflectiveExercise answers={projectData.reflectiveAnswers} readOnly={isReadOnly} />
        </div>
    );
};

export default ProjectDetails;
