// Archivo de prueba para verificar conexión Firebase
import { db } from '../db/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Probando conexión a Firebase...');
    console.log('📦 Database instance:', db);

    // Intentar leer la colección 'torres'
    const torresRef = collection(db, 'torres');
    const snapshot = await getDocs(torresRef);

    console.log('✅ Conexión exitosa a Firebase!');
    console.log(`📊 Documentos encontrados en 'torres': ${snapshot.size}`);

    snapshot.forEach((doc) => {
      console.log(`📄 Documento ID: ${doc.id}`, doc.data());
    });

    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error);
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    return { success: false, error: error.message };
  }
};
