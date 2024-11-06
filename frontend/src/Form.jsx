import { useState } from 'react';

const Form = () => {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [assistantType, setAssistantType] = useState('');
  const [program ,setProgram] = useState('');
  const [campus ,setCampus] = useState('');
  const [institution ,setInstitution] = useState('');
  const [typeSector,setTypeSector] = useState('');
  const [nameEnterprise,setNameEnterprise] = useState('');
  const [contac1,setContac1] = useState('');
  const [contact2,setContact2] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        document_type: documentType,  // Cambia a document_type
        document_number: documentNumber, // Cambia a document_number
        assistant_type: assistantType,  // Cambia a assistant_type
        program, 
        campus, 
        institution, 
        type_sector: typeSector, // Cambia a type_sector
        name_enterprise: nameEnterprise, // Cambia a name_enterprise
        contac1, 
        contact_2: contact2,
      }),
    });
    

    if (response.ok) {
      console.log('Usuario registrado con éxito');
      // Opcional: limpiar el formulario
      setName('');
      setDocumentType('');
      setDocumentNumber('');
      setAssistantType('');
      setProgram('');
      setCampus('');
      setInstitution('');
      setTypeSector('');
      setNameEnterprise('');
      setContac1('');
      setContact2('');
      } else {
      console.error('Error al registrar el usuario');
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
      <input
        type="text"
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        placeholder="Programa"
        required
      />
      <input
        type="text"
        value={campus}
        onChange={(e) => setCampus(e.target.value)}
        placeholder="Campus"
        required
      />
      <input
        type="text"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="Institucion"
        required
      />
      <input
        type="text"
        value={typeSector}
        onChange={(e) => setTypeSector(e.target.value)}
        placeholder="Tipo de Sector"
        required
      />
      <input
        type="text"
        value={nameEnterprise}
        onChange={(e) => setNameEnterprise(e.target.value)}
        placeholder="Nombre de la empresa"
        required
      />
      <input
        type="text"
        value={contac1}
        onChange={(e) => setContac1(e.target.value)}
        placeholder="Contacto 1"
        required
      />
      <input
        type="text"
        value={contact2}
        onChange={(e) => setContact2(e.target.value)}
        placeholder="Contacto 2"
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Form;
