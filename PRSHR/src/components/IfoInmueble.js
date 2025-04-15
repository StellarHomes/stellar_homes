import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetail = () => {
    const { id } = useParams();  
    const [inmueble, setInmueble] = useState(null);

    useEffect(() => {
        const fetchInmueble = async () => {
            try {
                const response = await fetch(`http://localhost/API/getInmuebleById.php?idInmueble=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setInmueble(data);
                } else {
                    console.error('Error al obtener el inmueble');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };
        
        fetchInmueble();
    }, [id]);

    if (!inmueble) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mt-5">
            <section className="property-detail">
                <h2 className="title has-text-centered">{inmueble.Nombre}</h2>
                <div className="columns">
                    <div className="column is-half">
                        <figure className="image">
                        <img
                             src={ inmueble.imagen ? `/uploads/${inmueble.imagen}` : '/img/diseno-de-casas-modernas-1_0.jpg'}
                                alt="Imagen del inmueble"
                        />
                        </figure>
                    </div>
                    <div className="column is-half">
                        <div className="content">
                            <p><strong>Descripción:</strong> {inmueble.Descripcion}</p>
                            <p><strong>Localidad:</strong> {inmueble.localidad}</p>
                            <p><strong>Dirección:</strong> {inmueble.Direccion}</p>
                            <p><strong>Precio:</strong> {inmueble.precio ? `$${inmueble.precio.toLocaleString()}` : 'No disponible'}</p>
                            <p><strong>Fecha de Publicación:</strong> {inmueble.FechaPubli}</p>
                            <p><strong>Estado:</strong> {inmueble.estado_desc}</p>
                            <Link to={`/contacto/${inmueble.idInmueble}`} className="button is-warning mt-3">Contacto</Link>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="has-background-dark mt-5">
                <div className="container has-text-centered">
                    <Link to="/usuarioregistrado" className="button is-info">Volver a Propiedades</Link>
                    <p className="mt-3">&copy; 2024 Inmobiliaria. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PropertyDetail;
