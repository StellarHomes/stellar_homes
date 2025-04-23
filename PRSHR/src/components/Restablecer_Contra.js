import React, { useState } from 'react';
import './Restablecer_Cont.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Restablecer_Contra = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const redirigir = () => {
    navigate('/'); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire("Error", "Por favor ingrese su correo electrónico", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost/API/solicitud.php", {
        email,
      });
      const responseData = JSON.parse(response.data.replace("{}", ''));
      if (responseData.status === "success") {
        Swal.fire("Éxito", responseData.message, "success");
      } else {
        Swal.fire("Error", responseData.error || "Error desconocido", "error");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Swal.fire("Error", "Hubo un problema al enviar el correo", "error");
    }
  };

  return (
    <>
      <header>
        <Link to="/login" className="button">Volver</Link>
      </header>

      <section className="form-section">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button onClick={redirigir} type="submit">Enviar correo de recuperacion</button>
        
          
          
        </form>
      </section>

      <footer>
        <p>&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Restablecer_Contra;
