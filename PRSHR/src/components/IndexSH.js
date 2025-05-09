import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <button onClick={() => navigate('/login')} className="delete-button">
          Más información
        </button>
      </div>
    </div>
  );
};
const SearchForm = ({ searchData, handleChange, handleSubmit }) => {
  
  return (
    <section className="search">
      <h2>Buscar Inmueble</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Inmueble:</label>
          <select id="tipo" name="tipo" value={searchData.tipo} onChange={handleChange}>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado:</label>
          <select id="estado" name="estado" value={searchData.estado} onChange={handleChange}>
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="zona">Zona:</label>
          <input type="text" id="zona" name="zona" value={searchData.zona} onChange={handleChange} placeholder="Ingrese la zona" />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input type="number" id="precio" name="precio" value={searchData.precio} onChange={handleChange} placeholder="Ingrese el precio" />
        </div>
        <button type="submit">Buscar</button>
      </form>
    </section>
  );
};

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [searchData, setSearchData] = useState({
    tipo: '',
    estado: '',
    zona: '',
    precio: ''
  });
  const [index, setIndex] = useState(0);

  const slides = [
    "/diseno-de-casas-modernas-1_0.jpg",
    "/13232908_1604013343248088_6302168264450648482_n.jpg",
    "/luxury-beach-house-sea-view-600nw-2313357873.webp"
  ];

  useEffect(() => {
    fetchInmuebles();
  }, []);

  const fetchInmuebles = async () => {
    try {
      const response = await fetch('http://localhost/API/getInmuebles.php');
      const data = await response.json();
      setInmuebles(data);
    } catch (error) {
      console.error('Error al obtener los inmuebles:', error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#777',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost/API/deleteInmueble.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idInmueble: id })
          });
          const data = await response.json();
          if (data.message === 'Inmueble eliminado con éxito') {
            setInmuebles((prev) => prev.filter(inmueble => inmueble.idInmueble !== id));
            Swal.fire('Eliminado', 'El inmueble fue eliminado con éxito.', 'success');
          }
        } catch (error) {
          console.error('Error al eliminar inmueble:', error);
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      tipo: searchData.tipo,
      estado: searchData.estado,
      zona: searchData.zona,
      precio: searchData.precio
    });

    try {
      const response = await fetch(`http://localhost/api/inmuebles.php?${queryParams.toString()}`);
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
        setInmuebles([]); 
      } else {
        setInmuebles(data);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setInmuebles([]); 
    }
  };

  const nextSlide = () => setIndex((index + 1) % slides.length);
  const prevSlide = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div>
      <header>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
      </header>

      <div className="menu-bar">
      <Link to="/inmueble"><button className="volverindex">Inmuebles</button></Link>
        <Link to="/login"><button className="volverindex">Iniciar Sesión</button></Link>
      </div>

      <section className="carousel">
        <div className="carousel-container" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((src, i) => (
            <div key={i} className="carousel-slide">
              <img src={src} alt={`Imagen ${i + 1}`} />
              <div className="caption">Encuentra el lugar de tus sueños</div>
            </div>
          ))}
        </div>
        <button className="prev" onClick={prevSlide}>&#10094;</button>
        <button className="next" onClick={nextSlide}>&#10095;</button>
        <div className="carousel-indicators">
          {slides.map((_, i) => (
            <span key={i} className={`indicator ${i === index ? 'active' : ''}`} />
          ))}
        </div>
      </section>

      <SearchForm 
        searchData={searchData} 
        handleChange={handleSearchChange} 
        handleSubmit={handleSearchSubmit} 
      />

      <section className="inmuebles-section">
        <div className="inmuebles-list">
          {inmuebles.length > 0 ? (
            inmuebles.slice(0, 3).map((inmueble) => (
              <InmuebleCard key={inmueble.idInmueble} inmueble={inmueble} />
            ))
            
          ) : (
            <p>No hay inmuebles disponibles.</p>
          )}
        </div>
      </section>

      <footer>
        <nav>
        <Link to="/inmuebles"><button className="volverindex">Inmuebles</button></Link>
          <Link to="/login"><button className="volverindex">Iniciar Sesión</button></Link>
        </nav>
        <img src="/sh_blanco-removebg-preview.png" alt="Logo2" className="logo2" />
        <p>&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default InmueblesList;
