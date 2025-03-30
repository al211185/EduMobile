import React, { useState, useEffect } from "react";
import CreateSemester from "./CreateSemester";
import RegisterStudents from "./RegisterStudents";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth(); // Obtén la información del usuario desde el contexto
    const navigate = useNavigate();

    // Imprimir el rol del usuario en la consola
    useEffect(() => {
        if (user) {
            console.log("Rol del usuario:", user.role);
        }
    }, [user]);

    const [semesters, setSemesters] = useState([]); // Lista de cursos (semestres)
    const [students, setStudents] = useState([]); // Lista de estudiantes en un curso
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [projects, setProjects] = useState([]); // Lista de proyectos
    const [loadingProjects, setLoadingProjects] = useState(true); // Estado de carga de proyectos


    // Cargar los cursos desde el servidor
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await fetch("/api/semesters");
                const data = await response.json();
                if (response.ok) {
                    setSemesters(data);
                } else {
                    console.error("Error al cargar los cursos:", data.message);
                }
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSemesters();
    }, []);

    const fetchStudents = async (semesterId) => {
        try {
            const response = await fetch(`/api/semesters/${semesterId}/students`);
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
            } else {
                console.error("Error al cargar los estudiantes:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener los estudiantes:", error);
        }
    };

    const fetchAllProjects = async (semesterId) => {
        try {
            // Asegúrate de enviar el semesterId como query parameter
            const response = await fetch(`/api/projects/all-projects?semesterId=${semesterId}`, {
                credentials: "include", // Si usas autenticación basada en cookies o tokens
            });
            const data = await response.json();
            if (response.ok) {
                setProjects(data); // Actualiza la lista de proyectos
            } else {
                console.error("Error al cargar proyectos:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        } finally {
            setLoadingProjects(false); // Finaliza el estado de carga
        }
    };



    const handleSemesterClick = (semester) => {
        setSelectedSemester(semester);
        setShowRegisterForm(false);
        fetchStudents(semester.id);
        // Carga los proyectos del semestre seleccionado
        fetchAllProjects(semester.id);
    };


    const handleDeleteSemester = async (id) => {
        try {
            const response = await fetch(`/api/semesters/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setSemesters((prevSemesters) => prevSemesters.filter((s) => s.id !== id));
                setMessage("✅ Curso eliminado con éxito.");
            } else {
                setMessage("⚠️ Error al eliminar el curso.");
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al intentar eliminar el curso.");
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
                setMessage("✅ Estudiante eliminado con éxito.");
            } else {
                setMessage("⚠️ Error al eliminar el estudiante.");
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al intentar eliminar el estudiante.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <main className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Gestión de Cursos
                </h1>

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

                {/* Semestres / Cursos */}
                <section>
                    {loading ? (
                        <p className="text-center text-gray-600">Cargando cursos...</p>
                    ) : semesters.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {semesters.map((semester) => (
                                <div
                                    key={semester.id}
                                    className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 shadow-sm"
                                >
                                    <button
                                        onClick={() => handleSemesterClick(semester)}
                                        title={`Periodo: ${semester.period}, Año: ${semester.year}`}
                                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${selectedSemester?.id === semester.id
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
                                            }`}
                                    >
                                        {semester.name}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSemester(semester.id)}
                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No hay cursos creados aún.</p>
                    )}
                </section>

                {/* Proyectos Activos */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Proyectos Activos</h2>
                    {loadingProjects ? (
                        <p className="text-center text-gray-600">Cargando proyectos...</p>
                    ) : projects.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">ID</th>
                                        <th className="px-4 py-2 border">Título</th>
                                        <th className="px-4 py-2 border">Descripción</th>
                                        <th className="px-4 py-2 border">Creado Por</th>
                                        <th className="px-4 py-2 border">Semestre</th>
                                        {/* Si es profesor, se muestra la columna de Equipo */}
                                        {user?.role === "Profesor" && (
                                            <th className="px-4 py-2 border">Equipo</th>
                                        )}
                                        <th className="px-4 py-2 border">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="text-center">
                                            <td className="px-4 py-2 border">{project.id}</td>
                                            <td className="px-4 py-2 border">{project.title}</td>
                                            <td className="px-4 py-2 border">{project.description}</td>
                                            <td className="px-4 py-2 border">
                                                {project.createdBy || "Desconocido"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {project.semesterName || "Sin Semestre"}
                                            </td>
                                            {/* Columna de equipo: se muestran los integrantes si existen */}
                                            {user?.role === "Profesor" && (
                                                <td className="px-4 py-2 border">
                                                    {project.team && project.team.length > 0
                                                        ? project.team.map((member) => member.name).join(", ")
                                                        : "Sin Equipo"}
                                                </td>
                                            )}
                                            <td className="px-4 py-2 border">
                                                <button
                                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                                                    onClick={() =>
                                                        navigate(`/projects/professor/${project.id}`)
                                                    }
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

                {/* Contenido del Curso / Estudiantes */}
                <section className="space-y-6">
                    {selectedSemester && !showRegisterForm ? (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Estudiantes del Curso: {selectedSemester.name}
                            </h2>
                            <div className="students-list mb-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Estudiantes Registrados
                                </h3>
                                {students.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-2 border">Nombre</th>
                                                    <th className="px-4 py-2 border">Apellido Paterno</th>
                                                    <th className="px-4 py-2 border">Apellido Materno</th>
                                                    <th className="px-4 py-2 border">Email</th>
                                                    <th className="px-4 py-2 border">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student) => (
                                                    <tr key={student.id} className="text-center">
                                                        <td className="px-4 py-2 border">{student.nombre}</td>
                                                        <td className="px-4 py-2 border">
                                                            {student.apellidoPaterno}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {student.apellidoMaterno}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {student.email}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            <button
                                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                                                onClick={() =>
                                                                    handleDeleteStudent(student.id)
                                                                }
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
                                    <p className="text-gray-600">
                                        No hay estudiantes registrados aún.
                                    </p>
                                )}
                            </div>
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
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
                    ) : (
                        <div className="course-section p-4 bg-white rounded shadow text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Diseño Web: HTML5 y CSS3 Adaptativo
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Explora técnicas avanzadas para construir sitios web adaptativos
                                utilizando HTML5 y CSS3.
                            </p>
                            <CreateSemester selectedCourse="html-css-advanced" />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );

};

export default Dashboard;
