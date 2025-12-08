import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from './useAuth';

/**
 * Hook para determinar el estado del usuario en la subasta
 * @param {string} torreID - ID de la torre/artículo
 * @returns {Object} Estado de la oferta del usuario
 */
export const useUserBidStatus = (torreID) => {
  const { user, isLoggedIn } = useAuth();
  const { ofertaMayor, ofertasFirebase = [] } = useSelector(state => state.auction || {});

  const userBidStatus = useMemo(() => {
    if (!isLoggedIn || !user?.usuarioID) {
      return null;
    }

    // Buscar ofertas del usuario actual
    const userBids = ofertasFirebase.filter(
      oferta => oferta.UsuarioPujaID === user.usuarioID
    );

    if (userBids.length === 0) {
      return {
        hasUserBid: false,
        isHighestBidder: false,
        userBidAmount: 0,
        currentHighest: ofertaMayor?.monto || 0
      };
    }

    // Obtener la oferta más alta del usuario
    const userHighestBid = Math.max(...userBids.map(b => b.Monto));

    // Verificar si el usuario es el postor más alto
    // Comparar tanto con usuario (usuarioID) como con el nombre por compatibilidad
    const isHighestBidder = ofertaMayor &&
      (ofertaMayor.usuario === user.usuarioID || ofertaMayor.usuario === user.nombre);

    return {
      hasUserBid: true,
      isHighestBidder,
      userBidAmount: userHighestBid,
      currentHighest: ofertaMayor?.monto || 0,
      totalUserBids: userBids.length
    };
  }, [isLoggedIn, user, ofertaMayor, ofertasFirebase]);

  return userBidStatus;
};

export default useUserBidStatus;
