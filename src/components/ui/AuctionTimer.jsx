import React, { useState, useEffect } from 'react';
import './auctionBadges.css';

const AuctionTimer = ({ endDate, displayMode = 'badge' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const formatTime = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
    }
    return `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  };

  // Si displayMode es 'text', solo retornar el texto con icono
  if (displayMode === 'text') {
    return (
      <strong className="st-timer-text">
        <i className="far fa-clock"></i> {formatTime()}
      </strong>
    );
  }

  // Por defecto, mostrar el badge completo
  return (
    <div className="st-auction-timer-badge">
      <i className="fas fa-clock"></i>
      <span>{formatTime()}</span>
    </div>
  );
};

export default AuctionTimer;
