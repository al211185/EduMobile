import React, { useState, useEffect } from "react";
import CreateSemester from "./CreateSemester";
import RegisterStudents from "./RegisterStudents";

const Dashboard = () => {
    const [selectedCourse, setSelectedCourse] = useState("html-css-basic");
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]); // Lista de estudiantes del semestre
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await fetch("/api/semesters");
                const data = await response.json();
                if (response.ok) {
                    setSemesters(data);
                } else {
                    console.error("Error al cargar los semestres:", data.message);
                }
            } catch (error) {
                console.error("Error al obtener semestres:", error);
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
                console.error("Error al cargar estudiantes:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener estudiantes:", error);
        }
    };

    const handleSwitch = (course) => {
        setSelectedCourse(course);
        setSelectedSemester(null);
        setStudents([]);
        setShowRegisterForm(false);
    };

    const handleSemesterClick = (semester) => {
        setSelectedSemester(semester);
        setShowRegisterForm(false);
        fetchStudents(semester.id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/semesters/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setSemesters((prevSemesters) => prevSemesters.filter((s) => s.id !== id));
                setMessage("✅ Semestre eliminado con éxito.");
            } else {
                setMessage("⚠️ Error al eliminar el semestre.");
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al intentar eliminar el semestre.");
        }
    };

    return (
        <div className="dashboard-container">
            {/* Menú lateral */}
            <aside className="sidebar">
                <h2 className="sidebar-title">Panel</h2>
                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-button ${selectedCourse === "html-css-basic" ? "active" : ""}`}
                        onClick={() => handleSwitch("html-css-basic")}
                    >
                        Introducción a HTML5 y CSS3
                    </button>
                    <button
                        className={`sidebar-button ${selectedCourse === "html-css-advanced" ? "active" : ""}`}
                        onClick={() => handleSwitch("html-css-advanced")}
                    >
                        Diseño Web: HTML5 y CSS3 Adaptativo
                    </button>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="main-container dashboard-main">
                <h1 className="main-title">Mis Cursos</h1>

                {message && (
                    <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <div className="semesters-pills">
                    {loading ? (
                        <p>Cargando semestres...</p>
                    ) : semesters.length > 0 ? (
                        semesters
                            .filter((s) => s.course === selectedCourse)
                            .map((semester) => (
                                <button
                                    key={semester.id}
                                    className={`semester-pill ${selectedSemester?.id === semester.id ? "active" : ""}`}
                                    onClick={() => handleSemesterClick(semester)}
                                    title={`Periodo: ${semester.period}, Año: ${semester.year}`}
                                >
                                    {semester.name}
                                </button>
                            ))
                    ) : (
                        <p>No hay semestres creados aún.</p>
                    )}
                </div>

                <div className="course-content">
                    {selectedSemester && !showRegisterForm ? (
                        <>
                            <h2 className="course-title">Estudiantes del Semestre: {selectedSemester.name}</h2>
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>{student.nombre}</td>
                                                    <td>{student.apellidoPaterno}</td>
                                                    <td>{student.apellidoMaterno}</td>
                                                    <td>{student.email}</td>
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
                            <h2 className="course-title">
                                {selectedCourse === "html-css-basic"
                                    ? "Introducción a HTML5 y CSS3"
                                    : "Diseño Web: HTML5 y CSS3 Adaptativo"}
                            </h2>
                            <p className="course-description">
                                {selectedCourse === "html-css-basic"
                                    ? "Aprende los fundamentos de HTML5 y CSS3, dos pilares esenciales para el desarrollo web moderno."
                                    : "Explora técnicas avanzadas para construir sitios web adaptativos utilizando HTML5 y CSS3."}
                            </p>
                            <CreateSemester selectedCourse={selectedCourse} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
