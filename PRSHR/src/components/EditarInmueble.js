import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditarInmueble = () => {
  const location = useLocation();
  const inmueble = location.state?.inmueble;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idInmueble: '',
    Nombre: '',
    Descripcion: '',
    localidad: '',
    precio: '',
    FechaPubli: '',
    ImagenUrl: '',
    estado_id_estado: '',
    tipo_idtipo: '',
    transaccion_idtransaccion: '',
    imagen: null, 
  });

  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  
  useEffect(() => {
    if (inmueble) {
      setFormData({
        idInmueble: inmueble.idInmueble,
        Nombre: inmueble.Nombre || '',
        Descripcion: inmueble.Descripcion || '',
        localidad: inmueble.localidad || '',
        precio: inmueble.precio || '',
        FechaPubli: inmueble.FechaPubli || '',
        ImagenUrl: inmueble.imagen ? `data:image/jpeg;base64,${inmueble.imagen}` : '', 
        estado_id_estado: inmueble.estado_id_estado || '',
        tipo_idtipo: inmueble.tipo_idtipo || '',
        transaccion_idtransaccion: inmueble.transaccion_idtransaccion || '',
      });
    } else {
      
      const inmuebleId = location.state?.idInmueble;
      if (inmuebleId) {
        const fetchInmuebleData = async () => {
          try {
            const response = await fetch(`http://localhost/API/getInmueble.php?idInmueble=${inmuebleId}`);
            const data = await response.json();
            if (data) {
              setFormData({
                idInmueble: data.idInmueble,
                Nombre: data.Nombre,
                Descripcion: data.Descripcion,
                localidad: data.localidad,
                precio: data.precio,
                FechaPubli: data.FechaPubli,
                ImagenUrl: data.imagen ? `data:image/jpeg;base64,${data.imagen}` : '',
                estado_id_estado: data.estado_id_estado,
                tipo_idtipo: data.tipo_idtipo,
                transaccion_idtransaccion: data.transaccion_idtransaccion,
              });
            } else {
              Swal.fire('Error', 'No se encontraron datos del inmueble.', 'error');
            }
          } catch (error) {
            console.error('Error al obtener los datos del inmueble:', error);
            Swal.fire('Error', 'Ocurrió un error al obtener los datos del inmueble.', 'error');
          }
        };
        fetchInmuebleData();
      }
    }
  }, [inmueble, location.state]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estadosData, tiposData, transaccionesData] = await Promise.all([
          fetch('http://localhost/API/estados.php').then(res => res.json()),
          fetch('http://localhost/API/tipos.php').then(res => res.json()),
          fetch('http://localhost/API/Variantes.php').then(res => res.json())
        ]);
        setEstados(estadosData);
        setTipos(tiposData);
        setTransacciones(transaccionesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        Swal.fire('Error', 'Hubo un problema al cargar los datos. Intenta de nuevo.', 'error');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      imagen: e.target.files[0], 
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (!formData.Nombre || !formData.Descripcion || !formData.localidad || !formData.precio || !formData.FechaPubli) {
      Swal.fire('Error', 'Por favor completa todos los campos.', 'error');
      return;
    }

    try {
      const updatedData = new FormData();
      updatedData.append('idInmueble', formData.idInmueble);
      updatedData.append('Nombre', formData.Nombre);
      updatedData.append('Descripcion', formData.Descripcion);
      updatedData.append('localidad', formData.localidad);
      updatedData.append('precio', formData.precio);
      updatedData.append('FechaPubli', formData.FechaPubli);
      updatedData.append('estado_id_estado', formData.estado_id_estado);
      updatedData.append('tipo_idtipo', formData.tipo_idtipo);
      updatedData.append('transaccion_idtransaccion', formData.transaccion_idtransaccion);

   
      if (formData.imagen) {
        updatedData.append('imagen', formData.imagen);
      }

    
      const response = await axios.post('http://localhost/API/updateInmueble.php', updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

  
      if (response.data.success) {
        Swal.fire('Éxito', 'El inmueble ha sido actualizado correctamente.', 'success');
        navigate('/inmuebles');
      } else {
        Swal.fire('Error', 'Hubo un problema al actualizar el inmueble.', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el inmueble:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar actualizar el inmueble.', 'error');
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Editar Inmueble</h1>
        <button onClick={() => navigate('/inmuebles')} className="button">Volver</button>
      </header>

      <div className="containerpub">
        <div className="form-container">
          <h2 className="title is-4">Editar Inmueble</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="Nombre">Nombre del Inmueble:</label>
              <input
                type="text"
                id="Nombre"
                name="Nombre"
                className="input"
                value={formData.Nombre}
                onChange={handleChange}
                placeholder="Ingrese el Nombre del Inmueble"
              />
            </div>

         
            {formData.ImagenUrl && (
              <div className="field">
                <label className="label">Imagen Actual</label>
                <div className="control">
                  <img
                    src={formData.ImagenUrl} 
                    alt="Imagen del Inmueble"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            )}

           
            <div className="form-group">
              <label htmlFor="imagen">Imagen del Inmueble:</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                className="input"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Descripcion">Descripción del Inmueble:</label>
              <input
                type="text"
                id="Descripcion"
                name="Descripcion"
                className="input"
                value={formData.Descripcion}
                onChange={handleChange}
                placeholder="Descripción del inmueble"
              />
            </div>

            <div className="form-group">
              <label htmlFor="localidad">Localidad:</label>
              <input
                type="text"
                id="localidad"
                name="localidad"
                className="input"
                value={formData.localidad}
                onChange={handleChange}
                placeholder="Ingrese la localidad"
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio:</label>
              <input
                type="number"
                id="precio"
                name="precio"
                className="input"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Ingrese el precio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="FechaPubli">Fecha de Publicación:</label>
              <input
                type="date"
                id="FechaPubli"
                name="FechaPubli"
                className="input"
                value={formData.FechaPubli}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="transaccion_idtransaccion">Transacción:</label>
              <div className="select">
                <select
                  id="transaccion_idtransaccion"
                  name="transaccion_idtransaccion"
                  value={formData.transaccion_idtransaccion}
                  onChange={handleChange}
                >
                  <option value="">Seleccione una transacción</option>
                  {transacciones.map((transaccion) => (
                    <option key={transaccion.idtransaccion} value={transaccion.idtransaccion}>
                      {transaccion.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tipo_idtipo">Tipo de Inmueble:</label>
              <div className="select">
                <select
                  id="tipo_idtipo"
                  name="tipo_idtipo"
                  value={formData.tipo_idtipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccione el tipo de inmueble</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.idtipo} value={tipo.idtipo}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estado_id_estado">Estado del Inmueble:</label>
              <div className="select">
                <select
                  id="estado_id_estado"
                  name="estado_id_estado"
                  value={formData.estado_id_estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccione el estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id_estado} value={estado.id_estado}>
                      {estado.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="button is-primary">Actualizar Inmueble</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarInmueble;
