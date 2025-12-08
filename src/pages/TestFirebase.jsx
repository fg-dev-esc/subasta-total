import React, { useState, useEffect } from 'react';
import { db } from '../db/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { subscribeToAuction } from '../utils/firebaseHelpers';

const TestFirebase = () => {
  const [status, setStatus] = useState('Verificando conexión...');
  const [collections, setCollections] = useState([]);
  const [torres, setTorres] = useState([]);
  const [selectedTorre, setSelectedTorre] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [error, setError] = useState(null);

  // Probar conexión básica
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('🔥 Probando conexión a Firebase...');
      console.log('📦 Database instance:', db);

      // Intentar leer colección torres
      const torresRef = collection(db, 'torres');
      const snapshot = await getDocs(torresRef);

      setStatus(`✅ Conexión exitosa! Encontrados ${snapshot.size} documentos en 'torres'`);

      const torresData = [];
      snapshot.forEach((doc) => {
        torresData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setTorres(torresData);
      console.log('📊 Torres encontradas:', torresData);

    } catch (error) {
      setStatus('❌ Error de conexión');
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const loadTorreDetail = async (torreId) => {
    try {
      setSelectedTorre(torreId);
      const torreRef = doc(db, 'torres', torreId);
      const torreSnap = await getDoc(torreRef);

      if (torreSnap.exists()) {
        console.log('📄 Datos de torre:', torreSnap.data());
        setLiveData(torreSnap.data());
      }
    } catch (error) {
      console.error('Error cargando torre:', error);
    }
  };

  const subscribeTorre = (torreId) => {
    setSelectedTorre(torreId);
    console.log('👂 Escuchando cambios en tiempo real para:', torreId);

    const unsubscribe = subscribeToAuction(torreId, (data) => {
      console.log('🔄 Datos actualizados en tiempo real:', data);
      setLiveData(data);
    });

    return unsubscribe;
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh' }}>
      <h1>🧪 Test Firebase - Subasta Total</h1>

      <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Estado de Conexión</h2>
        <p style={{ fontSize: '18px' }}>{status}</p>
        {error && (
          <div style={{ backgroundColor: '#ff4444', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📊 Colección: torres</h2>
        <p>Total de documentos: <strong>{torres.length}</strong></p>

        {torres.length > 0 && (
          <div>
            <h3>Documentos encontrados:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {torres.map((torre) => (
                <li key={torre.id} style={{
                  backgroundColor: '#3d3d3d',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>ID:</strong> {torre.id}
                      {torre.fechaFin && (
                        <div style={{ marginTop: '5px', fontSize: '14px', color: '#aaa' }}>
                          Fecha fin: {torre.fechaFin}
                        </div>
                      )}
                      {torre.pujas && (
                        <div style={{ marginTop: '5px', fontSize: '14px', color: '#aaa' }}>
                          Pujas: {torre.pujas.length}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => loadTorreDetail(torre.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => subscribeTorre(torre.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Escuchar en Tiempo Real
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedTorre && liveData && (
        <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px' }}>
          <h2>📡 Datos en Tiempo Real - Torre: {selectedTorre}</h2>
          <pre style={{
            backgroundColor: '#1e1e1e',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '500px'
          }}>
            {JSON.stringify(liveData, null, 2)}
          </pre>

          {liveData.ofertas && liveData.ofertas.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>🏆 Top 5 Ofertas:</h3>
              <ul>
                {liveData.ofertas.map((oferta, idx) => (
                  <li key={idx}>
                    <strong>${oferta.Monto?.toLocaleString()}</strong> - {oferta.Nickname} ({oferta.Fecha})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {liveData.comentarios && liveData.comentarios.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>💬 Comentarios:</h3>
              <ul>
                {liveData.comentarios.slice(0, 5).map((comentario, idx) => (
                  <li key={idx}>
                    <strong>{comentario.Nickname}:</strong> {comentario.Comentario} ({comentario.Fecha})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#2d2d2d', borderRadius: '8px' }}>
        <h3>🔍 Instrucciones:</h3>
        <ol>
          <li>Verifica que la conexión sea exitosa (✅)</li>
          <li>Revisa los documentos encontrados en 'torres'</li>
          <li>Haz clic en "Ver Detalles" para ver los datos de una torre específica</li>
          <li>Haz clic en "Escuchar en Tiempo Real" para recibir actualizaciones automáticas</li>
          <li>Abre la consola del navegador (F12) para ver logs detallados</li>
        </ol>
      </div>
    </div>
  );
};

export default TestFirebase;
