// src/hooks/useNotificationHub.js
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useNotificationHub = () => {
    const [notifications, setNotifications] = useState([]);
    const [connectionState, setConnectionState] = useState("Disconnected");

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/notificationHub", {
                withCredentials: true,
                transport: signalR.HttpTransportType.ServerSentEvents  // Forzar el uso de SSE
            })
            .configureLogging(signalR.LogLevel.None)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveNotification", (message) => {
            setNotifications(prev => [message, ...prev]);
        });

        connection.start()
            .then(() => {
                setConnectionState("Connected");
            })
            .catch(error => {
                setConnectionState("Disconnected");
            });

        connection.onreconnecting(error => {
            setConnectionState("Reconnecting");
        });

        connection.onreconnected(connectionId => {
            setConnectionState("Connected");
        });

        connection.onclose(error => {
            setConnectionState("Disconnected");
        });

        // Exponer la conexión para pruebas manuales
        window.connection = connection;

        return () => {
            connection.stop();
        };
    }, []);

    return { notifications, connectionState };
};
