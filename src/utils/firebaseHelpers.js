import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../db/firebase';

// listener subasta tiempo real - siguiendo patrón template
export const subscribeToAuction = (torreId, callback) => {
  const torreRef = doc(db, 'torres', torreId);

  return onSnapshot(torreRef, (documento) => {
    if (documento.exists()) {
      const data = documento.data();
      const fechaFin = data.fechaFin;
      const comentarios = data.comentarios?.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha)) || [];
      // usar 'pujas' desde Firebase, no 'ofertas'
      const ofertas = data.pujas?.sort((a, b) => b.Monto - a.Monto) || [];


      callback({
        id: documento.id,
        fechaFin,
        comentarios,
        pujas: ofertas, // todas las pujas
        ofertas: ofertas.slice(0, 5), // solo top 5 ofertas compatibilidad
        ofertaMayor: ofertas.length > 0 ? {
          monto: ofertas[0].Monto,
          usuario: ofertas[0].UsuarioPujaID || ofertas[0].UsuarioOfertaID
        } : null,
        ...data
      });
    } else {
    }
  }, (error) => {
    console.error('error en suscripción firebase:', error);
    console.error('código de error:', error.code);
    console.error('mensaje de error:', error.message);
  });
};

// agregar oferta a subasta - patrón template
export const addBidToAuction = async (torreId, bidData) => {
  const torreRef = doc(db, 'torres', torreId);

  const oferta = {
    Monto: bidData.monto,
    UsuarioOfertaID: bidData.usuarioID,
    Nickname: bidData.nickname,
    Fecha: new Date().toISOString(),
    Comentario: bidData.comentario || ""
  };

  await updateDoc(torreRef, {
    ofertas: arrayUnion(oferta)
  });
};

// agregar comentario a subasta - patrón template
export const addCommentToAuction = async (torreId, commentData) => {
  const torreRef = doc(db, 'torres', torreId);

  const comentario = {
    Comentario: commentData.comentario,
    UsuarioID: commentData.usuarioID,
    Nickname: commentData.nickname,
    Rating: commentData.rating || 5,
    Fecha: new Date().toISOString()
  };

  try {
    await updateDoc(torreRef, {
      comentarios: arrayUnion(comentario)
    });
  } catch (error) {
    console.error('error agregando comentario a firebase:', error);
    console.error('código de error:', error.code);
    console.error('mensaje de error:', error.message);
    throw error;
  }
};

// listener listados autos tiempo real
export const subscribeToCarListings = (callback) => {
  const carsRef = doc(db, 'listings', 'active');

  return onSnapshot(carsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().cars || []);
    }
  });
};

// manejo sesión usuario
export const updateUserSession = async (userId, sessionData) => {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    lastActivity: serverTimestamp(),
    ...sessionData
  });
};
