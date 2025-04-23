import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexSH from './components/IndexSH'; 
import LoginPage from './components/LoginPage'; 
import RegisterInm from './components/RegisterInm'; 
import RegisterCli from './components/RegisterCli'; 
import IndexUsu from './components/IndexUsu'; 
import InmobiliariaPerfil from './components/InmobiliariaPerfil';
import Publicar from './components/Publicar';  
import InmueblesList from './components/InmueblesList';
import InmueblesListUsu from './components/InmueblesListUsu';
import EditarInmueble from './components/EditarInmueble'; 
import IfoInmueble from './components/IfoInmueble';
import Restablecer_Contra from './components/Restablecer_Contra';
import Cambio_Contraseña from './components/Cambio_Contraseña'; 
import PerfilUsu from './components/PerfilUsu';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<IndexSH />} /> 
          <Route path="/indexUsu" element={<IndexUsu />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/registerInm" element={<RegisterInm />} /> 
          <Route path="/registerCli" element={<RegisterCli />} /> 
          <Route path="/perfil" element={<InmobiliariaPerfil />} />
          <Route path="/publicar" element={<Publicar />} />
          <Route path="/inmuebles" element={<InmueblesList />} />
          <Route path="/inmueble" element={<InmueblesListUsu />} />
          <Route path="/editarInmueble/:idInmueble" element={<EditarInmueble />} />
          <Route path="/IfoInmueble/:id" element={<IfoInmueble />} />
          <Route path="/restablecer" element={<Restablecer_Contra />} />
          <Route path="/cambioContra" element={<Cambio_Contraseña />} />
          <Route path="/perfilUsu" element={<PerfilUsu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
