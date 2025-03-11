import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Definimos los estados o columnas del Kanban Board
const statuses = ["Backlog", "Todo", "InProgress", "Done"];

const DevelopmentPhase = ({ projectId }) => {
    const [developmentPhase, setDevelopmentPhase] = useState(null);
    const [kanbanItems, setKanbanItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Cargar la fase de desarrollo y sus KanbanItems a partir del projectId
    useEffect(() => {
        const fetchDevelopmentPhase = async () => {
            try {
                const response = await axios.get(`/api/DevelopmentPhases/byproject/${projectId}`);
                // Suponemos que el endpoint retorna el DevelopmentPhase con su colección de KanbanItems
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

    // Manejar el fin del drag
    const onDragEnd = async (result) => {
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
        const draggedIndex = updatedItems.findIndex(
            (item) => String(item.id) === draggableId
        );
        if (draggedIndex === -1) return;
        const draggedItem = updatedItems[draggedIndex];

        // Actualizamos el status
        draggedItem.status = destination.droppableId;
        updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(destination.index, 0, draggedItem);
        setKanbanItems(updatedItems);

        // Construir un payload mínimo (solo campos obligatorios)
        const payload = {
            status: destination.droppableId,
            order: destination.index // o el valor que corresponda
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
                {(provided, snapshot) => (
                    <div
                        className="kanban-column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <h3>{status}</h3>
                        {items.map((item, index) => (
                            <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        className="kanban-card"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                        }}
                                    >
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!developmentPhase) return <div>No se encontró la fase de desarrollo para este proyecto.</div>;

    return (
        <div className="development-phase">
            <h2>Kanban Board del Proyecto {projectId}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board" style={{ display: "flex", gap: "1rem" }}>
                    {statuses.map(status => renderColumn(status))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default DevelopmentPhase;
