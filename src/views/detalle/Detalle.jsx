import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../db/firebase';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import { useAuth } from '../../hooks/useAuth';
import { useUserBidStatus } from '../../hooks/useUserBidStatus';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import {
  fetchOfertasTorre,
  realizarOferta,
  clearOfertaExitosa,
  clearError,
  setFechaFin,
  setOfertaMayor,
  setComentarios,
  setOfertasFirebase
} from '../../redux/features/auction/auctionSlice';

// Nuevos componentes
import CarImages from '../../components/auction/CarImages';
import CarTabs from '../../components/auction/CarTabs';

import './detalle.css';

const Detalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();
  useScrollTrigger();

  // Redux state
  const {
    ofertas,
    ofertaActual,
    loadingOferta,
    error: ofertaError,
    ofertaExitosa,
    ofertaMayor
  } = useSelector(state => state.auction);

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [subastaId, setSubastaId] = useState(null);
  const [bidError, setBidError] = useState('');

  // Hook para detectar si usuario va ganando
  const userBidStatus = useUserBidStatus(id);

  // Cargar datos iniciales de la torre desde API
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const torreResponse = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRE(id)));

        if (!torreResponse.ok) {
          throw new Error('Torre no encontrada');
        }

        const torreData = await torreResponse.json();
        setPropertyData(torreData);

        // Cargar ofertas con Redux
        dispatch(fetchOfertasTorre(id));

        // Buscar subasta padre
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
        setError('Error cargando los detalles del artículo');
        console.error('Error fetching property data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id, dispatch]);

  // Conectar Firebase para tiempo real
  useEffect(() => {
    if (!id) return;

    console.log('🔥 Conectando a Firebase para torre:', id);

    const unsubscribe = onSnapshot(
      doc(db, 'torres', id),
      (documento) => {
        if (documento.exists()) {
          const data = documento.data();
          console.log('📡 Datos de Firebase actualizados:', data);

          // Actualizar Redux con datos de Firebase
          dispatch(setFechaFin(data.fechaFin));

          // Ordenar comentarios por fecha descendente
          const comentarios = (data.comentarios || []).sort(
            (a, b) => new Date(b.Fecha) - new Date(a.Fecha)
          );
          dispatch(setComentarios(comentarios));

          // Ordenar ofertas/pujas por monto descendente
          const ofertas = (data.pujas || []).sort((a, b) => b.Monto - a.Monto);
          dispatch(setOfertasFirebase(ofertas));

          // Actualizar oferta mayor
          if (ofertas.length > 0) {
            dispatch(setOfertaMayor({
              monto: ofertas[0].Monto,
              usuario: ofertas[0].UsuarioPujaID
            }));
          }
        }
      },
      (error) => {
        console.error('❌ Error en suscripción Firebase:', error);
      }
    );

    return () => {
      console.log('🔌 Desconectando de Firebase');
      unsubscribe();
    };
  }, [id, dispatch]);

  // Limpiar al desmontar
  useEffect(() => {
    document.body.classList.add('loading');
    const timer = setTimeout(() => {
      document.body.classList.remove('loading');
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loading');
    };
  }, []);

  // Manejar oferta exitosa
  useEffect(() => {
    if (ofertaExitosa) {
      setBidAmount('');
      setTimeout(() => {
        setShowBidModal(false);
        dispatch(clearOfertaExitosa());
      }, 2000);
    }
  }, [ofertaExitosa, dispatch]);

  // Manejar errores
  useEffect(() => {
    if (ofertaError) {
      setBidError(ofertaError);
      if (ofertaError.includes('iniciar sesión')) {
        setTimeout(() => navigate('/auth'), 2000);
      }
    }
  }, [ofertaError, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const hour12 = hours % 12 || 12;
    const formattedHour = String(hour12).padStart(2, '0');

    return `${day}/${month}/${year} ${formattedHour}:${minutes} ${ampm}`;
  };

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

  if (loading) {
    return (
      <div className="detalle-page page-container">
        <div className="container text-center py-5">
          <div className="st-loading-spinner"></div>
          <p className="mt-3">Cargando detalles...</p>
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
                      <span style={{ color: '#21504c' }}>Subastas</span>
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
      {/* <section className="st-detalle-content-section"> */}
        <div className="container">
          <div className="row align-items-stretch">
            {/* Carrusel de imágenes con badges - Componente nuevo */}
            <CarImages propertyData={propertyData} userBidStatus={userBidStatus} />

            {/* Property Details - Columna derecha (mantener tu código actual) */}
            <div className="col-lg-4">
              <div className="st-property-details-card">
                <div className="st-property-header">
                  <h1 className="st-property-title">{propertyData?.nombre || ''}</h1>
                </div>

                {propertyData && (
                  <>
                    {/* Oferta Actual */}
                    {(ofertaMayor || ofertaActual) && (
                      <div className="st-oferta-actual">
                        <span className="st-oferta-label">Oferta Actual</span>
                        <span className="st-oferta-monto">
                          {formatPrice(ofertaMayor?.monto || ofertaActual?.monto)}
                        </span>
                      </div>
                    )}

                    {/* Precio Inicial - Comentado */}
                    {/* <div className="st-property-pricing st-starting-price">
                      <span className="st-price-label">Precio Inicial</span>
                      <span className="st-price-amount">{formatPrice(propertyData.montoSalida || 0)}</span>
                    </div> */}

                    {/* Botones Rápidos de Oferta */}
                    <div className="st-quick-bids">
                      <span className="st-quick-bids-label">Oferta Rápida</span>
                      <div className="st-quick-bids-buttons">
                        {[1000, 5000, 10000].map((increment) => {
                          const basePrice = ofertaMayor?.monto || ofertaActual?.monto || propertyData.montoSalida;
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
          </div>
        </div>
      {/* </section> */}

      {/* Tabs Section - Componente nuevo */}
      <CarTabs propertyData={propertyData} torreID={id} />

      {/* Bid Modal */}
      {showBidModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1055,
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '500px', margin: '0 auto', width: '90%' }}
          >
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
                        Oferta mínima: {formatPrice(((ofertaMayor?.monto || ofertaActual?.monto || propertyData.montoSalida) + 1000))}
                      </div>
                    </div>
                  )}
                </div>
                {!ofertaExitosa && (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowBidModal(false);
                        setBidError('');
                        dispatch(clearError());
                      }}
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
