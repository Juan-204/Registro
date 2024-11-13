import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

function BuscarUsuario() {
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [mensajeError, setMensajeError] = useState('');
    const [asistencia, setAsistencia] = useState('No_asistio'); // Estado inicial

    const handleBusqueda = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscar-usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numeroDocu: cedulaBusqueda }),
            });

            if (response.ok) {
                const usuario = await response.json();
                setUsuarioEncontrado({
                    nombre: usuario.name,
                    tipoDocu: usuario.document_type,
                    numeroDocu: usuario.document_number,
                    asistencia: usuario.asistencia, 
                    programa: usuario.program// Mantenemos el estado de asistencia para mostrarlo
                });
                setAsistencia(usuario.asistencia);  // Establecemos el estado inicial
                setMensajeError('');
            } else {
                setUsuarioEncontrado(null);
                setMensajeError('Usuario no encontrado.');
            }
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            setMensajeError('Ocurrió un error al buscar el usuario.');
        }
    };

    const handleCedulaChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setCedulaBusqueda(value);
        }
    };

    const handleActualizarAsistencia = async () => {
        const nuevoEstadoAsistencia = asistencia === 'No_asistio' ? 'Asistio' : 'No_asistio'; // Alternamos el estado

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/actualizar-asistencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula: cedulaBusqueda,
                    estadoAsistencia: nuevoEstadoAsistencia,  // Enviamos el nuevo estado
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setAsistencia(nuevoEstadoAsistencia); // Actualizamos el estado de asistencia en el frontend
                alert(result.message); // Muestra el mensaje de éxito
                setCedulaBusqueda('');
                setUsuarioEncontrado(null);
                setMensajeError('');
            } else {
                alert(result.error);
                setCedulaBusqueda('');
                setUsuarioEncontrado(null);
                setMensajeError('');
            }
        } catch (error) {
            console.error('Error al actualizar la asistencia:', error);
        }
    };

    return (
        <Box component="form" className="flex items-center flex-col shadow-2xl">
            <Typography className="text-4xl">Buscar Usuario por Cédula</Typography>

            <TextField
                label="Número de Cédula"
                value={cedulaBusqueda}
                onChange={handleCedulaChange}
                required
                className="MuiFormControl-root"
                sx={{ marginBottom: 2 }}
            />

            <Button 
                onClick={handleBusqueda} 
                variant="contained" 
                className="MuiButton-root"
                disabled={cedulaBusqueda.length === 0}
            >
                Buscar
            </Button>

            {mensajeError && <Typography color="error">{mensajeError}</Typography>}

            {usuarioEncontrado && (
                <Box className="flex items-center flex-col m-3 w-auto h-auto">
                    <Typography>Usuario Encontrado:</Typography>
                    <Typography>Nombre: {usuarioEncontrado.nombre}</Typography>
                    <Typography>Cédula: {usuarioEncontrado.programa}</Typography>
                    <Typography>Tipo de Documento: {usuarioEncontrado.tipoDocu}</Typography>
                    <Typography>Cédula: {usuarioEncontrado.numeroDocu}</Typography>

                    {/* Aquí mostramos el estado actual de asistencia */}
                    <Typography>Estado de Asistencia: {asistencia === 'Asistio' ? 'Asistió' : 'No Asistió'}</Typography>

                    {/* Botón para alternar el estado de asistencia */}
                    <Button 
                        variant="contained"
                        onClick={handleActualizarAsistencia}
                        sx={{ marginTop: 1, fontSize: '15px', width: 'auto' }}
                    >
                        Marcar Asistencia
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default BuscarUsuario;
