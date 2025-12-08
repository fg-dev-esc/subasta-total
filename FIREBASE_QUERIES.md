# 🔥 Guía de Consultas Firebase - Subasta Total

## ✅ Conexión Verificada

La conexión a Firebase está funcionando correctamente. Se encontraron **8 documentos** en la colección `torres`.

## 📊 Datos Disponibles

### Colección: `torres`
- **Total documentos**: 8
- **Campos principales**: fechaFin, fechaInicio, pujas, comentarios
- **IDs disponibles**: BSuu896Cv2, CEY7tlMtxp, Qby34bfx9d, Qd5LxeEbIH, RAFvDAM9Ea, Rbywu7BjBm, eSUpX7o64y, vueYCS7Cf4

### Ejemplo de Datos Reales:
```json
{
  "fechaInicio": "2025-10-17T21:58",
  "fechaFin": "2026-11-30T21:08",
  "pujas": [
    {
      "Monto": 24000,
      "Fecha": "2025-11-28T19:51:43",
      "UsuarioPujaID": "131f45be-bfab-417b-8add-bfab34eac6c0",
      "Nickname": "luisfelipetesting"
    }
  ],
  "comentarios": [
    {
      "UsuarioID": "a9e81e8d-e755-4fad-a46c-dd53c4f7a3af",
      "NickName": "comp3",
      "Fecha": "2025-11-28T17:04:14",
      "Comentario": "un comentario"
    }
  ]
}
```

## 🛠️ Formas de Hacer Consultas

### 1. Desde el Navegador (Recomendado para desarrollo)

Accede a: **http://localhost:5173/test-firebase**

Esta página de prueba te permite:
- ✅ Ver todas las torres disponibles
- ✅ Ver detalles de cada torre
- ✅ Escuchar cambios en tiempo real
- ✅ Ver logs detallados en la consola del navegador (F12)

**Instrucciones:**
1. Abre http://localhost:5173/test-firebase
2. Verás el estado de conexión y todas las torres
3. Haz clic en "Ver Detalles" para ver datos completos
4. Haz clic en "Escuchar en Tiempo Real" para recibir actualizaciones automáticas
5. Abre la consola del navegador (F12) para ver logs detallados

### 2. Desde Node.js (Terminal)

Ejecuta el script de prueba:

```bash
node test-firebase-node.js
```

Este script te mostrará:
- Estado de conexión
- Total de documentos
- Resumen de cada documento
- Detalle completo del primer documento

### 3. Desde Componentes React

#### Ejemplo 1: Consulta Simple

```javascript
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../db/firebase';

function MiComponente() {
  const [torres, setTorres] = useState([]);

  useEffect(() => {
    const fetchTorres = async () => {
      const snapshot = await getDocs(collection(db, 'torres'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTorres(data);
    };

    fetchTorres();
  }, []);

  return (
    <div>
      <h2>Total Torres: {torres.length}</h2>
      {torres.map(torre => (
        <div key={torre.id}>
          <p>ID: {torre.id}</p>
          <p>Pujas: {torre.pujas?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Ejemplo 2: Escuchar Cambios en Tiempo Real

```javascript
import { useEffect, useState } from 'react';
import { subscribeToAuction } from '../utils/firebaseHelpers';

