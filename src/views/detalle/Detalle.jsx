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

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        // En el contexto real, esto vendría del API
        // Por ahora, vamos a simular los datos basados en el ID
        const mockData = {
          torreID: id,
          numeroTorre: 1,
          nombre: `Propiedad ${id}`,
          descripcion: "Hermosa propiedad con excelente ubicación y acabados de primera calidad. Ideal para inversión o residencia.",
          montoSalida: 3500000,
          fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estado: "Ciudad de México",
          municipio: "Polanco",
          categoria: "Residencial",
          subCategoria: "Casa",
          foto: {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
          },
          estatusJuridico: "Libre de gravamen",
          tipoVenta: "Subasta pública",
          latLng: "19.4326,-99.1332"
        };
        
        // Simular delay del API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPropertyData(mockData);
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
    // Imagen única para detalle individual
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

  if (loading) {
    return (
      <div className="detalle-page page-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles de la propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="detalle-page page-container">
        <div className="container text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Propiedad no encontrada'}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/subastas')}
          >
            Volver a Subastas
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
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <button 
                      className="btn btn-link p-0"
                      onClick={() => navigate('/subastas')}
                    >
                      Subastas
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {propertyData.nombre}
                  </li>
                </ol>
              </nav>
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
                <img 
                  src={propertyData.foto?.url || getPlaceholderImage()}
                  alt={propertyData.nombre}
                  className="st-property-main-image"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage();
                  }}
                />
                <div className="st-property-status-badge">
                  <span className="badge bg-success">
                    <i className="fas fa-gavel me-1"></i>
                    En Subasta
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="col-lg-4">
              <div className="st-property-details-card">
                <div className="st-property-header">
                  <h1 className="st-property-title">{propertyData.nombre}</h1>
                  <p className="st-property-location">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {propertyData.municipio}, {propertyData.estado}
                  </p>
                </div>

                <div className="st-property-pricing st-starting-price">
                  <span className="st-price-label">Precio Inicial</span>
                  <span className="st-price-amount">{formatPrice(propertyData.montoSalida)}</span>
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
                    className="btn btn-primary btn-lg w-100 mb-3"
                    onClick={() => setShowBidModal(true)}
                  >
                    <i className="fas fa-hand-paper me-2"></i>
                    Hacer Puja
                  </button>
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate('/contacto')}
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    Más Información
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="st-property-description-card">
                <h3>Descripción de la Propiedad</h3>
                <p>{propertyData.descripcion}</p>
              </div>
            </div>
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
                  <button type="submit" className="btn btn-primary">
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