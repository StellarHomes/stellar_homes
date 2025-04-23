import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Cambio_Contraseña = () => {
  const [params] = useSearchParams();
  const codigo = params.get('codigo');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ContrasenaCliente: '',
    ContrasenaClienteConfirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.ContrasenaCliente !== formData.ContrasenaClienteConfirm) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost/API/Cambio_Contra.php', {
        codigo,
        ...formData},
        {
            headers: {
              'Content-Type': 'application/json'
            }
          
      });

      if (response.data.success) {
        Swal.fire('Éxito', response.data.message, 'success').then(() => {
          navigate('/');
        });
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al cambiar la contraseña', 'error');
    }
  };

  return (
    <div className="login-container">
      <h2>Recuperar Contraseña</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Cree una nueva contraseña</legend>

          <div className="form-group">
            <label htmlFor="user-password">Nueva Contraseña:</label>
            <input
              type="password"
              id="user-password"
              name="ContrasenaCliente"
              required
              value={formData.ContrasenaCliente}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password-confirm">Verifique su Contraseña:</label>
            <input
              type="password"
              id="user-password-confirm"
              name="ContrasenaClienteConfirm"
              required
              value={formData.ContrasenaClienteConfirm}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Cambiar Contraseña</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Cambio_Contraseña;
