import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Inmuebles.css';
import Swal from 'sweetalert2';

const InmuebleCard = ({ inmueble }) => {
  const navigate = useNavigate();

  const handleInfoClick = () => {
    Swal.fire({
      title: '¡Atención!',
      text: 'Debes estar registrado para ver más información del inmueble.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Registrarse',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/registerCli'); 
      }
    });
  };
  
    return (
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
          <button onClick={handleInfoClick} className="delete-button">
            Más información
          </button>
        </div>
      </div>
    );
  };
  



const Inmueble = () => {
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
      <header>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
      </header>

      <div className="menu-bar">
        <Link to="/"><button className="volverindex">Inicio</button></Link>
        <Link to="/login"><button className="volverindex">Iniciar Sesión</button></Link>
      </div>

      <section className="inmuebles-section">
        <div className="inmuebles-list">
          {inmuebles.length > 0 ? (
            inmuebles.map((inmueble) => (
              <InmuebleCard key={inmueble.idInmueble} inmueble={inmueble} navigate={navigate} />
            ))
          ) : (
            <p>No hay inmuebles disponibles.</p>
          )}
        </div>
      </section>

      <footer>
        <nav>
          <Link to="/"><button className="volverindex">Inicio</button></Link>
          <Link to="/login"><button className="volverindex">Iniciar Sesión</button></Link>
        </nav>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo2" className="logo2" />
        <p>&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Inmueble;
