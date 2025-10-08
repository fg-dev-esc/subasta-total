import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './subastas.css';

const Subastas = () => {
  const navigate = useNavigate();
  useScrollTrigger();
  
  // State for auctions data
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Sample auction end date (7 days from now for demo)
  const auctionEndDate = new Date();
  auctionEndDate.setDate(auctionEndDate.getDate() + 7);
  auctionEndDate.setHours(15, 30, 0, 0);

  // State para guardar todas las fotos
  const [todasLasFotos, setTodasLasFotos] = useState([]);

  // Fetch auctions data
  useEffect(() => {
    const fetchSubastas = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://demo-subasta.backend.secure9000.net/api/subasta/getSubastas');
        const data = await response.json();

        // Fetch torres (and their photos) for each subasta
        const todasLasFotosTemp = [];

        const subastasConFotos = await Promise.all(
          data.map(async (subasta) => {
            try {
              const torresResponse = await fetch(`https://demo-subasta.backend.secure9000.net/api/subasta/getTorres/${subasta.subastaID}`);
              const torresData = await torresResponse.json();

              // Extraer TODAS las fotos de todas las torres
              if (torresData.torres && torresData.torres.length > 0) {
                torresData.torres.forEach(torre => {
                  if (torre.foto?.url) {
                    todasLasFotosTemp.push(torre.foto.url);
                  }
                });
              }

              // También guardar la primera foto para la subasta individual
              let foto = null;
              if (torresData.torres && torresData.torres.length > 0) {
                const torreConFoto = torresData.torres.find(torre => torre.foto?.url);
                if (torreConFoto) {
                  foto = torreConFoto.foto;
                }
              }

              return {
                ...subasta,
                foto: foto
              };
            } catch (err) {
              console.error(`Error fetching torres for subasta ${subasta.subastaID}:`, err);
              return subasta;
            }
          })
        );

        // Mezclar aleatoriamente las fotos
        const fotosAleatorias = todasLasFotosTemp.sort(() => Math.random() - 0.5);
        setTodasLasFotos(fotosAleatorias);
        setSubastas(subastasConFotos);
      } catch (err) {
        setError('Error cargando las subastas');
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubastas();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = auctionEndDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
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
    // Animate elements on scroll
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
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Initialize Bootstrap carousels
    const initCarousels = () => {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const backgroundCarousel = document.getElementById('backgroundCarousel');
        const auctionsCarousel = document.getElementById('auctionsCarousel');

        if (backgroundCarousel && auctionsCarousel) {
          // Dispose previous instances
          const bgInstance = window.bootstrap.Carousel.getInstance(backgroundCarousel);
          const auctionInstance = window.bootstrap.Carousel.getInstance(auctionsCarousel);
          if (bgInstance) bgInstance.dispose();
          if (auctionInstance) auctionInstance.dispose();

          // Initialize auctions carousel WITHOUT auto-cycling
          const auctionCarousel = new window.bootstrap.Carousel(auctionsCarousel, {
            interval: false,
            ride: false,
            pause: false
          });

          // Initialize background carousel (controls timing)
          const bgCarousel = new window.bootstrap.Carousel(backgroundCarousel, {
            interval: 3500,
            ride: 'carousel',
            pause: false
          });

          // Sync: when background changes, change auctions too
          backgroundCarousel.addEventListener('slid.bs.carousel', () => {
            const activeIndex = Array.from(backgroundCarousel.querySelectorAll('.carousel-item')).indexOf(
              backgroundCarousel.querySelector('.carousel-item.active')
            );
            auctionCarousel.to(activeIndex);
          });
        }
      }
    };

    // Wait a bit for the DOM to be ready and Bootstrap to load
    setTimeout(initCarousels, 100);
  }, [subastas]);

  const handleViewAuctionDetails = (subastaId) => {
    navigate(`/subasta-detalle/${subastaId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubastasPhotos = () => {
    // Retornar una foto por cada subasta
    if (subastas.length > 0) {
      return subastas.map((subasta) => {
        // Usar la primera foto de la subasta, o null para mostrar skeleton
        if (subasta.foto?.url) {
          return subasta.foto.url;
        }
        return null;
      });
    }

    // Si no hay subastas, retornar array vacío
    return [];
  };

  return (
    <div className="subastas-page page-container">
      {/* Hero Section - Based on Homepage */}
      <section className="st-subastas-hero-section">
        <div className="st-subastas-hero-single">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-subastas-hero-content">
                  <div className="st-subastas-hero-sub-title">
                    Oportunidades únicas de inversión
                  </div>
                  <h1 className="st-subastas-hero-title">
                    Encuentra las mejores <span>subastas</span> en línea
                  </h1>
                  <p className="st-subastas-hero-description">
                    Explora nuestras subastas activas y descubre artículos exclusivos con precios competitivos
                    en un proceso transparente y seguro.
                  </p>

                  <div className="st-subastas-hero-btn">
                    <a href="/auth" className="st-theme-btn">
                      Participar Ahora <i className="fas fa-gavel"></i>
                    </a>
                    <a href="/nosotros" className="st-theme-btn-outline st-theme-btn">
                      Conoce Más <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auctions Carousel Section */}
      <section className="st-auctions-carousel-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="position-relative" style={{borderRadius: '20px', overflow: 'hidden'}}>
                {/* Carrousel de imágenes de fondo */}
                {!loading && !error && subastas.length > 0 && (
                  <div id="backgroundCarousel" className="carousel slide">
                    <div className="carousel-inner">
                      {getSubastasPhotos().map((imageUrl, index) => (
                        <div key={`bg-${index}`} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              className="d-block w-100"
                              alt={`Subasta ${index + 1}`}
                              style={{ height: '600px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="d-block w-100" style={{ height: '600px' }}>
                              <div className="placeholder-glow h-100">
                                <span className="placeholder col-12 h-100" style={{ display: 'block' }}></span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Fondo para cuando está cargando o hay error */}
                {(loading || error) && (
                  <div className="d-block w-100" style={{ height: '600px', backgroundColor: '#f8f9fa' }}>
                    <div className="placeholder-glow h-100">
                      <span className="placeholder col-12 h-100" style={{ display: 'block' }}></span>
                    </div>
                  </div>
                )}

                {/* Carrousel de contenido de subastas */}
                <div id="auctionsCarousel" className="carousel slide position-absolute top-0 start-0 w-100 h-100">
                  <div className="carousel-inner h-100">
                    {loading ? (
                      <div className="carousel-item h-100 active">
                        <div className="position-absolute text-start" style={{left: '5%', right: '50%', bottom: '10%', zIndex: 10}}>
                          <div className="bg-white bg-opacity-95 p-4 rounded-3 shadow">
                            <div className="mb-2">
                              <span className="badge bg-primary">
                                <i className="fas fa-spinner fa-spin me-1"></i>
                                Cargando
                              </span>
                            </div>
                            
                            <h3 className="text-dark fw-bold mb-2">
                              <div className="placeholder-glow">
                                <span className="placeholder col-8"></span>
                              </div>
                            </h3>
                            <p className="text-muted mb-3">
                              <div className="placeholder-glow">
                                <span className="placeholder col-6"></span>
                              </div>
                            </p>
                            
                            <div className="row mb-3">
                              <div className="col-6">
                                <small className="text-muted">
                                  <i className="fas fa-calendar-check me-1"></i>
                                  Fecha inicio
                                </small>
                                <div className="placeholder-glow">
                                  <span className="placeholder col-10"></span>
                                </div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">
                                  <i className="fas fa-building me-1"></i>
                                  Artículos
                                </small>
                                <div className="placeholder-glow">
                                  <span className="placeholder col-8"></span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Descripción
                              </small>
                              <div className="placeholder-glow">
                                <span className="placeholder col-12 mb-1"></span>
                                <span className="placeholder col-8"></span>
                              </div>
                            </div>
                            
                            <div className="d-flex gap-2">
                              <div className="btn btn-secondary flex-fill disabled">
                                <i className="fas fa-eye me-1"></i>
                                Cargando...
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="carousel-item h-100 active">
                        <div className="position-absolute text-start" style={{left: '5%', right: '50%', bottom: '10%', zIndex: 10}}>
                          <div className="bg-white bg-opacity-95 p-4 rounded-3 shadow">
                            <div className="mb-2">
                              <span className="badge bg-danger">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Error
                              </span>
                            </div>
                            
                            <h3 className="text-dark fw-bold mb-2">Error al cargar subastas</h3>
                            <p className="text-muted mb-3">
                              <i className="fas fa-wifi me-2"></i>
                              {error}
                            </p>
                            
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-primary flex-fill"
                                onClick={() => window.location.reload()}
                              >
                                <i className="fas fa-refresh me-1"></i>
                                Reintentar
                              </button>
                              <a href="/contacto" className="btn btn-outline-primary">
                                <i className="fas fa-info-circle"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : subastas.length > 0 ? (
                      subastas.map((subasta, index) => (
                        <div key={subasta.subastaID} className={`carousel-item h-100 ${index === 0 ? 'active' : ''}`}>
                          <div className="position-absolute text-start" style={{left: '5%', right: '50%', bottom: '10%', zIndex: 10}}>
                            <div className="bg-white bg-opacity-95 p-4 rounded-3 shadow">
                              <div className="mb-2">
                                <span className="badge bg-success">
                                  <i className="fas fa-gavel me-1"></i>
                                  En Subasta
                                </span>
                              </div>
                              
                              <h3 className="text-dark fw-bold mb-2">{subasta.nombre}</h3>
                              <p className="text-muted mb-3">
                                <i className="fas fa-calendar-alt me-2"></i>
                                Subasta activa hasta {formatDate(subasta.fechaFin)}
                              </p>
                              
                              <div className="row mb-3">
                                <div className="col-6">
                                  <small className="text-muted">
                                    <i className="fas fa-calendar-check me-1"></i>
                                    Fecha inicio
                                  </small>
                                  <div className="text-dark fw-semibold">{formatDate(subasta.fechaInicio)}</div>
                                </div>
                                <div className="col-6">
                                  <small className="text-muted">
                                    <i className="fas fa-building me-1"></i>
                                    Propiedades
                                  </small>
                                  <div className="text-dark fw-semibold">{subasta.torres} artículos</div>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <small className="text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  Descripción
                                </small>
                                <p className="text-dark mb-0 small">{subasta.descripcion}</p>
                              </div>
                              
                              <div className="row mb-3">
                                <div className="col-12">
                                  <div className="bg-success bg-opacity-10 p-3 rounded-2">
                                    <small className="text-success fw-semibold">Estado de Subasta:</small>
                                    <div className="text-success fw-bold">Activa - {subasta.torres} artículos disponibles</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-success flex-fill"
                                  onClick={() => handleViewAuctionDetails(subasta.subastaID)}
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  Ver Artículos
                                </button>
                                <a href="/contacto" className="btn btn-outline-success">
                                  <i className="fas fa-info-circle"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="carousel-item h-100 active">
                        <div className="position-absolute text-start" style={{left: '5%', right: '50%', bottom: '10%', zIndex: 10}}>
                          <div className="bg-white bg-opacity-95 p-4 rounded-3 shadow">
                            <div className="mb-2">
                              <span className="badge bg-warning">
                                <i className="fas fa-exclamation-circle me-1"></i>
                                Sin Subastas
                              </span>
                            </div>
                            
                            <h3 className="text-dark fw-bold mb-2">No hay subastas disponibles</h3>
                            <p className="text-muted mb-3">
                              <i className="fas fa-clock me-2"></i>
                              Próximamente tendremos nuevas oportunidades
                            </p>
                            
                            <div className="mb-3">
                              <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Estado
                              </small>
                              <p className="text-dark mb-0 small">
                                Estamos preparando nuevas subastas. 
                                Regresa pronto para encontrar excelentes oportunidades.
                              </p>
                            </div>
                            
                            <div className="d-flex gap-2">
                              <a href="/contacto" className="btn btn-primary flex-fill">
                                <i className="fas fa-envelope me-1"></i>
                                Contactar
                              </a>
                              <a href="/" className="btn btn-outline-primary">
                                <i className="fas fa-home"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                
                {!loading && !error && subastas.length > 1 && (
                  <div className="carousel-indicators">
                    {subastas.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#auctionsCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="st-countdown-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-countdown-card">
                <div className="st-countdown-header">
                  <h2 className="st-countdown-title">
                    <i className="fas fa-clock me-3"></i>
                    Tiempo restante para participar
                  </h2>
                  <p className="st-countdown-subtitle">
                    La subasta finaliza el {auctionEndDate.toLocaleDateString('es-MX', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} a las 3:30 PM
                  </p>
                </div>
                
                <div className="st-countdown-display">
                  <div className="st-time-block">
                    <div className="st-time-number">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="st-time-label">Días</div>
                  </div>
                  <div className="st-time-separator">:</div>
                  <div className="st-time-block">
                    <div className="st-time-number">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="st-time-label">Horas</div>
                  </div>
                  <div className="st-time-separator">:</div>
                  <div className="st-time-block">
                    <div className="st-time-number">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="st-time-label">Minutos</div>
                  </div>
                  <div className="st-time-separator">:</div>
                  <div className="st-time-block">
                    <div className="st-time-number">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="st-time-label">Segundos</div>
                  </div>
                </div>

                <div className="st-countdown-cta">
                  <a href="/auth" className="st-countdown-btn">
                    Participar Ahora <i className="fas fa-gavel"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Property Section */}
      {/* <section className="st-featured-property-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', width: '100%', maxWidth: '500px'}}>
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80" 
                    alt="Casa en subasta"
                    style={{
                      width: '100%',
                      height: '500px',
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      display: 'block',
                      margin: 0,
                      padding: 0,
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #21504c 0%, #4A9B8E 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontWeight: '700',
                    fontSize: '14px',
                    boxShadow: '0 10px 25px rgba(33, 80, 76, 0.3)',
                    zIndex: 2
                  }}>
                    <i className="fas fa-gavel"></i> En Subasta
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="st-property-details">
                <h3 className="st-property-title">
                  Casa Residencial en Zona Premium
                </h3>
                <div className="st-property-location">
                  <i className="fas fa-map-marker-alt"></i>
                  Polanco, Ciudad de México
                </div>
                
                <div className="st-property-specs">
                  <div className="st-spec">
                    <i className="fas fa-bed"></i>
                    <span>4 Recámaras</span>
                  </div>
                  <div className="st-spec">
                    <i className="fas fa-bath"></i>
                    <span>3 Baños</span>
                  </div>
                  <div className="st-spec">
                    <i className="fas fa-car"></i>
                    <span>2 Estacionamientos</span>
                  </div>
                  <div className="st-spec">
                    <i className="fas fa-ruler-combined"></i>
                    <span>350 m²</span>
                  </div>
                </div>

                <div className="st-property-description">
                  <p>
                    Hermosa casa en una de las zonas más exclusivas de la ciudad. 
                    Cuenta con amplios espacios, acabados de lujo y excelente ubicación.
                  </p>
                </div>

                <div className="st-property-pricing">
                  <div className="st-current-bid">
                    <span className="st-bid-label">Puja Actual:</span>
                    <span className="st-bid-amount">$4,250,000</span>
                  </div>
                  <div className="st-starting-price">
                    <span className="st-starting-label">Precio Inicial:</span>
                    <span className="st-starting-amount">$3,800,000</span>
                  </div>
                </div>

                <div className="st-property-actions">
                  <a href="/auth" className="st-property-btn primary">
                    Hacer Puja <i className="fas fa-hand-paper"></i>
                  </a>
                  <a href="/contacto" className="st-property-btn secondary">
                    Más Información <i className="fas fa-info-circle"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Información Adicional */}
      <section className="st-subastas-info-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="st-subastas-info-card">
                <div className="st-subastas-info-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <h4 className="st-subastas-info-title">Notificaciones</h4>
                <p className="st-subastas-info-text">
                  Sé el primero en enterarte cuando publiquemos nuevas subastas
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="st-subastas-info-card">
                <div className="st-subastas-info-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4 className="st-subastas-info-title">Proceso Seguro</h4>
                <p className="st-subastas-info-text">
                  Todas nuestras subastas están respaldadas por procesos legales seguros
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="st-subastas-info-card">
                <div className="st-subastas-info-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h4 className="st-subastas-info-title">Soporte 24/7</h4>
                <p className="st-subastas-info-text">
                  Nuestro equipo te acompañará durante todo el proceso de subasta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subastas;