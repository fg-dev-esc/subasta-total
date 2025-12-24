import React from 'react';
import { isAuctionActive, getBadgeText, getBadgeIcon } from '../../utils/auctionHelpers';
import './auctionBadges.css';

/**
 * Badge unificado para mostrar el estado de una subasta
 * Muestra "ACTIVA" (verde oscuro) o "CERRADA" (gris)
 *
 * @param {Object} props
 * @param {Object} props.torre - Datos de la torre desde Firebase/API
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.position - Posición del badge ('top-left', 'top-right', etc.)
 */
const AuctionBadge = ({ torre, className = '', position = 'top-left' }) => {
  if (!torre) return null;

  const isActive = isAuctionActive(torre);
  const text = getBadgeText(isActive);
  const icon = getBadgeIcon(isActive);
  const variant = isActive ? 'active' : 'closed';

  return (
    <div className={`st-auction-badge st-badge-${variant} st-badge-${position} ${className}`}>
      <i className={`fas ${icon}`}></i>
      <span>{text}</span>
    </div>
  );
};

export default AuctionBadge;
