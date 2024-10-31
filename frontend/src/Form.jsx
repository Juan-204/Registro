// src/Form.jsx
import { useState } from 'react';

const Form = () => {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [assistantType, setAssistantType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Cambia la URL por la URL de tu backend en Railway
    const response = await fetch('https://tu-backend-railway-url/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, documentType, documentNumber, assistantType }),
    });

    if (response.ok) {
      console.log('User registered successfully');
      // Opcional: limpiar el formulario
      setName('');
      setDocumentType('');
      setDocumentNumber('');
      setAssistantType('');
    } else {
      console.error('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="text"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        placeholder="Tipo de documento"
        required
      />
      <input
        type="text"
        value={documentNumber}
        onChange={(e) => setDocumentNumber(e.target.value)}
        placeholder="Número de documento"
        required
      />
      <input
        type="text"
        value={assistantType}
        onChange={(e) => setAssistantType(e.target.value)}
        placeholder="Tipo de asistente"
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Form;
