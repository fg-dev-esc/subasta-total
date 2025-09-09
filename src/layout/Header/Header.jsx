import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const location = useLocation();
  
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  
  const handleNavItemClick = () => {
    setIsNavCollapsed(true);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header fade-in-down">
      {/* top header */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-wrapper">
            <div className="header-top-left">
              <div className="header-top-contact">
                <ul>
                  <li>
                    <div className="header-top-contact-icon">
                      <i className="far fa-envelope"></i>
                    </div>
                    <div className="header-top-contact-info">
                      <a href="mailto:atencion.compradores@subastatotal.com.mx">atencion.compradores@subastatotal.com.mx</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="header-top-right">
              <div className="header-top-contact">
                <ul>
                  <li>
                    <div className="header-top-contact-icon">
                      <img src="/assets/img/icon/phone.svg" alt="" />
                    </div>
                    <div className="header-top-contact-info">
                      <a href="tel:+52(56)1015-1625">+52 (56)1015-1625</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main navigation */}
      <div className="main-navigation">
        <nav className="navbar navbar-expand-lg">
          <div className="container custom-nav">
            <Link className="navbar-brand" to="/">
              <img className="logo-img" src="/assets/img/logo/subasta-total.png" alt="Subasta Total" />
            </Link>
            
            <div className="mobile-menu-right">
              <div className="header-account header-mobile-account">
                <div className="dropdown">
                  <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="far fa-user-circle"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/auth"><i className="far fa-user-cog"></i> Mi Portal</Link></li>
                    <li><Link className="dropdown-item" to="/auth"><i className="far fa-sign-in"></i> Acceso</Link></li>
                  </ul>
                </div>
              </div>
              <button 
                className="navbar-toggler" 
                type="button" 
                onClick={handleNavCollapse}
                aria-expanded={!isNavCollapsed} 
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-mobile-icon">
                  <i className={`far ${isNavCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
                </span>
              </button>
            </div>

            <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="main_nav">
              <div className="header-nav-left">
                <div className="header-btn">
                  <Link to="/auth" className="theme-btn theme-btn-outline header-btn-sm me-2" style={{visibility: 'hidden'}}>
                    MI PORTAL
                  </Link>
                  <Link to="/auth" className="theme-btn header-btn-sm" style={{visibility: 'hidden'}}>
                    ACCESO
                  </Link>
                </div>
              </div>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item me-5">
                  <Link className={`nav-link ${isActive('/')}`} to="/" onClick={handleNavItemClick}>
                    INICIO
                  </Link>
                </li>
                <li className="nav-item me-5">
                  <Link className={`nav-link ${isActive('/nosotros')}`} to="/nosotros" onClick={handleNavItemClick}>
                    NOSOTROS
                  </Link>
                </li>
                <li className="nav-item me-5">
                  <Link className={`nav-link ${isActive('/compradores')}`} to="/compradores" onClick={handleNavItemClick}>
                    COMPRADORES
                  </Link>
                </li>
                <li className="nav-item me-5">
                  <Link className={`nav-link ${isActive('/vendedores')}`} to="/vendedores" onClick={handleNavItemClick}>
                    VENDEDORES
                  </Link>
                </li>
                <li className="nav-item me-5">
                  <Link className={`nav-link ${isActive('/subastas')}`} to="/subastas" onClick={handleNavItemClick}>
                    SUBASTAS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/contacto')}`} to="/contacto" onClick={handleNavItemClick}>
                    CONTACTO
                  </Link>
                </li>
              </ul>
              
              <div className="header-nav-right">
                <div className="header-account">
                  <div className="dropdown">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="far fa-user-circle"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/auth"><i className="far fa-user-cog"></i> Mi Portal</Link></li>
                      <li><Link className="dropdown-item" to="/auth"><i className="far fa-sign-in"></i> Acceso</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;