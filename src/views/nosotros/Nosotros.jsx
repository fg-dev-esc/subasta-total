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
      {/* Hero Section Nosotros - Based on Screenshot 08 */}
      <section className="st-nosotros-hero-section">
        <div className="st-nosotros-hero">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-nosotros-hero-content">
                  <h1 className="st-nosotros-hero-title">
                    Transformando el mundo de las subastas de inmuebles
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Corporativa Section */}
      <section className="st-historia-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-historia-content">
                <div className="st-historia-paragraph st-animate-on-scroll">
                  <p>
                    Somos un grupo de mexicanos apasionados y expertos en el fascinante mundo de las subastas. 
                    Con más de 14 años de dedicación, nos enorgullece liderar la primera plataforma online 
                    especializada en subastas de inmuebles en México.
                  </p>
                </div>

                <div className="st-historia-paragraph st-animate-on-scroll">
                  <p>
                    Subasta Total fue creada con la visión de democratizar y simplificar el mundo de las subastas, 
                    brindando oportunidades únicas tanto a corporativos que desean vender propiedades como a los compradores.
                  </p>
                </div>

                <div className="st-historia-paragraph st-animate-on-scroll">
                  <p>
                    Nuestro objetivo es expandir el modelo de subastas en línea a un público más amplio de manera 
                    totalmente fácil, transparente y segura.
                  </p>
                </div>

                <div className="st-historia-paragraph st-animate-on-scroll">
                  <p>
                    Hemos canalizado nuestra experiencia hacia la creación de una plataforma propia, diseñada especialmente 
                    para las subastas inmobiliarias. Pensando en la optimización del proceso, hemos perfeccionado cada detalle 
                    para ofrecer una experiencia única, brindando un entorno confiable, transparente y eficiente para todos 
                    los involucrados.
                  </p>
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
                  ¡Únete a la mejor experiencia de <span style={{color: 'white'}}>subastas de inmuebles!</span>
                </h2>
                <p className="st-cta-medio-description">
                  Ya sea que estés buscando tu próximo hogar, vendiendo propiedades o maximizando tu inversión, 
                  en Subasta Total te brindamos las mejores soluciones para subastas en línea de México.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section - Based on Screenshot 10 */}
      <section className="st-nosotros-final-cta-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="st-nosotros-final-cta-content">
                <h2 className="st-nosotros-final-cta-title">
                  ¡Descubre el futuro de las subastas inmobiliarias hoy mismo!
                </h2>
                <p className="st-nosotros-final-cta-description">
                  Si deseas participar en una subasta, regístrate ahora y comienza tu experiencia con nosotros.
                </p>
                
                <a href="/auth" className="st-nosotros-final-cta-btn">
                  Acceder <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;