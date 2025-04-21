import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PerfilUsu = () => {
  const [usuarioData, setUsuarioData] = useState({
    idCliente: '',
    Nombre: '',
    Apellido: '',
    Email: '',
  });

  const [errores, setErrores] = useState({
    Nombre: false,
    Apellido: false,
    Email: false,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioGuardado || !usuarioGuardado.idCliente) {
      Swal.fire('Error', 'Usuario no autenticado', 'error');
      navigate('/login');
      return;
    }

    fetch(`http://localhost/API/cliente.php?idCliente=${usuarioGuardado.idCliente}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener los datos');
        return response.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setUsuarioData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { Nombre, Apellido, Email } = usuarioData;
    const camposVacios = {
      Nombre: !Nombre.trim(),
      Apellido: !Apellido.trim(),
      Email: !Email.trim(),
    };

    setErrores(camposVacios);

    if (Object.values(camposVacios).some(Boolean)) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos antes de guardar.',
      });
      return;
    }

    fetch('http://localhost/API/EditUsuario.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error en la solicitud');
        return response.json();
      })
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Hubo un problema al actualizar', 'error');
        console.error('Error:', error);
      });
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Cargando datos del usuario...</p>;

  return (<div>
    <header className="main-header">
    <a href="/IndexUsu"><button className="w-full bg-[#1a237e] hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">VOLVER A LA PAGINA PRINCIPAL</button></a>
    <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />

  </header>
    <main className="min-h-screen bg-gradient-to-br from-[#1a237e] to-black flex items-center justify-center py-10 px-4 space-x-2 ">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {usuarioData.Nombre} {usuarioData.Apellido}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="idCliente" value={usuarioData.idCliente} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              name="Nombre"
              value={usuarioData.Nombre}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                errores.Nombre ? 'border-red-500' : 'border-gray-300'
              } focus:ring focus:ring-blue-200`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido:</label>
            <input
              type="text"
              name="Apellido"
              value={usuarioData.Apellido}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                errores.Apellido ? 'border-red-500' : 'border-gray-300'
              } focus:ring focus:ring-blue-200`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="Email"
              value={usuarioData.Email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                errores.Email ? 'border-red-500' : 'border-gray-300'
              } focus:ring focus:ring-blue-200`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>
        <div className='flex justify-center mt-4'>
            <p className='bg-white'> O SI PREFIERES </p>
        </div>
        <div className='flex justify-center mt-4'>
            <button type="delete"
             className="py-1.5 bg-[#d50a2e] hover:bg-[#1a237e] text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
             eliminar cuenta
            </button>    
      </div>
      </div>

    </main>
    </div>
  );
};

export default PerfilUsu;
