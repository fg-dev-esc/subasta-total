import React, { useState, useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './contacto.css';

const Contacto = () => {
  useScrollTrigger();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.mensaje) {
      setSubmitMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage('Por favor, ingresa un email válido.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        mensaje: ''
      });
    } catch (error) {
      setSubmitMessage('Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contacto-page page-container">
      {/* Hero Section Contacto - Based on Homepage */}
      <section className="st-contacto-hero-section">
        <div className="st-contacto-hero-single">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-contacto-hero-content">
                  <div className="st-contacto-hero-sub-title">
                    Comunicación directa y personalizada
                  </div>
                  <h1 className="st-contacto-hero-title">
                    Estamos aquí para <span>ayudarte</span> en todo momento
                  </h1>
                  <p className="st-contacto-hero-description">
                    Contáctanos para resolver dudas, obtener asesoría personalizada o conocer más
                    sobre nuestras subastas.
                  </p>

                  {/* <div className="st-contacto-hero-btn">
                    <a href="#formulario" className="st-theme-btn">
                      Enviar Mensaje <i className="fas fa-envelope"></i>
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto Section */}
      <section className="st-contacto-form-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="st-contacto-form-card">
                <form onSubmit={handleSubmit} className="st-contacto-form">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="st-form-group">
                        <label htmlFor="nombre" className="st-form-label">
                          Nombre <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          className="st-form-control"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="st-form-group">
                        <label htmlFor="telefono" className="st-form-label">
                          Teléfono <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          className="st-form-control"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="Tu número de teléfono"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <div className="st-form-group">
                        <label htmlFor="email" className="st-form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="st-form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <div className="st-form-group">
                        <label htmlFor="mensaje" className="st-form-label">
                          Mensaje <span className="required">*</span>
                        </label>
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          className="st-form-control st-form-textarea"
                          rows="6"
                          value={formData.mensaje}
                          onChange={handleInputChange}
                          placeholder="Cuéntanos cómo podemos ayudarte..."
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="st-contacto-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="st-spinner"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar <i className="fas fa-paper-plane"></i>
                          </>
                        )}
                      </button>

                      {submitMessage && (
                        <div className={`st-submit-message ${submitMessage.includes('Gracias') ? 'success' : 'error'}`}>
                          {submitMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto Adicional */}
      <section className="st-contacto-info-section st-animate-on-scroll">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="st-contacto-info-card">
                <div className="st-contacto-info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h4 className="st-contacto-info-title">Teléfono</h4>
                <p className="st-contacto-info-text">
                  <a href="tel:+525610151625">+52 (56)1015-1625</a>
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="st-contacto-info-card">
                <div className="st-contacto-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h4 className="st-contacto-info-title">Email</h4>
                <p className="st-contacto-info-text">
                  <a href="mailto:atencion.compradores@subastatotal.com.mx">
                    atencion.compradores@subastatotal.com.mx
                  </a>
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 mb-4">
              <div className="st-contacto-info-card">
                <div className="st-contacto-info-icon">
                  <i className="fas fa-share-alt"></i>
                </div>
                <h4 className="st-contacto-info-title">Redes Sociales</h4>
                <div className="st-social-links">
                  <a href="https://facebook.com/subastatotal" target="_blank" rel="noopener noreferrer" className="st-social-link facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://instagram.com/subasta.total" target="_blank" rel="noopener noreferrer" className="st-social-link instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="st-social-link linkedin">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="st-social-link youtube">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;