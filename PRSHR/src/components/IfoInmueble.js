import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './InmobiliariaPerfil.css';

const InmueblesInfo = () => {
    const { id } = useParams();  
    const [inmueble, setInmueble] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInmueble = async () => {
            try {
                const response = await fetch(`http://localhost/API/getInmuebleById.php?idInmueble=${id}`);
                if (!response.ok) throw new Error('Error al obtener el inmueble');
                
                const data = await response.json();
                console.log('DATA DEL INMUEBLE:', data);
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                setInmueble(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchInmueble();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando información del inmueble...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error al cargar el inmueble</h2>
                <p>{error}</p>
                <Link to="/usuarioregistrado" className="back-button">Volver a propiedades</Link>
            </div>
        );
    }

    if (!inmueble) {
        return (
            <div className="not-found-container">
                <h2>Inmueble no encontrado</h2>
                <p>El inmueble solicitado no existe o no está disponible.</p>
                <Link to="/usuarioregistrado" className="back-button">Volver a propiedades</Link>
            </div>
        );
    }

    return (
        <div className="propiedad-detail-container">
            <div className="propiedad-card">
                <h1 className="propiedad-title">{inmueble.Nombre}</h1>
                
                <div className="propiedad-content">
                    <div className="propiedad-image-container">
                        <img
                            src={inmueble.imagen || '/img/default-propiedad.jpg'}
                            alt="Imagen del inmueble"
                            className="propiedad-image"
                            onError={(e) => {
                                e.target.src = '/img/default-propiedad.jpg';
                            }}
                        />
                    </div>
                    
                    <div className="propiedad-info">
                        <div className="propiedad-description">
                            <h3>Descripción</h3>
                            <p>{inmueble.Descripcion || 'No hay descripción disponible'}</p>
                        </div>
                        
                        <div className="propiedad-details">
                            <div className="detail-item">
                                <span className="detail-label">Localidad:</span>
                                <span className="detail-value">{inmueble.localidad || 'No disponible'}</span>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-label">Dirección:</span>
                                <span className="detail-value">{inmueble.Direccion || 'No disponible'}</span>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-label">Precio:</span>
                                <span className="detail-value price">
                                    {inmueble.precio ? `$${inmueble.precio.toLocaleString()}` : 'Consultar'}
                                </span>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-label">Fecha de Publicación:</span>
                                <span className="detail-value">
                                    {inmueble.FechaPubli ? new Date(inmueble.FechaPubli).toLocaleDateString() : 'No disponible'}
                                </span>
                            </div>
                            
                            <div className="detail-item">
                                <span className="detail-label">Estado:</span>
                                <span className={`detail-value status ${inmueble.estado_desc?.toLowerCase()}`}>
                                    {inmueble.estado_desc || 'No disponible'}
                                </span>
                            </div>
                        </div>
                        
                        <Link to={`/contacto/${inmueble.idInmueble}`} className="contact-button">
                            <i className="fas fa-envelope"></i> Contactar
                        </Link>
                    </div>
                </div>
            </div>
            
            <footer className="propiedad-footer">
                <Link to="/indexUsu" className="back-button">
                    <i className="fas fa-arrow-left"></i> Volver a Propiedades
                </Link>
                <p className="copyright">&copy; {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default InmueblesInfo;