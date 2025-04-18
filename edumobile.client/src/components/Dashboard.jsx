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

    // --- Carga inicial de semestres y selección automática del primero ---
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await fetch("/api/semesters");
                const data = await res.json();
                if (res.ok) {
                    setSemesters(data);
                    if (data.length > 0) {
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
        fetchSemesters();
    }, []);

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
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Gestión de Cursos</h1>
            {message && (
                <div
                    className={`p-3 rounded mb-4 text-center text-sm ${message.startsWith("✅")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {message}
                </div>
            )}

            {/* --- Sección de creación de semestre --- */}
            <section className="mb-8 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-2">Crear Nuevo Curso</h2>
                <CreateSemester />
            </section>

            {/* --- Sección de selección de semestres existentes --- */}
            <section className="mb-8">
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
                                            ? "bg-blue-500 text-white"
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
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Proyectos Activos</h2>
                {loadingProjects ? (
                    <p className="text-center text-gray-600">Cargando proyectos...</p>
                ) : projects.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-100">
                                <tr className="text-center">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Título</th>
                                    <th className="px-4 py-2 border">Descripción</th>
                                    <th className="px-4 py-2 border">Creado Por</th>
                                    <th className="px-4 py-2 border">Semestre</th>
                                    {user?.role === "Profesor" && (
                                        <th className="px-4 py-2 border">Equipo</th>
                                    )}
                                    <th className="px-4 py-2 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((proj) => (
                                    <tr key={proj.id} className="text-center hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{proj.id}</td>
                                        <td className="px-4 py-2 border">{proj.title}</td>
                                        <td className="px-4 py-2 border">{proj.description}</td>
                                        <td className="px-4 py-2 border">
                                            {proj.createdBy || "Desconocido"}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {proj.semesterName || "Sin Semestre"}
                                        </td>
                                        {user?.role === "Profesor" && (
                                            <td className="px-4 py-2 border">
                                                {(proj.team || []).map((m) => m.name).join(", ") ||
                                                    "Sin Equipo"}
                                            </td>
                                        )}
                                        <td className="px-4 py-2 border">
                                            <button
                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
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
            <section className="space-y-6">
                {selectedSemester && !showRegisterForm ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            Estudiantes del Curso: {selectedSemester.name}
                        </h2>
                        {students.length > 0 ? (
                            <div className="overflow-x-auto mb-4">
                                <table className="min-w-full bg-white border">
                                    <thead className="bg-gray-100">
                                        <tr className="text-center">
                                            <th className="px-4 py-2 border">Nombre</th>
                                            <th className="px-4 py-2 border">Apellido Paterno</th>
                                            <th className="px-4 py-2 border">Apellido Materno</th>
                                            <th className="px-4 py-2 border">Email</th>
                                            <th className="px-4 py-2 border">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((stu) => (
                                            <tr key={stu.id} className="text-center hover:bg-gray-50">
                                                <td className="px-4 py-2 border">{stu.nombre}</td>
                                                <td className="px-4 py-2 border">
                                                    {stu.apellidoPaterno}
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    {stu.apellidoMaterno}
                                                </td>
                                                <td className="px-4 py-2 border">{stu.email}</td>
                                                <td className="px-4 py-2 border">
                                                    <button
                                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
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
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                            onClick={() => setShowRegisterForm(true)}
                        >
                            Registrar Estudiantes
                        </button>
                    </div>
                ) : selectedSemester && showRegisterForm ? (
                    <RegisterStudents
                        selectedSemester={selectedSemester}
                        setShowRegisterForm={setShowRegisterForm}
                    />
                ) : null}
            </section>
        </div>
    );
};

export default Dashboard;
