import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
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
        // Buscar la propiedad en todas las subastas disponibles
        const subastasResponse = await fetch('https://demo-subasta.backend.secure9000.net/api/subasta/getSubastas');
        const subastasData = await subastasResponse.json();
        
        let foundProperty = null;
        
        // Buscar en cada subasta hasta encontrar la propiedad
        for (const subasta of subastasData) {
          try {
            const torresResponse = await fetch(`https://demo-subasta.backend.secure9000.net/api/subasta/getTorres/${subasta.subastaID}`);
            const torresData = await torresResponse.json();
            
            if (torresData.torres) {
              foundProperty = torresData.torres.find(torre => torre.torreID === id);
              if (foundProperty) {
                setSubastaId(subasta.subastaID);
                break;
              }
            }
          } catch (error) {
            console.error(`Error fetching torres for subasta ${subasta.subastaID}:`, error);
          }
        }
        
        if (foundProperty) {
          setPropertyData(foundProperty);
        } else {
          setError('Propiedad no encontrada');
        }
      } catch (err) {
        setError('Error cargando los detalles de la propiedad');
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

  const getPlaceholderImage = () => {
    // Si hay foto real, usarla; si no, usar placeholder
    if (propertyData?.foto?.url) {
      return propertyData.foto.url;
    }
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= propertyData.montoSalida) {
      alert('La puja debe ser mayor al precio inicial');
      return;
    }
    
    // Aquí iría la lógica para enviar la puja al backend
    alert(`¡Puja enviada por ${formatPrice(parseFloat(bidAmount))}!`);
    setShowBidModal(false);
    setBidAmount('');
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
            {error || 'Propiedad no encontrada'}
          </div>
          <button 
            className="st-destacados-cta-btn"
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
                  className="st-destacados-cta-btn me-3"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px'
                  }}
                  onClick={handleGoBack}
                >
                  <i className="fas fa-arrow-left me-2"></i>
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
          <div className="row">
            {/* Property Image */}
            <div className="col-lg-8 mb-4">
              <div className="st-property-image-container">
                {propertyData && (
                  <>
                    <img 
                      src={propertyData?.foto?.url || getPlaceholderImage()}
                      alt={propertyData?.nombre || 'Propiedad'}
                      className="st-property-main-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                      }}
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
            </div>

            {/* Property Details */}
            <div className="col-lg-4">
              <div className="st-property-details-card">
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
                      className="st-property-btn mb-3"
                      onClick={() => setShowBidModal(true)}
                    >
                      <i className="fas fa-hand-paper me-2"></i>
                      Hacer Puja
                    </button>
                    <button 
                      className="st-destacados-cta-btn w-100"
                      style={{
                        background: 'transparent',
                        border: '2px solid var(--st-green)',
                        color: 'var(--st-green)'
                      }}
                      onClick={() => navigate('/contacto')}
                    >
                      <i className="fas fa-info-circle me-2"></i>
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
                    <h3>Descripción de la Propiedad</h3>
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
                        step="1000"
                        required
                      />
                    </div>
                    <div className="form-text">
                      Precio mínimo: {formatPrice(propertyData.montoSalida)}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowBidModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="st-property-btn"
                  >
                    Confirmar Puja
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