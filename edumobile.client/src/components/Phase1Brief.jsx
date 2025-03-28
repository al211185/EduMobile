import React, { useState, useEffect } from "react";

// Lista de valores conocidos para los requisitos (los que se usan en los checkboxes)
const knownRequisitos = [
    "formularios_contacto",
    "formularios_registro",
    "conexion_bd",
    "autenticacion_usuarios",
    "buscador_interno",
    "panel_administracion",
    "soporte_multimedia",
    "seguridad_ssl",
    "optimizacion_seo",
    "redes_sociales",
    "diseño_responsive",
    "normas_accesibilidad",
    "notificaciones_push",
    "plataforma_ecommerce"
];

// Helper para parsear la cadena de functionalRequirements
function parseRequirements(reqString) {
    if (!reqString) return { selected: [], otros: "" };
    const parts = reqString
        .split(";")
        .map((p) => p.trim())
        .filter((p) => p !== "");
    const selected = parts.filter((p) => knownRequisitos.includes(p));
    const otros = parts.filter((p) => !knownRequisitos.includes(p)).join(";");
    return { selected, otros };
}

const Phase1Brief = ({ data, onSave }) => {
    const [formData, setFormData] = useState({
        projectName: "",
        clienteName: "",
        responsable: "",
        startDate: "",
        generalObjective: "",
        specificObjectives: ["", "", ""],
        requisitos: { selected: [], otros: "" },
        preferencias: {
            primaryColor: "#000000",
            secondary1Color: "#000000",
            secondary2Color: "#000000",
            font: ""
        },
        allowedTechnologies: { selected: [], otros: "" },
        reflectiveAnswers: []
    });

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (data && !isInitialized) {
            setFormData({
                projectName: data.projectName || "",
                clienteName: data.clienteName || "",
                responsable: data.responsable || "",
                startDate: data.startDate ? data.startDate.split("T")[0] : "",
                generalObjective: data.generalObjective || "",
                specificObjectives: data.specificObjectives
                    ? data.specificObjectives.split(";")
                    : ["", "", ""],
                requisitos: {
                    selected: data.functionalRequirements
                        ? parseRequirements(data.functionalRequirements).selected
                        : [],
                    otros: data.customRequirements || ""
                },
                preferencias: {
                    primaryColor: data.corporateColors ? data.corporateColors.split(",")[0] : "#000000",
                    secondary1Color: data.corporateColors ? data.corporateColors.split(",")[1] || "#000000" : "#000000",
                    secondary2Color: data.corporateColors ? data.corporateColors.split(",")[2] || "#000000" : "#000000",
                    font: data.corporateFont || ""
                },
                allowedTechnologies: {
                    selected: data.allowedTechnologies
                        ? data.allowedTechnologies.split(",").map(v => v.trim()).filter(v => v !== "")
                        : [],
                    otros: data.customTechnologies || ""
                },
                reflectiveAnswers: data.reflectionPhase1
                    ? data.reflectionPhase1.split(";").map(v => v.trim()).filter(v => v !== "")
                    : []
            });
            setIsInitialized(true);
        }
    }, [data, isInitialized]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleCheckboxChange = (section, value) => {
        setFormData(prev => {
            const currentSelected = prev[section]?.selected || [];
            return currentSelected.includes(value)
                ? {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        selected: currentSelected.filter(item => item !== value)
                    }
                }
                : {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        selected: [...currentSelected, value]
                    }
                };
        });
    };

    const handleReflectiveChange = (value) => {
        setFormData(prev => {
            const current = prev.reflectiveAnswers;
            return current.includes(value)
                ? { ...prev, reflectiveAnswers: current.filter(v => v !== value) }
                : { ...prev, reflectiveAnswers: [...current, value] };
        });
    };

    const handleSpecificObjectiveChange = (index, value) => {
        setFormData(prev => {
            const objectives = [...prev.specificObjectives];
            objectives[index] = value;
            return { ...prev, specificObjectives: objectives };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.projectName.trim() ||
            !formData.clienteName.trim() ||
            !formData.responsable.trim() ||
            !formData.startDate ||
            !formData.generalObjective.trim()
        ) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const updatedData = {
            ProjectName: formData.projectName,
            ClienteName: formData.clienteName,
            Responsable: formData.responsable,
            StartDate: formData.startDate + "T00:00:00Z",
            GeneralObjective: formData.generalObjective,
            SpecificObjectives: formData.specificObjectives.join(";"),
            FunctionalRequirements: formData.requisitos.selected.join(";"),
            CustomRequirements: formData.requisitos.otros,
            CorporateColors: `${formData.preferencias.primaryColor},${formData.preferencias.secondary1Color},${formData.preferencias.secondary2Color}`,
            CorporateFont: formData.preferencias.font,
            AllowedTechnologies: formData.allowedTechnologies.selected.join(","),
            CustomTechnologies: formData.allowedTechnologies.otros,
            ReflectionPhase1: formData.reflectiveAnswers.join(";"),
        };

        onSave(updatedData);
    };

    return (
        // Contenedor con altura fija y display flex en columna
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg h-[90vh] flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Contenedor scrollable para el contenido */}
                <div className="overflow-y-auto flex-1 pr-4 space-y-8 p-6">
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-xl font-semibold text-gray-800 px-2">Fase 1: Brief de diseño</legend>
                        <p className="text-gray-700">
                            En esta sección resolverás las fases de <strong>Identificación de los objetivos del proyecto web</strong> y <strong>Establecimiento de los requisitos del cliente</strong> del proyecto web.
                        </p>
                        <p className="text-gray-700">
                            Llena los campos que se muestran a continuación y después contesta las preguntas para continuar a la siguiente sección.
                        </p>
                    </fieldset>

                    {/* Información general */}
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Información general del proyecto</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="projectName" className="text-gray-700 font-medium">Nombre del proyecto:</label>
                                <input
                                    type="text"
                                    id="projectName"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="clienteName" className="text-gray-700 font-medium">Nombre del cliente:</label>
                                <input
                                    type="text"
                                    id="clienteName"
                                    name="clienteName"
                                    value={formData.clienteName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="responsable" className="text-gray-700 font-medium">Responsable del proyecto:</label>
                                <input
                                    type="text"
                                    id="responsable"
                                    name="responsable"
                                    value={formData.responsable}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="startDate" className="text-gray-700 font-medium">Fecha de inicio:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Objetivos del proyecto */}
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Objetivos del proyecto</legend>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="generalObjective" className="text-gray-700 font-medium">
                                    <strong>Objetivo general:</strong>
                                </label>
                                <textarea
                                    id="generalObjective"
                                    name="generalObjective"
                                    value={formData.generalObjective}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-2"
                                ></textarea>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">
                                    <strong>Objetivos específicos:</strong> Escribir de 2 a 3 objetivos claros y medibles
                                </label>
                                {formData.specificObjectives.map((obj, index) => (
                                    <div key={index} className="mt-2">
                                        <label htmlFor={`obj${index + 1}`} className="text-gray-600">Objetivo {index + 1}:</label>
                                        <input
                                            type="text"
                                            id={`obj${index + 1}`}
                                            value={obj}
                                            onChange={(e) => handleSpecificObjectiveChange(index, e.target.value)}
                                            className="border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    {/* Requisitos del cliente */}
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Requisitos del cliente</legend>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-700 font-medium"><strong>Requisitos funcionales:</strong></label>
                                <div className="mt-2 space-y-1">
                                    {[
                                        { value: "formularios_contacto", label: "Formularios de contacto" },
                                        { value: "formularios_registro", label: "Formularios de registro de usuarios" },
                                        { value: "conexion_bd", label: "Conexión a bases de datos" },
                                        { value: "autenticacion_usuarios", label: "Sistema de autenticación (login/registro)" },
                                        { value: "buscador_interno", label: "Buscador interno en el sitio web" },
                                        { value: "panel_administracion", label: "Panel de administración" },
                                        { value: "soporte_multimedia", label: "Soporte para multimedia" },
                                        { value: "seguridad_ssl", label: "Seguridad SSL" },
                                        { value: "optimizacion_seo", label: "Optimización SEO" },
                                        { value: "redes_sociales", label: "Integración con redes sociales" },
                                        { value: "diseño_responsive", label: "Diseño responsive" },
                                        { value: "normas_accesibilidad", label: "Normas de accesibilidad" },
                                        { value: "notificaciones_push", label: "Notificaciones push" },
                                        { value: "plataforma_ecommerce", label: "Comercio electrónico" }
                                    ].map((item) => (
                                        <label key={item.value} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={item.value}
                                                checked={formData.requisitos.selected.includes(item.value)}
                                                onChange={() => handleCheckboxChange("requisitos", item.value)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="otros" className="text-gray-700 font-medium">Otros requisitos:</label>
                                <input
                                    type="text"
                                    id="otros"
                                    value={formData.requisitos.otros}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            requisitos: { ...prev.requisitos, otros: e.target.value }
                                        }))
                                    }
                                    className="border border-gray-300 rounded p-2 mt-1 w-full"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Restricciones y preferencias */}
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Restricciones y preferencias</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium"><strong>Colores corporativos:</strong></label>
                                <div className="space-y-2 mt-2">
                                    <div>
                                        <label htmlFor="primaryColor" className="block text-gray-600">Color primario</label>
                                        <input
                                            type="color"
                                            id="primaryColor"
                                            name="primaryColor"
                                            value={formData.preferencias.primaryColor}
                                            onChange={(e) =>
                                                handleNestedChange("preferencias", "primaryColor", e.target.value)
                                            }
                                            className="w-full h-10 p-0 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="secondary1Color" className="block text-gray-600">Color secundario 1</label>
                                        <input
                                            type="color"
                                            id="secondary1Color"
                                            name="secondary1Color"
                                            value={formData.preferencias.secondary1Color}
                                            onChange={(e) =>
                                                handleNestedChange("preferencias", "secondary1Color", e.target.value)
                                            }
                                            className="w-full h-10 p-0 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="secondary2Color" className="block text-gray-600">Color secundario 2</label>
                                        <input
                                            type="color"
                                            id="secondary2Color"
                                            name="secondary2Color"
                                            value={formData.preferencias.secondary2Color}
                                            onChange={(e) =>
                                                handleNestedChange("preferencias", "secondary2Color", e.target.value)
                                            }
                                            className="w-full h-10 p-0 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="font" className="text-gray-700 font-medium"><strong>Tipografías corporativas:</strong></label>
                                <input
                                    type="text"
                                    id="font"
                                    name="font"
                                    placeholder="Tipografías"
                                    value={formData.preferencias.font}
                                    onChange={(e) =>
                                        handleNestedChange("preferencias", "font", e.target.value)
                                    }
                                    className="border border-gray-300 rounded p-2 mt-2"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-gray-700 font-medium"><strong>Tecnologías permitidas:</strong></label>
                                <div className="mt-2 space-y-1">
                                    {[
                                        { value: "js", label: "JavaScript: Para interacción en el lado del cliente." },
                                        { value: "php", label: "PHP: Para manejo de formularios y procesamiento." },
                                        { value: "sql", label: "MySQL: Para almacenamiento de datos estructurados." },
                                        { value: "frame", label: "Frameworks" },
                                        { value: "sass", label: "SASS" },
                                        { value: "wp", label: "WordPress" },
                                        { value: "node", label: "Node.js" },
                                        { value: "ssl", label: "SSL/TLS" },
                                        { value: "pyt", label: "Python" },
                                        { value: "rest", label: "REST APIs" }
                                    ].map((item) => (
                                        <label key={item.value} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={item.value}
                                                checked={formData.allowedTechnologies.selected.includes(item.value)}
                                                onChange={() => handleCheckboxChange("allowedTechnologies", item.value)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="tec" className="text-gray-700 font-medium">Otras tecnologías:</label>
                                    <input
                                        type="text"
                                        id="tec"
                                        name="tec"
                                        value={formData.allowedTechnologies.otros}
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                allowedTechnologies: {
                                                    ...prev.allowedTechnologies,
                                                    otros: e.target.value
                                                }
                                            }))
                                        }
                                        className="border border-gray-300 rounded p-2 mt-1 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Ejercicio reflexivo */}
                    <fieldset className="border border-gray-300 p-4 rounded">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Ejercicio reflexivo</legend>
                        <p className="text-gray-700">
                            Responde a las siguientes preguntas marcando en el recuadro y presiona el botón para pasar a la siguiente sección.
                        </p>
                        <div className="mt-4 space-y-2">
                            {[
                                {
                                    value: "formularios_contacto",
                                    label:
                                        "¿Dentro de los objetivos, se consideró importante el diseño para dispositivos móviles como primera opción?",
                                },
                                {
                                    value: "formularios_registro",
                                    label:
                                        "¿En los requisitos funcionales, se consideró el enfoque Mobile First en la optimización para motores de búsqueda?",
                                },
                                {
                                    value: "conexion_bd",
                                    label:
                                        "¿En las tecnologías permitidas, se contempló el uso de frameworks con enfoque Mobile First?",
                                },
                            ].map((item) => (
                                <label key={item.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={item.value}
                                        checked={formData.reflectiveAnswers.includes(item.value)}
                                        onChange={() => handleReflectiveChange(item.value)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-gray-700">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>

                {/* Contenedor fijo para los botones de navegación */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Phase1Brief;
