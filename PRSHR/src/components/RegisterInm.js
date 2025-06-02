import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const RegisterInm = () => {
  const [formData, setFormData] = useState({
    NombreInmobiliaria: '',
    CorreoInmobiliaria: '',
    TelefonoInmobiliaria: '',
    Direccion: '',
    ContrasenaInmobiliaria: '', 
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
       const [showPassword, setShowPassword] = useState(false);
  
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };
  
  const validateForm = (e) => {
    e.preventDefault();

    const { NombreInmobiliaria, CorreoInmobiliaria, TelefonoInmobiliaria, Direccion, Contrasena } = formData;

  
    if (!NombreInmobiliaria || !CorreoInmobiliaria || !TelefonoInmobiliaria || !Direccion || !Contrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos del formulario.',
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(CorreoInmobiliaria)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingrese un correo electrónico válido.',
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/; 
    if (!phoneRegex.test(TelefonoInmobiliaria)) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'Por favor, ingrese un número de teléfono válido.',
      });
      return;
    }

    handleSubmit();
  };

  const handleSubmit = () => {
    fetch('http://localhost/API/CrearInmobiliaria.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire('Registro exitoso', 'La inmobiliaria se ha registrado correctamente.', 'success')
          .then(() => {
            navigate('/perfil'); 
          });
          
        } else {
          Swal.fire('Error', data.error || 'Error desconocido.', 'error');
        }
      })
      .catch((error) => {
        Swal.fire('Error', 'Hubo un problema con el registro.', 'error');
        console.error('Error al registrar:', error);
      });
  };

  return (
    <div className="login-container">
      <header>
        <Link to="/"><button className="volverindex">Volver a la pagina Principal</button></Link>
      </header>
      <h2>Registro Inmobiliaria</h2>
      <form onSubmit={validateForm}>
        <div className="form-group">
          <label htmlFor="NombreInmobiliaria">Nombre de la Inmobiliaria:</label>
          <input
            type="text"
            id="NombreInmobiliaria"
            name="NombreInmobiliaria"
            value={formData.NombreInmobiliaria}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="CorreoInmobiliaria">Correo de la Inmobiliaria:</label>
          <input
            type="email"
            id="CorreoInmobiliaria"
            name="CorreoInmobiliaria"
            value={formData.CorreoInmobiliaria}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="TelefonoInmobiliaria">Teléfono de la Inmobiliaria:</label>
          <input
            type="text"
            id="TelefonoInmobiliaria"
            name="TelefonoInmobiliaria"
            value={formData.TelefonoInmobiliaria}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Direccion">Dirección:</label>
          <input
            type="text"
            id="Direccion"
            name="Direccion"
            value={formData.Direccion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Contrasena">Contraseña:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="Contrasena"
            name="Contrasena"
            value={formData.Contrasena}
            onChange={handleChange}
          />
          <button type="button" onClick={togglePassword} className="toggle-password">
            {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
        </div>
        <button className="buttoninicio">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterInm;
