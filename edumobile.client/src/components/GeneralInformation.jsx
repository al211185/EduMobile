import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const GeneralInformation = ({ formData, handleInputChange }) => {
    const { user } = useAuth();
    const [warnings, setWarnings] = useState({
        title: false,
        clienteName: false,
        responsable: false,
        startDate: false,
    });

    useEffect(() => {
        if (user?.nombre) {
            if (!formData.title?.trim() && formData.title !== `Proyecto de ${user.nombre}`) {
                handleInputChange({
                    target: { name: "title", value: `Proyecto de ${user.nombre}` },
                });
            }
            if (!formData.responsable?.trim() && formData.responsable !== `${user.nombre} ${user.apellidoPaterno || ""}`) {
                handleInputChange({
                    target: { name: "responsable", value: `${user.nombre} ${user.apellidoPaterno || ""}` },
                });
            }
        }
    }, [user, formData.title, formData.responsable, handleInputChange]);

    useEffect(() => {
        const newWarnings = {
            title: !formData.title?.trim(),
            clienteName: !formData.clienteName?.trim(),
            responsable: !formData.responsable?.trim(),
            startDate: !formData.startDate,
        };

        setWarnings((prevWarnings) => {
            if (
                prevWarnings.title === newWarnings.title &&
                prevWarnings.clienteName === newWarnings.clienteName &&
                prevWarnings.responsable === newWarnings.responsable &&
                prevWarnings.startDate === newWarnings.startDate
            ) {
                return prevWarnings;
            }
            return newWarnings;
        });
    }, [formData]);

    return (
        <fieldset>
            <legend>
                <h2>Fase 1: Brief de diseño</h2>
            </legend>
            <p>
                En esta sección resolverás las fases de <b>Identificación de los objetivos del proyecto web</b> y{" "}
                <b>Establecimiento de los requisitos del cliente</b> del proyecto web.
            </p>
            <div className="grid-container">
                <label htmlFor="title">Nombre del proyecto:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                />
                {warnings.title && <p className="warning-message">El nombre del proyecto es obligatorio.</p>}

                <label htmlFor="clienteName">Nombre del cliente:</label>
                <input
                    type="text"
                    id="clienteName"
                    name="clienteName"
                    value={formData.clienteName || ""}
                    onChange={handleInputChange}
                />
                {warnings.clienteName && <p className="warning-message">El nombre del cliente es obligatorio.</p>}

                <label htmlFor="responsable">Responsable del proyecto:</label>
                <input
                    type="text"
                    id="responsable"
                    name="responsable"
                    value={formData.responsable || ""}
                    onChange={handleInputChange}
                />
                {warnings.responsable && (
                    <p className="warning-message">El responsable del proyecto es obligatorio.</p>
                )}

                <label htmlFor="startDate">Fecha de inicio:</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleInputChange}
                />
                {warnings.startDate && <p className="warning-message">La fecha de inicio es obligatoria.</p>}
            </div>
        </fieldset>
    );
};

export default GeneralInformation;
