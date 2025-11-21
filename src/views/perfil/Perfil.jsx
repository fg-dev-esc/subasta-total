import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './perfil.css';

const Perfil = () => {
  useScrollTrigger();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, loading: authLoading, getToken } = useAuth();

  // Obtener tab del query parameter
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'ofertas' ? 'ofertas' : 'datos';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [ofertas, setOfertas] = useState([]);
  const [garantias, setGarantias] = useState([]);
  const [tipoGarantia, setTipoGarantia] = useState(null);
  const [loadingOfertas, setLoadingOfertas] = useState(false);
  const [loadingGarantias, setLoadingGarantias] = useState(false);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/auth?tab=login');
    }
  }, [authLoading, isLoggedIn, navigate]);

  // Actualizar tab cuando cambia la URL
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  // Cargar garantías del usuario
  useEffect(() => {
    const fetchGarantias = async () => {
      const token = getToken();
      if (!token) return;

      setLoadingGarantias(true);
      try {
        const [garantiasRes, tipoRes] = await Promise.all([
          fetch(buildUrl(API_CONFIG.COMPRADOR.GET_GARANTIAS), {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(buildUrl(API_CONFIG.COMPRADOR.GET_TIPO_GARANTIA), {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (garantiasRes.ok) {
          const data = await garantiasRes.json();
          setGarantias(data);
        }
        if (tipoRes.ok) {
          const data = await tipoRes.json();
          setTipoGarantia(data);
        }
      } catch (err) {
        console.error('Error fetching garantias:', err);
      } finally {
        setLoadingGarantias(false);
      }
    };

    if (isLoggedIn) {
      fetchGarantias();
    }
  }, [isLoggedIn, getToken]);

  // Cargar ofertas del usuario
  useEffect(() => {
    const fetchOfertas = async () => {
      const token = getToken();
      if (!token || !user?.usuarioID) return;

      setLoadingOfertas(true);
      try {
        // Primero obtener todas las subastas
        const subastasRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_ALL));
        const subastas = await subastasRes.json();

        const todasLasOfertas = [];

        // Por cada subasta, obtener las torres
        for (const subasta of subastas) {
          const torresRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRES(subasta.subastaID)));
          const torres = await torresRes.json();
          const torresArray = Array.isArray(torres) ? torres : [];

          // Por cada torre, verificar si el usuario tiene ofertas
          for (const torre of torresArray) {
            const pujasRes = await fetch(
              buildUrl(API_CONFIG.PUJAS.GET_PUJAS_USUARIO(user.usuarioID, torre.torreID)),
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (pujasRes.ok) {
              const pujas = await pujasRes.json();
              if (pujas && pujas.length > 0) {
                // Obtener detalles completos de la torre
                const torreDetalleRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRE(torre.torreID)));
                const torreDetalle = await torreDetalleRes.json();

                todasLasOfertas.push({
                  torre: {
                    ...torre,
                    ...torreDetalle
                  },
                  subasta,
                  pujas: pujas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
                  mejorOferta: Math.max(...pujas.map(p => p.monto))
                });
              }
            }
          }
        }

        setOfertas(todasLasOfertas);
      } catch (err) {
        console.error('Error fetching ofertas:', err);
      } finally {
        setLoadingOfertas(false);
      }
    };

    if (isLoggedIn && activeTab === 'ofertas') {
      fetchOfertas();
    }
  }, [isLoggedIn, user, activeTab, getToken]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/perfil?tab=${tab}`, { replace: true });
  };

  const getPropertyImage = (torre) => {
    if (torre?.imagenes && torre.imagenes.length > 0) {
      return torre.imagenes[0].url;
    }
    return torre?.urlImgPrincipal || '/assets/img/placeholder-property.jpg';
  };

  if (authLoading) {
    return (
      <div className="perfil-page page-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Obtener inicial del nombre
  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="perfil-page page-container">
      {/* Hero Section */}
      <section className="st-perfil-hero-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="st-perfil-hero-content">
                <div className="st-perfil-avatar">
                  {getInitial(user?.nombre)}
                </div>
                <div className="st-perfil-info">
                  <span className="st-perfil-greeting">Bienvenido</span>
                  <h1>{user?.nombre || 'Usuario'}</h1>
                  <p className="st-perfil-email">
                    <i className="fas fa-envelope me-2"></i>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="st-perfil-tabs-section">
        <div className="container">
          <div className="st-perfil-tabs">
            <button
              className={`st-perfil-tab ${activeTab === 'datos' ? 'active' : ''}`}
              onClick={() => handleTabChange('datos')}
            >
              <i className="fas fa-user"></i>
              Mis Datos
            </button>
            <button
              className={`st-perfil-tab ${activeTab === 'ofertas' ? 'active' : ''}`}
              onClick={() => handleTabChange('ofertas')}
            >
              <i className="fas fa-gavel"></i>
              Mis Ofertas
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="st-perfil-content-section">
        <div className="container">
          {activeTab === 'datos' && (
            <div className="st-perfil-datos">
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <div className="st-perfil-card">
                    <h3><i className="fas fa-id-card"></i> Información Personal</h3>
                    <div className="st-perfil-field">
                      <label>Nombre</label>
                      <p>{user?.nombre || '-'}</p>
                    </div>
                    <div className="st-perfil-field">
                      <label>Email</label>
                      <p>{user?.email || '-'}</p>
                    </div>
                    <div className="st-perfil-field">
                      <label>ID de Comprador</label>
                      <p className="st-perfil-id">{user?.compradorID || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mb-4">
                  <div className="st-perfil-card">
                    <h3><i className="fas fa-shield-alt"></i> Mi Garantía</h3>
                    {loadingGarantias ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {tipoGarantia && (
                          <div className="st-garantia-info">
                            <div className="st-garantia-badge">
                              <span className="st-garantia-nivel">{tipoGarantia.tipoGarantia?.nombre || 'Sin garantía'}</span>
                            </div>
                            <div className="st-garantia-details">
                              <div className="st-perfil-field">
                                <label>Monto de Garantía</label>
                                <p className="st-garantia-monto">{formatPrice(tipoGarantia.garantia || 0)}</p>
                              </div>
                              <div className="st-perfil-field">
                                <label>Puedes ofertar hasta</label>
                                <p>{formatPrice(tipoGarantia.tipoGarantia?.ofertarHasta || 0)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* {garantias.length > 0 && (
                          <div className="st-garantias-list mt-3">
                            <h5>Historial de Garantías</h5>
                            {garantias.map((g, idx) => (
                              <div key={idx} className="st-garantia-item">
                                <span className="st-garantia-descripcion">{g.descipcion}</span>
                                <span className="st-garantia-monto-sm">{formatPrice(g.monto)}</span>
                              </div>
                            ))}
                          </div>
                        )} */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ofertas' && (
            <div className="st-perfil-ofertas">
              {loadingOfertas ? (
                <div className="st-loading-ofertas">
                  <div className="st-loading-spinner"></div>
                  <p>Buscando tus ofertas...</p>
                </div>
              ) : ofertas.length === 0 ? (
                <div className="st-perfil-empty">
                  <i className="fas fa-gavel"></i>
                  <h3>No tienes ofertas activas</h3>
                  <p>Explora nuestras subastas y realiza tu primera oferta</p>
                  <button
                    className="st-property-btn"
                    onClick={() => navigate('/subastas')}
                  >
                    Ver Subastas
                  </button>
                </div>
              ) : (
                <div className="row">
                  {ofertas.map((oferta, index) => (
                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                      <div className="st-oferta-card">
                        <div className="st-oferta-image">
                          <img
                            src={getPropertyImage(oferta.torre)}
                            alt={oferta.torre.nombre}
                            onError={(e) => {
                              e.target.src = '/assets/img/placeholder-property.jpg';
                            }}
                          />
                          <div className="st-oferta-badge">
                            <span className="badge bg-success">
                              <i className="fas fa-gavel me-1"></i>
                              {oferta.pujas.length} {oferta.pujas.length === 1 ? 'oferta' : 'ofertas'}
                            </span>
                          </div>
                        </div>
                        <div className="st-oferta-content">
                          <h5 className="st-oferta-title">{oferta.torre.nombre}</h5>
                          <p className="st-oferta-location">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {oferta.torre.municipio || oferta.torre.estado || 'Sin ubicación'}
                          </p>
                          <div className="st-oferta-details">
                            <div className="st-oferta-detail">
                              <span className="label">Mi mejor oferta</span>
                              <span className="value text-success">{formatPrice(oferta.mejorOferta)}</span>
                            </div>
                            <div className="st-oferta-detail">
                              <span className="label">Precio inicial</span>
                              <span className="value">{formatPrice(oferta.torre.montoSalida)}</span>
                            </div>
                            <div className="st-oferta-detail">
                              <span className="label">Última oferta</span>
                              <span className="value text-muted">{formatDate(oferta.pujas[0].fecha)}</span>
                            </div>
                          </div>
                          <button
                            className="st-oferta-btn"
                            onClick={() => navigate(`/detalle/${oferta.torre.torreID}`)}
                          >
                            Ver Artículo
                            <i className="fas fa-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Perfil;
