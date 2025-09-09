import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  // useScrollTrigger(); // Disabled to check if this causes hero animation
  
  // State for destacados
  const [destacados, setDestacados] = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);

  // Fetch destacados
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoadingDestacados(true);
        const response = await fetch('https://demo-subasta.backend.secure9000.net/api/actions/getDestacados');
        const data = await response.json();
        setDestacados(data.slice(0, 3)); // Mostrar solo 3 destacados
      } catch (error) {
        console.error('Error fetching destacados:', error);
      } finally {
        setLoadingDestacados(false);
      }
    };

    fetchDestacados();
  }, []);

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

  // Helper functions
  const getPlaceholderImage = (index) => {
    // Array de imágenes de casas de Unsplash
    const houseImages = [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    // Retorna imagen basada en el índice, si no hay índice usa la primera
    return houseImages[index % houseImages.length] || houseImages[0];
  };

  const formatPrice = (price) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleViewProperty = (articuloId) => {
    navigate(`/detalle/${articuloId}`);
  };

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
                    Somos expertos en <span>subastas y remates</span> inmobiliarios
                  </h1>
                  <p className="st-hero-description">
                    Con más de 14 años de dedicación, nos enorgullece liderar la primera plataforma online 
                    especializada en subastas de inmuebles en México.
                  </p>
                  
                  {/* Status Badge */}
                  <div className="st-hero-status">
                    <strong>Subasta activa:</strong> Casa residencial en Polanco - 7 días restantes
                  </div>

                  <div className="st-hero-btn">
                    <a href="/compradores" className="st-theme-btn">
                      Para Compradores <i className="fas fa-arrow-right"></i>
                    </a>
                    <a href="/vendedores" className="st-theme-btn-outline st-theme-btn">
                      Para Vendedores <i className="fas fa-handshake"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destacados Section */}
      <section className="st-destacados-section st-animate-on-scroll">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="st-section-heading text-center">
                <span className="st-section-tagline">Propiedades Destacadas</span>
                <h2 className="st-section-title">
                  Encuentra tu <span>oportunidad perfecta</span>
                </h2>
                <div className="st-heading-divider"></div>
                <p className="st-section-description">
                  Descubre las mejores propiedades disponibles en nuestras subastas inmobiliarias
                </p>
              </div>
            </div>
          </div>

          {loadingDestacados ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando propiedades destacadas...</p>
            </div>
          ) : (
            <div className="row">
              {destacados.length > 0 ? (
                destacados.map((propiedad, index) => (
                  <div key={propiedad.articuloID} className="col-lg-4 col-md-6 mb-4">
                    <div className="st-property-card">
                      <div className="st-property-image">
                        <img 
                          src={propiedad.foto?.url || getPlaceholderImage(index)}
                          alt={propiedad.nombre}
                          onError={(e) => {
                            e.target.src = getPlaceholderImage(index);
                          }}
                        />
                        <div className="st-property-status-badge">
                          <span className="badge bg-success">
                            <i className="fas fa-gavel me-1"></i>
                            Destacado
                          </span>
                        </div>
                      </div>
                      
                      <div className="st-property-content">
                        <h4 className="st-property-title">
                          {propiedad.nombre}
                        </h4>
                        <p className="st-property-location">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {propiedad.municipio}, {propiedad.estado}
                        </p>
                        
                        <div className="st-property-details">
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted">Categoría:</small>
                              <br />
                              <strong>{propiedad.categoria}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Subcategoría:</small>
                              <br />
                              <strong>{propiedad.subCategoria}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="st-property-description">
                          <p>{propiedad.descripcion}</p>
                        </div>

                        <div className="st-property-specs-simple mb-3">
                          <div className="st-spec-simple">
                            <div className="st-spec-label">
                              <i className="fas fa-handshake text-success me-2"></i>
                              <span className="text-muted">Tipo de Venta</span>
                            </div>
                            <div className="st-spec-value fw-bold text-dark">{propiedad.tipoVenta}</div>
                          </div>
                          <div className="st-spec-simple">
                            <div className="st-spec-label">
                              <i className="fas fa-balance-scale text-warning me-2"></i>
                              <span className="text-muted">Status Jurídico</span>
                            </div>
                            <div className="st-spec-value fw-bold text-dark">{propiedad.estatusJuridico}</div>
                          </div>
                          <div className="st-spec-simple">
                            <div className="st-spec-label">
                              <i className="fas fa-map-marker-alt text-danger me-2"></i>
                              <span className="text-muted">Estado</span>
                            </div>
                            <div className="st-spec-value fw-bold text-dark">{propiedad.estado}</div>
                          </div>
                        </div>

                        <div className="st-property-actions">
                          <button 
                            className="st-property-btn"
                            onClick={() => handleViewProperty(propiedad.articuloID)}
                          >
                            Ver Detalles y Ofertar
                            <i className="fas fa-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="st-no-results">
                    <i className="fas fa-exclamation-circle mb-3"></i>
                    <h4>No hay propiedades destacadas disponibles</h4>
                    <p className="text-muted">Próximamente tendremos nuevas propiedades destacadas.</p>
                  </div>
                </div>
              )}
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
      <section className="st-status-section st-animate-on-scroll">
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
      </section>

      {/* Properties Section - Based on Screenshot 02 */}
      <section className="st-properties-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-properties-hero">
                <div className="st-properties-content">
                  <h2 className="st-properties-title" style={{color: 'white'}}>
                    Explora las propiedades que tenemos en subasta
                  </h2>
                  <p className="st-properties-subtitle">
                    Casa residencial moderna con iluminación nocturna - Encuentra tu próximo hogar
                  </p>
                  
                  <a href="/subastas" className="st-properties-btn">
                    Ver más <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <div className="st-main-cta st-animate-on-scroll">
            <h2 className="st-main-cta-title" style={{color: 'white'}}>
              ¿Quieres comprar un inmueble al mejor precio posible?
            </h2>
            <p className="st-main-cta-subtitle">
              ¡Llegaste al lugar perfecto!
            </p>
            <p className="st-main-cta-description">
              En Subasta Total, te ofrecemos una plataforma amigable para adquirir bienes raíces. 
              Participa en subastas públicas en línea y encuentra la propiedad que estás buscando.
            </p>
            <a href="/compradores" className="st-main-cta-btn">
              Comenzar ahora <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section - Based on Screenshot 04 */}
      <section className="st-benefits-section st-animate-on-scroll">
        <div className="container">
          <div className="st-benefits-title-section">
            <h2 className="st-benefits-main-title">
              ¿Por qué elegir Subasta Total?
            </h2>
            <p className="st-benefits-subtitle">
              Descubre las ventajas que nos convierten en la mejor opción para tus inversiones inmobiliarias
            </p>
          </div>

          <div className="st-benefits-layout">
            {/* Left Side - Lifestyle Images */}
            <div className="st-benefits-images">
              <div style={{
                position: 'relative',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                height: '300px',
                background: 'white'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80" 
                  alt="Pareja feliz con llaves de casa nueva"
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
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                  color: 'white',
                  padding: '40px 25px 25px',
                  textAlign: 'center'
                }}>
                  <h4 style={{fontSize: '20px', fontWeight: '700', marginBottom: '8px', margin: 0}}>Tu nueva casa te espera</h4>
                  <p style={{fontSize: '14px', opacity: 0.9, margin: 0}}>Pareja celebrando la compra de su nuevo hogar</p>
                </div>
              </div>

              <div className="st-benefit-image-card">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" 
                  alt="Reunión de profesionales inmobiliarios"
                />
                <div className="st-benefit-image-overlay">
                  <h4 className="st-benefit-image-title">Asesoría profesional</h4>
                  <p className="st-benefit-image-desc">Equipo de expertos inmobiliarios a tu servicio</p>
                </div>
              </div>
            </div>

            {/* Right Side - Benefits List */}
            <div className="st-benefits-list">
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
                  <p>Obtén las mejores propiedades a precios justos, maximizando tu inversión inmobiliaria.</p>
                </div>
              </div>

              <div className="st-benefit-item st-animate-on-scroll">
                <div className="st-benefit-item-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="st-benefit-item-content">
                  <h4>Seguridad Garantizada</h4>
                  <p>Proceso transparente y seguro, con propiedades verificadas y documentación completa.</p>
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
      </section>

      {/* Property Types Section - Based on Screenshots 05-06 */}
      <section className="st-property-types-section st-animate-on-scroll">
        <div className="container">
          <h2 className="st-property-types-title">
            ¿Qué tipo de propiedades puedes encontrar en nuestras subastas inmobiliarias?
          </h2>

          <div className="st-property-types-layout">
            {/* Left Side - Property Images */}
            <div className="st-property-images">
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
                  <h4 className="st-property-image-title">Propiedades Institucionales</h4>
                  <p className="st-property-image-desc">Hospital La Fe - Arquitectura institucional moderna</p>
                </div>
              </div>
            </div>

            {/* Right Side - Property Types List */}
            <div className="st-property-list">
              <h3 className="st-property-list-title">Tipos de Propiedades</h3>
              
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
      </section>

      {/* Final Homepage CTA Section - Based on Screenshot 07 */}
      <section className="st-final-cta-section st-animate-on-scroll">
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

          {/* Floating Decorative Elements */}
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
      </section>
    </div>
  );
};

export default Homepage;