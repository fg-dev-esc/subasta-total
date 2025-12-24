import React, { useState, useEffect } from 'react';
import { calculateTimeLeft, formatTimeLeft, isAuctionActive } from '../../utils/auctionHelpers';
import './auctionBadges.css';

/**
 * Componente de cuenta regresiva para subastas activas
 * Solo se muestra si la subasta está activa
 * Color rojo (#dc3545) para indicar urgencia
 *
 * @param {Object} props
 * @param {Object} props.torre - Datos de la torre desde Firebase/API
 * @param {string} props.endDate - Fecha de fin (opcional, se usa torre.fechaFin si no se provee)
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.position - Posición del timer ('top-right', 'top-left', etc.)
 */
const AuctionTimer = ({ torre, endDate, className = '', position = 'top-right' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Determinar la fecha de fin
  const finalEndDate = endDate || torre?.fechaFin;

  // Verificar si la subasta está activa
  const isActive = torre ? isAuctionActive(torre) : false;

  useEffect(() => {
    // Si no está activa o no hay fecha de fin, no hacer nada
    if (!isActive || !finalEndDate) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      });
      return;
    }

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft(finalEndDate);
      setTimeLeft(newTimeLeft);
    };

    // Actualizar inmediatamente
    updateTimer();

    // Actualizar cada segundo
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [finalEndDate, isActive]);

  // No mostrar si expiró o no está activa
  if (timeLeft.isExpired || !isActive) {
    return null;
  }

  const displayTime = formatTimeLeft(timeLeft);

  if (!displayTime) {
    return null;
  }

  return (
    <div className={`st-auction-timer st-timer-active st-timer-${position} ${className}`}>
      <i className="fas fa-clock"></i>
      <span>{displayTime}</span>
    </div>
  );
};

export default AuctionTimer;
