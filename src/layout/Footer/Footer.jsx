import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getAppVersion = () => '0.0.2';

  return (
    <footer className="footer-area">
      <div className="footer-widget">
        <div className="container">
          <div className="row footer-widget-wrapper pt-100 pb-70">
            <div className="col-md-6 col-lg-4">
              <div className="footer-widget-box about-us">
                <Link to="/" className="footer-logo">
                  <img src="/assets/img/logo/subasta-total.png" alt="Subasta Total" />
                </Link>
                <p className="mb-3">
                  Somos un grupo de mexicanos apasionados y expertos en el fascinante mundo de las subastas. 
                  Con más de 14 años de dedicación, nos enorgullece liderar la primera plataforma online 
                  especializada en subastas de inmuebles en México.
                </p>
                <ul className="footer-contact">
                  <li>
                    <a href="tel:+52(56)1015-1625">
                      <i className="far fa-phone"></i>+52 (56)1015-1625
                    </a>
                  </li>
                  <li>
                    <i className="far fa-map-marker-alt"></i>México
                  </li>
                  <li>
                    <a href="mailto:atencion.compradores@subastatotal.com.mx">
                      <i className="far fa-envelope"></i>atencion.compradores@subastatotal.com.mx
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <div className="footer-widget-box list">
                <h4 className="footer-widget-title">Navegación</h4>
                <ul className="footer-list">
                  <li>
                    <Link to="/">
                      <i className="fas fa-caret-right"></i> Inicio
                    </Link>
                  </li>
                  <li>
                    <Link to="/nosotros">
                      <i className="fas fa-caret-right"></i> Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link to="/compradores">
                      <i className="fas fa-caret-right"></i> Compradores
                    </Link>
                  </li>
                  <li>
                    <Link to="/vendedores">
                      <i className="fas fa-caret-right"></i> Vendedores
                    </Link>
                  </li>
                  <li>
                    <Link to="/subastas">
                      <i className="fas fa-caret-right"></i> Subastas
                    </Link>
                  </li>
                  <li>
                    <Link to="/contacto">
                      <i className="fas fa-caret-right"></i> Contacto
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="footer-widget-box list">
                <h4 className="footer-widget-title">Servicios</h4>
                <ul className="footer-list">
                  <li>
                    <Link to="/subastas">
                      <i className="fas fa-caret-right"></i> Nuestras Subastas
                    </Link>
                  </li>
                  <li>
                    <Link to="/compradores">
                      <i className="fas fa-caret-right"></i> Registro de Compradores
                    </Link>
                  </li>
                  <li>
                    <Link to="/vendedores">
                      <i className="fas fa-caret-right"></i> Cómo Vender
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth">
                      <i className="fas fa-caret-right"></i> Portal de Usuario
                    </Link>
                  </li>
                  <li>
                    <Link to="/contacto">
                      <i className="fas fa-caret-right"></i> Soporte Técnico
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="footer-widget-box list">
                <h4 className="footer-widget-title">Mantente Informado</h4>
                <div className="footer-newsletter">
                                      <p>Suscríbete para recibir notificaciones sobre nuevas subastas y oportunidades de inversión</p>                  <div className="subscribe-form">
                    <form onSubmit={handleNewsletterSubmit}>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button className="theme-btn" type="submit">
                        Suscribirse <i className="far fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="row">
            <div className="col-md-6 align-self-center">
              <p className="copyright-text">
                &copy; Copyright {getCurrentYear()} <a href="#"> Subasta Total </a> Todos los Derechos Reservados.
                <br />v{getAppVersion()}
              </p>
            </div>
            <div className="col-md-6 align-self-center">
              <ul className="footer-social">
                <li><a href="https://facebook.com/subastatotal" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="https://instagram.com/subasta.total" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
                <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                <li><a href="#"><i className="fab fa-youtube"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;