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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Fase de Evaluación</h2>
            <p className="text-gray-700">
                Utiliza las siguientes herramientas para evaluar la eficacia, usabilidad,
                accesibilidad y rendimiento de tu proyecto. Luego, documenta manualmente
                los resultados en tu repositorio de GitHub.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {externalTools.map((tool, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-500 hover:underline"
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
