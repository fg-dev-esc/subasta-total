import React, { useState } from 'react';
import AuctionBadge from '../ui/AuctionBadge';
import AuctionTimer from '../ui/AuctionTimer';
import './carImages.css';

const CarImages = ({ propertyData, userBidStatus }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const imagenes = propertyData?.imagenes || [];
  const totalImages = imagenes.length;

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!propertyData) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="col-lg-8">
        {/* Imagen principal con badges */}
        <div className="st-car-single-main-image">
          {/* Badge Estado: ACTIVA / CERRADA - esquina superior izquierda */}
          <AuctionBadge torre={propertyData} position="top-left" />

          {/* Timer de cuenta regresiva - esquina superior derecha (solo si activa) */}
          <AuctionTimer torre={propertyData} position="top-right" />

          {/* Imagen principal */}
          <div className="st-main-image-container" onClick={openModal}>
            {imagenes.length > 0 && (
              <img
                src={imagenes[currentImageIndex].url}
                alt={imagenes[currentImageIndex].nombre || `Imagen ${currentImageIndex + 1}`}
                className="st-main-image"
              />
            )}

            {/* Navegación en imagen */}
            {totalImages > 1 && (
              <>
                <button
                  className="st-image-nav-btn st-prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <button
                  className="st-image-nav-btn st-next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>

                {/* Indicador de posición */}
                <div className="st-image-position">
                  {currentImageIndex + 1} / {totalImages}
                </div>
              </>
            )}

            {/* Overlay info - Click para ampliar */}
            <div className="st-image-overlay-info">
              <i className="fas fa-search-plus"></i>
              <span>Click para ampliar</span>
            </div>
          </div>
        </div>

        {/* Galería de miniaturas */}
        {totalImages > 1 && (
          <div className="st-thumbnails-gallery">
            <div className="st-thumbnails-container">
              {imagenes.map((img, index) => (
                <div
                  key={img.articuloDocumentoID || index}
                  className={`st-thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={img.url}
                    alt={img.nombre || `Miniatura ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badge dinámico según estado del usuario */}
        {!userBidStatus && (
          /* Usuario NO logueado */
          <div className="st-user-bid-status-badge alert alert-info">
            <div className="st-badge-content">
              <div className="st-badge-header">
                <i className="fas fa-user-plus"></i>
                <strong>¡Completa tu registro!</strong>
              </div>
              <div className="st-badge-subtitle">
                Regístrate para participar en esta subasta
              </div>
            </div>
          </div>
        )}

        {userBidStatus && userBidStatus.isHighestBidder && (
          /* Usuario va GANANDO */
          <div className="st-user-bid-status-badge alert alert-success">
            <div className="st-badge-content">
              <div className="st-badge-header">
                <i className="fas fa-trophy"></i>
                <strong>¡Vas ganando!</strong>
              </div>
              <div className="st-badge-subtitle">
                Eres la oferta más alta actual
              </div>
              <div className="st-badge-amount">
                <span className="st-badge-label">Tu oferta</span>
                <span className="st-badge-monto">
                  {formatCurrency(userBidStatus.userBidAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {userBidStatus && !userBidStatus.isHighestBidder && userBidStatus.hasUserBid && (
          /* Usuario ofertó pero NO va ganando */
          <div className="st-user-bid-status-badge alert alert-warning">
            <div className="st-badge-content">
              <div className="st-badge-header">
                <i className="fas fa-exclamation-triangle"></i>
                <strong>No vas ganando</strong>
              </div>
              <div className="st-badge-subtitle">
                Tu oferta: {formatCurrency(userBidStatus.userBidAmount)}
              </div>
              <div className="st-badge-amount">
                <span className="st-badge-label">Necesitas ofertar mínimo</span>
                <span className="st-badge-monto">
                  {formatCurrency(userBidStatus.currentHighest + 1000)}
                </span>
                <small className="d-block mt-1">
                  (Te faltan {formatCurrency((userBidStatus.currentHighest + 1000) - userBidStatus.userBidAmount)})
                </small>
              </div>
            </div>
          </div>
        )}

        {userBidStatus && !userBidStatus.hasUserBid && (
          /* Usuario logueado pero NO ha ofertado */
          <div className="st-user-bid-status-badge alert alert-primary">
            <div className="st-badge-content">
              <div className="st-badge-header">
                <i className="fas fa-gavel"></i>
                <strong>¡Haz tu primera oferta!</strong>
              </div>
              <div className="st-badge-subtitle">
                Para llevar la delantera, ofrece mínimo
              </div>
              <div className="st-badge-amount">
                <span className="st-badge-monto">
                  {formatCurrency(userBidStatus.currentHighest + 1000)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal fullscreen */}
      {showModal && (
        <div className="st-image-modal" onClick={closeModal}>
          <button className="st-modal-close" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>

          {totalImages > 1 && (
            <>
              <button
                className="st-modal-nav-btn st-modal-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <button
                className="st-modal-nav-btn st-modal-next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              <div className="st-modal-position">
                {currentImageIndex + 1} / {totalImages}
              </div>
            </>
          )}

          <div className="st-modal-image-wrapper">
            <img
              src={imagenes[currentImageIndex].url}
              alt={imagenes[currentImageIndex].nombre || ''}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CarImages;
