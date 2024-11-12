import { useState } from 'react';
import { TextField, Button, Typography, Box, Radio, FormControlLabel } from '@mui/material';
import '../App.css';

function BuscarUsuario() {
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [checked, setChecked] = useState(false);  // Estado del checkbox de asistencia
    const [mensajeError, setMensajeError] = useState('');

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
                    asistencia: usuario.asistencia, // También tomamos el estado de asistencia
                });
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

    // Función para actualizar el estado de asistencia
    const handleAsistenciaChange = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/actualizar-asistencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula: cedulaBusqueda,
                    estadoAsistencia: checked,  // Enviamos el estado booleano
                }),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Mensaje de éxito
                setUsuarioEncontrado((prev) => ({
                    ...prev,
                    asistencia: checked ? 'Asistio' : 'No_asistio',
                })); // Actualizamos el estado de asistencia en el frontend
            } else {
                console.error('Error al actualizar la asistencia');
            }
        } catch (error) {
            console.error('Error al actualizar la asistencia:', error);
        }
    };
    

    return (
        <Box component="form" className="shadow-2xl">
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
                <Box sx={{ marginTop: 2 }}>
                    <Typography>Usuario Encontrado:</Typography>
                    <Typography>Nombre: {usuarioEncontrado.nombre}</Typography>
                    <Typography>Tipo de Documento: {usuarioEncontrado.tipoDocu}</Typography>
                    <Typography>Cédula: {usuarioEncontrado.numeroDocu}</Typography>
                    <Typography>Estado de Asistencia: {usuarioEncontrado.asistencia}</Typography>

                    <FormControlLabel
                        control={<Radio checked={checked} onChange={() => { 
                            setChecked(!checked); 
                            handleAsistenciaChange(); // Llamamos a la función para actualizar la asistencia
                        }} />}
                        label="Asistió"
                    />
                </Box>
            )}
        </Box>
    );
}

export default BuscarUsuario;
