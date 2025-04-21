import React, { useState } from 'react';

const PerfilUsu = () => {


    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setUser(formData);
        setEditMode(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setEditMode(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Perfil del Usuario</h1>
            {editMode ? (
                <div>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={handleCancel}>Cancelar</button>
                </div>
            ) : (
                <div>
                    <p><strong>Nombre:</strong> {user.nombre}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {user.telefono}</p>
                    <button onClick={handleEdit}>Editar</button>
                </div>
            )}
        </div>
    );
};

export default PerfilUsu;