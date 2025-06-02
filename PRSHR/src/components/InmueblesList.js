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
      const res = await fetch('http://localhost/API/inmuebles.php?action=opciones');
      const data = await res.json();
      setOpciones(data);
    } catch (error) {
      console.error('Error al obtener opciones:', error);
    }
  };

  const fetchInmuebles = async () => {
    try {
      const query = new URLSearchParams(filtros);
      const res = await fetch(`http://localhost/API/inmuebles.php?${query}`);
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

      <div className="dropdown-container">
        <button className="round-button" onClick={() => setOpen(!open)}>☰</button>
        {open && (
          <div className="dropdown-menu">
            <div className="dropdown-group">
              <strong>Tipo</strong>
              {opciones.tipos.map((op, i) => (
                <button key={i} onClick={() => handleSelect('tipo', op)}>{op}</button>
              ))}
            </div>
            <div className="dropdown-group">
              <strong>Transacción</strong>
              {opciones.transacciones.map((op, i) => (
                <button key={i} onClick={() => handleSelect('transaccion', op)}>{op}</button>
              ))}
            </div>
            <div className="dropdown-group">
              <strong>Estado</strong>
              {opciones.estados.map((op, i) => (
                <button key={i} onClick={() => handleSelect('estado', op)}>{op}</button>
              ))}
            </div>
            <button onClick={handleClear}>Limpiar filtros</button>
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
