import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './subasta-total.css';
import Layout from './layout/Layout';
import Homepage from './views/homepage/Homepage';
import Nosotros from './views/nosotros/Nosotros';
import Contacto from './views/contacto/Contacto';
import Compradores from './views/compradores/Compradores';
import Subastas from './views/subastas/Subastas';
import SubastaDetalle from './views/subasta-detalle/SubastaDetalle';
import Detalle from './views/detalle/Detalle';
import Auth from './views/auth/Auth';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/compradores" element={<Compradores />} />
          <Route path="/subastas" element={<Subastas />} />
          <Route path="/subasta-detalle/:id" element={<SubastaDetalle />} />
          <Route path="/detalle/:id" element={<Detalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;