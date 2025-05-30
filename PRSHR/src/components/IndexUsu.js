import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Inmuebles.css';
import Swal from 'sweetalert2';

const InmuebleCard = ({ inmueble }) => {
  const navigate = useNavigate(); 

  return (
    <div className="inmueble-card" key={inmueble.idInmueble}>
      <img 
        src={inmueble.imagen || 'default-image.jpg'} 
        alt={inmueble.Nombre} 
        className="inmueble-image" 
      />
      <div className="inmueble-details">
        <h2 className="inmueble-title">{inmueble.Nombre}</h2>
        <p className="inmueble-description">{inmueble.tipo}</p>
        <p className="inmueble-description">{inmueble.Descripcion}</p>
        <p className="inmueble-localidad">{inmueble.localidad}</p>
        <p className="inmueble-precio">{inmueble.precio}</p>
        <p className="inmueble-fecha">{inmueble.FechaPubli}</p>
        <button onClick={() => navigate((`/IfoInmueble/${inmueble.idInmueble}`))} className="delete-button">
          Más información
        </button>
      </div>
    </div>
  );
};

const SearchForm = ({ searchData, handleChange, handleSubmit, handleClear }) => {
  return (
    <section className="search">
      <h2>Buscar Inmueble</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Inmueble:</label>
          <select className="opcion" id="tipo" name="tipo" value={searchData.tipo} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="transaccion">transaccion:</label>
          <select className="opcion" id="transaccion" name="transaccion" value={searchData.transaccion} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="localidad">Localidad:</label>
          <input
            className="opcion"
            type="text"
            id="localidad"
            name="localidad"
            value={searchData.localidad}
            onChange={handleChange}
            placeholder="Ingrese la localidad"
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            className="opcion"
            type="number"
            id="precio"
            name="precio"
            value={searchData.precio}
            onChange={handleChange}
            placeholder="Ingrese el precio"
          />
        </div>
        <button type="submit">Buscar</button>
        <button type="button" onClick={handleClear}>Limpiar</button>
      </form>
    </section>
  );
};

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [searchData, setSearchData] = useState({
    tipo: '',
    transaccion: '',
    localidad: '',
    precio: ''
  });
  const [usuarioData, setUsuarioData] = useState(null); 
  const [loadingUser, setLoadingUser] = useState(true);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate(); 

  const slides = [
    "/diseno-de-casas-modernas-1_0.jpg",
    "/13232908_1604013343248088_6302168264450648482_n.jpg",
    "/luxury-beach-house-sea-view-600nw-2313357873.webp"
  ];


    useEffect(() => {
      const fetchUserData = () => {
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
            setLoadingUser(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setLoadingUser(false);
          });
      };
  
      fetchInmuebles();
      fetchUserData();
    }, []);
  useEffect(() => {
    fetchInmuebles();
  }, []);

  const fetchInmuebles = async () => {
    try {
      const response = await fetch('http://localhost/API/Uinmuebles.php');
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setInmuebles(data);
    } catch (error) {
      console.error('Error al obtener los inmuebles:', error);
    }
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
    const handleClear = () => {
    setSearchData({
      tipo: '',
      transaccion: '',
      localidad: '',
      precio: ''
    });
    fetchInmuebles();
  };


  const nextSlide = () => setIndex((index + 1) % slides.length);
  const prevSlide = () => setIndex((index - 1 + slides.length) % slides.length);

    return (
        <div>
           
           <header className="main-header">
  <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
  {usuarioData && (
    <span className="usuario-nombre">
      Bienvenido, <strong>{usuarioData.Nombre} {usuarioData.Apellido}</strong>
    </span>
  )}
</header>


            <div className="menu-bar">
                <Link to="/"><button className="volverindex">Cerrar Sesión</button></Link>
                <a href="/perfilUsu"><button className="volverindex">Perfil</button></a>
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
        handleClear={handleClear}

      />

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
                    <Link to="/inmuebles"><button className="volverindex">Inmuebles</button></Link>
                    <Link to="/"><button className="volverindex">Cerrar Sesión</button></Link>
                </nav>
                <img src="/sh_blanco-removebg-preview.png" alt="Logo2" className="logo2" />
                <p>&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default InmueblesList;
