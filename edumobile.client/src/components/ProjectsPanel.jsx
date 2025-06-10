import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Componente para mostrar texto colapsable
const CollapsibleText = ({ text, maxLength = 50 }) => {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;
    const shouldTruncate = text.length > maxLength;
    const displayedText = !expanded && shouldTruncate
        ? text.substring(0, maxLength) + "..."
        : text;
    return (
        <span className="inline-block">
            {displayedText}
            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 hover:text-blue-700 text-xs font-semibold ml-1"
                >
                    {expanded ? "Ver menos" : "Ver más"}
                </button>
            )}
        </span>
    );
};

const ProjectsPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [semesters, setSemesters] = useState([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState("");
    // Almacena qué proyectos están expandidos para el equipo
    const [expandedProjects, setExpandedProjects] = useState({});
    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // Carga la lista de semestres (suponiendo endpoint /api/semesters)
    const fetchSemesters = async () => {
        try {
            const response = await fetch("/api/semesters", { credentials: "include" });
            const data = await response.json();
            if (response.ok) {
                setSemesters(data);
                if (data.length > 0) setSelectedSemester(data[0].id);
            } else {
                console.error("Error al cargar semestres:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener semestres:", error);
        } finally {
            setLoadingSemesters(false);
        }
    };

    // Carga los proyectos según el semestre seleccionado
    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            let response;
            if (user?.role === "Profesor") {
                response = await fetch(
                    `/api/projects/all-projects?semesterId=${selectedSemester}`,
                    { credentials: "include" }
                );
            } else {
                response = await fetch("/api/projects", { credentials: "include" });
            }
            const data = await response.json();
            if (response.ok) {
                setProjects(data);
            } else {
                console.error("Error al cargar proyectos:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        if (user?.role === "Profesor") {
            fetchSemesters();
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === "Profesor") {
            if (selectedSemester) fetchProjects();
        } else {
            fetchProjects();
        }
    }, [user, selectedSemester]);

    const toggleProjectExpanded = (projectId) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    // Filtra los proyectos por el término de búsqueda (aplica solo si es profesor)
    const filteredProjects =
        user?.role === "Profesor" && searchTerm.trim().length > 0
            ? projects.filter((project) =>
                project.team &&
                project.team.some((member) =>
                    member.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
            : projects;

    if (loadingProjects || (user?.role === "Profesor" && loadingSemesters))
        return <p className="text-center text-gray-600 mt-4">Cargando...</p>;

    return (
        <section className="w-full bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#4F46E5]">
                    Proyectos Activos
                </h2>
                {/* aquí podrías poner un botón de acción si lo necesitas */}
            </div>

            {user?.role === "Profesor" && (
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                    {/* Select de semestre */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="semesterSelect" className="mr-2 text-gray-700">
                            Selecciona un semestre:
                        </label>
                        <select
                            id="semesterSelect"
                            className="border border-gray-200 rounded-2xl p-2 pr-8 bg-white appearance-none focus:outline-none focus:border-[#4F46E5]"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {semester.name} - {semester.period} {semester.year}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar alumno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                        />
                    </div>
                </div>
            )}

            {filteredProjects.length > 0 ? (
                <div className="overflow-x-auto rounded-xl overflow-hidden shadow-sm">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-[#64748B]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Creado Por
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Semestre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Equipo
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.map((project) => {
                                const isExpanded = expandedProjects[project.id] || false;
                                const teamList = project.team || [];
                                const displayTeam =
                                    !isExpanded && teamList.length > 2
                                        ? teamList.slice(0, 2)
                                        : teamList;
                                return (
                                    <tr key={project.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {project.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <CollapsibleText text={project.title} maxLength={30} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <CollapsibleText text={project.description} maxLength={50} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <CollapsibleText text={project.createdBy || "Desconocido"} maxLength={30} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {project.semesterName || "Sin Semestre"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teamList.length > 0 ? (
                                                <>
                                                    {displayTeam.map((member) => member.name).join(", ")}
                                                    {teamList.length > 2 && (
                                                        <button
                                                            onClick={() => toggleProjectExpanded(project.id)}
                                                            className="ml-2 text-blue-500 hover:text-blue-700 text-xs font-semibold"
                                                        >
                                                            {isExpanded
                                                                ? "Ver menos"
                                                                : `+${teamList.length - 2} más`}
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                "Sin Equipo"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <button
                                                className="px-3 py-1 bg-[#4F46E5] hover:bg-[#64748B] text-white rounded-md text-sm transition"
                                                onClick={() =>
                                                    navigate(
                                                        project.createdById
                                                            ? `/projects/professor/${project.id}`
                                                            : `/projects/${project.id}`
                                                    )
                                                }
                                            >
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    No hay proyectos activos en este momento.
                </p>
            )}
               
        </section>
    );
};

export default ProjectsPanel;
