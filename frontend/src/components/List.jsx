// src/components/ListaUsuarios.js
import { useEffect, useState } from 'react';

    const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const obtenerUsuarios = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listar`);
            if (!response.ok) {
            throw new Error("Error al obtener la lista de usuarios");
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        }
        };

        obtenerUsuarios();
    }, []);

    return (
        <div>
        <h1>Lista de Usuarios</h1>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Documento</th>
                <th>Programa</th>
                {/* Agrega más columnas según los campos en tu base de datos */}
            </tr>
            </thead>
            <tbody>
            {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.document_number}</td>
                <td>{usuario.program}</td>
                {/* Agrega más datos según sea necesario */}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

export default ListaUsuarios;
