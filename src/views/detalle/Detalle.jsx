import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import './detalle.css';

const Detalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useScrollTrigger();

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
  }, [id]);

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

  const getPropertyImage = () => {
    if (propertyData?.imagenes && propertyData.imagenes.length > 0) {
      return propertyData.imagenes[0].url;
    }
    return propertyData?.urlImgPrincipal || '';
  };

  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= propertyData.montoSalida) {
      setBidError('La puja debe ser mayor al precio inicial');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setBidError('Debes iniciar sesion para hacer una puja');
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    setBidLoading(true);
    setBidError('');

    try {
      const response = await fetch(buildUrl(API_CONFIG.PUJAS.PUJAR), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          torreID: id,
          monto: parseFloat(bidAmount)
        })
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || 'Error al realizar la puja');
      }

      alert(`Puja exitosa por ${formatPrice(parseFloat(bidAmount))}`);
      setShowBidModal(false);
      setBidAmount('');
    } catch (err) {
      setBidError(err.message);
    } finally {
      setBidLoading(false);
    }
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
            <div className="col-lg-8 mb-4">
              <div className="st-detalle-left-column d-flex flex-column" style={{ height: '100%' }}>
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

                {/* CTA Badge */}
                <div className="st-detalle-cta-badge flex-grow-1 d-flex align-items-stretch">
                  <div className="st-cta-badge-content d-flex flex-column justify-content-center w-100">
                    <div className="st-cta-badge-icon">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <div className="st-cta-badge-text">
                      <h4>Únete a nuestras subastas</h4>
                      <p>Regístrate gratis y accede a todas las subastas activas</p>
                    </div>
                    <button
                      className="st-property-btn"
                      style={{ width: 'auto' }}
                      onClick={() => navigate('/auth?tab=register')}
                    >
                      Registrarme
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="col-lg-4">
              <div className="st-property-details-card" style={{ height: '100%' }}>
                <div className="st-property-header">
                  <h1 className="st-property-title">{propertyData?.nombre || ''}</h1>
                  <p className="st-property-location">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {propertyData?.municipio && propertyData?.estado ? `${propertyData.municipio}, ${propertyData.estado}` : ''}
                  </p>
                </div>

                {propertyData && (
                  <>
                  <div className="st-property-pricing st-starting-price">
                    <span className="st-price-label">Precio Inicial</span>
                    <span className="st-price-amount">{formatPrice(propertyData.montoSalida || 0)}</span>
                  </div>

                  <div className="st-property-info">
                    <div className="st-info-item">
                      <strong>Categoría:</strong> {propertyData.categoria}
                    </div>
                    <div className="st-info-item">
                      <strong>Subcategoría:</strong> {propertyData.subCategoria}
                    </div>
                    <div className="st-info-item">
                      <strong>Status Jurídico:</strong> {propertyData.estatusJuridico}
                    </div>
                    <div className="st-info-item">
                      <strong>Tipo de Venta:</strong> {propertyData.tipoVenta}
                    </div>
                    <div className="st-info-item">
                      <strong>Fecha Fin:</strong> {formatDate(propertyData.fechaFin)}
                    </div>
                  </div>

                  <div className="st-property-actions">
                    <button
                      className="st-property-btn"
                      onClick={() => setShowBidModal(true)}
                    >
                      <i className="fas fa-gavel"></i>
                      Hacer Puja
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
                <h5 className="modal-title">Realizar Puja</h5>
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
                      {bidError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="bidAmount" className="form-label">
                      Monto de la Puja
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Ingresa tu puja"
                        min={propertyData.montoSalida + 1}
                        step="1"
                        required
                        disabled={bidLoading}
                      />
                    </div>
                    <div className="form-text">
                      Precio minimo: {formatPrice(propertyData.montoSalida)}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setShowBidModal(false); setBidError(''); }}
                    disabled={bidLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="st-property-btn"
                    disabled={bidLoading}
                  >
                    {bidLoading ? 'Enviando...' : 'Confirmar Puja'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detalle;