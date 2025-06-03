import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import './Inmuebles.css';

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [filtros, setFiltros] = useState({ tipo: '', transaccion: '', estado: '' });
  const [opciones, setOpciones] = useState({ tipos: [], transacciones: [], estados: [] });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOpciones = async () => {
    try {
      const res = await fetch('http://localhost/API/finmobiliaria.php?action=opciones');
      const data = await res.json();
      setOpciones(data);
    } catch (error) {
      console.error('Error al obtener opciones:', error);
    }
  };

  const fetchInmuebles = async () => {
    try {
      const query = new URLSearchParams(filtros);
      const res = await fetch(`http://localhost/API/finmobiliaria.php?${query}`);
      const data = await res.json();
      setInmuebles(data);
    } catch (error) {
      console.error('Error al obtener inmuebles:', error);
    }
  };

  useEffect(() => {
    fetchOpciones();
    fetchInmuebles();
  }, []);

  useEffect(() => {
    fetchInmuebles();
  }, [filtros]);

  const handleSelect = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setOpen(false);
  };

  const handleClear = () => {
    setFiltros({ tipo: '', transaccion: '', estado: '' });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#777',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch('http://localhost/API/deleteInmueble.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idInmueble: id })
        });
        const data = await response.json();
        if (data.message === 'Inmueble eliminado con éxito') {
          setInmuebles(prev => prev.filter(inmueble => inmueble.idInmueble !== id));
          Swal.fire('Eliminado', 'El inmueble fue eliminado con éxito.', 'success');
        }
      } catch (error) {
        console.error('Error al eliminar inmueble:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost/API/getInmuebleById.php?idInmueble=${id}`);
      const inmueble = await response.json();
      if (inmueble && !inmueble.error) {
        navigate(`/editarInmueble/${id}`, { state: { inmueble } });
      }
    } catch (error) {
      console.error('Error al obtener el inmueble para editar:', error);
    }
  };

  return (
    <div>
      <header className="header">
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
        <h1 className="title">Mis Publicaciones</h1>
        <Link to="/Perfil" className="button">Volver</Link>
      </header>

    <div className="relative inline-block text-left">
  <button
    onClick={() => setOpen(!open)}
    className="buttoninicio"
  >
    ☰
  </button>

  {open && (
    <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-72 p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          value={filtros.tipo}
          onChange={(e) => handleSelect('tipo', e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {opciones.tipos.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Transacción</label>
        <select
          className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          value={filtros.transaccion}
          onChange={(e) => handleSelect('transaccion', e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {opciones.transacciones.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          value={filtros.estado}
          onChange={(e) => handleSelect('estado', e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {opciones.estados.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleClear}
        className="buttoninicio"
      >
        Limpiar filtros
      </button>
    </div>
  )}
</div>




      <div className="inmuebles-section">
        <div className="inmuebles-list">
          {inmuebles.length > 0 ? (
            inmuebles.map((inmueble) => (
              <div className="inmueble-card" key={inmueble.idInmueble}>
                <img 
                  src={inmueble.imagen || 'default-image.jpg'} 
                  alt={inmueble.Nombre} 
                  className="inmueble-image" 
                />
                <div className="inmueble-details">
                  <h2 className="inmueble-title">{inmueble.Nombre}</h2>
                  <p className="inmueble-description">{inmueble.Descripcion}</p>
                  <p className="inmueble-localidad">{inmueble.localidad}</p>
                  <p className="inmueble-precio">{inmueble.precio}</p>
                  <p className="inmueble-fecha">{inmueble.FechaPubli}</p>
                  <button className="edit-button" onClick={() => handleEdit(inmueble.idInmueble)}>Editar</button>
                  <button className="delete-button" onClick={() => handleDelete(inmueble.idInmueble)}>Eliminar</button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay inmuebles disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InmueblesList;
