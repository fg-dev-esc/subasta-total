/**
 * Utilidades centralizadas para el manejo de subastas
 * Lógica para badges de estado y timers en tiempo real
 */

/**
 * Verifica si una subasta/torre está activa
 * @param {Object} torre - Datos de la torre desde Firebase o API
 * @returns {boolean} - true si está activa, false si está cerrada
 */
export const isAuctionActive = (torre) => {
  if (!torre) return false;

  try {
    // Si fue adjudicada, no está activa
    if (torre.fueAdjudicado) {
      return false;
    }

    // Verificar fechaFin
    const endDate = getAuctionEndDate(torre);
    if (endDate) {
      const end = new Date(endDate);
      const now = new Date();

      if (!isNaN(end.getTime())) {
        return end > now;
      }
    }

    return false;
  } catch (error) {
    console.error('Error en isAuctionActive:', error);
    return false;
  }
};

/**
 * Obtiene la fecha de fin de una subasta
 * @param {Object} torre - Datos de la torre
 * @returns {string|null} - Fecha de fin en formato ISO o null
 */
export const getAuctionEndDate = (torre) => {
  const endDate = torre?.fechaFin || torre?.fechaVencimiento;

  if (endDate) {
    try {
      const dateObj = new Date(endDate);
      if (!isNaN(dateObj.getTime())) {
        return endDate;
      }
    } catch (error) {
      console.warn('Formato de fecha inválido:', endDate, error);
    }
  }

  return null;
};

/**
 * Obtiene la variante del badge según el estado
 * @param {boolean} isActive - Si la subasta está activa
 * @returns {string} - 'active' o 'closed'
 */
export const getBadgeVariant = (isActive) => {
  return isActive ? 'active' : 'closed';
};

/**
 * Obtiene el texto del badge según el estado
 * @param {boolean} isActive - Si la subasta está activa
 * @returns {string} - Texto a mostrar en el badge
 */
export const getBadgeText = (isActive) => {
  return isActive ? 'Activa' : 'Cerrada';
};

/**
 * Obtiene el ícono del badge según el estado
 * @param {boolean} isActive - Si la subasta está activa
 * @returns {string} - Clase del ícono FontAwesome
 */
export const getBadgeIcon = (isActive) => {
  return isActive ? 'fa-gavel' : 'fa-lock';
};

/**
 * Calcula el tiempo restante hasta una fecha
 * @param {string} endDate - Fecha de fin en formato ISO
 * @returns {Object} - Objeto con días, horas, minutos, segundos e isExpired
 */
export const calculateTimeLeft = (endDate) => {
  if (!endDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  try {
    const now = new Date().getTime();
    const targetDate = new Date(endDate).getTime();

    if (isNaN(targetDate)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    };
  } catch (error) {
    console.error('Error calculando tiempo restante:', error);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }
};

/**
 * Formatea el tiempo restante como string
 * @param {Object} timeLeft - Objeto con días, horas, minutos, segundos
 * @returns {string} - Tiempo formateado (ej: "5d 12:30:45" o "12:30:45")
 */

export const formatTimeLeft = (timeLeft) => {
  if (timeLeft.isExpired) return null;

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (timeLeft.days > 0) {
    return `${timeLeft.days}d ${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`;
  } else {
    return `${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`;
  }
};
