import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';

const LoginForm = () => {
  const [loginType, setLoginType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState(""); 
  const [userEmail, setUserEmail] = useState(""); 
  const [userId, setUserId] = useState(""); 
  const navigate = useNavigate(); 

  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Validación de formulario
  const validateForm = async () => {
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='password']").value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos.',
      });
      return;
    }

    if (!loginType) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selecciona un tipo de usuario para iniciar sesión.',
      });
      return;
    }

    try {
      const url = loginType === "inmobiliaria" 
        ? 'http://localhost/API/LoginInmobiliaria.php' 
        : 'http://localhost/API/LoginUsuario.php'; 

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          loginType,
        }),
      });

      const result = await response.json();

      if (response.ok && result.message) {
        setUserName(result.user_name);  
        setUserEmail(result.user_email); 
        setUserId(result.userId);

        if (loginType === "user") {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            html: `Tu ID es: <span class="welcome-id">${result.userId}</span>`,
          });

          navigate("/indexUsu"); 
        } else if (loginType === "inmobiliaria") {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            html: `Bienvenido <span class="welcome-name">${result.user_name}</span> (<span class="welcome-email">${result.user_email}</span>)`,
          });

          navigate("/perfil");
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: result.error || 'Credenciales incorrectas.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'No se pudo conectar con el servidor. Por favor, inténtalo más tarde.',
      });
    }
  };

 
  const handleLoginClick = (e) => {
    e.preventDefault(); 

    
    validateForm();
  };

  return (
    <div className="login-container">
      <header>
        <Link to="/"><button className="volverindex">Volver a la página principal</button></Link>
      </header>
      <h2>Iniciar sesión</h2>

      <div className="form-group">
        <label htmlFor="login-type">Iniciar sesión como:</label>
        <select id="login-type" value={loginType} onChange={handleLoginTypeChange}>
          <option value="" disabled>Seleccione una opción</option>
          <option value="user">Usuario</option>
          <option value="inmobiliaria">Inmobiliaria</option>
        </select>
      </div>

      {loginType === "user" && (
        <form className="login-form">
          <fieldset>
            <legend>Iniciar sesión como Usuario</legend>
            <div className="form-group">
              <label htmlFor="user-email">Correo electrónico:</label>
              <input type="email" id="user-email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="user-password">Contraseña:</label>
              <input type="password" id="user-password" name="password" />
            </div>
           
            <button onClick={handleLoginClick} className="buttoninicio">Iniciar Sesión</button>
          </fieldset>
          <Link to="/ResContraseña" className="restore-password-link">¿Olvidaste tu contraseña?</Link>
        </form>
      )}

      {loginType === "inmobiliaria" && (
        <form className="login-form">
          <fieldset>
            <legend>Iniciar sesión como Inmobiliaria</legend>
            <div className="form-group">
              <label htmlFor="inmobiliaria-email">Correo electrónico:</label>
              <input type="email" id="inmobiliaria-email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="inmobiliaria-password">Contraseña:</label>
              <input type="password" id="inmobiliaria-password" name="password" />
            </div>
          
            <button onClick={handleLoginClick} className="buttoninicio">Iniciar Sesión</button>
          </fieldset>
          <Link to="/ResContraseña" className="restore-password-link">¿Olvidaste tu contraseña?</Link>
        </form>
      )}

      <div className="register-container">
        <button className="register-button" onClick={openPopup}>Registrarse</button>

        {showPopup && (
          <>
            <div className="popup">
              <h3>Registrarse como:</h3>
              <Link to="/registerInm"><button className="dropbtn">Inmobiliaria</button></Link>
              <Link to="/registerCli"><button className="dropbtn">Cliente</button></Link>
              <div className="popup-close" onClick={closePopup}>Cerrar</div>
            </div>
            <div className="popup-overlay" onClick={closePopup}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
