import React, { useState } from "react";

const CreateSemester = ({ selectedCourse }) => {
    const [year, setYear] = useState("");
    const [period, setPeriod] = useState("A");
    const [description, setDescription] = useState("");
    const [distinctive, setDistinctive] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const semesterName = `${year}${period}${distinctive ? ` - ${distinctive}` : ""}`;

        try {
            const response = await fetch("/api/semesters/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: semesterName,
                    year: parseInt(year),
                    period,
                    description,
                    course: selectedCourse,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Semestre creado con éxito: ${semesterName}`);
                setYear("");
                setPeriod("A");
                setDescription("");
                setDistinctive("");
            } else {
                setMessage(`⚠️ Error: ${data.message || "No se pudo crear el semestre."}`);
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al crear el semestre.");
        }
    };

    return (
        <div className="create-semester-container">
            <h2>Crear Semestre</h2>
            {message && (
                <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-floating">
                    <label htmlFor="year">Año</label>
                    <input
                        type="number"
                        id="year"
                        className="styled-input"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Ingrese el año (e.g., 2024)"
                        required
                    />
                </div>
                <div className="form-floating">
                    <label htmlFor="period">Periodo</label>
                    <select
                        id="period"
                        className="styled-input"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        required
                    >
                        <option value="A">A (Primavera)</option>
                        <option value="B">B (Otoño)</option>
                    </select>
                </div>
                <div className="form-floating">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        className="styled-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción opcional del semestre"
                    />
                </div>
                <div className="form-floating">
                    <label htmlFor="distinctive">Distintivo</label>
                    <input
                        type="text"
                        id="distinctive"
                        className="styled-input"
                        value={distinctive}
                        onChange={(e) => setDistinctive(e.target.value)}
                        placeholder="Añadir un distintivo (e.g., 'Especialidad en Frontend')"
                    />
                </div>
                <button type="submit" className="btn-primary">Crear Semestre</button>
            </form>
        </div>
    );
};

export default CreateSemester;
