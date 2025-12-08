// Script Node.js para probar Firebase desde la terminal
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Configuración Firebase (mismas credenciales que .env)
const firebaseConfig = {
  apiKey: "AIzaSyAtyiMRcbx5w6D754HFrTncKvJK01gn4D4",
  authDomain: "fir-subasta-63f80.firebaseapp.com",
  projectId: "fir-subasta-63f80",
  storageBucket: "fir-subasta-63f80.firebasestorage.app",
  messagingSenderId: "816161552046",
  appId: "1:816161552046:web:b48a2dca922f45c79cdf3f"
};

console.log('🔥 Iniciando prueba de conexión Firebase...\n');

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase inicializado correctamente');
console.log('📦 Database instance:', db.type, '\n');

// Función principal de prueba
async function testFirebase() {
  try {
    console.log('📊 Consultando colección "torres"...\n');

    const torresRef = collection(db, 'torres');
    const snapshot = await getDocs(torresRef);

    console.log(`✅ Conexión exitosa!`);
    console.log(`📈 Total de documentos encontrados: ${snapshot.size}\n`);

    if (snapshot.size === 0) {
      console.log('⚠️  No hay documentos en la colección "torres"');
      return;
    }

    console.log('📄 Documentos encontrados:\n');
    console.log('='.repeat(80));

    let count = 1;
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n${count}. ID: ${doc.id}`);
      console.log('-'.repeat(80));

      if (data.fechaFin) {
        console.log(`   📅 Fecha Fin: ${data.fechaFin}`);
      }

      if (data.pujas) {
        console.log(`   🏆 Pujas: ${data.pujas.length}`);
        if (data.pujas.length > 0) {
          const topPuja = data.pujas.sort((a, b) => b.Monto - a.Monto)[0];
          console.log(`   💰 Mayor puja: $${topPuja.Monto?.toLocaleString()} por ${topPuja.Nickname}`);
        }
      }

      if (data.comentarios) {
        console.log(`   💬 Comentarios: ${data.comentarios.length}`);
      }

      // Mostrar otros campos
      const otherFields = Object.keys(data).filter(
        key => !['fechaFin', 'pujas', 'comentarios'].includes(key)
      );
      if (otherFields.length > 0) {
        console.log(`   📋 Otros campos: ${otherFields.join(', ')}`);
      }

      count++;
    });

    console.log('\n' + '='.repeat(80));

    // Ejemplo: Obtener detalle de un documento específico
    console.log('\n🔍 Ejemplo: Obteniendo detalle del primer documento...\n');
    const firstDoc = snapshot.docs[0];
    const detailRef = doc(db, 'torres', firstDoc.id);
    const detailSnap = await getDoc(detailRef);

    if (detailSnap.exists()) {
      console.log('📄 Detalle completo del documento:');
      console.log(JSON.stringify(detailSnap.data(), null, 2));
    }

    console.log('\n✅ Prueba completada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante la prueba:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Ejecutar prueba
testFirebase();
