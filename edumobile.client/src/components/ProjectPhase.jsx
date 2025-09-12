import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProjectPlanning from "./PlanningPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import EvaluationPhase from "./EvaluationPhase";
import AddParticipantModal from "./AddParticipantModal";
import TeamList from "./TeamList";
import PhaseAssignmentEditor from "./PhaseAssignmentEditor";

const ProjectPhase = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const isProfessor = user?.role === "Profesor"; // Si es profesor, se activa el modo readOnly

    const [project, setProject] = useState(null);
    const [phaseData, setPhaseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTeamList, setShowTeamList] = useState(false);
    // Estado para mostrar el editor de asignaciones, visible solo para el creador
    const [showPhaseAssignmentEditor, setShowPhaseAssignmentEditor] = useState(false);
    // 1: Planeación, 2: Diseño, 3: Desarrollo, 4: Evaluación
    const [currentPhase, setCurrentPhase] = useState(1);
    const [currentUserId, setCurrentUserId] = useState("");

    const [professorId, setProfessorId] = useState(null);

    // Estado para almacenar la retroalimentación del profesor por fase
    const [teacherFeedback, setTeacherFeedback] = useState({
        1: "",
        2: "",
        3: "",
        4: ""
    });

    // Si la URL incluye un parámetro ?phase, ajusta la fase inicial
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const phaseParam = parseInt(params.get("phase"), 10);
        if (phaseParam >= 1 && phaseParam <= 4) {
            setCurrentPhase(phaseParam);
        }
    }, [location.search]);


    useEffect(() => {
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId) setCurrentUserId(storedUserId);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Usamos el mismo endpoint para todos los usuarios
                const response = await fetch(`/api/projects/${projectId}`);
                const data = await response.json();
                if (response.ok) {
                    setProject(data);
                    setProfessorId(data.semesterProfessorId);  // guardas el prof ID
                } else {
                    setError(data.message || "No se pudo cargar el proyecto.");
                }
            } catch (err) {
                setError("Error al obtener los datos del proyecto.");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSaveData = async (updatedData) => {
        // Si el usuario es profesor en modo readOnly, no se actualizan los datos principales
        if (isProfessor) {
            return true;
        }
        if (currentPhase === 4) {
            setPhaseData(updatedData);
            alert("Evaluación guardada exitosamente.");
            return true;
        }
        try {
            let endpoint = "";
            switch (currentPhase) {
                case 1:
                    endpoint = `/api/planningphases/${projectId}`;
                    break;
                case 2:
                    endpoint = `/api/designphases/${projectId}`;
                    break;
                case 3:
                    endpoint = `/api/developmentphases/byproject/${projectId}`;
                    break;
                default:
                    throw new Error("Fase no válida");
            }
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la fase.");
            }
            const newPhaseData = await response.json();
            setPhaseData(newPhaseData);
            alert("Datos guardados exitosamente.");
            return true;
        } catch (error) {
            console.error("Error al guardar la fase:", error);
            alert("Error al guardar los datos. Inténtalo nuevamente.");
            return false;
        }
    };

    const handleNextPhase = () => {
        // Permite la navegación entre fases incluso en modo readOnly
        if (currentPhase < 4) {
            setCurrentPhase((prev) => prev + 1);
        } else {
            navigate("/my-projects");
        }
    };

    const handlePrevPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase((prev) => prev - 1);
        }
    };

    const formatValue = (val) => {
        if (val === null || val === undefined) return "";
        if (typeof val === "boolean") return val ? "Sí" : "No";
        if (typeof val === "string") {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed.join(", ");
                if (typeof parsed === "object")
                    return Object.entries(parsed)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ");
            } catch { }
            return val.replace(/;/g, "; ");
        }
        if (typeof val === "object") return objectToLines(val).join("\n");
        return val.toString();
    };

    const objectToLines = (obj) => {
        const skip = ["id", "projectId", "project", "updatedAt", "createdAt"];
        const lines = [];
        for (const [key, value] of Object.entries(obj || {})) {
            if (skip.includes(key.toLowerCase())) continue;
            const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim();
            if (key.toLowerCase() === "audiencequestions") {
                try {
                    const parsed = JSON.parse(value);
                    lines.push("Preguntas de Audiencia:");
                    const catMap = {
                        demographics: "Datos Demográficos",
                        behavior: "Preguntas sobre Comportamiento",
                        expectations: "Expectativas y Opiniones",
                        preferences: "Preferencias Tecnológicas",
                        custom: "Preguntas Personalizadas"
                    };
                    for (const [cat, arr] of Object.entries(parsed || {})) {
                        if (Array.isArray(arr) && arr.length) {
                            const capCat = catMap[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
                            lines.push(`  ${capCat}:`);
                            arr.forEach((q, idx) => lines.push(`    ${idx + 1}. ${q}`));
                        }
                    }
                } catch {
                    lines.push(`${label}: ${formatValue(value)}`);
                }
            } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                lines.push(`${label}:`);
                objectToLines(value).forEach((l) => lines.push(`  ${l}`));
            } else {
                lines.push(`${label}: ${formatValue(value)}`);
            }
        }
        return lines;
    };


    // Genera un PDF con la información de todas las fases del proyecto
    const handleDownloadPDF = async () => {
        try {
            const [planRes, designRes, devRes] = await Promise.all([
                fetch(`/api/planningphases/${projectId}`),
                fetch(`/api/designphases/${projectId}`),
                fetch(`/api/developmentphases/byproject/${projectId}`)
            ]);
            const planData = planRes.ok ? await planRes.json() : {};
            const designData = designRes.ok ? await designRes.json() : {};
            const devData = devRes.ok ? await devRes.json() : {};

            const doc = new jsPDF("p", "pt", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFillColor(79, 70, 229);
            doc.rect(0, 0, pageWidth, 60, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.text("Reporte del Proyecto", pageWidth / 2, 35, { align: "center" });

            let y = 80;

            const addSection = (title, data) => {

                const lines = objectToLines(data);
                if (!lines.length) return;

                // Fondo tipo "pill" para el título
                const pillBg = [238, 242, 255]; // #EEF2FF
                doc.setFillColor(...pillBg);
                doc.roundedRect(40, y - 6, pageWidth - 80, 24, 6, 6, "F");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(79, 70, 229);
                doc.text(title, 50, y + 12);
                y += 36;

                const marginX = 40;
                const contentWidth = pageWidth - marginX * 2;

                const fields = lines.map((line) => {
                    const indent = (line.match(/^\s*/)[0].length / 2) || 0;
                    const text = line.trim();
                    if (text.endsWith(":") && !text.includes(": ")) {
                        return { heading: true, label: text.slice(0, -1), indent };
                    }
                    const [label, value] = text.split(/:(.+)/);
                    return {
                        heading: false,
                        label: (label || "").trim(),
                        value: (value || "").trim(),
                        indent
                    };
                });

                fields.forEach((field) => {
                    if (field.heading) {
                        if (y > doc.internal.pageSize.getHeight() - 60) {
                            doc.addPage();
                            y = 40;
                        }
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(12);
                        doc.setTextColor(79, 70, 229);
                        doc.text(field.label, marginX + field.indent * 20, y);
                        y += 20;
                        return;
                    }

                    const x = marginX + field.indent * 20;
                    const usableWidth = contentWidth - field.indent * 20;

                    if (!field.value) {
                        if (/^\d+\.\s/.test(field.label)) {
                            if (y > doc.internal.pageSize.getHeight() - 40) {
                                doc.addPage();
                                y = 40;
                            }
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(12);
                            doc.setTextColor(44, 62, 80);
                            const qLines = doc.splitTextToSize(field.label, usableWidth - 10);
                            qLines.forEach((line, idx) => {
                                if (y > doc.internal.pageSize.getHeight() - 40) {
                                    doc.addPage();
                                    y = 40;
                                }
                                if (idx === 0) doc.circle(x - 10, y - 4, 2, "F");
                                doc.text(line, x, y);
                                y += 14;
                            });
                            y += 6;
                            return;
                        }
                        if (y > doc.internal.pageSize.getHeight() - 40) {
                            doc.addPage();
                            y = 40;
                        }
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(12);
                        doc.setTextColor(44, 62, 80);
                        doc.text(field.label, x, y);
                        y += 20;
                        return;
                    }

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    doc.setTextColor(79, 70, 229);
                    doc.text(field.label, x, y);

                    const valueLines = doc.splitTextToSize(field.value, usableWidth - 10);
                    const boxHeight = valueLines.length * 16 + 6;
                    const requiredHeight = boxHeight + 24;

                    if (y + requiredHeight > doc.internal.pageSize.getHeight() - 40) {
                        doc.addPage();
                        y = 40;
                    }

                    doc.setFillColor(243, 244, 246); // #F3F4F6
                    doc.roundedRect(x, y + 4, usableWidth, boxHeight, 4, 4, "F");
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(44, 62, 80);
                    doc.text(valueLines, x + 5, y + 18);

                    y += requiredHeight;
                });

                y += 10;
            };

            addSection("Planeaci\u00f3n", planData);
            addSection("Dise\u00f1o", designData);
            addSection("Desarrollo", devData);

            const footerY = doc.internal.pageSize.getHeight() - 40;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(1);
            doc.line(40, footerY, pageWidth - 40, footerY);
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            const currentDate = new Date().toLocaleDateString();
            doc.text(`Generado el: ${currentDate}`, 40, footerY + 15);

            doc.save("reporte_proyecto.pdf");
        } catch (err) {
            console.error("Error al generar PDF", err);
            alert("Error al generar el PDF");
        }
    };


    // Nueva función para confirmar el cierre del proyecto
    const handleFinish = async () => {
        const ok = window.confirm(
            "¿Estás seguro de finalizar? Se notificará al profesor que has terminado el proyecto."
        );
        if (!ok) return;
        // 1) enviar notificación
        try {
            await fetch("/api/Notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserId: professorId,
                    Message: `El alumno ${user.nombre} ha finalizado el proyecto "${project.title}".`
                })
            });
        } catch (_) {
            console.error("No se pudo enviar la notificación.");
        }
        // 2) navegar de vuelta
        navigate("/my-projects");
    };

    // Se definen las props comunes para cada fase. Si el usuario es profesor se incluye feedback.
    const commonProps = {
        projectId,
        phaseData,
        readOnly: isProfessor,
        ...(isProfessor && {
            feedback: teacherFeedback[currentPhase],
            onFeedbackChange: (newFeedback) =>
                setTeacherFeedback((prev) => ({ ...prev, [currentPhase]: newFeedback }))
        })
    };

    // Renderiza el componente de la fase según el estado actual
    const renderPhaseComponent = () => {
        switch (currentPhase) {
            case 1:
                return (
                    <ProjectPlanning
                        projectData={project}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        onNext={handleNextPhase}
                        {...commonProps}
                    />
                );
            case 2:
                return (
                    <DesignPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        {...commonProps}
                    />
                );
            case 3:
                return (
                    <DevelopmentPhase
                        projectId={projectId}
                        data={phaseData}
                        onSave={handleSaveData}
                        onPrev={handlePrevPhase}
                        onNext={handleNextPhase}
                        {...commonProps}
                    />
                );
            case 4:
                return (
                    <EvaluationPhase
                        projectId={projectId}
                        phaseData={phaseData}
                        onSave={handleSaveData}
                        onPrev={handlePrevPhase}
                        onNext={handleNextPhase}
                        {...commonProps}
                    />
                );
            default:
                return null;
        }
    };

    if (loading)
        return <p className="text-center text-gray-600 mt-4">Cargando proyecto...</p>;
    if (error)
        return <p className="text-center text-red-500 mt-4">{error}</p>;
    if (!project)
        return <p className="text-center text-red-500 mt-4">Error: Proyecto no encontrado.</p>;

    const isCreator = project && currentUserId && project.createdById === currentUserId;
    const progress = (currentPhase / 4) * 100;

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="sticky top-0 bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-gray-800 leading-tight">
                            {project.title}
                        </h1>
                        <p className="text-gray-600 text-xs leading-tight">
                            {project.description}
                        </p>
                    </div>
                    <div className="bg-gray-200 h-2 w-32 md:w-48 rounded-full relative">
                        <div
                            className="bg-[#4F46E5] h-2 rounded-full absolute top-0 left-0 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2">

                    {/* El botón "Agregar Participante" solo se muestra para alumnos */}
                    {!isProfessor && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Agregar Participante
                        </button>
                    )}
                    {isModalOpen && !isProfessor && (
                        <AddParticipantModal
                            projectId={projectId}
                            onClose={() => setIsModalOpen(false)}
                            onParticipantAdded={() => { }}
                        />
                    )}
                    <button
                        onClick={() => setShowTeamList((prev) => !prev)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                        {showTeamList ? "Ocultar Equipo" : "Equipo del Proyecto"}
                    </button>
                    {/* Botón para abrir el editor de asignación de fases, solo para el creador */}
                    {isCreator && (
                        <button
                            onClick={() => setShowPhaseAssignmentEditor(true)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Asignar Fases
                        </button>
                    )}
                    {showTeamList && (
                        <div className="absolute top-12 right-2 bg-white border border-gray-300 rounded shadow-md p-2 w-64 z-20">
                            <TeamList isCreator={isCreator} refreshProject={() => { }} />
                        </div>
                    )}

                    {currentPhase > 1 && (
                        <button
                            onClick={handlePrevPhase}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Fase Anterior
                        </button>
                    )}
                    {currentPhase === 4 && (
                        <button
                            onClick={handleDownloadPDF}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm"
                        >
                            Descargar PDF
                        </button>
                    )}
                    <button
                        onClick={currentPhase < 4 ? handleNextPhase : handleFinish}
                        disabled={currentPhase >= 4 && !professorId}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                        {currentPhase < 4 ? "Siguiente Fase" : "Finalizar"}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-y-auto p-6">
                {renderPhaseComponent()}
            </main>


            {/* Modal para editar asignaciones de fase */}
            {showPhaseAssignmentEditor && (
                <PhaseAssignmentEditor
                    projectId={projectId}
                    onClose={() => setShowPhaseAssignmentEditor(false)}
                    onAssignmentsSaved={() => {
                        // Aquí podrías refrescar la información del proyecto o del equipo si es necesario.
                    }}
                />
            )}
        </div>
    );
};

export default ProjectPhase;
