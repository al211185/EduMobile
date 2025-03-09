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

const Phase1Brief = ({ data, onNext }) => {
    // Estado inicial
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

    // Cuando se reciben datos, actualizar el estado usando las claves correctas (minúsculas)
    useEffect(() => {
        if (data) {
            console.log("Datos recibidos:", data);
            setFormData({
                projectName: data.projectName || "",
                clienteName: data.clienteName || "",
                responsable: data.responsable || "",
                startDate: data.startDate ? data.startDate.split("T")[0] : "",
                generalObjective: data.generalObjective || "",
                specificObjectives: data.specificObjectives
                    ? data.specificObjectives.split(";")
                    : ["", "", ""],
                requisitos: data.functionalRequirements
                    ? parseRequirements(data.functionalRequirements)
                    : { selected: [], otros: "" },
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
        }
    }, [data]);

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
        // Validación mínima
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

        // Armar los campos de Fase 1
        const updatedData = {
            ProjectName: formData.projectName,
            ClienteName: formData.clienteName,
            Responsable: formData.responsable,
            StartDate: formData.startDate + "T00:00:00Z",
            GeneralObjective: formData.generalObjective,
            SpecificObjectives: formData.specificObjectives.join(";"),
            FunctionalRequirements:
                formData.requisitos.selected.join(";") +
                (formData.requisitos.otros.trim()
                    ? ";" + formData.requisitos.otros
                    : ""),
            CustomRequirements: "",

            CorporateColors: `${formData.preferencias.primaryColor},${formData.preferencias.secondary1Color},${formData.preferencias.secondary2Color}`,
            CorporateFont: formData.preferencias.font,

            AllowedTechnologies:
                formData.allowedTechnologies.selected.join(",") +
                (formData.allowedTechnologies.otros.trim()
                    ? "," + formData.allowedTechnologies.otros
                    : ""),
            CustomTechnologies: "",

            ReflectionPhase1: formData.reflectiveAnswers.join(";"),
        };

        // Llamamos al onNext con SOLO lo de Fase 1
        onNext(updatedData);
    };

    return (
        <div className="project-planning-container">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        <h2>Fase 1: Brief de diseño</h2>
                    </legend>
                    <p>
                        En esta sección resolverás las fases de{" "}
                        <b>Identificación de los objetivos del proyecto web</b> y{" "}
                        <b>Establecimiento de los requisitos del cliente</b> del proyecto web.
                    </p>
                    <p>
                        Llena los campos que se muestran a continuación y después contesta las
                        preguntas para continuar a la siguiente sección.
                    </p>
                </fieldset>

                {/* Información general */}
                <fieldset>
                    <section className="grid-container informacion" id="info">
                        <div className="item1 grid-item">
                            <h3>Información general del proyecto</h3>
                        </div>
                        <div className="item2 grid-item">
                            <label htmlFor="projectName">Nombre del proyecto:</label>
                        </div>
                        <div className="item3 grid-item">
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                className="styled-input"
                            />
                        </div>
                        <div className="item4 grid-item">
                            <label htmlFor="clienteName">Nombre del cliente:</label>
                        </div>
                        <div className="item5 grid-item">
                            <input
                                type="text"
                                id="clienteName"
                                name="clienteName"
                                value={formData.clienteName}
                                onChange={handleChange}
                                className="styled-input"
                            />
                        </div>
                        <div className="item6 grid-item">
                            <label htmlFor="responsable">Responsable del proyecto:</label>
                        </div>
                        <div className="item7 grid-item">
                            <input
                                type="text"
                                id="responsable"
                                name="responsable"
                                value={formData.responsable}
                                onChange={handleChange}
                                className="styled-input"
                            />
                        </div>
                        <div className="item8 grid-item">
                            <label htmlFor="startDate">Fecha de inicio:</label>
                        </div>
                        <div className="item9 grid-item">
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="styled-input"
                            />
                        </div>
                    </section>
                </fieldset>

                {/* Objetivos del proyecto */}
                <fieldset>
                    <section className="grid-container objetivos" id="obj">
                        <div className="item1 grid-item">
                            <h3>Objetivos del proyecto</h3>
                        </div>
                        <div className="item2 grid-item">
                            <label htmlFor="generalObjective">
                                <b>Objetivo general:</b>
                            </label>
                        </div>
                        <div className="item3 grid-item">
                            <textarea
                                id="generalObjective"
                                name="generalObjective"
                                value={formData.generalObjective}
                                onChange={handleChange}
                                className="styled-input"
                            ></textarea>
                        </div>
                        <div className="item4 grid-item">
                            <label>
                                <b>Objetivos específicos:</b> Escribir de 2 a 3 objetivos claros y medibles
                            </label>
                        </div>
                        <div id="item5" className="item5 grid-item">
                            {formData.specificObjectives.map((obj, index) => (
                                <div key={index}>
                                    <label htmlFor={`obj${index + 1}`}>Objetivo {index + 1}:</label>
                                    <input
                                        type="text"
                                        id={`obj${index + 1}`}
                                        value={obj}
                                        onChange={(e) => handleSpecificObjectiveChange(index, e.target.value)}
                                        className="styled-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </fieldset>

                {/* Requisitos del cliente */}
                <fieldset>
                    <section className="grid-container requisitos" id="req">
                        <div className="item1 grid-item">
                            <h3>Requisitos del cliente</h3>
                        </div>
                        <div className="item2 grid-item">
                            <label>
                                <b>Requisitos funcionales:</b>
                            </label>
                        </div>
                        <div className="item3 grid-item">
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
                                <label key={item.value}>
                                    <input
                                        type="checkbox"
                                        value={item.value}
                                        checked={formData.requisitos.selected.includes(item.value)}
                                        onChange={() => handleCheckboxChange("requisitos", item.value)}
                                    />
                                    {item.label}
                                </label>
                            ))}
                            <br />
                            <label htmlFor="otros">Otros requisitos:</label>
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
                                className="styled-input"
                            />
                        </div>
                    </section>
                </fieldset>

                {/* Restricciones y preferencias */}
                <fieldset>
                    <section className="grid-container requisitos" id="requisitos">
                        <div className="item1 grid-item">
                            <h3>Restricciones y preferencias</h3>
                        </div>
                        <div className="item2 grid-item">
                            <label htmlFor="primaryColor">
                                <b>Colores corporativos:</b>
                            </label>
                        </div>
                        <div className="item3 grid-item">
                            <label htmlFor="primaryColor">Color primario</label>
                            <input
                                type="color"
                                id="primaryColor"
                                name="primaryColor"
                                value={formData.preferencias.primaryColor}
                                onChange={(e) =>
                                    handleNestedChange("preferencias", "primaryColor", e.target.value)
                                }
                                style={{ width: "100%", height: "40px", padding: 0 }}
                            />
                            <br />
                            <label htmlFor="secondary1Color">Color secundario 1</label>
                            <input
                                type="color"
                                id="secondary1Color"
                                name="secondary1Color"
                                value={formData.preferencias.secondary1Color}
                                onChange={(e) =>
                                    handleNestedChange("preferencias", "secondary1Color", e.target.value)
                                }
                                style={{ width: "100%", height: "40px", padding: 0 }}
                            />
                            <br />
                            <label htmlFor="secondary2Color">Color secundario 2</label>
                            <input
                                type="color"
                                id="secondary2Color"
                                name="secondary2Color"
                                value={formData.preferencias.secondary2Color}
                                onChange={(e) =>
                                    handleNestedChange("preferencias", "secondary2Color", e.target.value)
                                }
                                style={{ width: "100%", height: "40px", padding: 0 }}
                            />
                        </div>
                        <div className="item4 grid-item">
                            <label htmlFor="font">
                                <b>Tipografías corporativas:</b>
                            </label>
                        </div>
                        <div className="item5 grid-item">
                            <input
                                type="text"
                                id="font"
                                name="font"
                                placeholder="Tipografías"
                                value={formData.preferencias.font}
                                onChange={(e) =>
                                    handleNestedChange("preferencias", "font", e.target.value)
                                }
                                className="styled-input"
                            />
                        </div>
                        <div className="item6 grid-item">
                            <b>Tecnologías permitidas:</b>
                        </div>
                        <div className="item7 grid-item">
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
                                <label key={item.value}>
                                    <input
                                        type="checkbox"
                                        value={item.value}
                                        checked={formData.allowedTechnologies.selected.includes(item.value)}
                                        onChange={() => handleCheckboxChange("allowedTechnologies", item.value)}
                                    />
                                    {item.label}
                                </label>
                            ))}
                            <br />
                            <label htmlFor="tec">Otras tecnologías:</label>
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
                                className="styled-input"
                            />
                        </div>
                    </section>
                </fieldset>

                {/* Ejercicio reflexivo */}
                <fieldset>
                    <legend>
                        <h3>Ejercicio reflexivo</h3>
                    </legend>
                    <p>
                        Responde a las siguientes preguntas marcando en el recuadro y presiona el botón para pasar a la siguiente sección.
                    </p>
                    <div className="checklist">
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
                            <label key={item.value}>
                                <input
                                    type="checkbox"
                                    value={item.value}
                                    checked={formData.reflectiveAnswers.includes(item.value)}
                                    onChange={() => handleReflectiveChange(item.value)}
                                />
                                {item.label}
                            </label>
                        ))}
                    </div>
                    <button
                        type="submit"
                        id="complete-phase1"
                        disabled={
                            !formData.projectName.trim() ||
                            !formData.clienteName.trim() ||
                            !formData.responsable.trim() ||
                            !formData.startDate ||
                            !formData.generalObjective.trim()
                        }
                    >
                        Completar Fase 1
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default Phase1Brief;
