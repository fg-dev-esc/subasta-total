import React, { useState, useEffect } from 'react';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './auth.css';

const Auth = () => {
  useScrollTrigger();
  
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    tipoPersona: 'fisica',
    aceptaTerminos: false
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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      setSubmitMessage('Por favor, completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setSubmitMessage('Por favor, ingresa un email válido.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitMessage('¡Bienvenido! Inicio de sesión exitoso.');
      setLoginData({ email: '', password: '' });
    } catch (error) {
      setSubmitMessage('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!registerData.nombre || !registerData.apellidos || !registerData.email || 
        !registerData.telefono || !registerData.password || !registerData.confirmPassword) {
      setSubmitMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setSubmitMessage('Por favor, ingresa un email válido.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setSubmitMessage('Las contraseñas no coinciden.');
      return;
    }

    if (registerData.password.length < 8) {
      setSubmitMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!registerData.aceptaTerminos) {
      setSubmitMessage('Debes aceptar los términos y condiciones.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitMessage('¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
      setRegisterData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        tipoPersona: 'fisica',
        aceptaTerminos: false
      });
    } catch (error) {
      setSubmitMessage('Error en el registro. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page page-container">
      {/* Hero Section */}
      <section className="st-auth-hero-section">
        <div className="st-auth-hero">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="st-auth-hero-content">
                  <h1 className="st-auth-hero-title">
                    Portal de Acceso
                  </h1>
                  <p className="st-auth-hero-subtitle">
                    Inicia sesión o regístrate para participar en nuestras subastas inmobiliarias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formularios de Auth */}
      <section className="st-auth-forms-section st-animate-on-scroll">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="st-auth-forms-card">
                {/* Tabs */}
                <div className="st-auth-tabs">
                  <button 
                    className={`st-auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Iniciar Sesión
                  </button>
                  <button 
                    className={`st-auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                  >
                    <i className="fas fa-user-plus"></i>
                    Registrarse
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <div className="st-auth-form-container">
                    <h3 className="st-auth-form-title">
                      <i className="fas fa-user"></i>
                      Acceder a tu cuenta
                    </h3>
                    
                    <form onSubmit={handleLoginSubmit} className="st-auth-form">
                      <div className="st-form-group">
                        <label htmlFor="login-email" className="st-form-label">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="login-email"
                          name="email"
                          className="st-form-control"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>

                      <div className="st-form-group">
                        <label htmlFor="login-password" className="st-form-label">
                          Contraseña *
                        </label>
                        <input
                          type="password"
                          id="login-password"
                          name="password"
                          className="st-form-control"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Tu contraseña"
                          required
                        />
                      </div>

                      <div className="st-form-extras">
                        <label className="st-checkbox-label">
                          <input type="checkbox" className="st-checkbox" />
                          <span className="st-checkbox-text">Recordarme</span>
                        </label>
                        <a href="#" className="st-forgot-password">¿Olvidaste tu contraseña?</a>
                      </div>

                      <button
                        type="submit"
                        className="st-auth-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="st-spinner"></span>
                            Iniciando sesión...
                          </>
                        ) : (
                          <>
                            Iniciar Sesión <i className="fas fa-arrow-right"></i>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <div className="st-auth-form-container">
                    <h3 className="st-auth-form-title">
                      <i className="fas fa-user-plus"></i>
                      Crear nueva cuenta
                    </h3>
                    
                    <form onSubmit={handleRegisterSubmit} className="st-auth-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="st-form-group">
                            <label htmlFor="register-nombre" className="st-form-label">
                              Nombre *
                            </label>
                            <input
                              type="text"
                              id="register-nombre"
                              name="nombre"
                              className="st-form-control"
                              value={registerData.nombre}
                              onChange={handleRegisterChange}
                              placeholder="Tu nombre"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="st-form-group">
                            <label htmlFor="register-apellidos" className="st-form-label">
                              Apellidos *
                            </label>
                            <input
                              type="text"
                              id="register-apellidos"
                              name="apellidos"
                              className="st-form-control"
                              value={registerData.apellidos}
                              onChange={handleRegisterChange}
                              placeholder="Tus apellidos"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="st-form-group">
                        <label htmlFor="register-email" className="st-form-label">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="register-email"
                          name="email"
                          className="st-form-control"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>

                      <div className="st-form-group">
                        <label htmlFor="register-telefono" className="st-form-label">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          id="register-telefono"
                          name="telefono"
                          className="st-form-control"
                          value={registerData.telefono}
                          onChange={handleRegisterChange}
                          placeholder="+52 55 1234 5678"
                          required
                        />
                      </div>

                      <div className="st-form-group">
                        <label htmlFor="register-tipo" className="st-form-label">
                          Tipo de Persona *
                        </label>
                        <select
                          id="register-tipo"
                          name="tipoPersona"
                          className="st-form-control"
                          value={registerData.tipoPersona}
                          onChange={handleRegisterChange}
                          required
                        >
                          <option value="fisica">Persona Física</option>
                          <option value="moral">Persona Moral</option>
                        </select>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="st-form-group">
                            <label htmlFor="register-password" className="st-form-label">
                              Contraseña *
                            </label>
                            <input
                              type="password"
                              id="register-password"
                              name="password"
                              className="st-form-control"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              placeholder="Mínimo 8 caracteres"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="st-form-group">
                            <label htmlFor="register-confirm" className="st-form-label">
                              Confirmar Contraseña *
                            </label>
                            <input
                              type="password"
                              id="register-confirm"
                              name="confirmPassword"
                              className="st-form-control"
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              placeholder="Repite tu contraseña"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="st-form-group">
                        <label className="st-checkbox-label">
                          <input 
                            type="checkbox" 
                            className="st-checkbox"
                            name="aceptaTerminos"
                            checked={registerData.aceptaTerminos}
                            onChange={handleRegisterChange}
                            required
                          />
                          <span className="st-checkbox-text">
                            Acepto los <a href="#" className="st-link">términos y condiciones</a> y la <a href="#" className="st-link">política de privacidad</a>
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="st-auth-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="st-spinner"></span>
                            Registrando...
                          </>
                        ) : (
                          <>
                            Crear Cuenta <i className="fas fa-user-plus"></i>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`st-submit-message ${submitMessage.includes('exitoso') || submitMessage.includes('Bienvenido') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Registro */}
      <section className="st-auth-info-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="st-auth-info-content">
                <h3 className="st-auth-info-title">
                  ¿Qué necesitarás para registrarte?
                </h3>
                <div className="row">
                  <div className="col-lg-6">
                    <h4 className="st-auth-info-subtitle">Personas Físicas</h4>
                    <ul className="st-auth-requirements">
                      <li><i className="fas fa-id-card"></i>Identificación oficial (INE, pasaporte o cédula)</li>
                      <li><i className="fas fa-file-invoice-dollar"></i>Constancia de Situación Fiscal actualizada</li>
                      <li><i className="fas fa-home"></i>Comprobante de domicilio (no mayor a 3 meses)</li>
                      <li><i className="fas fa-university"></i>Estado de cuenta bancario (no mayor a 3 meses)</li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <h4 className="st-auth-info-subtitle">Personas Morales</h4>
                    <ul className="st-auth-requirements">
                      <li><i className="fas fa-user-tie"></i>Identificación del apoderado legal</li>
                      <li><i className="fas fa-file-contract"></i>Acta constitutiva de la empresa</li>
                      <li><i className="fas fa-stamp"></i>Poder notarial del representante</li>
                      <li><i className="fas fa-receipt"></i>Cédula fiscal de la empresa</li>
                      <li><i className="fas fa-chart-line"></i>Estados financieros recientes</li>
                    </ul>
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

export default Auth;