import React from "react";

const EvaluationPhase = ({ projectId, phaseData, onSave }) => {
    const externalTools = [
        {
            name: "Lighthouse",
            url: "https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=es",
            description:
                "Audita el rendimiento, accesibilidad y mejores prácticas de tu sitio web.",
        },
        {
            name: "Google PageSpeed Insights",
            url: "https://developers.google.com/speed/pagespeed/insights/",
            description:
                "Analiza el rendimiento de tu página en dispositivos móviles y de escritorio.",
        },
        {
            name: "WAVE Accessibility",
            url: "https://wave.webaim.org/",
            description:
                "Evalúa la accesibilidad de tu sitio para identificar barreras de uso.",
        },
        {
            name: "GTmetrix",
            url: "https://gtmetrix.com/",
            description:
                "Proporciona un análisis detallado del rendimiento y tiempos de carga de tu sitio.",
        },
        {
            name: "Pingdom Website Speed Test",
            url: "https://tools.pingdom.com/",
            description:
                "Permite evaluar la velocidad de carga y optimizar la experiencia del usuario.",
        },
    ];

    return (
        <div className="evaluation-phase-container">
            <h2 className="evaluation-title">Fase de Evaluación</h2>
            <p className="evaluation-description">
                Utiliza las siguientes herramientas para evaluar la eficacia, usabilidad,
                accesibilidad y rendimiento de tu proyecto. Luego, documenta manualmente
                los resultados en tu repositorio de GitHub.
            </p>
            <div className="external-tools-container">
                {externalTools.map((tool, index) => (
                    <div key={index} className="tool-card">
                        <h3 className="tool-title">{tool.name}</h3>
                        <p className="tool-description">{tool.description}</p>
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tool-link"
                        >
                            Abrir {tool.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluationPhase;
