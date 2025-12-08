// Script para consultar una torre específica
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtyiMRcbx5w6D754HFrTncKvJK01gn4D4",
  authDomain: "fir-subasta-63f80.firebaseapp.com",
  projectId: "fir-subasta-63f80",
  storageBucket: "fir-subasta-63f80.firebasestorage.app",
  messagingSenderId: "816161552046",
  appId: "1:816161552046:web:b48a2dca922f45c79cdf3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Torre a consultar (puedes cambiar este ID)
const TORRE_ID = process.argv[2] || 'RAFvDAM9Ea';

console.log(`\n🔍 Consultando torre: ${TORRE_ID}\n`);
console.log('='.repeat(80));

async function consultarTorre(torreId) {
  try {
    const torreRef = doc(db, 'torres', torreId);
    const torreSnap = await getDoc(torreRef);

    if (!torreSnap.exists()) {
      console.log('❌ Torre no encontrada');
      process.exit(1);
    }

    const data = torreSnap.data();
    console.log('\n✅ Torre encontrada!\n');

    // Información básica
    console.log('📋 INFORMACIÓN BÁSICA:');
    console.log('-'.repeat(80));
    console.log(`ID: ${torreSnap.id}`);

    if (data.fechaInicio) {
      console.log(`Fecha Inicio: ${data.fechaInicio}`);
    }

    if (data.fechaFin) {
      console.log(`Fecha Fin: ${data.fechaFin}`);
    }

    if (data.creado) {
      console.log(`Creado: ${data.creado}`);
    }

    // Pujas
    console.log('\n💰 PUJAS:');
    console.log('-'.repeat(80));

    if (data.pujas && data.pujas.length > 0) {
      console.log(`Total de pujas: ${data.pujas.length}\n`);

      // Ordenar por monto descendente
      const pujasOrdenadas = [...data.pujas].sort((a, b) => b.Monto - a.Monto);

      pujasOrdenadas.forEach((puja, idx) => {
        console.log(`${idx + 1}. $${puja.Monto.toLocaleString()}`);
        console.log(`   Usuario: ${puja.Nickname || 'N/A'}`);
        console.log(`   ID Usuario: ${puja.UsuarioPujaID || 'N/A'}`);
        console.log(`   Fecha: ${puja.Fecha || 'N/A'}`);
        console.log('');
      });

      const mayorPuja = pujasOrdenadas[0];
      console.log(`🏆 PUJA MAYOR: $${mayorPuja.Monto.toLocaleString()} por ${mayorPuja.Nickname}`);

    } else {
      console.log('No hay pujas registradas');
    }

    // Comentarios
    console.log('\n💬 COMENTARIOS:');
    console.log('-'.repeat(80));

    if (data.comentarios && data.comentarios.length > 0) {
      console.log(`Total de comentarios: ${data.comentarios.length}\n`);

      // Ordenar por fecha descendente
      const comentariosOrdenados = [...data.comentarios].sort(
        (a, b) => new Date(b.Fecha) - new Date(a.Fecha)
      );

      comentariosOrdenados.forEach((comentario, idx) => {
        console.log(`${idx + 1}. ${comentario.NickName || comentario.Nickname || 'Anónimo'}`);
        console.log(`   "${comentario.Comentario}"`);
        console.log(`   Fecha: ${comentario.Fecha || 'N/A'}`);
        if (comentario.Rating) {
          console.log(`   Rating: ${'⭐'.repeat(comentario.Rating)}`);
        }
        console.log('');
      });

    } else {
      console.log('No hay comentarios registrados');
    }

    // Otros campos
    const camposBasicos = ['fechaInicio', 'fechaFin', 'pujas', 'comentarios', 'creado'];
    const otrosCampos = Object.keys(data).filter(key => !camposBasicos.includes(key));

    if (otrosCampos.length > 0) {
      console.log('\n📋 OTROS CAMPOS:');
      console.log('-'.repeat(80));
      otrosCampos.forEach(campo => {
        console.log(`${campo}: ${JSON.stringify(data[campo])}`);
      });
    }

    // Resumen final
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN:');
    console.log('-'.repeat(80));
    console.log(`✅ ID: ${torreSnap.id}`);
    console.log(`💰 Pujas: ${data.pujas?.length || 0}`);
    console.log(`💬 Comentarios: ${data.comentarios?.length || 0}`);
    console.log(`📅 Fecha Fin: ${data.fechaFin || 'N/A'}`);

    if (data.pujas && data.pujas.length > 0) {
      const mayorPuja = [...data.pujas].sort((a, b) => b.Monto - a.Monto)[0];
      console.log(`🏆 Mayor Puja: $${mayorPuja.Monto.toLocaleString()} por ${mayorPuja.Nickname}`);
    }

    console.log('='.repeat(80));

    // Documento completo en JSON
    console.log('\n📄 DOCUMENTO COMPLETO (JSON):');
    console.log('-'.repeat(80));
    console.log(JSON.stringify(data, null, 2));

    console.log('\n✅ Consulta completada exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante la consulta:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    process.exit(1);
  }
}

consultarTorre(TORRE_ID);