function DetalleSubasta({ torreId }) {
  const [subasta, setSubasta] = useState(null);

  useEffect(() => {
    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToAuction(torreId, (data) => {
      console.log('📡 Datos actualizados:', data);
      setSubasta(data);
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [torreId]);

  if (!subasta) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Subasta {torreId}</h2>
      <p>Fecha fin: {subasta.fechaFin}</p>
      <p>Total pujas: {subasta.pujas?.length || 0}</p>

      {subasta.ofertaMayor && (
        <div>
          <h3>Oferta Mayor</h3>
          <p>Monto: ${subasta.ofertaMayor.monto.toLocaleString()}</p>
          <p>Usuario: {subasta.ofertaMayor.usuario}</p>
        </div>
      )}

      <h3>Top 5 Ofertas</h3>
      {subasta.ofertas?.map((oferta, idx) => (
        <div key={idx}>
          <p>${oferta.Monto.toLocaleString()} - {oferta.Nickname}</p>
        </div>
      ))}

      <h3>Comentarios</h3>
      {subasta.comentarios?.map((comentario, idx) => (
        <div key={idx}>
          <p><strong>{comentario.NickName}:</strong> {comentario.Comentario}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Ejemplo 3: Agregar Puja

```javascript
import { addBidToAuction } from '../utils/firebaseHelpers';

async function handleSubmitBid(torreId, monto, usuarioID, nickname) {
  try {
    await addBidToAuction(torreId, {
      monto: parseFloat(monto),
      usuarioID: usuarioID,
      nickname: nickname,
      comentario: `Puja de ${nickname} por $${monto}`
    });

    console.log('✅ Puja agregada exitosamente');
  } catch (error) {
    console.error('❌ Error al agregar puja:', error);
  }
}
```

#### Ejemplo 4: Agregar Comentario

```javascript
import { addCommentToAuction } from '../utils/firebaseHelpers';

async function handleSubmitComment(torreId, texto, usuarioID, nickname) {
  try {
    await addCommentToAuction(torreId, {
      comentario: texto,
      usuarioID: usuarioID,
      nickname: nickname,
      rating: 5
    });

    console.log('✅ Comentario agregado exitosamente');
  } catch (error) {
    console.error('❌ Error al agregar comentario:', error);
  }
}
```

### 4. Desde la Consola del Navegador

Abre la consola del navegador (F12) en cualquier página y ejecuta:

```javascript
// Importar funciones
import { collection, getDocs } from 'firebase/firestore';
import { db } from './db/firebase';

// Consultar todas las torres
const snapshot = await getDocs(collection(db, 'torres'));
console.log('Total torres:', snapshot.size);
snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});

// O usar las funciones helper
import { testFirebaseConnection } from './utils/testFirebase';
await testFirebaseConnection();
```

## 📋 IDs de Torres Disponibles para Pruebas

Puedes usar estos IDs en tus consultas:

1. **BSuu896Cv2** - 4 pujas, mayor: $24,000
2. **CEY7tlMtxp** - 21 pujas, mayor: $300,000
3. **Qby34bfx9d** - 1 comentario
4. **Qd5LxeEbIH** - 1 puja, mayor: $280,000
5. **RAFvDAM9Ea** - 3 pujas, mayor: $378,000
6. **Rbywu7BjBm** - 1 puja, mayor: $300,000
7. **eSUpX7o64y** - 11 pujas, mayor: $105,000
8. **vueYCS7Cf4** - 2 pujas, mayor: $2,000

## 🔍 Verificar Cambios en Tiempo Real

Para probar que los listeners funcionan:

1. Abre http://localhost:5173/test-firebase
2. Selecciona una torre y haz clic en "Escuchar en Tiempo Real"
3. En otra pestaña o con Postman, haz una petición a tu API para agregar una puja
4. Verás que los datos se actualizan automáticamente sin recargar la página

## 🎯 Mejores Prácticas

1. **Siempre limpia los listeners**: Usa `return () => unsubscribe()` en el useEffect
2. **Maneja errores**: Envuelve las consultas en try-catch
3. **Valida datos**: Verifica que existan antes de usarlos (usa `?.`)
4. **Usa los helpers**: En lugar de escribir código Firebase directamente, usa `firebaseHelpers.js`
5. **Logs**: Mantén los `console.log` durante desarrollo para debugging

## 🚀 Próximos Pasos

Ahora que Firebase está funcionando, puedes:

1. Integrar los listeners en tus componentes de detalle de subasta
2. Implementar el sistema de pujas en tiempo real
3. Mostrar el cronómetro actualizado automáticamente
4. Agregar notificaciones cuando haya nuevas pujas
5. Implementar el sistema de comentarios en tiempo real

## 📝 Notas

- El servidor de desarrollo debe estar corriendo: `npm run dev`
- Las variables de entorno están en `.env` (no subir a git)
- La documentación completa está en `FIREBASE_SETUP.md`
- Para debugging, usa siempre la consola del navegador (F12)

---

**Última actualización**: 2025-12-08
**Estado**: ✅ Funcionando correctamente
