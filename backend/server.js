// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Para leer el cuerpo JSON de las peticiones

// Configura la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint para registrar usuarios
app.post('/api/users', async (req, res) => {
  const { name, document_type, document_number, email , assistant_type, program, campus, institution, type_sector, name_enterprise, contac1, contact_2 } = req.body;  
  
  const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (checkEmail.rows.length > 0) {
    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO users (name, document_type, document_number, email , assistant_type, program, campus, institution, type_sector, name_enterprise, contac1, contact_2) VALUES ($1, $2, $3, $4, $5 , $6, $7, $8, $9, $10, $11, $12)',
      [name, document_type, document_number, email, assistant_type, program, campus, institution, type_sector, name_enterprise, contac1, contact_2]
    );
    
    res.status(201).send('User registered');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

//End Point para buscar usuarios
app.post('/buscar-usuario', async (req, res) => {
  const { numeroDocu } = req.body;
  try {
      const usuario = await pool.query('SELECT * FROM users WHERE document_number = $1', [numeroDocu]);
      
      if (usuario.rows.length > 0) {
          res.json(usuario.rows[0]); // Enviar el usuario encontrado
      } else {
          res.status(404).send('Usuario no encontrado');
      }
  } catch (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).send('Error del servidor');
  }
});

app.get('/api/listar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});


// Endpoint para actualizar el estado de asistencia
// backend/server.js

app.post('/api/actualizar-asistencia', async (req, res) => {
  const { cedula, estadoAsistencia } = req.body;  // Recibimos cédula y estado de asistencia (true o false)

  try {
      // Convertir el estado de asistencia en texto adecuado
      const estado = estadoAsistencia ? 'Asistio' : 'No_asistio';

      // Actualizamos el estado de asistencia en la base de datos
      const result = await pool.query(
          'UPDATE users SET asistencia = $1 WHERE document_number = $2 RETURNING *',
          [estado, cedula]
      );

      if (result.rows.length > 0) {
          res.json({ message: 'Estado de asistencia actualizado', usuario: result.rows[0] });
      } else {
          res.status(404).json({ error: 'Usuario no encontrado' });
      }
  } catch (error) {
      console.error('Error al actualizar la asistencia:', error);
      res.status(500).json({ error: 'Error al actualizar la asistencia' });
  }
});




// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
