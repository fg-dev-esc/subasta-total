# Configuración Firebase - Subasta Total

## ✅ Configuración Completada

La conexión a Firebase ha sido configurada correctamente siguiendo el patrón del proyecto Unique Motors.

## 📁 Archivos Creados

### 1. Configuración Base
- `src/db/config/firebase.js` - Configuración de Firebase usando variables de entorno
- `src/db/firebase.js` - Inicialización de Firebase App y Firestore
- `.env` - Variables de entorno con credenciales Firebase

### 2. Utilidades
- `src/utils/firebaseHelpers.js` - Funciones helper para interactuar con Firebase
- `src/utils/testFirebase.js` - Script de prueba de conexión

## 🔧 Variables de Entorno

Las siguientes variables están configuradas en `.env`:

```env
VITE_APIKEY_FIREBASE=AIzaSyAtyiMRcbx5w6D754HFrTncKvJK01gn4D4
VITE_FIREBASE_AUTH_DOMINIO=fir-subasta-63f80.firebaseapp.com
VITE_FIREBASE_ID=fir-subasta-63f80
VITE_FIREBASE_BUCKET=fir-subasta-63f80.firebasestorage.app
VITE_FIREBASE_SENDERID=816161552046
VITE_FIREBASE_APPID=1:816161552046:web:b48a2dca922f45c79cdf3f
```

**⚠️ IMPORTANTE**: El archivo `.env` debe estar en `.gitignore` para no subir las credenciales al repositorio.

## 📦 Funciones Disponibles

### `subscribeToAuction(torreId, callback)`
Escucha cambios en tiempo real de una subasta específica.

```javascript
import { subscribeToAuction } from './utils/firebaseHelpers';

useEffect(() => {
  const unsubscribe = subscribeToAuction('torre-123', (data) => {
    console.log('Datos actualizados:', data);
    // data incluye: fechaFin, ofertas, comentarios, ofertaMayor
  });

  return () => unsubscribe();
}, [torreId]);
```

### `addBidToAuction(torreId, bidData)`
Agrega una nueva oferta a una subasta.

```javascript
import { addBidToAuction } from './utils/firebaseHelpers';

await addBidToAuction('torre-123', {
  monto: 50000,
  usuarioID: 'user-123',
  nickname: 'Juan Pérez',
  comentario: 'Mi oferta'
});
```

### `addCommentToAuction(torreId, commentData)`
Agrega un comentario a una subasta.

```javascript
import { addCommentToAuction } from './utils/firebaseHelpers';

await addCommentToAuction('torre-123', {
  comentario: 'Excelente vehículo',
  usuarioID: 'user-123',
  nickname: 'Juan Pérez',
  rating: 5
});
```

### `subscribeToCarListings(callback)`
Escucha cambios en el listado de autos activos.

```javascript
import { subscribeToCarListings } from './utils/firebaseHelpers';

useEffect(() => {
  const unsubscribe = subscribeToCarListings((cars) => {
    console.log('Autos activos:', cars);
  });

  return () => unsubscribe();
}, []);
```

### `updateUserSession(userId, sessionData)`
Actualiza la sesión del usuario.

```javascript
import { updateUserSession } from './utils/firebaseHelpers';

await updateUserSession('user-123', {
  lastPage: '/subastas',
  activeAuction: 'torre-123'
});
```

## 🧪 Probar la Conexión

Para verificar que Firebase está conectado correctamente:

```javascript
import { testFirebaseConnection } from './utils/testFirebase';

// En un componente o en la consola del navegador
testFirebaseConnection().then(result => {
  console.log('Resultado:', result);
});
```

## 📊 Estructura de Datos Firebase

### Colección: `torres/{torreID}`

```javascript
{
  fechaFin: "2025-01-15T10:00:00.000Z",
  pujas: [
    {
      Monto: 50000,
      UsuarioPujaID: "user123",
      Nickname: "usuario1",
      Fecha: "2025-01-10T10:30:00.000Z",
      Comentario: ""
    }
  ],
  comentarios: [
    {
      Comentario: "Excelente vehículo",
      UsuarioID: "user123",
      Nickname: "usuario1",
      Rating: 5,
      Fecha: "2025-01-10T10:25:00.000Z"
    }
  ]
}
```

## 🎯 Características Implementadas

- ✅ Conexión a Firebase Firestore
- ✅ Listeners en tiempo real para subastas
- ✅ Sistema de ofertas/pujas
- ✅ Sistema de comentarios
- ✅ Manejo de errores
- ✅ Ordenamiento automático (ofertas por monto, comentarios por fecha)
- ✅ Top 5 ofertas más altas
- ✅ Detección de oferta mayor

## 🔄 Extensión Automática de Tiempo

El sistema funciona de la siguiente manera:

1. **Backend API** recibe una nueva puja
2. **Backend** determina si debe extender el tiempo de la subasta
3. **Backend** actualiza `fechaFin` en Firebase
4. **Frontend** escucha los cambios vía `onSnapshot()`
5. **Cronómetro** se actualiza automáticamente con el nuevo `fechaFin`

No es necesario implementar lógica de extensión en el frontend, ya que Firebase actualiza automáticamente todos los clientes conectados.

## 🚀 Siguiente Paso

Ahora puedes usar estos helpers en tus componentes de React. Por ejemplo:

```javascript
// En un componente de detalle de subasta
import { useEffect, useState } from 'react';
import { subscribeToAuction } from '../utils/firebaseHelpers';

function DetalleSubasta({ torreId }) {
  const [subasta, setSubasta] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuction(torreId, (data) => {
      setSubasta(data);
    });

    return () => unsubscribe();
  }, [torreId]);

  return (
    <div>
      <h1>Subasta {torreId}</h1>
      {subasta && (
        <>
          <p>Fecha fin: {subasta.fechaFin}</p>
          <p>Ofertas: {subasta.ofertas?.length || 0}</p>
          <p>Oferta mayor: ${subasta.ofertaMayor?.monto || 0}</p>
        </>
      )}
    </div>
  );
}
```

## 📝 Notas Importantes

1. **Mismo proyecto Firebase**: Estás usando el mismo proyecto Firebase que Unique Motors (`fir-subasta-63f80`)
2. **Colección `torres`**: Las subastas se almacenan en la colección `torres`
3. **Nomenclatura mixta**: Firebase usa `pujas` pero los helpers devuelven `ofertas` para mantener consistencia con el frontend
4. **Limpieza de listeners**: Siempre limpia los listeners con `unsubscribe()` en el `useEffect` cleanup

## 🔒 Seguridad

- Las reglas de seguridad de Firebase deben estar configuradas en la consola de Firebase
- Asegúrate de que `.env` esté en `.gitignore`
- No expongas las credenciales en el código del cliente sin las reglas adecuadas

---

**Proyecto**: Subasta Total
**Fecha de configuración**: 2025-12-08
**Basado en**: Unique Motors Firebase Setup
