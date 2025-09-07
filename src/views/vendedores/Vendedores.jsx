import React, { useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './vendedores.css';

const Vendedores = () => {
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
    <div className="vendedores-page">
      {/* Hero + Propuesta Vendedores - Based on Screenshots 20-21 */}
      <section className="st-vendedores-hero-section">
        <div className="st-vendedores-hero">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-vendedores-hero-content">
                  <h1 className="st-vendedores-hero-title">
                    Maximiza el valor de tus propiedades con nuestras subastas inmobiliarias
                  </h1>
                  <p className="st-vendedores-hero-subtitle">
                    ¡Vende de manera rápida, eficiente y lucrativa!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Propuesta Inicial Section */}
      <section className="st-propuesta-inicial-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-propuesta-inicial-content">
                <p className="st-propuesta-inicial-intro">
                  En Subasta Total, estamos revolucionando la forma en que vendes tus propiedades. 
                  Nuestra plataforma especializada te ofrece una alternativa innovadora y eficiente 
                  para maximizar el valor de tus activos inmobiliarios.
                </p>
                
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <div className="st-propuesta-card st-animate-on-scroll">
                      <div className="st-propuesta-card-icon">
                        <i className="fas fa-rocket"></i>
                      </div>
                      <h4 className="st-propuesta-card-title">Nuevo Canal de Comercialización</h4>
                      <p className="st-propuesta-card-text">
                        Te ofrecemos un nuevo canal de comercialización que te permitirá llegar a 
                        múltiples compradores potenciales de manera simultánea, generando competencia 
                        y obteniendo el mejor precio por tu propiedad.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 mb-4">
                    <div className="st-propuesta-card st-animate-on-scroll">
                      <div className="st-propuesta-card-icon">
                        <i className="fas fa-gavel"></i>
                      </div>
                      <h4 className="st-propuesta-card-title">Plataforma Especializada</h4>
                      <p className="st-propuesta-card-text">
                        Subasta Total no es un sitio de compra-venta tradicional. Somos una plataforma 
                        especializada en subastas inmobiliarias que garantiza transparencia, seguridad 
                        y el mejor resultado para tu inversión.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Ventajas Específicas Vendedores - Based on Screenshot 22 */}
      <section className="st-ventajas-vendedores-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="st-ventajas-vendedores-intro">
                <h2 className="st-ventajas-vendedores-title">
                  Ventajas exclusivas para vendedores
                </h2>
                <p className="st-ventajas-vendedores-subtitle">
                  Descubre por qué elegir nuestras subastas inmobiliarias es la mejor decisión para maximizar tus ganancias
                </p>
              </div>
              
              <div className="st-ventajas-vendedores-grid">
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-bolt"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Rápido y Efectivo</h4>
                      <p className="st-ventaja-vendedor-text">
                        Vende tus propiedades de manera rápida y efectiva. Nuestro proceso de subastas 
                        acelera la venta, eliminando largas esperas del mercado tradicional y conectándote 
                        directamente con compradores listos para adquirir.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Seguridad y Confianza</h4>
                      <p className="st-ventaja-vendedor-text">
                        Tu tranquilidad es nuestra prioridad. Todos nuestros compradores están debidamente 
                        verificados y cuentan con la solvencia económica necesaria, garantizando transacciones 
                        seguras y confiables en cada subasta.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-laptop-code"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Tecnología de Vanguardia</h4>
                      <p className="st-ventaja-vendedor-text">
                        Nuestra plataforma ofrece la facilidad y agilidad de las subastas en línea con 
                        tecnología de punta. Monitorea tu subasta en tiempo real desde cualquier dispositivo 
                        y mantente informado de cada oferta.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-eye"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Mayor Exposición</h4>
                      <p className="st-ventaja-vendedor-text">
                        Atrae múltiples compradores potenciales a través de nuestra amplia red de marketing 
                        digital. Tu propiedad tendrá máxima visibilidad, llegando a inversores y compradores 
                        que buscan oportunidades únicas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-balance-scale-right"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Competencia y Precio Justo</h4>
                      <p className="st-ventaja-vendedor-text">
                        Permite que el mercado determine el verdadero valor de tu propiedad. La competencia 
                        entre compradores genera ofertas más altas, asegurando que obtengas el mejor precio 
                        posible por tu inmueble.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="st-ventaja-vendedor-card st-animate-on-scroll">
                      <div className="st-ventaja-vendedor-icon">
                        <i className="fas fa-users-cog"></i>
                      </div>
                      <h4 className="st-ventaja-vendedor-title">Asesoría y Promoción</h4>
                      <p className="st-ventaja-vendedor-text">
                        Cuenta con nuestro equipo de expertos que te acompañará durante todo el proceso. 
                        Desde la preparación de tu propiedad hasta el cierre de la venta, recibirás 
                        asesoría profesional personalizada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Vendedores - Based on Screenshot 23 */}
      <section className="st-vendedores-final-cta-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-vendedores-final-cta-content">
                <h2 className="st-vendedores-final-cta-title">
                  ¡Descubre el poder de nuestras subastas inmobiliarias!
                </h2>
                <p className="st-vendedores-final-cta-subtitle">
                  Maximiza el valor de tus activos inmobiliarios
                </p>
                <p className="st-vendedores-final-cta-description">
                  No esperes más para convertir tus propiedades en oportunidades de negocio excepcionales. 
                  Nuestro equipo de especialistas está listo para ayudarte a obtener el máximo valor 
                  por tus activos inmobiliarios.
                </p>
                
                <a href="/contacto" className="st-vendedores-final-cta-btn">
                  ¡Contáctanos hoy mismo! <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vendedores;