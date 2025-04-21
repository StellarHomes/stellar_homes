import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './InmobiliariaPerfil.css'; 

const PerfilUsu = () => {
  const [usuarioData, setUsuarioData] = useState({
    idCliente: '',
    Nombre: '',
    Apellido: '',
    Email: '',
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
    setUsuarioData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Nombre || !Apellido || !Email) {
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

    if (!usuarioData) return <p>Cargando datos del usuario...</p>;

    return (
        <main className="profile-main">
        <div className="profile-card">
          <h1 className="profile-title">
            <i className="fas fa-building"></i> {usuarioData.Nombre} {usuarioData.Apellido}
          </h1>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <input type="hidden" name="idCliente" value={usuarioData.idCliente} />
            
            <div className="form-group">
              <label><i className="fas fa-signature"></i> Nombre:</label>
              <input
                type="text"
                name="Nombre"
                value={usuarioData.Nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><i className="fas fa-signature"></i> Apellido:</label>
              <input
                type="text"
                name="Apellido"
                value={usuarioData.Apellido}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label><i className="fas fa-envelope"></i> Email:</label>
              <input
                type="email"
                name="Email"
                value={usuarioData.Email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              <i className="fas fa-save">Guardar Cambios</i>
            </button>
          </form>
        </div>
      </main>
    );
};

export default PerfilUsu;
