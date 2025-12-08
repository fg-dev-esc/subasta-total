import React from 'react';
import './carSpecifications.css';

const CarSpecifications = ({ propertyData }) => {
  if (!propertyData) return null;

  const specifications = propertyData.valores || propertyData.campos || [];

  return (
    <div className="st-car-specifications">
      <h3>Especificaciones</h3>

      {propertyData.descripcion && (
        <div className="st-spec-description">
          <h4>Descripción</h4>
          <p>{propertyData.descripcion}</p>
        </div>
      )}

      {specifications.length > 0 && (
        <div className="st-spec-list">
          <h4>Características</h4>
          <div className="st-spec-grid">
            {specifications.map((spec, index) => (
              <div key={index} className="st-spec-item">
                <span className="st-spec-label">{spec.campo}:</span>
                <span className="st-spec-value">{spec.valor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {propertyData.categoria && (
        <div className="st-spec-additional">
          <h4>Información Adicional</h4>
          <div className="st-spec-grid">
            <div className="st-spec-item">
              <span className="st-spec-label">Categoría:</span>
              <span className="st-spec-value">{propertyData.categoria}</span>
            </div>
            {propertyData.subCategoria && (
              <div className="st-spec-item">
                <span className="st-spec-label">Subcategoría:</span>
                <span className="st-spec-value">{propertyData.subCategoria}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSpecifications;
