import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./InfoInmueble.css"; // Asegúrate de importar los estilos

const InfoInmueble = () => {
  const { id } = useParams();
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/API/getInmuebles.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const inmuebleEncontrado = data.find((item) => item.idInmueble == id);
          setInmueble(inmuebleEncontrado);
        } else {
          setError("No se encontró el inmueble.");
        }
      })
      .catch((error) => setError("Error al obtener inmueble: " + error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!inmueble) return <p>No se encontró el inmueble.</p>;

  return (
    <div>
      {/* Encabezado */}
      <header className="header">
        <img src="/sh_blanco-removebg-preview.png" alt="Logo" className="logo" />
        <h1 className="title">Detalles del Inmueble</h1>
        <Link to="/inmueblesList" className="button">Volver</Link>
      </header>

      {/* Contenido principal */}
      <section className="info-inmueble">
        <div className="inmueble-layout">
          {/* Imagen a la izquierda */}
          <div className="inmueble-imagen-container">
            <img src={inmueble.imagen} alt={inmueble.Nombre} className="inmueble-imagen" />
          </div>

          {/* Información a la derecha */}
          <div className="inmueble-detalles">
            <h2 className="inmueble-titulo">{inmueble.Nombre}</h2>
            <p><strong>ID del Inmueble:</strong> {inmueble.idInmueble}</p>
            <p><strong>Descripción:</strong> {inmueble.Descripcion}</p>
            <p><strong>Localidad:</strong> {inmueble.localidad}</p>
            <p><strong>Dirección:</strong> {inmueble.Direccion}</p>
            <p><strong>Contacto:</strong> {inmueble.NumCont}</p>
            <p className="inmueble-precio"><strong>Precio:</strong> ${inmueble.precio}</p>
            <p><strong>Fecha de Publicación:</strong> {inmueble.FechaPubli}</p>
            <p><strong>Transacción:</strong> {inmueble.transaccion}</p>
            <p><strong>Estado:</strong> {inmueble.estado}</p>
            <p><strong>Inmobiliaria:</strong> {inmueble.inmobiliaria}</p>
            <p><strong>Tipo:</strong> {inmueble.tipo}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default InfoInmueble;
