import React, { useState, useEffect } from "react";
import CreateSemester from "./CreateSemester";
import RegisterStudents from "./RegisterStudents";
import { useNavigate } from "react-router-dom";

const ProfessorCoursesDashboard = () => {
    const navigate = useNavigate();
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
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

    const handleSemesterClick = (semester) => {
        setSelectedSemester(semester);
        setShowRegisterForm(false);
        fetchStudents(semester.id);
    };

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
                setStudents((prev) => prev.filter((s) => s.id !== id));
                setMessage("✅ Estudiante eliminado con éxito.");
            } else {
                setMessage("⚠️ Error al eliminar el estudiante.");
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al intentar eliminar el estudiante.");
        }
    };

    return (
        <div className="courses-dashboard">
            <h2>Gestión de Cursos</h2>
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
                            <button className="delete-button" onClick={() => handleDeleteSemester(semester.id)}>
                                Eliminar
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay cursos creados aún.</p>
                )}
            </div>
            {selectedSemester && (
                <>
                    <h2>Estudiantes del Curso: {selectedSemester.name}</h2>
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
                                                <button className="delete-button" onClick={() => handleDeleteStudent(student.id)}>
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
                    <button className="btn-primary" onClick={() => setShowRegisterForm(true)}>
                        Registrar Estudiantes
                    </button>
                    {showRegisterForm && (
                        <RegisterStudents selectedSemester={selectedSemester} setShowRegisterForm={setShowRegisterForm} />
                    )}
                </>
            )}
        </div>
    );
};

export default ProfessorCoursesDashboard;
