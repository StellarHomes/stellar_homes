import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Inmuebles.css';

const InmueblesListUsu = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch('http://localhost/API/getInmuebles.php');
        const data = await response.json();
        setInmuebles(data);
      } catch (error) {
        console.error('Error al obtener los inmuebles:', error);
      }
    };
    fetchInmuebles();
  }, []);

  return (
    <div>
      <header className="header">
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
          <h1 className="title">Inmuebles</h1>
          <Link to="/" className="button">Volver</Link>
      </header>
      
      <section className="inmuebles-section">
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
                  <button onClick={() => navigate(`/IfoInmueble/${inmueble.idInmueble}`)}> Más información </button>

                </div>
              </div>
            ))
          ) : (
            <p>No hay inmuebles disponibles.</p>
          )}
        </div>
      </section>
      
      <footer>
        <nav>
          <Link to="/"><button className="volverindex">Cerrar Sesión</button></Link>
        </nav>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo2" className="logo2" />
        <p>&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default InmueblesListUsu;
