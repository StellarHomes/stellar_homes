import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 


const RegisterCli = () => {
  const [tiposDoc, setTiposDoc] = useState([]);
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    FechNaci: "",
    Email: "",
    ContrasenaCliente: "",
    tipo_doc_id_tipoDoc: "",
  });

  const navigate = useNavigate(); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const validarFormulario = () => {
    const { Nombre, Apellido, FechNaci, Email, ContrasenaCliente, tipo_doc_id_tipoDoc } = formData;
    console.log("Datos del formulario:", formData); 
    if (!Nombre || !Apellido || !FechNaci || !Email || !ContrasenaCliente || !tipo_doc_id_tipoDoc) {
      Swal.fire("Error", "Por favor completa todos los campos", "error");
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/API/CrearCliente.php",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Respuesta del servidor:", response);

      if (response.data.message) {
        Swal.fire("Éxito", response.data.message, "success").then(() => {
          navigate("/IndexUsu");
        });
      } else {
        Swal.fire("Error", response.data.error || "Error desconocido", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema con el registro.", "error");
      console.error("Error al registrar:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost/API/ObtenerTiposDoc.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); 
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          console.log("datos recibidos", data);
          setTiposDoc(data);
        } catch (error) {
          throw new Error("Received data is not valid JSON");
        }
      })
      .catch((error) => {
        console.error("Error al cargar tipos de documento:", error);
      });
  }, []);

  return (
    <div className="login-container">
    <header>
      <Link to="/"><button className="volverindex">Volver a la pagina Principal</button></Link>
    </header>
      <h2>Registro Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Nombre">Nombre de Usuario:</label>
          <input
            type="text"
            id="Nombre"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Apellido">Apellido del Usuario:</label>
          <input
            type="text"
            id="Apellido"
            name="Apellido"
            value={formData.Apellido}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="FechNaci">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="FechNaci" 
            name="FechNaci"
            value={formData.FechNaci}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Email">Correo electrónico:</label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ContrasenaCliente">Contraseña:</label>
          <input
            type="password"
            id="ContrasenaCliente"
            name="ContrasenaCliente"
            value={formData.ContrasenaCliente}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipo_doc_id_tipoDoc">Tipo de Documento:</label>
          <select
            id="tipo_doc_id_tipoDoc"
            name="tipo_doc_id_tipoDoc"
            value={formData.tipo_doc_id_tipoDoc}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            {tiposDoc.map((tipo) => (
              <option key={tipo.id_tipoDoc} value={tipo.id_tipoDoc}>
                {tipo.id_tipoDoc} 
              </option>
            ))}
          </select>
        </div>
        <button className="buttoninicio" type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterCli;
