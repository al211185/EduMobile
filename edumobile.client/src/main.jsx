import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que esta ruta apunte a tu App.jsx
import { AuthProvider } from './contexts/AuthContext'; // Importar el AuthProvider
import "./globals.css"; // Importar estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
