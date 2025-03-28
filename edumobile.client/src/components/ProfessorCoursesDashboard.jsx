import React, { useState, useEffect } from "react";
import CreateSemester from "./CreateSemester";
import RegisterStudents from "./RegisterStudents";
import { useNavigate } from "react-router-dom";

const ProfessorCoursesDashboard = () => {
    const navigate = useNavigate();
    const [semesters, setSemesters] = useState([]);
    const [courseStudents, setCourseStudents] = useState({}); // { [semesterId]: [students] }
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    // Usamos registerCourse para saber en cuál curso se muestra el formulario de registro
    const [registerCourse, setRegisterCourse] = useState(null);

    // Fetch all semesters
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

    // For each semester, fetch its students and store them in courseStudents
    useEffect(() => {
        const fetchAllStudents = async () => {
            const newCourseStudents = {};
            for (const semester of semesters) {
                try {
                    const response = await fetch(`/api/semesters/${semester.id}/students`);
                    const data = await response.json();
                    if (response.ok) {
                        newCourseStudents[semester.id] = data;
                    } else {
                        console.error(
                            `Error al cargar los estudiantes del curso ${semester.id}:`,
                            data.message
                        );
                        newCourseStudents[semester.id] = [];
                    }
                } catch (error) {
                    console.error(
                        `Error al obtener los estudiantes del curso ${semester.id}:`,
                        error
                    );
                    newCourseStudents[semester.id] = [];
                }
            }
            setCourseStudents(newCourseStudents);
        };

        if (semesters.length > 0) {
            fetchAllStudents();
        }
    }, [semesters]);

    const handleDeleteSemester = async (id) => {
        try {
            const response = await fetch(`/api/semesters/${id}`, { method: "DELETE" });
            if (response.ok) {
                setSemesters((prev) => prev.filter((s) => s.id !== id));
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
            const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
            if (response.ok) {
                // Update students for each course (assuming a student belongs to one course)
                setCourseStudents((prev) => {
                    const newState = { ...prev };
                    Object.keys(newState).forEach((semId) => {
                        newState[semId] = newState[semId].filter((s) => s.id !== id);
                    });
                    return newState;
                });
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
                <h1 className="text-3xl font-bold text-gray-800 text-center">
                    Gestión de Cursos
                </h1>

                {message && (
                    <div
                        className={`p-3 rounded text-center text-sm ${message.startsWith("✅")
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Lista de Semestres / Cursos */}
                <section>
                    {loading ? (
                        <p className="text-center text-gray-600">Cargando cursos...</p>
                    ) : semesters.length > 0 ? (
                        semesters.map((semester) => (
                            <div key={semester.id} className="bg-white rounded shadow p-4 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {semester.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            Periodo: {semester.period}, Año: {semester.year}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteSemester(semester.id)}
                                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            onClick={() => setRegisterCourse(semester.id)}
                                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                                        >
                                            Registrar Estudiantes
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    {courseStudents[semester.id] ? (
                                        courseStudents[semester.id].length > 0 ? (
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-2 border">Nombre</th>
                                                        <th className="px-4 py-2 border">Apellido Paterno</th>
                                                        <th className="px-4 py-2 border">Apellido Materno</th>
                                                        <th className="px-4 py-2 border">Email</th>
                                                        <th className="px-4 py-2 border">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {courseStudents[semester.id].map((student) => (
                                                        <tr key={student.id} className="text-center">
                                                            <td className="px-4 py-2 border">
                                                                {student.nombre}
                                                            </td>
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
                                                                    onClick={() => handleDeleteStudent(student.id)}
                                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-center text-gray-600">
                                                No hay estudiantes registrados aún.
                                            </p>
                                        )
                                    ) : (
                                        <p className="text-center text-gray-600">
                                            Cargando estudiantes...
                                        </p>
                                    )}
                                </div>
                                {registerCourse === semester.id && (
                                    <div className="mt-4">
                                        <RegisterStudents
                                            selectedSemester={semester}
                                            setShowRegisterForm={() => setRegisterCourse(null)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No hay cursos creados aún.</p>
                    )}
                </section>

                {/* Sección de Proyectos Activos (placeholder) */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Proyectos Activos
                    </h2>
                    <p className="text-center text-gray-600">
                        [Sección de proyectos no implementada]
                    </p>
                </section>

                {/* Sección de Crear Nuevo Curso */}
                <section className="p-4 bg-white rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Diseño Web: HTML5 y CSS3 Adaptativo
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Explora técnicas avanzadas para construir sitios web adaptativos
                        utilizando HTML5 y CSS3.
                    </p>
                    <CreateSemester selectedCourse="html-css-advanced" />
                </section>
            </main>
        </div>
    );
};

export default ProfessorCoursesDashboard;
