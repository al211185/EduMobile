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
                        className="bg-gray-100 p-4 rounded-md shadow-sm min-h-[200px]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{status}</h3>
                        {items.map((item, index) => (
                            <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
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


    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!developmentPhase) return <div>No se encontró la fase de desarrollo para este proyecto.</div>;

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Kanban Board del Proyecto {projectId}
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 h-[calc(100vh-150px)]">
                    {statuses.map((status) => (
                        <div key={status} className="flex-1">
                            <Droppable droppableId={status}>
                                {(provided, snapshot) => (
                                    <div
                                        className="bg-gray-100 p-4 rounded-md shadow-sm h-full flex flex-col"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            {status}
                                        </h3>
                                        <div className="flex-1 overflow-y-auto">
                                            {kanbanItems
                                                .filter((item) => item.status === status)
                                                .map((item, index) => (
                                                    <Draggable
                                                        key={String(item.id)}
                                                        draggableId={String(item.id)}
                                                        index={index}
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
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );


};

export default DevelopmentPhase;
