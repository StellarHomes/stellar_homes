import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './InmobiliariaPerfil.css'; // Archivo CSS para estilos

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
        if (!response.ok) throw new Error('Error al obtener los datos');
        return response.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setInmobiliariaData(data); 
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
    setInmobiliariaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/API/EditInmobiliaria.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inmobiliariaData), 
    })
    .then(response => {
      if (!response.ok) throw new Error('Error en la solicitud');
      return response.json();
    })
    .then(data => {
      if (!data.success) throw new Error(data.message);
      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    })
    .catch(error => {
      Swal.fire('Error', 'Hubo un problema al actualizar', 'error');
      console.error('Error:', error);
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
        <Link to="/" className="logout-button">
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </Link>
      </header>

      {/* Menú de navegación */}
      <nav className="profile-nav">
        <Link to="/Inmuebles" className="nav-button">
          <i className="fas fa-home"></i> Mis Publicaciones
        </Link>
        <Link to="/publicar" className="nav-button">
          <i className="fas fa-plus-circle"></i> Publicar Inmueble
        </Link>
      </nav>

      {/* Formulario de perfil */}
      <main className="profile-main">
        <div className="profile-card">
          <h1 className="profile-title">
            <i className="fas fa-building"></i> {inmobiliariaData.NombreInmobiliaria}
          </h1>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <input type="hidden" name="idInmobiliaria" value={inmobiliariaData.idInmobiliaria} />
            
            <div className="form-group">
              <label><i className="fas fa-signature"></i> Nombre:</label>
              <input
                type="text"
                name="NombreInmobiliaria"
                value={inmobiliariaData.NombreInmobiliaria}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label><i className="fas fa-envelope"></i> Email:</label>
              <input
                type="email"
                name="EmailInmobiliaria"
                value={inmobiliariaData.EmailInmobiliaria}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label><i className="fas fa-phone"></i> Teléfono:</label>
              <input
                type="tel"
                name="Telefono"
                value={inmobiliariaData.Telefono}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label><i className="fas fa-map-marker-alt"></i> Dirección:</label>
              <input
                type="text"
                name="Direccion"
                value={inmobiliariaData.Direccion}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="submit-button">
              <i className="fas fa-save"></i> Guardar Cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InmobiliariaPerfil;