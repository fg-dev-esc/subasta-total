import React from 'react';
import './auctionBadges.css';

const AuctionStatus = ({ isActive = true }) => {
  return (
    <div className={`st-auction-status-badge ${isActive ? 'active' : 'inactive'}`}>
      <i className={`fas ${isActive ? 'fa-gavel' : 'fa-lock'}`}></i>
      <span>{isActive ? 'Activa' : 'Finalizada'}</span>
    </div>
  );
};

export default AuctionStatus;
