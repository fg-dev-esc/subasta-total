import React, { useState } from 'react';
import CarComments from './CarComments';
import CarSpecifications from './CarSpecifications';
import './carTabs.css';

const CarTabs = ({ propertyData, torreID }) => {
  const [activeTab, setActiveTab] = useState('comentarios');

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
        </div>

        {/* Tab Content */}
        <div className="st-tabs-content">
          {activeTab === 'especificaciones' && (
            <CarSpecifications propertyData={propertyData} />
          )}

          {activeTab === 'comentarios' && (
            <CarComments torreID={torreID} propertyData={propertyData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CarTabs;
