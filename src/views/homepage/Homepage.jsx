import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import './homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  // useScrollTrigger(); // Disabled to check if this causes hero animation

  // Fetch productos del API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRES('1-251121')));
        const data = await response.json();
        const torres = Array.isArray(data) ? data : (data.torres || []);

        // Repetir los productos 6 veces si hay menos de 6
        const productosRepetidos = [];
        for (let i = 0; i < 6; i++) {
          if (torres.length > 0) {
            productosRepetidos.push({
              ...torres[i % torres.length],
              displayId: `${torres[i % torres.length].torreID}-${i}`
            });
          }
        }

        setProductos(productosRepetidos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Categories data
  const categories = [
    {
      name: 'Inmuebles',
      icon: 'fas fa-home',
      description: 'Casas, Departamentos, Terrenos',
      link: '/subastas'
    },
    {
      name: 'Autos',
      icon: 'fas fa-car',
      description: 'Vehículos de Todo Tipo',
      link: '/subastas'
    },
    {
      name: 'Vinos',
      icon: 'fas fa-wine-glass-alt',
      description: 'Colecciones Exclusivas',
      link: '/subastas'
    },
    {
      name: 'Joyería',
      icon: 'fas fa-gem',
      description: 'Piezas Únicas',
      link: '/subastas'
    },
    {
      name: 'Arte',
      icon: 'fas fa-palette',
      description: 'Obras y Colecciones',
      link: '/subastas'
    },
    {
      name: 'Varios',
      icon: 'fas fa-box',
      description: 'Otros Productos',
      link: '/subastas'
    }
  ];

  useEffect(() => {
    // Add loading class initially, remove after animations start
    document.body.classList.add('loading');
    const timer = setTimeout(() => {
      document.body.classList.remove('loading');
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loading');
    };
  }, []);

  useEffect(() => {
    // Animate elements on scroll but exclude images
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.st-animate-on-scroll');
    animateElements.forEach((el) => {
      // Skip elements that contain images OR are inside hero
      const hasImage = el.querySelector('img') || el.classList.contains('st-benefit-image-card') || el.classList.contains('st-property-image-card');
      const isInHero = el.closest('.st-hero-section') || el.closest('.st-hero');
      if (!hasImage && !isInHero) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div className="homepage page-container">
      {/* Hero Section - Cutting Edge Design */}
      <section className="st-hero-section">
        <div className="st-hero-single">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-hero-content">
                  <div className="st-hero-sub-title">
                    Primera plataforma online en México
                  </div>
                  <h1 className="st-hero-title">
                    Somos expertos en <span>subastas</span>
                  </h1>
                  <p className="st-hero-description">
                    Con más de 14 años de dedicación, nos enorgullece liderar la primera plataforma online 
                    especializada en subastas en México.
                  </p>
                  
                  {/* Status Badge */}
                  {/* <div className="st-hero-status">
                    <strong>Subasta activa:</strong> Casa residencial en Polanco - 7 días restantes
                  </div> */}

                  <div className="st-hero-btn">
                    <a href="/compradores" className="st-theme-btn">
                      Para Compradores <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="st-categories-section st-animate-on-scroll">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="st-section-heading text-center">
                <span className="st-section-tagline">Artículos Destacados</span>
                <h2 className="st-section-title">
                  Descubre los mejores <span>articulos disponibles en nuestras subastas</span>
                </h2>
                <div className="st-heading-divider"></div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center" style={{padding: '40px'}}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : productos.length > 0 ? (
            <div className="row mt-4">
              {productos.map((producto) => (
                <div key={producto.displayId} className="col-md-6 col-lg-4 mb-4">
                  <div className="st-property-card">
                    <div className="st-property-image">
                      <img
                        src={producto.urlImgPrincipal}
                        alt={producto.nombre}
                      />
                      <div className="st-property-status-badge">
                        <span className="badge bg-success">{producto.ofertas} Ofertas</span>
                      </div>
                    </div>
                    <div className="st-property-content">
                      <h4 className="st-property-title">{producto.nombre}</h4>

                      <div className="st-property-details">
                        <div className="st-property-detail">
                          <i className="fas fa-tag"></i>
                          <span>{producto.categoria}</span>
                        </div>
                        <div className="st-property-detail">
                          <i className="fas fa-clock"></i>
                          <span>Finaliza: {new Date(producto.fechaFin).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="st-property-description">
                        <p>{producto.descripcion}</p>
                      </div>

                      <div className="st-property-actions">
                        <button
                          className="st-property-btn"
                          onClick={() => navigate(`/detalle/${producto.torreID}`)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="st-no-results">
              <i className="fas fa-inbox"></i>
              <h4>No hay productos disponibles</h4>
              <p>Intenta más tarde</p>
            </div>
          )}

          <div className="text-center mt-4">
            <a href="/subastas" className="st-destacados-cta-btn">
              Ver Todas las Subastas <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Status Section */}
      {/* <section className="st-status-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="st-status-content">
                <h2 className="st-status-title">
                  <i className="fas fa-gavel me-3"></i>
                  Estado de Subastas
                </h2>
                <p className="st-status-text">
                  Subasta activa: Casa residencial en Polanco. ¡Participa ahora y encuentra tu próximo hogar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Properties Section - Based on Screenshot 02 */}
      {/* <section className="st-properties-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-properties-hero">
                <div className="st-properties-content">
                  <h2 className="st-properties-title" style={{color: 'white'}}>
                    Explora los increíbles artículos que tenemos en subasta
                  </h2>
                  <p className="st-properties-subtitle">
                    Artículos destacados y oportunidades únicas te esperan.
                  </p>
                  
                  <a href="/subastas" className="st-properties-btn">
                    Ver más <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section with Circular Buttons - Based on Screenshot 03 */}
      <section className="st-cta-section st-animate-on-scroll">
        <div className="container">
          {/* Circular CTA Buttons */}
          <div className="st-circular-cta-container">
            <a href="/auth" className="st-circular-btn st-circular-btn-acceder">
              <i className="fas fa-mobile-alt"></i>
              Acceder
            </a>
            <a href="/subastas" className="st-circular-btn st-circular-btn-subastar">
              <i className="fas fa-gavel"></i>
              Subastar
            </a>
          </div>

          {/* Main CTA Text */}
          {/* <div className="st-main-cta st-animate-on-scroll">
                          <h2 className="st-main-cta-title" style={{color: 'white'}}>
                          ¿Quieres comprar artículos únicos al mejor precio?
                        </h2>            <p className="st-main-cta-subtitle">
              ¡Llegaste al lugar perfecto!
            </p>
                                        <p className="st-main-cta-description">
                                        En Subasta Total, te ofrecemos una plataforma amigable para participar en subastas en línea. 
                                        Participa y encuentra eso que tanto estás buscando.
                                      </p>            <a href="/nosotros" className="st-main-cta-btn">
              Comenzar ahora <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div> */}
        </div>
      </section>

      {/* Benefits Section - Based on Screenshot 04 */}
      {/* <section className="st-benefits-section st-animate-on-scroll">
        <div className="container">
          <div className="st-benefits-title-section">
            <h2 className="st-benefits-main-title">
              ¿Por qué elegir Subasta Total?
            </h2>
            <p className="st-benefits-subtitle">
              Descubre las ventajas que nos convierten en tu mejor opción para comprar e invertir
            </p>
          </div>

          <div className="st-benefits-layout"> */}
            {/* Left Side - Lifestyle Images */}
            {/* <div className="st-benefits-images">
              <div style={{
                position: 'relative',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                height: '300px',
                background: 'white'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80" 
                  alt="Equipo profesional en reunión corporativa"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                    border: 'none',
                    outline: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(33, 80, 76, 0.95))',
                  color: 'white',
                  padding: '40px 25px 25px',
                  textAlign: 'center'
                }}>
                  <h4 style={{fontSize: '22px', fontWeight: '700', marginBottom: '12px', margin: 0, color: 'white', textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>Experiencia Comprobada</h4>
                  <p style={{fontSize: '15px', margin: 0, lineHeight: '1.4', color: 'white', textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'}}>Más de 14 años liderando el mercado mexicano de subastas.</p>
                </div>
              </div>

              <div className="st-benefit-image-card">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" 
                  alt="Subasta profesional"
                />
                <div className="st-benefit-image-overlay">
                  <h4 className="st-benefit-image-title">Plataforma Digital Líder</h4>
                  <p className="st-benefit-image-desc">La primera plataforma de subastas en línea de México.</p>
                </div>
              </div>
            </div> */}

            {/* Right Side - Benefits List */}
            {/* <div className="st-benefits-list">
              <h3 className="st-benefits-list-title">Nuestras Ventajas</h3>

              <div className="st-benefit-item st-animate-on-scroll">
                <div className="st-benefit-item-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="st-benefit-item-content">
                  <h4>Oportunidades Exclusivas</h4>
                  <p>Acceso a propiedades únicas en el mercado con oportunidades de inversión excepcionales.</p>
                </div>
              </div>

              <div className="st-benefit-item st-animate-on-scroll">
                <div className="st-benefit-item-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="st-benefit-item-content">
                  <h4>Precios Competitivos</h4>
                  <p>Obtén los mejores artículos a precios justos, maximizando tu inversión.</p>
                </div>
              </div>

              <div className="st-benefit-item st-animate-on-scroll">
                <div className="st-benefit-item-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="st-benefit-item-content">
                  <h4>Seguridad Garantizada</h4>
                  <p>Proceso transparente y seguro, con artículos verificados y legalmente sólidos.</p>
                </div>
              </div>

              <div className="st-benefit-item st-animate-on-scroll">
                <div className="st-benefit-item-icon">
                  <i className="fas fa-balance-scale"></i>
                </div>
                <div className="st-benefit-item-content">
                  <h4>Igualdad de Condiciones</h4>
                  <p>Todos los participantes compiten en igualdad de condiciones en un proceso justo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Property Types Section - Based on Screenshots 05-06 */}
      {/* <section className="st-property-types-section st-animate-on-scroll">
        <div className="container">
          <h2 className="st-property-types-title">
            ¿Qué tipo de artículos puedes encontrar en nuestras subastas?
          </h2>

          <div className="st-property-types-layout"> */}
            {/* Left Side - Property Images */}
            {/* <div className="st-property-images">
              <div className="st-property-image-card">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Edificio de departamentos moderno"
                />
                <div className="st-property-image-overlay">
                  <h4 className="st-property-image-title">Departamentos Modernos</h4>
                  <p className="st-property-image-desc">Edificio contemporáneo de 4 pisos</p>
                </div>
              </div>

              <div className="st-property-image-card">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                  alt="Vista aérea de terrenos agrícolas"
                />
                <div className="st-property-image-overlay">
                  <h4 className="st-property-image-title">Terrenos Agrícolas</h4>
                  <p className="st-property-image-desc">Paisaje rural y fincas</p>
                </div>
              </div>

              <div className="st-property-image-card st-property-image-large">
                <img 
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80" 
                  alt="Hospital moderno"
                />
                <div className="st-property-image-overlay">
                  <h4 className="st-property-image-title">Artículos Institucionales</h4>
                  <p className="st-property-image-desc">Hospital La Fe - Arquitectura institucional moderna</p>
                </div>
              </div>
            </div> */}

            {/* Right Side - Property Types List */}
            {/* <div className="st-property-list">
              <h3 className="st-property-list-title">Tipos de Artículos</h3>
              
              <div className="st-property-columns">
                <div className="st-property-column">
                  <div className="st-property-type">
                    <i className="fas fa-building"></i>
                    <span>Departamentos</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-home"></i>
                    <span>Casas</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-mountain"></i>
                    <span>Terrenos</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-warehouse"></i>
                    <span>Bodegas</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-industry"></i>
                    <span>Naves industriales</span>
                  </div>
                </div>

                <div className="st-property-column">
                  <div className="st-property-type">
                    <i className="fas fa-tree"></i>
                    <span>Fincas</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-store"></i>
                    <span>Locales comerciales</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-city"></i>
                    <span>Edificios</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-seedling"></i>
                    <span>Predios rústicos</span>
                  </div>
                </div>

                <div className="st-property-column">
                  <div className="st-property-type">
                    <i className="fas fa-tractor"></i>
                    <span>Terrenos agrícolas</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-horse"></i>
                    <span>Ranchos</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-film"></i>
                    <span>Cines</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-hospital"></i>
                    <span>Hospitales</span>
                  </div>
                  <div className="st-property-type">
                    <i className="fas fa-school"></i>
                    <span>Escuelas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final Homepage CTA Section - Based on Screenshot 07 */}
      {/* <section className="st-final-cta-section st-animate-on-scroll">
        <div className="container">
          <div className="st-final-cta-content">
            <h2 className="st-final-cta-title" style={{color: 'white'}}>
              ¡Encuentra la casa de tus sueños o tu mejor inversión en bienes raíces!
            </h2>
            <p className="st-final-cta-subtitle">
              Con Subasta Total, tu próxima propiedad está a solo un clic de distancia
            </p>
            
            <a href="/auth" className="st-final-cta-btn">
              Acceder al Portal <i className="fas fa-sign-in-alt"></i>
            </a>
          </div>

          <div className="st-floating-element" style={{fontSize: '60px'}}>
            <i className="fas fa-home"></i>
          </div>
          <div className="st-floating-element" style={{fontSize: '40px'}}>
            <i className="fas fa-key"></i>
          </div>
          <div className="st-floating-element" style={{fontSize: '50px'}}>
            <i className="fas fa-gavel"></i>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Homepage;