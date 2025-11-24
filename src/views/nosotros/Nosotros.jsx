import React, { useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './nosotros.css';

const Nosotros = () => {
  useScrollTrigger();

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
    <div className="nosotros-page page-container">
      {/* Hero Section Nosotros - Based on Homepage */}
      <section className="st-nosotros-hero-section">
        <div className="st-nosotros-hero-single">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-nosotros-hero-content">
                  <div className="st-nosotros-hero-sub-title">
                    Líderes en subastas
                  </div>
                  <h1 className="st-nosotros-hero-title">
                    Transformando el <span>mundo de las subastas</span>
                  </h1>
                  <p className="st-nosotros-hero-description">
                    Más de 14 años de experiencia liderando las
                    subastas en México.
                  </p>

                  <div className="st-nosotros-hero-btn">
                    <a href="/subastas" className="st-theme-btn">
                      Ver Subastas <i className="fas fa-eye"></i>
                    </a>
                    <a href="/contacto" className="st-theme-btn-outline st-theme-btn">
                      Contáctanos <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Corporativa Section - Rediseñada */}
      <section className="st-historia-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Título de Sección */}
              <div className="st-historia-header st-animate-on-scroll">
                <span className="st-historia-badge">Nuestra Historia</span>
                <h2 className="st-historia-main-title">Más de 14 años transformando el mercado de las subastas</h2>
              </div>

              {/* Timeline Vertical */}
              <div className="st-timeline-container">
                {/* Item 1 - Quiénes Somos */}
                <div className="st-timeline-item st-animate-on-scroll">
                  <div className="st-timeline-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="st-timeline-content">
                    <div className="st-timeline-badge">Quiénes Somos</div>
                    <h3 className="st-timeline-title">Expertos Mexicanos en Subastas</h3>
                    <p className="st-timeline-text">
                      Somos un grupo de mexicanos apasionados y expertos en el fascinante mundo de las subastas. 
                      Con más de 14 años de dedicación, nos enorgullece liderar la primera plataforma online 
                      de subastas en México.
                    </p>
                  </div>
                </div>

                {/* Item 2 - Nuestra Visión */}
                <div className="st-timeline-item st-timeline-item-right st-animate-on-scroll">
                  <div className="st-timeline-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div className="st-timeline-content">
                    <div className="st-timeline-badge">Nuestra Visión</div>
                    <h3 className="st-timeline-title">Democratizar las Subastas</h3>
                    <p className="st-timeline-text">
                      Subasta Total fue creada con la visión de democratizar y simplificar el mundo de las subastas, 
                      brindando oportunidades únicas tanto a vendedores corporativos como a los compradores.
                    </p>
                  </div>
                </div>

                {/* Item 3 - Nuestro Objetivo */}
                <div className="st-timeline-item st-animate-on-scroll">
                  <div className="st-timeline-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <div className="st-timeline-content">
                    <div className="st-timeline-badge">Nuestro Objetivo</div>
                    <h3 className="st-timeline-title">Expansión y Accesibilidad</h3>
                    <p className="st-timeline-text">
                      Nuestro objetivo es expandir el modelo de subastas en línea a un público más amplio de manera 
                      totalmente fácil, transparente y segura.
                    </p>
                  </div>
                </div>

                {/* Item 4 - Nuestra Plataforma */}
                <div className="st-timeline-item st-timeline-item-right st-animate-on-scroll">
                  <div className="st-timeline-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <div className="st-timeline-content">
                    <div className="st-timeline-badge">Nuestra Plataforma</div>
                    <h3 className="st-timeline-title">Tecnología y Experiencia</h3>
                    <p className="st-timeline-text">
                      Hemos canalizado nuestra experiencia hacia la creación de una plataforma propia, diseñada para optimizar el proceso de subasta. Pensando en la optimización del proceso, hemos perfeccionado cada detalle 
                      para ofrecer una experiencia única, brindando un entorno confiable, transparente y eficiente para todos 
                      los involucrados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Medio Section - Based on Screenshot 09 */}
      <section className="st-cta-medio-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-cta-medio-content">
                <h2 className="st-cta-medio-title" style={{color: 'white'}}>
                  ¡Únete a la mejor experiencia de <span style={{color: 'white'}}>subastas!</span>
                </h2>
                <p className="st-cta-medio-description">
                  Regístrate ahora y comienza tu experiencia con nosotros.
                </p>
                <a href="/auth" className="st-cta-medio-btn">
                  Acceder <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section - Based on Screenshot 10 */}
      {/* <section className="st-nosotros-final-cta-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="st-nosotros-final-cta-content">
                <h2 className="st-nosotros-final-cta-title">
                  ¡Descubre el futuro de las subastas hoy mismo!
                </h2>
                <p className="st-nosotros-final-cta-description">
                  Regístrate ahora y comienza tu experiencia con nosotros.
                </p>
                
                <a href="/auth" className="st-nosotros-final-cta-btn">
                  Acceder <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Nosotros;
