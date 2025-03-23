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
                // Si deseas refrescar información del proyecto en un componente padre, llama a refreshProject()
                refreshProject && refreshProject();
            } else {
                alert(data.message || "Error al eliminar el colaborador.");
            }
        } catch (err) {
            alert("Error al conectar con el servidor.");
        }
    };

    if (loading) return <p>Cargando equipo...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="team-list">
            <h3>Equipo del Proyecto</h3>
            {team.length === 0 ? (
                <p>No hay colaboradores en este proyecto.</p>
            ) : (
                <ul>
                    {team.map((member) => (
                        <li key={member.applicationUserId}>
                            {member.nombre} {member.apellidoPaterno} - {member.roleInProject}
                            {isCreator && (
                                <button onClick={() => handleRemove(member.applicationUserId)}>
                                    Eliminar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamList;
