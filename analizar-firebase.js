// Script para analizar estructura completa de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtyiMRcbx5w6D754HFrTncKvJK01gn4D4",
  authDomain: "fir-subasta-63f80.firebaseapp.com",
  projectId: "fir-subasta-63f80",
  storageBucket: "fir-subasta-63f80.firebasestorage.app",
  messagingSenderId: "816161552046",
  appId: "1:816161552046:web:b48a2dca922f45c79cdf3f"
};

console.log('🔥 ANÁLISIS COMPLETO DE FIREBASE - PROYECTO fir-subasta-63f80\n');
console.log('='.repeat(100));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function analizarFirebase() {
  try {
    console.log('\n📦 INFORMACIÓN DEL PROYECTO:');
    console.log('-'.repeat(100));
    console.log('Proyecto ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
    console.log('Storage Bucket:', firebaseConfig.storageBucket);
    console.log('App ID:', firebaseConfig.appId);

    // Lista de colecciones a revisar (conocidas)
    const coleccionesConocidas = [
      'torres',
      'users',
      'listings',
      'subastas',
      'vehiculos',
      'ofertas',
      'pujas',
      'comentarios',
      'sesiones',
      'configuracion'
    ];

    console.log('\n\n📊 ANÁLISIS DE COLECCIONES:\n');
    console.log('='.repeat(100));

    const coleccionesEncontradas = [];

    for (const nombreColeccion of coleccionesConocidas) {
      try {
        const colRef = collection(db, nombreColeccion);
        const q = query(colRef, limit(1));
        const snapshot = await getDocs(colRef);

        if (snapshot.size > 0) {
          coleccionesEncontradas.push({
            nombre: nombreColeccion,
            documentos: snapshot.size
          });

          console.log(`\n✅ Colección: ${nombreColeccion.toUpperCase()}`);
          console.log('-'.repeat(100));
          console.log(`   Total de documentos: ${snapshot.size}`);

          // Obtener estructura del primer documento
          const primerDoc = snapshot.docs[0];
          const campos = Object.keys(primerDoc.data());
          console.log(`   Campos del primer documento: ${campos.join(', ')}`);

          // Mostrar ejemplo de datos (primeros 3 documentos)
          console.log(`\n   📄 Ejemplos de documentos (primeros 3):`);
          let count = 0;
          snapshot.forEach((doc) => {
            if (count < 3) {
              console.log(`      ${count + 1}. ID: ${doc.id}`);
              const data = doc.data();
              // Mostrar resumen de datos
              Object.keys(data).slice(0, 5).forEach(key => {
                const value = data[key];
                let displayValue = value;
                if (Array.isArray(value)) {
                  displayValue = `Array(${value.length})`;
                } else if (typeof value === 'object' && value !== null) {
                  displayValue = 'Object{...}';
                } else if (typeof value === 'string' && value.length > 50) {
                  displayValue = value.substring(0, 50) + '...';
                }
                console.log(`         - ${key}: ${displayValue}`);
              });
              count++;
            }
          });
        }
      } catch (error) {
        // Colección no existe o no hay permisos
      }
    }

    // Análisis detallado de la colección 'torres'
    console.log('\n\n🎯 ANÁLISIS DETALLADO - COLECCIÓN TORRES:\n');
    console.log('='.repeat(100));

    const torresRef = collection(db, 'torres');
    const torresSnapshot = await getDocs(torresRef);

    console.log(`Total de torres: ${torresSnapshot.size}\n`);

    let conPujas = 0;
    let sinPujas = 0;
    let conComentarios = 0;
    let sinComentarios = 0;
    let totalPujas = 0;
    let totalComentarios = 0;
    const campos = new Set();

    torresSnapshot.forEach((doc) => {
      const data = doc.data();

      // Recolectar todos los campos únicos
      Object.keys(data).forEach(key => campos.add(key));

      // Contar pujas
      if (data.pujas && data.pujas.length > 0) {
        conPujas++;
        totalPujas += data.pujas.length;
      } else {
        sinPujas++;
      }

      // Contar comentarios
      if (data.comentarios && data.comentarios.length > 0) {
        conComentarios++;
        totalComentarios += data.comentarios.length;
      } else {
        sinComentarios++;
      }
    });

    console.log('📊 ESTADÍSTICAS:');
    console.log('-'.repeat(100));
    console.log(`Torres con pujas: ${conPujas}`);
    console.log(`Torres sin pujas: ${sinPujas}`);
    console.log(`Torres con comentarios: ${conComentarios}`);
    console.log(`Torres sin comentarios: ${sinComentarios}`);
    console.log(`Total de pujas en todas las torres: ${totalPujas}`);
    console.log(`Total de comentarios en todas las torres: ${totalComentarios}`);
    console.log(`Promedio de pujas por torre: ${(totalPujas / torresSnapshot.size).toFixed(2)}`);
    console.log(`Promedio de comentarios por torre: ${(totalComentarios / torresSnapshot.size).toFixed(2)}`);

    console.log('\n📋 CAMPOS ENCONTRADOS EN DOCUMENTOS:');
    console.log('-'.repeat(100));
    console.log(Array.from(campos).join(', '));

    // Análisis de estructura de pujas y comentarios
    console.log('\n\n🔍 ESTRUCTURA DE DATOS:\n');
    console.log('='.repeat(100));

    const torreConDatos = torresSnapshot.docs.find(doc => {
      const data = doc.data();
      return data.pujas && data.pujas.length > 0 && data.comentarios && data.comentarios.length > 0;
    });

    if (torreConDatos) {
      const data = torreConDatos.data();
      console.log('📄 Estructura de una PUJA:');
      console.log('-'.repeat(100));
      console.log(JSON.stringify(data.pujas[0], null, 2));

      console.log('\n📄 Estructura de un COMENTARIO:');
      console.log('-'.repeat(100));
      console.log(JSON.stringify(data.comentarios[0], null, 2));
    }

    // Resumen final
    console.log('\n\n📋 RESUMEN FINAL:\n');
    console.log('='.repeat(100));
    console.log(`✅ Proyecto Firebase: ${firebaseConfig.projectId}`);
    console.log(`✅ Colecciones encontradas: ${coleccionesEncontradas.map(c => c.nombre).join(', ')}`);
    console.log(`✅ Colección principal: torres (${torresSnapshot.size} documentos)`);
    console.log(`✅ Total de pujas registradas: ${totalPujas}`);
    console.log(`✅ Total de comentarios registrados: ${totalComentarios}`);

    console.log('\n\n🎯 USO EN APLICACIONES:\n');
    console.log('='.repeat(100));
    console.log('Este proyecto Firebase (fir-subasta-63f80) es usado por:');
    console.log('  1. ✅ UNIQUE MOTORS (dev-web3-uniquemotors)');
    console.log('  2. ✅ SUBASTA TOTAL (subasta-total)');
    console.log('\nAmbas aplicaciones comparten:');
    console.log('  • Mismo proyecto Firebase');
    console.log('  • Misma colección de torres');
    console.log('  • Mismos datos de pujas y comentarios');
    console.log('  • Tiempo real sincronizado entre ambas apps');

    console.log('\n✅ Análisis completado!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el análisis:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    process.exit(1);
  }
}

analizarFirebase();
