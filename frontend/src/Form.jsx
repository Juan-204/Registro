import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, TextField, InputLabel, Select, MenuItem, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const Form = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar usuarios registrados
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocu: '',
    numeroDocu: '',
    TipoAsis: '',
    institucion: '',
    programaUniversitario: '',
    gradoEscolar: '',
  });

  // Función para obtener usuarios de la base de datos
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users-get`);
      if (!response.ok) {
        const errorText = await response.text(); // Obtener el texto de error
        console.error(`Error al obtener usuarios: ${errorText}`);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };
  

  // Llama a fetchUsuarios cuando el componente se monte
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const manejoForm = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nombre,
          document_type: formData.tipoDocu,
          document_number: formData.numeroDocu,
          assistant_type: formData.TipoAsis,
          institution: formData.institucion,
          university_program: formData.programaUniversitario,
          school_grade: formData.gradoEscolar,
        }),
      });
  
      if (response.ok) {
        console.log('Usuario registrado con éxito');
        fetchUsuarios(); // Actualiza la lista de usuarios después de agregar uno nuevo
        setFormData({ nombre: '', tipoDocu: '', numeroDocu: '', TipoAsis: '', institucion: '', programaUniversitario: '', gradoEscolar: '' });

      } else {
        console.error('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };
  

  return (
    <>
      <Box className='shadow-2xl rounded-2xl flex flex-col' component='form' onSubmit={manejoForm}>
        <Typography className='text-4xl'>Asistencia Eventos Univalle</Typography>
        
        <FormControl sx={{ margin: '10px' }}>
          <TextField
            label='Nombre Completo'
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </FormControl>
        
        <FormControl sx={{ margin: '10px', textAlign: 'start' }}>
          <InputLabel id='TipoDocu'>Tipo de documento</InputLabel>
          <Select
            labelId='TipoDocu'
            id='TipoDocu'
            label="Tipo de documento"
            name="tipoDocu"
            value={formData.tipoDocu}
            onChange={handleChange}
            required
          >
            <MenuItem value='TD'>Tarjeta de identidad</MenuItem>
            <MenuItem value='CC'>Cédula de ciudadanía</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ margin: '10px' }}>
          <TextField
            label='Número De Documento'
            name='numeroDocu'
            value={formData.numeroDocu}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl sx={{ margin: '10px', textAlign: 'start' }}>
          <InputLabel id='TipoAsis'>Tipo de Asistente</InputLabel>
          <Select
            labelId='TipoAsis'
            id='TipoAsis'
            label="Tipo de Asistente"
            name="TipoAsis"
            value={formData.TipoAsis}
            onChange={handleChange}
            required
          >
            <MenuItem value='EXPOSITOR/A'>Expositor/a</MenuItem>
            <MenuItem value='ASISTENTE'>Asistente</MenuItem>
            <MenuItem value='LOGISTICA'>Logística</MenuItem>
            <MenuItem value='ORGANIZADOR'>Organizador</MenuItem>
            <MenuItem value='PONENTE'>Ponente</MenuItem>
          </Select>
        </FormControl>

        {formData.TipoAsis === 'ASISTENTE' && (
          <>
            <FormControl sx={{ margin: '10px', textAlign: 'start' }}>
              <InputLabel id='Institucion'>Institución</InputLabel>
              <Select
                labelId='Institucion'
                id='Institucion'
                label="Institución"
                name="institucion"
                value={formData.institucion}
                onChange={handleChange}
                required
              >
                <MenuItem value='UNIVERSIDAD'>Universidad</MenuItem>
                <MenuItem value='COLEGIO'>Colegio</MenuItem>
              </Select>
            </FormControl>

            {formData.institucion === 'UNIVERSIDAD' && (
              <FormControl sx={{ margin: '10px' }}>
                <TextField
                  label='Programa Universitario'
                  name='programaUniversitario'
                  value={formData.programaUniversitario}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            )}

            {formData.institucion === 'COLEGIO' && (
              <FormControl sx={{ margin: '10px' }}>
                <TextField
                  label='Grado Escolar'
                  name='gradoEscolar'
                  value={formData.gradoEscolar}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            )}
          </>
        )}
        
        <Button type='submit'>Guardar</Button>
      </Box>

      <TableContainer sx={{ marginTop: 10 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>Número Documento</TableCell>
              <TableCell>Tipo de Asistente</TableCell>
              <TableCell>Institución</TableCell>
              <TableCell>Programa Universitario</TableCell>
              <TableCell>Grado Escolar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario, index) => (
              <TableRow key={index}>
                <TableCell>{usuario.name}</TableCell>
                <TableCell>{usuario.document_type}</TableCell>
                <TableCell>{usuario.document_number}</TableCell>
                <TableCell>{usuario.assistant_type}</TableCell>
                <TableCell>{usuario.institution || '-'}</TableCell>
                <TableCell>{usuario.university_program || '-'}</TableCell>
                <TableCell>{usuario.school_grade || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Form;
