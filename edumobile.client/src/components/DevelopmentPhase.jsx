import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

// Definimos los estados o columnas del Kanban Board
const statuses = ["Backlog", "Todo", "InProgress", "Done"];

const DevelopmentPhase = ({ projectId, readOnly = false }) => {
    const { projectId: paramId } = useParams();
    projectId = projectId || paramId;

    const [developmentPhase, setDevelopmentPhase] = useState(null);
    const [kanbanItems, setKanbanItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estado local para la retroalimentación del profesor (fase 3)
    const [localFeedback, setLocalFeedback] = useState("");

    // Cargar la fase de desarrollo y sus KanbanItems a partir del projectId
    useEffect(() => {
        if (!projectId) return;

        const fetchDevelopmentPhase = async () => {
            try {
                const response = await axios.get(`/api/DevelopmentPhases/byproject/${projectId}`);
                // Se asume que el endpoint retorna el DevelopmentPhase con su colección de KanbanItems
                setDevelopmentPhase(response.data);
                setKanbanItems(response.data.kanbanItems || []);
            } catch (err) {
                console.error("Error fetching development phase", err);
                setError("Error al cargar la fase de desarrollo.");
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopmentPhase();
    }, [projectId]);

    // Si se encuentra projectId, cargar la retroalimentación guardada para la fase de desarrollo (fase 3)
    useEffect(() => {
        if (projectId) {
            const fetchFeedback = async () => {
                try {
                    const response = await fetch(`/api/Feedbacks/${projectId}/3`);
                    console.log("GET Feedback response:", response);
                    if (response.ok) {
                        const data = await response.json();
                        // Ajusta el nombre de la propiedad según lo que retorna tu API (ej: feedbackText)
                        setLocalFeedback(data.feedbackText || "");
                    } else if (response.status === 404) {
                        setLocalFeedback("");
                    } else {
                        console.error("Error al obtener la retroalimentación.");
                    }
                } catch (error) {
                    console.error("Error en fetchFeedback:", error);
                }
            };
            fetchFeedback();
        }
    }, [projectId]);

    // Manejar el fin del drag; si readOnly es true, se deshabilita el arrastre
    const onDragEnd = async (result) => {
        if (readOnly) return; // No permite drag en modo readOnly

        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Copia el arreglo actual y busca el item arrastrado
        const updatedItems = Array.from(kanbanItems);
        const draggedIndex = updatedItems.findIndex((item) => String(item.id) === draggableId);
        if (draggedIndex === -1) return;
        const draggedItem = updatedItems[draggedIndex];

        // Actualizamos el status y reordenamos
        draggedItem.status = destination.droppableId;
        updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(destination.index, 0, draggedItem);
        setKanbanItems(updatedItems);

        // Payload mínimo
        const payload = {
            status: destination.droppableId,
            order: destination.index
        };

        console.log("Payload:", payload);

        try {
            await axios.put(
                `/api/DevelopmentPhases/${draggedItem.developmentPhaseId}/kanbanitems/${draggedItem.id}`,
                payload
            );
        } catch (error) {
            console.error("Error updating card status", error);
            alert("Error al actualizar el estado de la tarjeta.");
        }
    };

    // Renderiza cada columna usando Droppable y Draggable
    const renderColumn = (status) => {
        const items = kanbanItems.filter(item => item.status === status);
        return (
            <Droppable droppableId={status} key={status}>
                {(provided) => (
                    <div
                        className="bg-gray-100 p-4 rounded-md shadow-sm min-h-[200px]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{status}</h3>
                        {items.map((item, index) => (
                            <Draggable
                                key={String(item.id)}
                                draggableId={String(item.id)}
                                index={index}
                                isDragDisabled={readOnly} // Deshabilitar drag para readOnly (profesor)
                            >
                                {(provided, snapshot) => (
                                    <div
                                        className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-2"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                        }}
                                    >
                                        <h4 className="text-md font-medium text-gray-800">{item.title}</h4>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };

    // Función para guardar la retroalimentación del profesor para la fase de desarrollo (fase 3)
    const handleFeedbackSave = async () => {
        try {
            // Primero se intenta obtener la retroalimentación existente para este proyecto y fase (fase 3)
            const getResponse = await fetch(`/api/Feedbacks/${projectId}/3`);
            if (getResponse.ok) {
                // Ya existe retroalimentación: actualizarla
                const existingFeedback = await getResponse.json();
                const feedbackId = existingFeedback.id;
                const putResponse = await fetch(`/api/Feedbacks/${feedbackId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 3,
                        FeedbackText: localFeedback,
                    }),
                });
                if (!putResponse.ok) {
                    const errData = await putResponse.json();
                    console.error("Error al actualizar feedback:", errData);
                    alert("Error al actualizar la retroalimentación.");
                } else {
                    alert("Retroalimentación actualizada correctamente.");
                }
            } else if (getResponse.status === 404) {
                // No existe retroalimentación: crear una nueva
                const postResponse = await fetch("/api/Feedbacks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ProjectId: parseInt(projectId, 10),
                        Phase: 3,
                        FeedbackText: localFeedback,
                    }),
                });
                if (!postResponse.ok) {
                    const errData = await postResponse.json();
                    console.error("Error al crear feedback:", errData);
                    alert("Error al crear la retroalimentación.");
                } else {
                    alert("Retroalimentación creada correctamente.");
                }
            } else {
                alert("Error al obtener la retroalimentación.");
            }
        } catch (error) {
            console.error("Error en handleFeedbackSave:", error);
            alert("Error al guardar la retroalimentación.");
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!developmentPhase) return <div>No se encontró la fase de desarrollo para este proyecto.</div>;

    return (
        <div className="w-full flex-1 flex flex-col rounded-2xl overflow-hidden bg-white">
            {/* Contenido con scroll */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Etapa de desarrollo
                </h2>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {statuses.map((status) => (
                            <Droppable droppableId={status} key={status}>
                                {(provided) => {
                                    const items = kanbanItems.filter((i) => i.status === status);
                                    return (
                                        <div
                                            className="min-w-[240px] bg-gray-100 p-4 rounded-2xl border border-gray-200 flex-shrink-0 flex flex-col"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                {status}
                                            </h3>
                                            <div className="flex-1 space-y-2 overflow-y-auto">
                                                {items.map((item, index) => (
                                                    <Draggable
                                                        key={String(item.id)}
                                                        draggableId={String(item.id)}
                                                        index={index}
                                                        isDragDisabled={readOnly}
                                                    >
                                                        {(prov, snap) => (
                                                            <div
                                                                className="bg-white p-3 rounded-md border border-gray-200 shadow-sm"
                                                                ref={prov.innerRef}
                                                                {...prov.draggableProps}
                                                                {...prov.dragHandleProps}
                                                                style={{
                                                                    ...prov.draggableProps.style,
                                                                    opacity: snap.isDragging ? 0.8 : 1,
                                                                }}
                                                            >
                                                                <h4 className="text-md font-medium text-gray-800">
                                                                    {item.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>

                {/* Retroalimentación */}
                <fieldset className="rounded-2xl border border-gray-200 p-4">
                    <legend className="sr-only">Retroalimentación del Profesor</legend>
                    <label
                        htmlFor="teacherFeedback"
                        className="block mb-2 font-bold text-gray-700"
                    >
                        Retroalimentación del Profesor:
                    </label>

                    {readOnly ? (
                        <>
                            <textarea
                                id="teacherFeedback"
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={3}
                                value={localFeedback}
                                onChange={(e) => setLocalFeedback(e.target.value)}
                            />
                            <button
                                onClick={handleFeedbackSave}
                                className="mt-2 bg-[#4F46E5] hover:bg-[#3730A3] text-white px-4 py-2 rounded"
                            >
                                Guardar Retroalimentación
                            </button>
                        </>
                    ) : (
                        <textarea
                            id="teacherFeedback"
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            rows={3}
                            value={localFeedback}
                            disabled
                        />
                    )}
                </fieldset>
            </div>
        </div>
    );
};

export default DevelopmentPhase;
