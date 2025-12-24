import React, { useState } from 'react';
import CarComments from './CarComments';
import CarSpecifications from './CarSpecifications';
import './carTabs.css';

const CarTabs = ({ propertyData, torreID }) => {
  const [activeTab, setActiveTab] = useState('comentarios');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const documentos = propertyData?.documentos || [];

  const handleDocumentClick = (documento) => {
    setSelectedDocument(documento);
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  const isImage = (ext) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext?.toLowerCase());
  };

  const isPDF = (ext) => {
    return ext?.toLowerCase() === 'pdf';
  };

  return (
    <div className="st-car-tabs-section">
      <div className="container">
        {/* Tab Headers */}
        <div className="st-tabs-header">
          <button
            className={`st-tab-btn ${activeTab === 'especificaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('especificaciones')}
          >
            <i className="fas fa-cog"></i>
            <span>Especificaciones</span>
          </button>

          <button
            className={`st-tab-btn ${activeTab === 'comentarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('comentarios')}
          >
            <i className="fas fa-comments"></i>
            <span>Comentarios</span>
          </button>

          <button
            className={`st-tab-btn ${activeTab === 'documentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('documentos')}
          >
            <i className="fas fa-file-alt"></i>
            <span>Documentos</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="st-tabs-content">
          {activeTab === 'especificaciones' && (
            <CarSpecifications propertyData={propertyData} />
          )}

          {activeTab === 'comentarios' && (
            <CarComments torreID={torreID} propertyData={propertyData} />
          )}

          {activeTab === 'documentos' && (
            <div className="st-documentos-content">
              {documentos.length > 0 ? (
                <div className="st-documentos-list">
                  {documentos.map((documento) => (
                    <div
                      key={documento.articuloDocumentoID}
                      className="st-documento-item"
                      onClick={() => handleDocumentClick(documento)}
                    >
                      <div className="st-documento-icon">
                        {isImage(documento.ext) ? (
                          <i className="fas fa-image"></i>
                        ) : isPDF(documento.ext) ? (
                          <i className="fas fa-file-pdf"></i>
                        ) : (
                          <i className="fas fa-file"></i>
                        )}
                      </div>
                      <div className="st-documento-info">
                        <h4>{documento.nombre}</h4>
                        <span className="st-documento-ext">{documento.ext.toUpperCase()}</span>
                      </div>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="st-no-documentos">
                  <i className="fas fa-folder-open"></i>
                  <p>No hay documentos disponibles</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para visualizar documentos */}
      {showDocumentModal && selectedDocument && (
        <div className="st-document-modal-overlay" onClick={closeDocumentModal}>
          <div className="st-document-modal" onClick={(e) => e.stopPropagation()}>
            <div className="st-document-modal-header">
              <h3>{selectedDocument.nombre}</h3>
              <button className="st-modal-close" onClick={closeDocumentModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="st-document-modal-body">
              {isImage(selectedDocument.ext) ? (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.nombre}
                  className="st-document-image"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDocument.url)}&embedded=true`}
                  title={selectedDocument.nombre}
                  className="st-document-pdf"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarTabs;
