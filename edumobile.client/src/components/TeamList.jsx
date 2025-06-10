import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TeamList = ({ isCreator, refreshProject }) => {
    const { projectId } = useParams();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Función para cargar el equipo del proyecto
    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/team`);
            const data = await response.json();
            if (response.ok) {
                setTeam(data);
            } else {
                setError(data.message || "Error al cargar el equipo");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [projectId]);

    // Maneja la eliminación de un colaborador (solo para el creador)
    const handleRemove = async (collaboratorId) => {
        if (!window.confirm("¿Estás seguro de eliminar a este colaborador?")) return;
        try {
            const response = await fetch(`/api/projects/${projectId}/team/${collaboratorId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message || "Colaborador eliminado exitosamente.");
                fetchTeam(); // Refresca la lista de colaboradores
                refreshProject && refreshProject();
            } else {
                alert(data.message || "Error al eliminar el colaborador.");
            }
        } catch (err) {
            alert("Error al conectar con el servidor.");
        }
    };

    if (loading)
        return (
            <p className="text-center text-gray-600 p-4">Cargando equipo...</p>
        );
    if (error)
        return (
            <p className="text-center text-red-600 p-4">{error}</p>
        );

    return (
        <div className="rounded-2xl w-full max-w-sm overflow-auto">
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#4F46E5]">Equipo del Proyecto</h3>
                {team.length === 0 ? (
                    <p className="text-gray-600">No hay colaboradores en este proyecto.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {team.map((member) => (
                            <li
                                key={member.applicationUserId}
                                className="py-3 flex items-center justify-between"
                            >
                                <span className="text-gray-700">
                                    {member.nombre} {member.apellidoPaterno} –{" "}
                                    <em>{member.roleInProject}</em>
                                </span>
                                {isCreator && (
                                    <button
                                        onClick={() => handleRemove(member.applicationUserId)}
                                        className="text-red-600 hover:text-red-800 font-semibold rounded-2xl px-3 py-1 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TeamList;