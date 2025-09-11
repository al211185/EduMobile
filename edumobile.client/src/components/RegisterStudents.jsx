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
        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert("Por favor, sube un archivo CSV válido.");
            return;
        }
        setIsSubmitting(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const students = results.data.map((student) => ({
                    matricula: student.matricula,
                    nombre: student.nombre,
                    apellidoPaterno: student.apellidoPaterno,
                    apellidoMaterno: student.apellidoMaterno,
                }));
                try {
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
                        alert(
                            `⚠️ Error en el registro: ${registerData.message || "No se pudo registrar a los alumnos."
                            }`
                        );
                        return;
                    }
                    const successfulRegistrations = registerData.results.filter(
                        (result) => result.success
                    );
                    const assignmentPayload = successfulRegistrations.map((result) => ({
                        studentId: result.userId,
                    }));
                    const assignResponse = await fetch(
                        `/api/semesters/${selectedSemester.id}/assign-students`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(assignmentPayload),
                        }
                    );
                    const assignData = await assignResponse.json();
                    if (!assignResponse.ok) {
                        throw new Error(
                            assignData.message || "Error al asignar los alumnos al semestre."
                        );
                    }
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
                throw new Error(
                    registerData.message || "Error al registrar al estudiante."
                );
            }
            const studentId = registerData.studentId;
            const assignResponse = await fetch(
                `/api/semesters/${selectedSemester.id}/assign-student`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ studentId }),
                }
            );
            const assignData = await assignResponse.json();
            if (!assignResponse.ok) {
                throw new Error(assignData.message || "Error al asignar al semestre.");
            }
            alert("✅ Alumno registrado y asignado exitosamente.");
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
        <div className="rounded-2xl p-6 space-y-8">
            <h3 className="text-2xl font-semibold text-[#4F46E5]">
                Registrar Alumnos
            </h3>

            {/* Botón para regresar a la tabla */}
            <button
                className="inline-block bg-gray-50 border border-gray-200 text-[#64748B] px-4 py-2 rounded-md hover:bg-gray-100 transition"
                onClick={() => setShowRegisterForm(false)}
            >
                Volver a la Tabla de Estudiantes
            </button>

            {/* Registro Individual */}
            <section className="space-y-4">
                <h4 className="text-xl font-semibold text-[#64748B]">Registro Individual</h4>
                <form onSubmit={handleIndividualSubmit} className="space-y-6 mb-8">
                    <div className="form-group">
                        <label
                            htmlFor="matricula"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Matrícula
                        </label>
                        <input
                            type="text"
                            id="matricula"
                            name="matricula"
                            value={individualData.matricula}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingrese la matrícula del alumno"
                            className="w-full bg-[#E5E5E5] border-transparent rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B] transition"
                        />
                    </div>
                    <div className="form-group">
                        <label
                            htmlFor="nombre"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={individualData.nombre}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingrese el nombre del alumno"
                            className="w-full bg-[#E5E5E5] border-transparent rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B] transition"
                        />
                    </div>
                    <div className="form-group">
                        <label
                            htmlFor="apellidoPaterno"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Apellido Paterno
                        </label>
                        <input
                            type="text"
                            id="apellidoPaterno"
                            name="apellidoPaterno"
                            value={individualData.apellidoPaterno}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingrese el apellido paterno del alumno"
                            className="w-full bg-[#E5E5E5] border-transparent rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B] transition"
                        />
                    </div>
                    <div className="form-group">
                        <label
                            htmlFor="apellidoMaterno"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Apellido Materno
                        </label>
                        <input
                            type="text"
                            id="apellidoMaterno"
                            name="apellidoMaterno"
                            value={individualData.apellidoMaterno}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingrese el apellido materno del alumno"
                            className="w-full bg-[#E5E5E5] border-transparent rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B] transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#4F46E5] hover:bg-[#64748B] text-white font-semibold py-2 rounded transition-colors"
                    >
                        {isSubmitting ? "Cargando..." : "Registrar Alumno"}
                    </button>
                </form>
            </section>

            <hr className="my-8" />

            {/* Registro Masivo */}
            <form onSubmit={handleFileSubmit} className="space-y-6">
                <h4 className="text-xl font-semibold text-[#64748B]">Registro Masivo</h4>
                <div className="form-group">
                    <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Carga Masiva de Alumnos
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!file || isSubmitting}
                    className="w-full bg-[#4F46E5] hover:bg-[#64748B] text-white font-semibold py-2 rounded transition-colors"
                >
                    {isSubmitting ? "Cargando..." : "Registrar Alumnos"}
                </button>
            </form>
        </div>
    );
};

export default RegisterStudents;
