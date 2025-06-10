import React, { useState, useEffect } from "react";

const PhaseAssignmentEditor = ({ projectId, onClose, onAssignmentsSaved }) => {
    const [assignments, setAssignments] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            // 1. Obtener asignaciones
            const assignRes = await fetch(`/api/PhaseAssignments?projectId=${projectId}`);
            let assignData = [];
            if (assignRes.ok) {
                assignData = await assignRes.json();
            } else {
                setError("Error al cargar asignaciones.");
            }

            // 2. Obtener equipo
            const teamRes = await fetch(`/api/Projects/${projectId}/team`);
            let teamData = [];
            if (teamRes.ok) {
                teamData = await teamRes.json();
            } else {
                setError("Error al cargar el equipo.");
            }

            // 3. Filtrar solo alumnos (excluye profesores si lo deseas)
            //   Suponiendo que en la respuesta devuelves un 'role' o algo similar
            //   para identificar a profesores. Si no, ya filtras en tu backend.
            const onlyStudents = teamData.filter(
                (member) => member.roleInProject !== "Profesor"
            );

            // 4. Combinar asignaciones con participantes
            // Crea un objeto intermedio con la info mínima requerida para la UI
            const combined = onlyStudents.map((member) => {
                // Buscar si ya existe una asignación para este user
                const existing = assignData.find(
                    (a) => a.applicationUserId === member.applicationUserId
                );

                return {
                    applicationUserId: member.applicationUserId,
                    userName: `${member.nombre} ${member.apellidoPaterno}`,
                    assignedPhase: existing ? existing.assignedPhase : 1
                };
            });

            setAssignments(combined);
            setTeam(onlyStudents);
        } catch (err) {
            setError("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (userId, value) => {
        setAssignments((prev) =>
            prev.map((item) =>
                item.applicationUserId === userId
                    ? { ...item, assignedPhase: parseInt(value, 10) }
                    : item
            )
        );
    };

    const handleSave = async () => {
        // Se envía SOLO la parte de { applicationUserId, assignedPhase }
        // tal como espera tu PUT /api/PhaseAssignments
        try {
            const response = await fetch(`/api/PhaseAssignments?projectId=${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assignments.map((item) => ({
                    applicationUserId: item.applicationUserId,
                    assignedPhase: item.assignedPhase
                }))),
            });
            if (response.ok) {
                onAssignmentsSaved && onAssignmentsSaved();
                onClose();
            } else {
                setError("Error al guardar asignaciones.");
            }
        } catch (err) {
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
                <div className="p-6 space-y-6">
                    <h2 className="text-xl font-bold text-[#4F46E5]">Asignar Fases</h2>

                    {loading && <p>Cargando asignaciones...</p>}

                    {error && (
                        <p className="text-red-500 bg-red-50 border border-red-200 rounded-2xl p-2">
                            {error}
                        </p>
                    )}

                    {!loading && !error && assignments.length === 0 && (
                        <p className="text-gray-600">No hay alumnos en este proyecto.</p>
                    )}

                    {!loading && !error && assignments.length > 0 && (
                        <div className="space-y-4">
                            {assignments.map((item) => (
                                <div
                                    key={item.applicationUserId}
                                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-3 overflow-visible"
                                >
                                    <span className="text-gray-700">{item.userName}</span>
                                    <select
                                        value={item.assignedPhase}
                                        onChange={(e) =>
                                            handleChange(item.applicationUserId, e.target.value)
                                        }
                                        className="border border-gray-200 rounded-2xl p-2 pr-8 bg-white appearance-none focus:outline-none focus:border-[#4F46E5]"
                                    >
                                        <option value={1}>Planeación</option>
                                        <option value={2}>Diseño</option>
                                        <option value={3}>Desarrollo</option>
                                        <option value={4}>Evaluación</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-[#4F46E5] hover:bg-[#3730A3] text-white font-semibold px-4 py-2 rounded-2xl transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhaseAssignmentEditor;
