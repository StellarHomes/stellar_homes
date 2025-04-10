import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const InmobiliariaPerfil = () => {
  const [inmobiliariaData, setInmobiliariaData] = useState({
    idInmobiliaria: '',
    NombreInmobiliaria: '',
    EmailInmobiliaria: '',
    Telefono: '',
    Direccion: ''
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch('http://localhost/API/Inmobiliaria.php') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setInmobiliariaData(data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos de la inmobiliaria.',
        });
        setLoading(false);
      });
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInmobiliariaData({
      ...inmobiliariaData,
      [name]: value
    });
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/API/EditInmobiliaria.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inmobiliariaData), 
    })
    
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tu perfil se ha actualizado correctamente.',
        });
      } else {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar tu perfil.',
      });
      console.error('Error al actualizar:', error);
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/diseno-de-casas-modernas-1_0.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', 
      }}
    >
      <header>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
        <Link to="/" className="button">Cerrar Sesión</Link>
      </header>

      <div className="content">
        <div className="contenedores">
          <div className="contenedor">
            <Link to="/Inmuebles">Mis Publicaciones</Link>
          </div>
          <div className="contenedor">
            <a href="/publicar">Publicar</a>
          </div>
        </div>

        <div className="container">
          <form onSubmit={handleSubmit} className="form-card">
            <h1 className="form-title"> {inmobiliariaData.NombreInmobiliaria}</h1>
            <input type="hidden" name="idInmobiliaria" value={inmobiliariaData.idInmobiliaria} />
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="NombreInmobiliaria"
                value={inmobiliariaData.NombreInmobiliaria}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Email Inmobiliaria:</label>
              <input
                type="email"
                name="EmailInmobiliaria"
                value={inmobiliariaData.EmailInmobiliaria}
                onChange={handleChange}
                className="form-control"  
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="Telefono"
                value={inmobiliariaData.Telefono}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                name="Direccion"
                value={inmobiliariaData.Direccion}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-submit">Editar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InmobiliariaPerfil;
