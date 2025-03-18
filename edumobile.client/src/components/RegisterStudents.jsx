import React, { useState } from "react";
import Papa from "papaparse";

const RegisterStudents = ({ selectedSemester, setShowRegisterForm }) => {
    const [file, setFile] = useState(null);
    const [individualData, setIndividualData] = useState({
        matricula: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selectedSemester) {
            alert("Por favor, selecciona un archivo y un semestre válido.");
            return;
        }

        if (file.type !== "text/csv") {
            alert("Por favor, sube un archivo CSV válido.");
            return;
        }

        setIsSubmitting(true);

        // Parsear el CSV usando Papa Parse
        Papa.parse(file, {
            header: true, // Se asume que el CSV tiene encabezado con las columnas necesarias
            skipEmptyLines: true,
            complete: async (results) => {
                // results.data es un arreglo de objetos con los datos de cada alumno
                const students = results.data.map((student) => ({
                    matricula: student.matricula,
                    nombre: student.nombre,
                    apellidoPaterno: student.apellidoPaterno,
                    apellidoMaterno: student.apellidoMaterno,
                }));

                try {
                    // Registrar los alumnos en masa
                    const registerResponse = await fetch(`/api/auth/register-students`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(students),
                    });

                    const registerData = await registerResponse.json();

                    if (!registerResponse.ok) {
                        setIsSubmitting(false);
                        alert(`⚠️ Error en el registro: ${registerData.message || "No se pudo registrar a los alumnos."}`);
                        return;
                    }

                    // Extraer los IDs de los alumnos registrados exitosamente
                    // Se asume que registerData.Results contiene un arreglo de objetos con propiedades: Success y UserId
                    const successfulRegistrations = registerData.results.filter(result => result.success);
                    const assignmentPayload = successfulRegistrations.map(result => ({
                        studentId: result.userId, // Debe coincidir con lo que espera el endpoint AssignStudentsToSemester
                    }));


                    // Asignar los alumnos al semestre usando el endpoint masivo
                    const assignResponse = await fetch(`/api/semesters/${selectedSemester.id}/assign-students`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(assignmentPayload),
                    });

                    const assignData = await assignResponse.json();

                    if (!assignResponse.ok) {
                        throw new Error(assignData.message || "Error al asignar los alumnos al semestre.");
                    }
                    console.log("Respuesta de registro:", registerData);

                    setIsSubmitting(false);
                    alert("✅ Alumnos registrados y asignados exitosamente.");
                    setFile(null);
                } catch (error) {
                    setIsSubmitting(false);
                    console.error("Error al registrar o asignar alumnos:", error);
                    alert(`⚠️ ${error.message}`);
                }
            },
            error: (err) => {
                alert("Error al procesar el archivo CSV.");
                setIsSubmitting(false);
            },
        });
    };



    const handleIndividualSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSemester) {
            alert("Por favor, selecciona un semestre válido.");
            return;
        }

        const email = `al${individualData.matricula}@alumnos.uacj.mx`;
        const password = `Al${individualData.matricula}!`;

        setIsSubmitting(true);

        try {
            // Registrar al estudiante
            const registerResponse = await fetch(`/api/auth/register-student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    matricula: individualData.matricula,
                    nombre: individualData.nombre,
                    apellidoPaterno: individualData.apellidoPaterno,
                    apellidoMaterno: individualData.apellidoMaterno,
                    email,
                    password,
                }),
            });

            const registerData = await registerResponse.json();
            if (!registerResponse.ok) {
                throw new Error(registerData.message || "Error al registrar al estudiante.");
            }

            const studentId = registerData.studentId; // Asegúrate de que el API devuelve esto.

            // Asignar al semestre
            const assignResponse = await fetch(`/api/semesters/${selectedSemester.id}/assign-student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId, // Usar el ID del estudiante recién registrado
                }),
            });

            const assignData = await assignResponse.json();
            if (!assignResponse.ok) {
                throw new Error(assignData.message || "Error al asignar al semestre.");
            }

            alert("✅ Alumno registrado y asignado exitosamente.");

            // Resetear formulario
            setIndividualData({
                matricula: "",
                nombre: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
            });
        } catch (error) {
            alert(`⚠️ ${error.message}`);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIndividualData((prev) => ({ ...prev, [name]: value }));
    };

    if (!selectedSemester) {
        return <p>Por favor, selecciona un semestre para registrar alumnos.</p>;
    }

    return (
        <div className="register-students">
            <h3>Registrar Alumnos</h3>

            {/* Botón para regresar a la tabla */}
            <button
                className="btn-secondary"
                onClick={() => setShowRegisterForm(false)}
            >
                Volver a la Tabla de Estudiantes
            </button>

            {/* Registro Individual */}
            <form onSubmit={handleIndividualSubmit}>
                <h4>Registro Individual</h4>
                <div className="form-group">
                    <label htmlFor="matricula">Matrícula</label>
                    <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        value={individualData.matricula}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese la matrícula del alumno"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={individualData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre del alumno"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                    <input
                        type="text"
                        id="apellidoPaterno"
                        name="apellidoPaterno"
                        value={individualData.apellidoPaterno}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el apellido paterno del alumno"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                    <input
                        type="text"
                        id="apellidoMaterno"
                        name="apellidoMaterno"
                        value={individualData.apellidoMaterno}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el apellido materno del alumno"
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Cargando..." : "Registrar Alumno"}
                </button>
            </form>

            <hr />

            {/* Registro Masivo */}
            <form onSubmit={handleFileSubmit}>
                <h4>Registro Masivo</h4>
                <div className="form-group">
                    <label htmlFor="file">Carga Masiva de Alumnos</label>
                    <input type="file" id="file" onChange={handleFileUpload} />
                </div>
                <button type="submit" className="btn-primary" disabled={!file || isSubmitting}>
                    {isSubmitting ? "Cargando..." : "Registrar Alumnos"}
                </button>
            </form>
        </div>
    );
};

export default RegisterStudents;
