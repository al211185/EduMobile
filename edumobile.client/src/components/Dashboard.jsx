import React, { useState, useEffect } from "react";
import CreateSemester from "./CreateSemester";
import RegisterStudents from "./RegisterStudents";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const [message, setMessage] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const fetchSemesters = async (selectFirst = false) => {
        setLoadingSemesters(true);
        try {
            const res = await fetch("/api/semesters");
            const data = await res.json();
            if (res.ok) {
                setSemesters(data);
                if (selectFirst && data.length > 0) {
                    const first = data[0];
                    setSelectedSemester(first);
                    loadCourseData(first.id);
                }
            } else {
                console.error("Error al cargar cursos:", data.message);
            }
        } catch (err) {
            console.error("Error al obtener cursos:", err);
        } finally {
            setLoadingSemesters(false);
        }
    };

    // --- Carga inicial de semestres y selección automática del primero ---
    useEffect(() => {
        fetchSemesters(true);
    }, []);

    const handleSemesterCreated = () => {
        fetchSemesters();
    };

    const handleStudentsRegistered = () => {
        if (selectedSemester) {
            loadCourseData(selectedSemester.id);
            setShowRegisterForm(false);
        }
    };


    // --- Función para cargar estudiantes y proyectos de un semestre ---
    const loadCourseData = async (semesterId) => {
        setLoadingProjects(true);
        // Estudiantes
        try {
            const resp1 = await fetch(`/api/semesters/${semesterId}/students`);
            const st = await resp1.json();
            if (resp1.ok) setStudents(st);
        } catch (err) {
            console.error("Error al cargar estudiantes:", err);
        }
        // Proyectos
        try {
            const resp2 = await fetch(`/api/projects/all-projects?semesterId=${semesterId}`);
            const pj = await resp2.json();
            if (resp2.ok) setProjects(pj);
        } catch (err) {
            console.error("Error al cargar proyectos:", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleSemesterClick = (sem) => {
        setSelectedSemester(sem);
        setShowRegisterForm(false);
        loadCourseData(sem.id);
    };

    const handleDeleteSemester = async (id) => {
        try {
            const res = await fetch(`/api/semesters/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSemesters((prev) => prev.filter((s) => s.id !== id));
                setMessage("✅ Curso eliminado con éxito.");
                if (selectedSemester?.id === id && semesters.length > 1) {
                    const next = semesters.find((s) => s.id !== id);
                    setSelectedSemester(next);
                    loadCourseData(next.id);
                }
            } else {
                setMessage("⚠️ Error al eliminar el curso.");
            }
        } catch {
            setMessage("⚠️ Hubo un error al intentar eliminar el curso.");
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
            if (res.ok) {
                setStudents((prev) => prev.filter((s) => s.id !== id));
                setMessage("✅ Estudiante eliminado con éxito.");
            } else {
                setMessage("⚠️ Error al eliminar el estudiante.");
            }
        } catch {
            setMessage("⚠️ Hubo un error al intentar eliminar el estudiante.");
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {/* centramos y limitamos ancho igual que MyProjects */}
                <div className="max-w-screen-xl mx-auto space-y-4">

                    <header className="bg-white border border-gray-200 rounded-2xl px-6 py-4 w-full">
                        <h1 className="text-2xl font-bold text-[#64748B]">Gestión de Cursos</h1>
                    </header>

                        {message && (
                            <div
                                    className={`text-sm text-center p-3 rounded-lg mb-4 ${message.startsWith("✅")
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {message}
                            </div>
                    )}

                    {/* Grid de tarjetas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* --- Sección de creación de semestre --- */}
                        <section className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-[#4F46E5] mb-4">Crear Nuevo Curso</h2>
                            <CreateSemester onSemesterCreated={handleSemesterCreated} />
                        </section>

                        {/* --- Sección de selección de semestres existentes --- */}
                        <section className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                                Mis Semestres
                            </h2>
                            {loadingSemesters ? (
                                <p className="text-center text-gray-600">Cargando cursos...</p>
                            ) : semesters.length > 0 ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {semesters.map((sem) => (
                                        <div
                                            key={sem.id}
                                            className="flex items-center gap-2 border rounded-full px-3 py-1 shadow-sm"
                                        >
                                            <button
                                                onClick={() => handleSemesterClick(sem)}
                                                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${selectedSemester?.id === sem.id
                                                    ? "bg-[#4F46E5] text-white"
                                                    : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
                                                    }`}
                                            >
                                                {sem.name}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSemester(sem.id)}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No hay cursos creados aún.
                                </p>
                            )}
                        </section>

                        {/* --- Proyectos Activos --- */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
                            <h2 className="text-xl font-semibold text-[#64748B] mb-4">Proyectos Activos</h2>
                            {loadingProjects ? (
                                <p className="text-center text-gray-600">Cargando proyectos...</p>
                            ) : projects.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl overflow-hidden shadow-sm">
                                    <table className="min-w-full bg-white divide-y divide-gray-200">
                                            <thead className="bg-[#64748B]">
                                            <tr className="text-center">
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">ID</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Título</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Creado Por</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Semestre</th>
                                                {user?.role === "Profesor" && (
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Equipo</th>
                                                )}
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((proj) => (
                                                <tr key={proj.id} className="text-center hover:bg-gray-50">
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{proj.id}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{proj.title}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{proj.description}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {proj.createdBy || "Desconocido"}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {proj.semesterName || "Sin Semestre"}
                                                    </td>
                                                    {user?.role === "Profesor" && (
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {(proj.team || []).map((m) => m.name).join(", ") ||
                                                                "Sin Equipo"}
                                                        </td>
                                                    )}
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            className="px-3 py-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-md text-sm transition"
                                                            onClick={() => navigate(`/projects/${proj.id}`)}
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No hay proyectos activos en este momento.
                                </p>
                            )}
                        </section>

                        {/* --- Sección de Estudiantes / Registro --- */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
                            {selectedSemester && !showRegisterForm ? (
                                <div>
                                    <h2 className="text-xl font-semibold text-[#64748B] mb-4">
                                        Estudiantes del Curso: {selectedSemester.name}
                                    </h2>
                                    {students.length > 0 ? (
                                        <div className="overflow-x-auto rounded-xl overflow-hidden shadow-sm mb-4">
                                            <table className="min-w-full bg-white divide-y divide-gray-200">
                                                <thead className="bg-[#64748B]">
                                                    <tr className="text-center">
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apellido Paterno</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apellido Materno</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.map((stu) => (
                                                        <tr key={stu.id} className="text-center hover:bg-gray-50">
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{stu.nombre}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {stu.apellidoPaterno}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {stu.apellidoMaterno}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{stu.email}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                <button
                                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition"
                                                                    onClick={() => handleDeleteStudent(stu.id)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 mb-4">
                                            No hay estudiantes registrados aún.
                                        </p>
                                    )}
                                    <button
                                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-2 rounded transition"
                                        onClick={() => setShowRegisterForm(true)}
                                    >
                                        Registrar Estudiantes
                                    </button>
                                </div>
                            ) : selectedSemester && showRegisterForm ? (
                                <RegisterStudents
                                    selectedSemester={selectedSemester}
                                        setShowRegisterForm={setShowRegisterForm}
                                        onStudentsRegistered={handleStudentsRegistered}
                                />
                            ) : null}
                                </section>
                    </div>{/* /CONTENT CARD */}
                </div>{/* /max-w-3xl */}
            </div>{/* /scroll */}
        </div>
    );
};

export default Dashboard;