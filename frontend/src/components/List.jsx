// src/components/ListaUsuarios.js
import { useEffect, useState } from 'react';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina] = useState(10);
  const [busqueda, setBusqueda] = useState('');

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

  // Filtrar usuarios por cédula si hay texto en la búsqueda
  const usuariosFiltrados = busqueda
    ? usuarios.filter((usuario) =>
        usuario.document_number.includes(busqueda)
      )
    : usuarios;

  // Lógica para obtener los usuarios de la página actual
  const indexOfLastUsuario = paginaActual * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const usuariosPaginaActual = usuariosFiltrados.slice(indexOfFirstUsuario, indexOfLastUsuario);

  // Funciones para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina > 0 && numeroPagina <= totalDePaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const totalDePaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  // Función para manejar el cambio de búsqueda
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1); // Resetear la página a la 1 cuando se realiza una búsqueda
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Usuarios</h1>
      
      {/* Campo de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por cédula"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="px-4 py-2 w-full md:w-1/3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Tipo de Documento</th>
              <th className="py-3 px-6 text-left"># de Documento</th>
              <th className="py-3 px-6 text-left">Tipo de Asistente</th>
              <th className="py-3 px-6 text-left">Programa</th>
              <th className="py-3 px-6 text-left">Campus</th>
              <th className="py-3 px-6 text-left">Institucion</th>
              <th className="py-3 px-6 text-left">Tipo de Sector</th>
              <th className="py-3 px-6 text-left">Nombre de la Empresa</th>
              <th className="py-3 px-6 text-left">Contacto 1</th>
              <th className="py-3 px-6 text-left">Contacto 2</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginaActual.map((usuario, index) => (
              <tr key={usuario.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {/* El ID es generado de manera secuencial empezando en 1 */}
                <td className="py-3 px-6 border-b border-gray-200">{index + 1 + (paginaActual - 1) * usuariosPorPagina}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.name}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.document_type}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.document_number}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.assistant_type}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.program}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.campus}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.institution}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.type_sector}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.name_enterprise}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.contac1}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.contact_2}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.email}</td>
                <td className="py-3 px-6 border-b border-gray-200">{usuario.asistencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de Paginación */}
      <div className="mt-6 text-center">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 disabled:bg-gray-300"
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-lg">
          Página {paginaActual} de {totalDePaginas}
        </span>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalDePaginas}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 disabled:bg-gray-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaUsuarios;
