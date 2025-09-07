import React, { useState, useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './subastas.css';

const Subastas = () => {
  useScrollTrigger();
  
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

  return (
    <div className="subastas-page">
      {/* Hero Section */}
      <section className="st-subastas-hero-section">
        <div className="st-subastas-hero">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-subastas-hero-content">
                  <h1 className="st-subastas-hero-title">
                    Subasta Activa
                  </h1>
                  <p className="st-subastas-hero-subtitle">
                    Participa en nuestra subasta inmobiliaria y encuentra la propiedad de tus sueños
                  </p>
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
      <section className="st-featured-property-section">
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
      </section>

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