import React, { useState } from "react";

const CreateSemester = ({ selectedCourse, onSemesterCreated }) => {
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
                    course: "Diseño web HTML5 y CSS3 Adaptativo",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Semestre creado con éxito: ${semesterName}`);
                setYear("");
                setPeriod("A");
                setDescription("");
                setDistinctive("");
                onSemesterCreated && onSemesterCreated();
            } else {
                setMessage(`⚠️ Error: ${data.message || "No se pudo crear el semestre."}`);
            }
        } catch (error) {
            setMessage("⚠️ Hubo un error al crear el semestre.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
            {message && (
                <div
                    className={`sm:col-span-2 text-center py-2 rounded-md text-sm ${message.startsWith("✅")
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Año */}
            <div className="flex flex-col">
                <label htmlFor="year" className="mb-1 font-medium text-[#64748B]">
                    Año
                </label>
                <input
                    id="year"
                    type="number"
                    required
                    placeholder="2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                />
            </div>

            {/* Periodo */}
            <div className="flex flex-col">
                <label htmlFor="period" className="mb-1 font-medium text-[#64748B]">
                    Periodo
                </label>
                <select
                    id="period"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                >
                    <option value="A">A (Primavera)</option>
                    <option value="B">B (Otoño)</option>
                </select>
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2 flex flex-col">
                <label htmlFor="description" className="mb-1 font-medium text-[#64748B]">
                    Descripción <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                    id="description"
                    rows={2}
                    placeholder="Descripción del semestre"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                />
            </div>

            {/* Distintivo */}
            <div className="sm:col-span-2 flex flex-col">
                <label
                    htmlFor="distinctive"
                    className="mb-1 font-medium text-[#64748B]"
                >
                    Distintivo <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                    id="distinctive"
                    type="text"
                    placeholder="e.g., Especialidad en Frontend"
                    value={distinctive}
                    onChange={(e) => setDistinctive(e.target.value)}
                    className="bg-[#E5E5E5] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64748B]"
                />
            </div>

            {/* Botón Crear */}
            <div className="sm:col-span-2 flex justify-end">
                <button
                    type="submit"
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                    Crear Semestre
                </button>
            </div>
        </form>
    );
};

export default CreateSemester;
