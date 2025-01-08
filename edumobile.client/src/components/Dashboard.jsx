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
        fetchAllProjects();
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

    const fetchAllProjects = async () => {
        try {
            const response = await fetch("api/projects/all-projects", {
                credentials: "include", // Incluye cookies o tokens para la autenticación
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
        <div className="dashboard-container">
            {/* Contenido principal */}
            <main className="main-container dashboard-main">
                <h1 className="main-title">Gestión de Cursos</h1>

                {message && (
                    <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <div className="semesters-pills">
                    {loading ? (
                        <p>Cargando cursos...</p>
                    ) : semesters.length > 0 ? (
                        semesters.map((semester) => (
                            <div key={semester.id} className="semester-container">
                                <button
                                    className={`semester-pill ${selectedSemester?.id === semester.id ? "active" : ""}`}
                                    onClick={() => handleSemesterClick(semester)}
                                    title={`Periodo: ${semester.period}, Año: ${semester.year}`}
                                >
                                    {semester.name}
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteSemester(semester.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay cursos creados aún.</p>
                    )}
                </div>

                <div className="projects-section">
                    <h2 className="main-title">Proyectos Activos</h2>
                    {loadingProjects ? (
                        <p>Cargando proyectos...</p>
                    ) : projects.length > 0 ? (
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Descripción</th>
                                    <th>Creado Por</th>
                                    <th>Semestre</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td>{project.id}</td>
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
                                            <td>{project.createdBy || "Desconocido"}</td>
                                            <td>{project.semesterName || "Sin Semestre"}</td>
                                            <td>
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => navigate(`/projects/${project.id}`)}
                                                >
                                                    Ver Detalles
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                        </table>
                    ) : (
                        <p>No hay proyectos activos en este momento.</p>
                    )}
                </div>


                <div className="course-content">
                    {selectedSemester && !showRegisterForm ? (
                        <>
                            <h2 className="course-title">Estudiantes del Curso: {selectedSemester.name}</h2>
                            <div className="students-list">
                                <h3>Estudiantes Registrados</h3>
                                {students.length > 0 ? (
                                    <table className="students-table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Apellido Paterno</th>
                                                <th>Apellido Materno</th>
                                                <th>Email</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>{student.nombre}</td>
                                                    <td>{student.apellidoPaterno}</td>
                                                    <td>{student.apellidoMaterno}</td>
                                                    <td>{student.email}</td>
                                                    <td>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay estudiantes registrados aún.</p>
                                )}
                            </div>

                            <button
                                className="btn-primary"
                                onClick={() => setShowRegisterForm(true)}
                            >
                                Registrar Estudiantes
                            </button>
                        </>
                    ) : selectedSemester && showRegisterForm ? (
                        <RegisterStudents
                            selectedSemester={selectedSemester}
                            setShowRegisterForm={setShowRegisterForm}
                        />
                    ) : (
                        <div className="course-section">
                            <h2 className="course-title">Diseño Web: HTML5 y CSS3 Adaptativo</h2>
                            <p className="course-description">
                                Explora técnicas avanzadas para construir sitios web adaptativos utilizando HTML5 y CSS3.
                            </p>
                            <CreateSemester selectedCourse="html-css-advanced" />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
