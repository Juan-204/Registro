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
  const { name, documentType, documentNumber, assistantType, program, campus, institution, typeSector, nameEnterprise, contac1, contact2 } = req.body;  
  try {
    const result = await pool.query(
      'INSERT INTO users (name, document_type, document_number, assistant_type, program, campus, institution, type_sector, name_enterprise, contac1, contact2) VALUES ($1, $2, $3, $4, $5 , $6, $7, $8, $9, $10, $11)',
      [name, documentType, documentNumber, assistantType, program, campus, institution, typeSector, nameEnterprise, contac1, contact2]
    );
    
    res.status(201).send('User registered');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
