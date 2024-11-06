import { useState } from 'react';
import { TextField, Button, Typography, Box, Radio, FormControlLabel } from '@mui/material';
import '../App.css';

function BuscarUsuario() {
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [checked, setChecked] = useState(false); // Estado para el RadioButton
    const [mensajeError, setMensajeError] = useState(''); // Estado para mensajes de error o éxito

    const handleBusqueda = async () => {
        try {
            // Cambia '/buscar-usuario' al endpoint correcto en tu backend para buscar usuarios
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscar-usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numeroDocu: cedulaBusqueda }), // Enviar número de documento al backend
            });

            if (response.ok) {
                const usuario = await response.json();
                setUsuarioEncontrado(usuario);
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
        // Verifica que el valor ingresado sea numérico
        if (/^\d*$/.test(value)) {
            setCedulaBusqueda(value);
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
                disabled={cedulaBusqueda.length === 0} // Deshabilitar el botón si no hay número de cédula
            >
                Buscar
            </Button>

            {/* Mensaje de error o éxito */}
            {mensajeError && <Typography color="error">{mensajeError}</Typography>}

            {usuarioEncontrado && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography>Usuario Encontrado:</Typography>
                    <Typography>Nombre: {usuarioEncontrado.nombre}</Typography>
                    <Typography>Tipo de Documento: {usuarioEncontrado.tipoDocu}</Typography>
                    <Typography>Cédula: {usuarioEncontrado.numeroDocu}</Typography>

                    {/* Radio button para realizar el checklist */}
                    <FormControlLabel
                        control={<Radio checked={checked} onChange={() => setChecked(!checked)} />}
                        label="Realizar Checklist"
                    />
                </Box>
            )}
        </Box>
    );
}

export default BuscarUsuario;
