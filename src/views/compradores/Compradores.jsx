import React, { useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './compradores.css';

const Compradores = () => {
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
    <div className="compradores-page page-container">
      {/* Hero Section + Propuesta de Valor (3 Cards) - Based on Screenshot 11 */}
      <section className="st-compradores-hero-section">
        <div className="st-compradores-hero">
          {/* Floating SVG Icons */}
          <div className="st-floating-icon st-floating-icon-1">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div className="st-floating-icon st-floating-icon-2">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="st-compradores-hero-content">
                  <h1 className="st-compradores-hero-title">
                    ¡Descubre una nueva forma de invertir en bienes raíces con nuestras subastas inmobiliarias!
                  </h1>
                  
                  <div className="st-propuesta-cards">
                    <div className="row">
                      <div className="col-lg-4 col-md-6 mb-4">
                        <div className="st-propuesta-card st-animate-on-scroll">
                          <p>
                            En Subasta Total, estamos revolucionando la manera en que compras propiedades. 
                            Nuestra plataforma te brinda acceso exclusivo a una amplia gama de inmuebles 
                            disponibles en subastas en línea.
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-lg-4 col-md-6 mb-4">
                        <div className="st-propuesta-card st-animate-on-scroll">
                          <p>
                            Te ofrecemos una nueva plataforma de remates que te permite explorar y adquirir 
                            propiedades de manera segura y transparente. Olvídate de las complicaciones 
                            tradicionales y descubre oportunidades únicas.
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-lg-4 col-md-12 mb-4">
                        <div className="st-propuesta-card st-animate-on-scroll">
                          <p>
                            Subasta Total es el lugar para hacer realidad tus sueños de inversión inmobiliaria. 
                            Con nuestro enfoque centrado en la excelencia y la innovación, te garantizamos 
                            una experiencia única en el mercado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas Competitivas (8 Total) - Based on Screenshots 12-13 */}
      <section className="st-ventajas-section st-animate-on-scroll">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4">
              <div className="st-ventajas-image">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Pareja trabajando en computadora"
                  className="img-fluid"
                />
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="st-ventajas-intro">
                <h2 className="st-ventajas-title">
                  ¿Por qué somos la mejor alternativa de subastas en línea de inmuebles?
                </h2>
              </div>
            </div>
          </div>
          
          <div className="st-ventajas-grid">
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-gem"></i>
                  </div>
                  <h4 className="st-ventaja-title">Oportunidades Únicas</h4>
                  <p className="st-ventaja-text">
                    Sumérgete en un mundo de oportunidades inmobiliarias exclusivas. 
                    Nuestra plataforma te da acceso a propiedades que no encontrarás 
                    en el mercado tradicional.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h4 className="st-ventaja-title">Seguridad Garantizada</h4>
                  <p className="st-ventaja-text">
                    Ten la tranquilidad de que todas nuestras subastas están respaldadas 
                    por rigurosos procesos de verificación y documentación legal completa.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <h4 className="st-ventaja-title">Igualdad de Condiciones</h4>
                  <p className="st-ventaja-text">
                    No importa si eres un comprador particular o un inversionista experimentado, 
                    todos tienen las mismas oportunidades de participar y ganar.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-laptop-house"></i>
                  </div>
                  <h4 className="st-ventaja-title">Flexibilidad y Comodidad</h4>
                  <p className="st-ventaja-text">
                    Participa en nuestras subastas en cualquier momento y desde cualquier lugar. 
                    Solo necesitas una conexión a internet y podrás ofertar.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h4 className="st-ventaja-title">Transparencia y Confianza</h4>
                  <p className="st-ventaja-text">
                    Nuestro proceso de subastas en línea es completamente transparente. 
                    Puedes ver todas las ofertas en tiempo real y seguir cada paso del proceso.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <h4 className="st-ventaja-title">Precio Competitivo</h4>
                  <p className="st-ventaja-text">
                    Descubre propiedades a precios competitivos. Las subastas permiten 
                    que el mercado determine el valor real de cada inmueble.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h4 className="st-ventaja-title">Proceso Eficiente</h4>
                  <p className="st-ventaja-text">
                    Accede a información relevante en línea sobre cada propiedad, 
                    incluyendo fotografías, especificaciones y documentos legales.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="st-ventaja-card st-animate-on-scroll">
                  <div className="st-ventaja-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h4 className="st-ventaja-title">Soporte Técnico</h4>
                  <p className="st-ventaja-text">
                    Nuestro equipo de asesores está disponible para apoyarte durante 
                    todo el proceso, desde el registro hasta la finalización de tu compra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Compradores - Based on Screenshot 14 */}
      <section className="st-compradores-final-cta-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-compradores-final-cta-content">
                <h2 className="st-compradores-final-cta-title" style={{color: 'white'}}>
                  ¡Encuentra la casa de tus sueños o tu mejor inversión en nuestras subastas inmobiliarias!
                </h2>
                <p className="st-compradores-final-cta-description">
                  Estás a solo un clic de distancia. ¡No dejes pasar esta oportunidad!
                </p>
                
                <a href="/auth" className="st-compradores-final-cta-btn">
                  Acceder <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Participación (7 Pasos) - Based on Screenshot 15 */}
      <section className="st-proceso-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-proceso-intro">
                <h2 className="st-proceso-title">
                  ¿Cómo participar en nuestras subastas en línea de inmuebles?
                </h2>
                <p className="st-proceso-subtitle">
                  ¡Participar en nuestras subastas de inmuebles es fácil y rápido!
                </p>
              </div>
              
              <div className="st-proceso-steps">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="st-proceso-grid">
                      
                      {/* Primera fila: 3 pasos */}
                      <div className="st-proceso-row">
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-clipboard-check"></i>
                          </div>
                          <h4 className="st-proceso-step-title">1. Registro</h4>
                          <p className="st-proceso-step-text">Crea tu cuenta y completa tu expediente</p>
                        </div>
                        
                        <div className="st-proceso-arrow-horizontal">
                          <i className="fas fa-arrow-right"></i>
                        </div>
                        
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-search-plus"></i>
                          </div>
                          <h4 className="st-proceso-step-title">2. Explorar</h4>
                          <p className="st-proceso-step-text">Busca y analiza las propiedades disponibles</p>
                        </div>
                        
                        <div className="st-proceso-arrow-horizontal">
                          <i className="fas fa-arrow-right"></i>
                        </div>
                        
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-hand-point-up"></i>
                          </div>
                          <h4 className="st-proceso-step-title">3. Participar</h4>
                          <p className="st-proceso-step-text">Realiza tus ofertas en tiempo real</p>
                        </div>
                      </div>
                      
                      {/* Flecha hacia abajo */}
                      <div className="st-proceso-arrow-down">
                        <i className="fas fa-arrow-down"></i>
                      </div>
                      
                      {/* Segunda fila: 4 pasos */}
                      <div className="st-proceso-row st-proceso-row-reverse">
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-handshake"></i>
                          </div>
                          <h4 className="st-proceso-step-title">7. ¡Felicidades!</h4>
                          <p className="st-proceso-step-text">Ya eres propietario de tu nueva inversión</p>
                        </div>
                        
                        <div className="st-proceso-arrow-horizontal st-arrow-reverse">
                          <i className="fas fa-arrow-left"></i>
                        </div>
                        
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-desktop"></i>
                          </div>
                          <h4 className="st-proceso-step-title">6. Conclusión</h4>
                          <p className="st-proceso-step-text">Finaliza el proceso legal</p>
                        </div>
                        
                        <div className="st-proceso-arrow-horizontal st-arrow-reverse">
                          <i className="fas fa-arrow-left"></i>
                        </div>
                        
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-trophy"></i>
                          </div>
                          <h4 className="st-proceso-step-title">5. Ganar</h4>
                          <p className="st-proceso-step-text">¡Felicidades! Has ganado la subasta</p>
                        </div>
                        
                        <div className="st-proceso-arrow-horizontal st-arrow-reverse">
                          <i className="fas fa-arrow-left"></i>
                        </div>
                        
                        <div className="st-proceso-step st-animate-on-scroll">
                          <div className="st-proceso-step-icon">
                            <i className="fas fa-credit-card"></i>
                          </div>
                          <h4 className="st-proceso-step-title">4. Pagar</h4>
                          <p className="st-proceso-step-text">Completa tu pago de manera segura</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requisitos de Registro Section - Based on Screenshot 16 */}
      <section className="st-requisitos-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-requisitos-intro">
                <h2 className="st-requisitos-title">
                  ¿Cuáles son los requisitos para registrarme y participar?
                </h2>
                <p className="st-requisitos-description">
                  Nuestro compromiso es brindarte un proceso simple y transparente para que puedas 
                  participar en nuestras subastas de manera segura y confiable.
                </p>
                <div className="st-requisitos-cta">
                  <h3 className="st-requisitos-cta-title" style={{color: 'white'}}>
                    ¡Descubre cómo participar en nuestras subastas de manera segura!
                  </h3>
                </div>
              </div>
              
              <div className="st-requisitos-pasos">
                <div className="row">
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="st-requisito-paso st-animate-on-scroll">
                      <div className="st-requisito-paso-number">1</div>
                      <h4 className="st-requisito-paso-title">CREA TU CUENTA</h4>
                      <p className="st-requisito-paso-text">
                        Ingresa tus datos generales y crea tu perfil de usuario en nuestra 
                        plataforma de manera rápida y sencilla.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="st-requisito-paso st-animate-on-scroll">
                      <div className="st-requisito-paso-number">2</div>
                      <h4 className="st-requisito-paso-title">COMPLETA TU EXPEDIENTE</h4>
                      <p className="st-requisito-paso-text">
                        Ingresa tus datos fiscales y documentación requerida para validar 
                        tu identidad y solvencia económica.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="st-requisito-paso st-animate-on-scroll">
                      <div className="st-requisito-paso-number">3</div>
                      <h4 className="st-requisito-paso-title">PAGA TU GARANTÍA</h4>
                      <p className="st-requisito-paso-text">
                        Como es habitual en las subastas, deberás cubrir una garantía 
                        que asegure tu participación seria en el proceso.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="st-requisito-paso st-animate-on-scroll">
                      <div className="st-requisito-paso-number">4</div>
                      <h4 className="st-requisito-paso-title">RECIBE TU VALIDACIÓN</h4>
                      <p className="st-requisito-paso-text">
                        Una vez que completes tu expediente y garantía, recibirás la 
                        validación para participar en todas nuestras subastas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentación Requerida Section - Based on Screenshot 17 */}
      <section className="st-documentacion-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-documentacion-intro">
                <h2 className="st-documentacion-title">
                  Documentación Requerida
                </h2>
              </div>
              
              <div className="row">
                <div className="col-lg-6 mb-5">
                  <div className="st-documentacion-card st-animate-on-scroll">
                    <h3 className="st-documentacion-card-title">
                      <i className="fas fa-user"></i>
                      Personas Físicas
                    </h3>
                    <ul className="st-documentacion-list">
                      <li>
                        <i className="fas fa-id-card"></i>
                        Identificación oficial (INE, pasaporte o cédula profesional)
                      </li>
                      <li>
                        <i className="fas fa-file-invoice-dollar"></i>
                        Constancia de Situación Fiscal actualizada (no mayor a 3 meses)
                      </li>
                      <li>
                        <i className="fas fa-home"></i>
                        Comprobante de domicilio (no mayor a 3 meses)
                      </li>
                      <li>
                        <i className="fas fa-university"></i>
                        Estado de cuenta bancario (no mayor a 3 meses)
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-lg-6 mb-5">
                  <div className="st-documentacion-card st-animate-on-scroll">
                    <h3 className="st-documentacion-card-title">
                      <i className="fas fa-building"></i>
                      Personas Morales
                    </h3>
                    <ul className="st-documentacion-list">
                      <li>
                        <i className="fas fa-id-card"></i>
                        Identificación oficial del apoderado legal
                      </li>
                      <li>
                        <i className="fas fa-scroll"></i>
                        Acta constitutiva de la empresa
                      </li>
                      <li>
                        <i className="fas fa-stamp"></i>
                        Poder notarial del representante legal
                      </li>
                      <li>
                        <i className="fas fa-certificate"></i>
                        Cédula fiscal de la empresa
                      </li>
                      <li>
                        <i className="fas fa-chart-line"></i>
                        Estados financieros recientes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="st-documentacion-final-message st-animate-on-scroll">
                <div className="st-documentacion-final-card">
                  <i className="fas fa-check-circle"></i>
                  <h3 style={{color: 'white'}}>¡Listo, ahora puedes comenzar a ofertar inmuebles!</h3>
                  <p>Una vez que tengas toda tu documentación completa y validada, podrás participar en todas nuestras subastas inmobiliarias.</p>
                  <a href="/auth" className="st-documentacion-final-btn">
                    Comenzar Registro <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información Legal Section - Based on Screenshots 18-19 */}
      <section className="st-legal-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-legal-intro">
                <h2 className="st-legal-title">
                  Información Legal Importante
                </h2>
                <p className="st-legal-description">
                  Es importante y te recomendamos que consideres la siguiente información legal 
                  antes de participar en nuestras subastas inmobiliarias.
                </p>
              </div>
              
              <div className="st-legal-accordion">
                <h3 className="st-legal-section-title">Tipos de Venta</h3>
                <div className="st-accordion" id="tiposVentaAccordion">
                  
                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingOne">
                      <button className="st-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        1. Cesión de Derechos Adjudicatarios sin Posesión
                      </button>
                    </div>
                    <div id="collapseOne" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Se refiere a la transferencia de los derechos sobre un inmueble que ha sido adjudicado en remate, pero donde el comprador no tiene posesión física del bien.</p>
                      </div>
                    </div>
                  </div>

                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingTwo">
                      <button className="st-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        2. Cesión de Derechos Adjudicatarios con Posesión
                      </button>
                    </div>
                    <div id="collapseTwo" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Transferencia de derechos sobre un inmueble adjudicado en remate donde el comprador sí tiene posesión física del bien.</p>
                      </div>
                    </div>
                  </div>

                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingThree">
                      <button className="st-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        3. Cesión de Derechos de Dación en Pago con Posesión
                      </button>
                    </div>
                    <div id="collapseThree" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Transferencia de derechos sobre un inmueble recibido como dación en pago, donde el cesionario tendrá posesión del inmueble.</p>
                      </div>
                    </div>
                  </div>

                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingFour">
                      <button className="st-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                        4. Cesión de Derechos de Dación en Pago sin Posesión
                      </button>
                    </div>
                    <div id="collapseFour" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Transferencia de derechos sobre un inmueble recibido como dación en pago, donde el cesionario no tendrá posesión inmediata del inmueble.</p>
                      </div>
                    </div>
                  </div>

                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingFive">
                      <button className="st-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                        5. Venta en Escritura con Posesión
                      </button>
                    </div>
                    <div id="collapseFive" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Venta tradicional con escritura pública donde el comprador obtiene tanto la propiedad legal como la posesión física del inmueble.</p>
                      </div>
                    </div>
                  </div>

                  <div className="st-accordion-item">
                    <div className="st-accordion-header" id="headingSix">
                      <button className="st-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                        6. Venta en Escritura sin Posesión
                      </button>
                    </div>
                    <div id="collapseSix" className="st-accordion-collapse collapse" data-bs-parent="#tiposVentaAccordion">
                      <div className="st-accordion-body">
                        <p>Venta con escritura pública donde el comprador obtiene la propiedad legal pero no la posesión física inmediata del inmueble.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compradores;