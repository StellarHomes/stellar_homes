import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import './Inmuebles.css';

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const navigate = useNavigate();

  const fetchInmuebles = async () => {
    try {
      const response = await fetch('http://localhost/API/getInmuebles.php');
      const data = await response.json();
      console.log('Datos recibidos:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener los inmuebles:', error);
    }
  };

  const reloadInmuebles = async () => {
    const data = await fetchInmuebles();
    if (data && Array.isArray(data)) {
      setInmuebles(data);
    } else {
      console.log('No se recibieron datos válidos:', data);
    }
  };

  useEffect(() => {
    reloadInmuebles();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#777',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost/API/deleteInmueble.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idInmueble: id })
          });
          const data = await response.json();
          if (data.message === 'Inmueble eliminado con éxito') {
            setInmuebles((prevInmuebles) => prevInmuebles.filter(inmueble => inmueble.idInmueble !== id));
            Swal.fire('Eliminado', 'El inmueble fue eliminado con éxito.', 'success');
          }
        } catch (error) {
          console.error('Error al eliminar inmueble:', error);
        }
      }
    });
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost/API/getInmuebleById.php?idInmueble=${id}`);
      const inmueble = await response.json();
      console.log('Inmueble encontrado para editar:', inmueble);
      if (inmueble && !inmueble.error) {
        navigate(`/editarInmueble/${id}`, { state: { inmueble } });
      } else {
        console.log('No se encontró el inmueble.');
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
