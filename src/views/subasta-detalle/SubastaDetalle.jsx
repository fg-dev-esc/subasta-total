import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import './subasta-detalle.css';

const SubastaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useScrollTrigger();

  const [torres, setTorres] = useState([]);
  const [subastaInfo, setSubastaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTorres = async () => {
      try {
        setLoading(true);
        const response = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRES(id)));
        const data = await response.json();

        // La respuesta es un array directo de torres
        const torresData = Array.isArray(data) ? data : (data.torres || []);
        setTorres(torresData);
      } catch (err) {
        setError('Error cargando los articulos de la subasta');
        console.error('Error fetching torres:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTorres();
    }
  }, [id]);

  const handleViewProperty = (torreId) => {
    navigate(`/detalle/${torreId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
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

  const getPlaceholderImage = (index) => {
    // Array de imágenes de casas de Unsplash
    const houseImages = [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    // Retorna imagen basada en el índice, si no hay índice usa la primera
    return houseImages[index % houseImages.length] || houseImages[0];
  };

  if (loading) {
    return (
      <div className="subasta-detalle-page page-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subasta-detalle-page page-container">
        <div className="container text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            className="st-property-btn"
            style={{ width: 'auto' }}
            onClick={() => navigate('/subastas')}
          >
            Volver a Subastas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subasta-detalle-page page-container">
      {/* Hero Section */}
      <section className="st-subasta-detalle-hero-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center mb-4">
                <button
                  className="st-property-btn-outline me-3"
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '14px' }}
                  onClick={() => navigate('/subastas')}
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver a Subastas
                </button>
                <div>
                  <h1 className="mb-0">Artículos en Subasta</h1>
                  <p className="text-muted mb-0">ID de Subasta: {id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className="st-properties-grid-section">
        <div className="container">
          {torres.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-exclamation-circle text-muted mb-3" style={{fontSize: '4rem'}}></i>
              <h3 className="text-muted">No hay artículos disponibles</h3>
              <p className="text-muted">Esta subasta no tiene artículos registrados.</p>
            </div>
          ) : (
            <div className="row">
              {torres.map((torre, index) => (
                <div key={torre.torreID} className="col-lg-4 col-md-6 mb-4">
                  <div className="st-property-card">
                    <div className="st-property-image">
                      <img
                        src={torre.urlImgPrincipal || ''}
                        alt={torre.nombre}
                        className="img-fluid"
                      />
                      <div className="st-property-status">
                        <span className="badge bg-success">
                          <i className="fas fa-gavel me-1"></i>
                          En Subasta
                        </span>
                      </div>
                    </div>
                    
                    <div className="st-property-content">
                      <h5 className="st-property-title text-center">{torre.nombre}</h5>
                      
                      <div className="st-property-details">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted">Categoría:</small>
                            <br />
                            <strong>{torre.categoria}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Subcategoría:</small>
                            <br />
                            <strong>{torre.subCategoria}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="st-property-description">
                        <p>{torre.descripcion}</p>
                      </div>

                      <div className="st-property-specs-simple mb-3">
                        <div className="st-spec-simple">
                          <div className="st-spec-label">
                            <span className="text-muted">Precio Inicial</span>
                          </div>
                          <div className="st-spec-value fw-bold text-success">
                            $ {formatPrice(torre.montoSalida || 0)}
                          </div>
                        </div>
                        <div className="st-spec-simple">
                          <div className="st-spec-label">
                            <i className="fas fa-calendar-times text-danger me-2"></i>
                            <span className="text-muted">Fecha de Finalización</span>
                          </div>
                          <div className="st-spec-value fw-bold text-dark">{formatDate(torre.fechaFin)}</div>
                        </div>
                      </div>

                      <div className="st-property-actions mt-3">
                        <button 
                          className="st-property-btn"
                          onClick={() => handleViewProperty(torre.torreID)}
                        >
                          Ver Detalles y Ofertar
                          <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubastaDetalle;