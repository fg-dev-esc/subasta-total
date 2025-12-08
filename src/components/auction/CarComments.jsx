import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { subscribeToAuction } from '../../utils/firebaseHelpers';
import AuctionTimer from '../ui/AuctionTimer';
import './carComments.css';

const CarComments = ({ torreID, propertyData }) => {
  const { user, isLoggedIn } = useSelector(state => state.user || {});
  const { ofertas = [], ofertaMayor } = useSelector(state => state.auction || {});

  const [comentarios, setComentarios] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!torreID) return;

    const unsubscribe = subscribeToAuction(torreID, (data) => {
      setComentarios(data.comentarios || []);
    });

    return () => unsubscribe();
  }, [torreID]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getLastOfferTime = () => {
    if (comentarios.length === 0) return 'Sin ofertas aún';

    const lastComment = comentarios[0]; // Ya vienen ordenados por fecha desc
    return new Date(lastComment.Fecha).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      // Aquí iría la lógica para enviar comentario a tu API
      console.log('Enviando comentario:', newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentBid = ofertaMayor?.monto || propertyData?.montoSalida || 0;
  const startingBid = propertyData?.montoSalida || 0;
  const totalBids = ofertas.length;
  const uniqueBidders = new Set(ofertas.map(o => o.UsuarioPujaID)).size;

  return (
    <div className="st-car-comments">
      <h3>Comentarios ({comentarios.length})</h3>

      {/* Estadísticas de la subasta - 2 filas de 3 elementos */}
      <div className="st-auction-stats">
        {/* Primera fila */}
        <div className="st-stats-row">
          <div className="st-stat-item">
            <small>Oferta Actual:</small>
            <strong className="st-stat-current-bid">{formatCurrency(currentBid)}</strong>
          </div>
          <div className="st-stat-item">
            <small>Oferta Inicial:</small>
            <strong>{formatCurrency(startingBid)}</strong>
          </div>
          <div className="st-stat-item">
            <small>Tiempo Restante:</small>
            {propertyData?.fechaFin ? (
              <AuctionTimer endDate={propertyData.fechaFin} displayMode="text" className="st-stat-timer" />
            ) : (
              <strong className="st-stat-calculating">Calculando...</strong>
            )}
          </div>
        </div>

        {/* Segunda fila */}
        <div className="st-stats-row st-stats-row-border">
          <div className="st-stat-item">
            <small>Total Ofertas:</small>
            <strong>{totalBids}</strong>
          </div>
          <div className="st-stat-item">
            <small>Participantes:</small>
            <strong>{uniqueBidders}</strong>
          </div>
          <div className="st-stat-item">
            <small>Última Oferta:</small>
            <strong>{getLastOfferTime()}</strong>
          </div>
        </div>
      </div>

      {/* Formulario de comentarios */}
      <div className="st-comments-form">
        <h3>Dejar un Comentario</h3>
        {!isLoggedIn ? (
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Inicia sesión para poder comentar este artículo.
          </div>
        ) : (
          <form onSubmit={handleSubmitComment}>
            <textarea
              className="st-comment-textarea"
              rows="5"
              placeholder="Tu Comentario*"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="st-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Enviar Comentario
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Lista de comentarios */}
      <div className="st-comments-list">
        {comentarios.map((comentario, index) => (
          <div key={index} className="st-comment-item">
            <div className="st-comment-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="st-comment-content">
              <h5>{comentario.NickName || 'Usuario'}</h5>
              <div className="st-comment-date">
                <i className="far fa-clock"></i>
                {new Date(comentario.Fecha).toLocaleString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <p>{comentario.Comentario}</p>
              <a href="#" className="st-comment-reply">
                <i className="far fa-reply"></i> Responder
              </a>
            </div>
          </div>
        ))}

        {comentarios.length === 0 && (
          <div className="st-no-comments">
            <i className="fas fa-comments fs-1 text-muted mb-3"></i>
            <p className="text-muted">No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarComments;
