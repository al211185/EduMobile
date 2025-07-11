// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function calcCompletion(obj, keys) {
    if (!obj) return 0;
    const total = keys.length;
    const filled = keys.filter((k) => {
        const v = obj[k];
        return (
            v !== null &&
            v !== undefined &&
            !(typeof v === "string" && v.trim() === "") &&
            !(Array.isArray(v) && v.length === 0)
        );
    }).length;
    return Math.round((filled / total) * 100);
}

const StudentDashboard = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [planning, setPlanning] = useState(null);
    const [design, setDesign] = useState(null);
    const [development, setDevelopment] = useState(null);
    const [team, setTeam] = useState([]);
    const [feedback, setFeedback] = useState([]);

    // 2 Claves "requeridas"
    const planningPhase1Keys = [
        "projectName", "clienteName", "responsable", "startDate",
        "generalObjective", "specificObjectives",
        "functionalRequirements", "customRequirements",
    ];
    const planningPhase2Keys = [
        "benchmarkObjective", "benchmarkSector",
        "competitor1Name", "competitor1Positives", "competitor1Negatives",
        "competitor2Name", "competitor2Positives", "competitor2Negatives",
        "benchmarkFindings", "benchmarkImprovements",
        "benchmarkUsedSmartphoneForScreens",
        "benchmarkUsedSmartphoneForComparative",
        "benchmarkConsideredMobileFirst",
    ];
    const planningPhase3Keys = ["audienceQuestions", "reflectionPhase3"];
    const planningKeys = [
        ...planningPhase1Keys,
        ...planningPhase2Keys,
        ...planningPhase3Keys,
    ];

    const designPhase1Keys = [
        "siteMapFilePath", "isHierarchyClear", "areSectionsIdentified",
        "areLinksClear", "areVisualElementsUseful",
    ];
    const designPhase2Keys = [
        "wireframe480pxPath", "wireframe768pxPath", "wireframe1024pxPath",
        "isMobileFirst", "isNavigationClear", "isDesignFunctional",
        "isVisualConsistencyMet",
    ];
    const designPhase3Keys = [
        "visualDesignFilePath",
        "areVisualElementsBeneficialForSmallScreens",
        "doesDesignPrioritizeContentForMobile",
        "doesDesignImproveLoadingSpeed",
    ];
    const designPhase4Keys = [
        "contentFilePath",
        "areContentsRelevantForMobile",
        "areContentsClearAndNavigable",
        "doContentsGuideUserAttention",
    ];
    const designKeys = [
        ...designPhase1Keys,
        ...designPhase2Keys,
        ...designPhase3Keys,
        ...designPhase4Keys,
    ];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // 1️⃣ Proyecto actual
                const resProj = await fetch("/api/projects/current", { credentials: "include" });
                if (!resProj.ok) throw new Error("No se pudo cargar el proyecto");
                const proj = await resProj.json();
                setProject(proj);

                const id = proj.id;
                // 2️⃣ Llamadas paralelas (incluyendo todas las retroalimentaciones)
                const [rPlan, rDes, rDev, rTeam, rFb] = await Promise.all([
                    fetch(`/api/planningphases/${id}`, { credentials: "include" }),
                    fetch(`/api/designphases/${id}`, { credentials: "include" }),
                    fetch(`/api/developmentphases/byproject/${id}`, { credentials: "include" }),
                    fetch(`/api/projects/${id}/team`, { credentials: "include" }),
                    fetch(`/api/feedbacks/project/${id}`, { credentials: "include" }),
                ]);

                if (rPlan.ok) setPlanning(await rPlan.json());
                if (rDes.ok) setDesign(await rDes.json());
                if (rDev.ok) setDevelopment(await rDev.json());
                if (rTeam.ok) setTeam(await rTeam.json());
                if (rFb.ok) setFeedback(await rFb.json()); // ← array de TeacherFeedback
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading)
        return (
            <div className="space-y-6 animate-pulse">
                <div className="bg-white rounded-2xl px-6 py-8 h-20" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 h-40" />
                    <div className="bg-white rounded-2xl p-6 h-40" />
                    <div className="bg-white rounded-2xl p-6 h-40" />
                </div>
                <div className="bg-white rounded-2xl p-6 h-40" />
            </div>
        );
    if (!project) return <p className="text-center mt-8">No hay proyecto asignado.</p>;

    // ③ Cálculo de porcentajes
    const pctPlan = calcCompletion(planning, planningKeys);
    const pctDes = calcCompletion(design, designKeys);

    const kanbanItems = development?.kanbanItems || [];
    const doneCount = kanbanItems.filter(i =>
        ["done", "completed"].includes(i.status.toLowerCase())
    ).length;
    const pctDev = kanbanItems.length
        ? Math.round((doneCount / kanbanItems.length) * 100)
        : 0;

    // Evaluación: feedback global
    const pctEval = feedback.length
        ? Math.round((feedback.length / /* fases totales */ 4) * 100)
        : 0;

    const progress = {
        Planeación: pctPlan,
        Diseño: pctDes,
        Desarrollo: pctDev,
        Evaluación: pctEval,
    };

    const phaseLinks = {
        Planeación: project ? `/projects/${project.id}` : "#",
        Diseño: project ? `/projects/${project.id}?phase=2` : "#",
        Desarrollo: project ? `/projects/${project.id}?phase=3` : "#",
        Evaluación: project ? `/projects/${project.id}?phase=4` : "#",
    };

    const getProgressColor = (value) => {
        if (value < 25) return "#DC2626"; // rojo
        if (value < 50) return "#F59E0B"; // naranja
        if (value < 75) return "#EAB308"; // amarillo
        return "#16A34A"; // verde
    };


    // ④ Render para cada círculo
    const renderCircle = (label, value) => (
        <Link
            key={label}
            to={phaseLinks[label]}
            className="flex items-center justify-between hover:bg-gray-50 p-2 rounded"
        >
            <span className="text-[#64748B] font-medium">{label}</span>
            <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                    value={value}
                    text={`${value}%`}
                    styles={buildStyles({
                        pathColor: getProgressColor(value),
                        trailColor: "#E5E7EB",
                        textColor: getProgressColor(value),
                        textSize: "28px",
                    })}
                />
            </div>
        </Link>
    );

    return (
        <div className="space-y-6">
            {/* — Capsulita única — */}
            <div className="bg-white rounded-2xl px-6 py-4">
                <h1 className="text-2xl font-bold text-[#64748B]">
                    Bienvenido, {user.nombre}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* — Proyecto — */}
                <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                        {project.title}
                    </h2>
                    <p className="text-[#64748B] mb-3">
                        Creado: {new Date(project.createdAt).toLocaleDateString("es-ES")}
                    </p>
                    <p className="text-[#64748B] mb-3">
                        Cliente: {planning?.clienteName || "—"}
                    </p>
                    <p className="text-[#64748B] mb-6">
                        Inicio: {planning?.startDate
                            ? new Date(planning.startDate).toLocaleDateString("es-ES")
                            : "—"}
                    </p>
                    <p className="text-[#64748B]">
                        <strong>Objetivo:</strong> {planning?.generalObjective || "—"}
                    </p>
                </div>

                {/* — Progreso — */}
                <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                        Progreso
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(progress).map(([label, value]) =>
                            renderCircle(label, value)
                        )}
                    </div>
                </div>

                {/* — Equipo — */}
                <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                        Equipo ({team.length})
                    </h2>
                    <ul className="space-y-3">
                        {team.length === 0 ? (
                            <li className="text-[#64748B]">Sin miembros.</li>
                        ) : (
                            team.map((m) => (
                                <li key={m.applicationUserId} className="flex items-center gap-3">
                                    {/* Icono en lugar de avatar */}
                                    <FaUserCircle className="w-7 h-7 text-[#64748B]" />
                                    <span className="text-[#64748B]">
                                        {m.nombre} {m.apellidoPaterno}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* — Retroalimentación — */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sólo las dos primeras columnas */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6">
                        {/* Título como en las otras tarjetas */}
                        <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                            Retroalimentación
                        </h2>

                        {feedback.length === 0 ? (
                            <p className="text-[#64748B]">No hay retroalimentación aún.</p>
                        ) : (
                            feedback.map((f) => (
                                <div
                                    key={f.id}
                                    className="bg-[#7C7C7C] text-white rounded-2xl px-6 py-4 mb-4"
                                >
                                    <div className="flex items-center text-sm text-gray-300 space-x-2 mb-2">
                                        <span>{new Date(f.createdAt).toLocaleDateString("es-ES")}</span>
                                        <span>•</span>
                                        <span>
                                            {new Date(f.createdAt).toLocaleTimeString("es-ES", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-200">{f.feedbackText}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Esta columna queda vacía */}
                <div className="hidden lg:block" />
            </div>



        </div>
    );
};

export default StudentDashboard;