import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import { fetchOfertasTorre, realizarOferta, clearOfertaExitosa, clearError } from '../../redux/features/auction/auctionSlice';
import './detalle.css';

const Detalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();
  useScrollTrigger();

  // Redux state
  const { ofertas, ofertaActual, totalOfertas, loadingOferta, error: ofertaError, ofertaExitosa } = useSelector(state => state.auction);

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [subastaId, setSubastaId] = useState(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        // Obtener directamente el detalle de la torre
        const torreResponse = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRE(id)));

        if (!torreResponse.ok) {
          throw new Error('Torre no encontrada');
        }

        const torreData = await torreResponse.json();
        setPropertyData(torreData);

        // Cargar ofertas con Redux
        dispatch(fetchOfertasTorre(id));

        // Buscar la subasta a la que pertenece para el boton de volver
        const subastasResponse = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_ALL));
        const subastasData = await subastasResponse.json();

        for (const subasta of subastasData) {
          const torresResponse = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRES(subasta.subastaID)));
          const torresData = await torresResponse.json();
          const torres = Array.isArray(torresData) ? torresData : [];

          if (torres.find(t => t.torreID === id)) {
            setSubastaId(subasta.subastaID);
            break;
          }
        }
      } catch (err) {
        setError('Error cargando los detalles del articulo');
        console.error('Error fetching property data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id, dispatch]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular estado del usuario en la subasta
  const userBidStatus = useMemo(() => {
    if (!isLoggedIn) {
      return {
        type: 'not_logged',
        title: 'Únete a nuestras subastas',
        subtitle: 'Regístrate gratis y accede a todas las subastas activas',
        icon: 'fas fa-user-plus',
        btnText: 'Registrarme',
        btnAction: () => navigate('/auth?tab=register'),
        alertClass: 'st-cta-primary'
      };
    }

    // Verificar si la subasta terminó
    const subastaTerminada = propertyData?.fechaFin && new Date(propertyData.fechaFin) < new Date();

    // Buscar ofertas del usuario actual
    const misOfertas = ofertas.filter(o => o.usuarioID === user?.usuarioID || o.usuario === user?.nombre);
    const miMejorOferta = misOfertas.length > 0 ? Math.max(...misOfertas.map(o => o.monto)) : 0;

    // Verificar si soy el mejor postor
    const soyMejorPostor = ofertaActual && (ofertaActual.usuarioID === user?.usuarioID || ofertaActual.usuario === user?.nombre);

    if (subastaTerminada) {
      if (soyMejorPostor) {
        return {
          type: 'winner',
          title: '¡Felicidades! Ganaste la Subasta',
          subtitle: 'Revisa tu email para los siguientes pasos',
          icon: 'fas fa-trophy',
          alertClass: 'st-cta-success'
        };
      } else if (misOfertas.length > 0) {
        return {
          type: 'lost',
          title: 'No ganaste esta subasta',
          subtitle: 'Sigue participando en otras subastas',
          icon: 'fas fa-heart',
          btnText: 'Ver otras subastas',
          btnAction: () => navigate('/subastas'),
          extraInfo: miMejorOferta,
          alertClass: 'st-cta-warning'
        };
      }
    } else {
      // Subasta activa
      if (soyMejorPostor) {
        return {
          type: 'winning',
          title: '¡Vas ganando!',
          subtitle: 'Eres la mejor oferta actual',
          icon: 'fas fa-crown',
          extraInfo: ofertaActual.monto,
          alertClass: 'st-cta-success'
        };
      } else if (misOfertas.length > 0) {
        const diferencia = ofertaActual ? ofertaActual.monto - miMejorOferta : 0;
        return {
          type: 'outbid',
          title: 'Te han superado',
          subtitle: `Te faltan ${formatPrice(diferencia + 1000)} para ser la mejor oferta`,
          icon: 'fas fa-arrow-up',
          btnText: 'Mejorar oferta',
          btnAction: () => setShowBidModal(true),
          extraInfo: miMejorOferta,
          alertClass: 'st-cta-warning'
        };
      }
    }

    // No ha participado
    return {
      type: 'no_bids',
      title: '¡Descubre Más Oportunidades!',
      subtitle: 'Haz clic aquí para ver todas las subastas activas',
      icon: 'fas fa-search',
      btnText: 'Ver subastas',
      btnAction: () => navigate('/subastas'),
      alertClass: 'st-cta-primary'
    };
  }, [isLoggedIn, user, ofertas, ofertaActual, propertyData, navigate]);

  const getPropertyImage = () => {
    if (propertyData?.imagenes && propertyData.imagenes.length > 0) {
      return propertyData.imagenes[0].url;
    }
    return propertyData?.urlImgPrincipal || '';
  };

  const [bidError, setBidError] = useState('');

  // Manejar oferta exitosa desde Redux
  useEffect(() => {
    if (ofertaExitosa) {
      setBidAmount('');
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowBidModal(false);
        dispatch(clearOfertaExitosa());
      }, 2000);
    }
  }, [ofertaExitosa, dispatch]);

  // Manejar errores de oferta desde Redux
  useEffect(() => {
    if (ofertaError) {
      setBidError(ofertaError);
      // Redirigir a login si no está autenticado
      if (ofertaError.includes('iniciar sesión')) {
        setTimeout(() => navigate('/auth'), 2000);
      }
    }
  }, [ofertaError, navigate]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const baseOferta = ofertaActual ? ofertaActual.monto : propertyData.montoSalida;
    const minOferta = baseOferta + 1000;

    if (!bidAmount || parseFloat(bidAmount) < minOferta) {
      setBidError(`La oferta mínima es ${formatPrice(minOferta)}`);
      return;
    }

    setBidError('');
    dispatch(clearError());
    dispatch(realizarOferta({ torreID: id, monto: parseFloat(bidAmount) }));
  };

  const handleGoBack = () => {
    if (subastaId) {
      navigate(`/subasta-detalle/${subastaId}`);
    } else {
      navigate('/subastas');
    }
  };


  if (error || (!loading && !propertyData)) {
    return (
      <div className="detalle-page page-container">
        <div className="container text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Artículo no encontrado'}
          </div>
          <button
            className="st-property-btn"
            style={{ width: 'auto' }}
            onClick={handleGoBack}
          >
            {subastaId ? 'Volver a Subasta' : 'Volver a Subastas'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-page page-container">
      {/* Navigation */}
      <section className="st-detalle-nav-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center mb-3">
                <button
                  className="st-property-btn-outline me-3"
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }}
                  onClick={handleGoBack}
                >
                  <i className="fas fa-arrow-left"></i>
                  {subastaId ? 'Volver a Subasta' : 'Volver a Subastas'}
                </button>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <span style={{color: '#21504c'}}>Subastas</span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {propertyData?.nombre || ''}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="st-detalle-content-section">
        <div className="container">
          <div className="row align-items-stretch">
            {/* Property Image */}
            <div className="col-lg-8">
              <div className="st-detalle-left-column">
                <div className="st-property-image-container">
                  {propertyData && (
                    <>
                      <img
                        src={getPropertyImage()}
                        alt={propertyData?.nombre || 'Articulo'}
                        className="st-property-main-image"
                      />
                      <div className="st-property-status-badge">
                        <span className="badge bg-success">
                          <i className="fas fa-gavel me-1"></i>
                          En Subasta
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Badge Dinámico */}
                <div className={`st-detalle-cta-badge flex-grow-1 d-flex align-items-stretch ${userBidStatus.alertClass}`}>
                  <div className="st-cta-badge-content d-flex flex-column justify-content-center w-100">
                    <div className="st-cta-badge-icon">
                      <i className={userBidStatus.icon}></i>
                    </div>
                    <div className="st-cta-badge-text">
                      <h4>{userBidStatus.title}</h4>
                      <p>{userBidStatus.subtitle}</p>
                    </div>
                    {userBidStatus.extraInfo && (
                      <div className="st-cta-extra-info">
                        <span className="st-cta-extra-label">
                          {userBidStatus.type === 'winning' ? 'Tu oferta' : 'Tu mejor oferta'}
                        </span>
                        <span className="st-cta-extra-monto">{formatPrice(userBidStatus.extraInfo)}</span>
                      </div>
                    )}
                    {userBidStatus.btnText && (
                      <button
                        className="st-property-btn"
                        style={{ width: 'auto' }}
                        onClick={userBidStatus.btnAction}
                      >
                        {userBidStatus.btnText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="col-lg-4">
              <div className="st-property-details-card">
                <div className="st-property-header">
                  <h1 className="st-property-title">{propertyData?.nombre || ''}</h1>
                </div>

                {propertyData && (
                  <>
                  {/* Oferta Actual */}
                  {ofertaActual && (
                    <div className="st-oferta-actual">
                      <span className="st-oferta-label">Oferta Actual</span>
                      <span className="st-oferta-monto">{formatPrice(ofertaActual.monto)}</span>
                      <span className="st-oferta-user">por {ofertaActual.usuario}</span>
                    </div>
                  )}

                  <div className="st-property-pricing st-starting-price">
                    <span className="st-price-label">Precio Inicial</span>
                    <span className="st-price-amount">{formatPrice(propertyData.montoSalida || 0)}</span>
                  </div>

                  {/* Botones Rápidos de Oferta */}
                  <div className="st-quick-bids">
                    <span className="st-quick-bids-label">Oferta Rápida</span>
                    <div className="st-quick-bids-buttons">
                      {[1000, 5000, 10000].map((increment) => {
                        const basePrice = ofertaActual ? ofertaActual.monto : propertyData.montoSalida;
                        const newBid = basePrice + increment;
                        return (
                          <button
                            key={increment}
                            className="st-quick-bid-btn"
                            onClick={() => {
                              setBidAmount(newBid.toString());
                              setShowBidModal(true);
                            }}
                          >
                            +${increment.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="st-property-info">
                    <div className="st-info-item">
                      <strong>Categoría:</strong> {propertyData.categoria}
                    </div>
                    <div className="st-info-item">
                      <strong>Subcategoría:</strong> {propertyData.subCategoria}
                    </div>
                    <div className="st-info-item">
                      <strong>Fecha Fin:</strong> {formatDate(propertyData.fechaFin)}
                    </div>
                    <div className="st-info-item">
                      <strong>Total Ofertas:</strong> {ofertas.length}
                    </div>
                  </div>

                  <div className="st-property-actions">
                    <button
                      className="st-property-btn"
                      onClick={() => setShowBidModal(true)}
                    >
                      <i className="fas fa-gavel"></i>
                      Hacer Oferta Personalizada
                    </button>
                    <button
                      className="st-property-btn-outline"
                      onClick={() => navigate('/contacto')}
                    >
                      <i className="fas fa-info-circle"></i>
                      Más Información
                    </button>
                  </div>
                </>
                )}
              </div>
            </div>

            {/* Property Description */}
            {propertyData && (
              <div className="row mt-5">
                <div className="col-12">
                  <div className="st-property-description-card">
                    <h3>Descripción del Artículo</h3>
                    <p>{propertyData.descripcion || ''}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Realizar Oferta</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowBidModal(false)}
                ></button>
              </div>
              <form onSubmit={handleBidSubmit}>
                <div className="modal-body">
                  {bidError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {bidError}
                    </div>
                  )}
                  {ofertaExitosa ? (
                    <div className="alert alert-success" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      Oferta exitosa por {formatPrice(ofertaExitosa)}
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label htmlFor="bidAmount" className="form-label">
                        Monto de la Oferta
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="Ingresa tu oferta"
                          step="1000"
                          disabled={loadingOferta}
                        />
                      </div>
                      <div className="form-text">
                        Oferta mínima: {formatPrice((ofertaActual ? ofertaActual.monto : propertyData.montoSalida) + 1000)}
                      </div>
                    </div>
                  )}
                </div>
                {!ofertaExitosa && (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => { setShowBidModal(false); setBidError(''); dispatch(clearError()); }}
                      disabled={loadingOferta}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="st-property-btn"
                      disabled={loadingOferta}
                    >
                      {loadingOferta ? 'Enviando...' : 'Confirmar Oferta'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detalle;