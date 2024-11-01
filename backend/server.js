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
  const { name, document_type, document_number, assistant_type, institucion, programaUniversitario, gradoEscolar} = req.body;
  
  try {
    await pool.query(
      'INSERT INTO users (document_type, document_number, assistant_type, name, institucion, programaUniversitario, gradoEscolar) VALUES ($1, $2, $3, $4, $5 , $6, $7)',
      [document_type, document_number, assistant_type,name, institucion, programaUniversitario, gradoEscolar]
    );
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

app.get('/api/usersget', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
