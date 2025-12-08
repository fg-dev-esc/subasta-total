# 🔥 ARQUITECTURA COMPLETA DE FIREBASE

## 📦 RESUMEN EJECUTIVO

### **UN SOLO PROYECTO FIREBASE PARA AMBAS APLICACIONES**

```
┌─────────────────────────────────────────────────────────┐
│         PROYECTO FIREBASE: fir-subasta-63f80            │
│                                                         │
│  Project ID: fir-subasta-63f80                         │
│  Auth Domain: fir-subasta-63f80.firebaseapp.com        │
│  Storage Bucket: fir-subasta-63f80.firebasestorage.app │
└─────────────────────────────────────────────────────────┘
                    │
                    │
        ┌──────────────┴──────────────┐
        │                              │
        ▼                              ▼
┌───────────────┐            ┌───────────────────┐
│ UNIQUE MOTORS │            │  SUBASTA TOTAL   │
│  (original)   │            │    (nuevo)       │
└───────────────┘            └───────────────────┘
```

**IMPORTANTE**: Ambos proyectos apuntan al **MISMO** Firebase, comparten:
- ✅ Misma base de datos Firestore
- ✅ Misma colección `torres`
- ✅ Mismas pujas y comentarios
- ✅ Tiempo real sincronizado entre ambas apps

---

## 📊 ESTRUCTURA DE FIREBASE

### Colecciones Disponibles:
- **`torres`** ← ÚNICA COLECCIÓN ACTIVA (8 documentos)

### Estadísticas Actuales:
```
Total torres: 8
Torres con pujas: 7
Torres sin pujas: 1
Total de pujas: 43
Total de comentarios: 50
Promedio de pujas por torre: 5.38
Promedio de comentarios por torre: 6.25
```

---

## 📄 ESTRUCTURA DE DOCUMENTOS

### Documento Torre (colección: `torres`)

```javascript
{
  // CAMPOS PRINCIPALES
  "fechaInicio": "2025-10-17T21:58",    // Fecha de inicio de subasta
  "fechaFin": "2026-11-30T21:08",        // Fecha de fin (se extiende automáticamente)

  // ARRAY DE PUJAS
  "pujas": [
    {
      "Monto": 24000,                    // Monto de la puja
      "Fecha": "2025-11-28T19:51:43",   // Fecha/hora de la puja
      "UsuarioPujaID": "131f45be-...",  // UUID del usuario
      "Nickname": "luisfelipetesting"    // Nombre del usuario
    }
  ],

  // ARRAY DE COMENTARIOS
  "comentarios": [
    {
      "Comentario": "un comentario",     // Texto del comentario
      "Fecha": "2025-11-28T17:04:14",   // Fecha/hora
      "UsuarioID": "a9e81e8d-...",      // UUID del usuario
      "NickName": "comp3"                // Nombre del usuario
    }
  ],

  // CAMPOS OPCIONALES
  "creado": "desde comentarios"          // Metadata (algunas torres)
}
```

### IDs de Torres Disponibles:
```
1. BSuu896Cv2 - 4 pujas, mayor: $24,000
2. CEY7tlMtxp - 21 pujas, mayor: $300,000
3. Qby34bfx9d - 0 pujas, 1 comentario
4. Qd5LxeEbIH - 1 puja, mayor: $280,000
5. RAFvDAM9Ea - 3 pujas, mayor: $378,000
6. Rbywu7BjBm - 1 puja, mayor: $300,000
7. eSUpX7o64y - 11 pujas, mayor: $105,000
8. vueYCS7Cf4 - 2 pujas, mayor: $2,000
```

---

## 🛠️ FUNCIONES FIREBASE EN UNIQUE MOTORS

### 1. **firebaseHelpers.js** (Funciones Utilitarias)

```javascript
// ✅ YA IMPLEMENTADO EN SUBASTA TOTAL

import { subscribeToAuction } from '../utils/firebaseHelpers';
import { addBidToAuction } from '../utils/firebaseHelpers';
import { addCommentToAuction } from '../utils/firebaseHelpers';
import { subscribeToCarListings } from '../utils/firebaseHelpers';
import { updateUserSession } from '../utils/firebaseHelpers';
```

### 2. **AuctionBidding.jsx** (Componente de Pujas)

**Ubicación**: `src/components/auction/AuctionBidding.jsx`

**Función Principal**:
- Escucha cambios en tiempo real de una torre específica
- Actualiza Redux con `fechaFin`, `ofertas`, `comentarios`
- Muestra solo top 5 ofertas
- Requiere sesión activa para ver datos

**Código clave**:
```javascript
useEffect(() => {
  const unsuscribe = onSnapshot(
    doc(db, "torres", torreID),
    documento => {
      const fechaFin = documento.data().fechaFin;
      const comentarios = documento.data().comentarios.sort((a, b) =>
        new Date(b.Fecha) - new Date(a.Fecha)
      );
      dispatch(setFechaFin(fechaFin));
      dispatch(setTorreComentarios(comentarios));

      if (!sesion) {
        const arregloOfertas = documento.data().ofertas.sort((a,b)=>
          b.Monto - a.Monto
        );
        setOfertas(arregloOfertas.slice(0,5));
        dispatch(setOfertaMayor({
          monto: arregloOfertas[0].Monto,
          usuario: arregloOfertas[0].UsuarioOfertaID
        }));
      };
    }
  );

  return ()=> unsuscribe();
}, [sesion, torreID, dispatch]);
```

### 3. **useCarDetail.js** (Hook para Detalle de Auto)

**Ubicación**: `src/views/detail/useCarDetail.js`

**Función Principal**:
- Combina datos de API inicial con actualizaciones Firebase
- Usa debounce para evitar re-renders excesivos
- Sincroniza con Redux store

**Código clave**:
```javascript
// Obtener datos actualizados de Firebase vía Redux
const { fechaFin: reduxFechaFin, ofertas, comentarios } =
  useSelector(state => state.auctionReducer);

// Debounce para evitar re-renders excesivos
const [debouncedOfertas, setDebouncedOfertas] = useState(ofertas);
const [debouncedComentarios, setDebouncedComentarios] = useState(comentarios);

// Combinar datos iniciales con actualizaciones en tiempo real
const carWithLiveData = useMemo(() => {
  return car ? {
    ...car,
    fechaFin: reduxFechaFin || car.fechaFin,
    ofertas: debouncedOfertas,
    comentarios: debouncedComentarios
  } : null;
}, [car, reduxFechaFin, debouncedOfertas, debouncedComentarios]);
```

### 4. **multipleOffersService.js** (Servicio de Múltiples Ofertas)

**Ubicación**: `src/services/multipleOffersService.js`

**Funciones Principales**:

#### a) `getCurrentBidForCar(torreID)`
Obtiene la oferta mayor actual de una torre específica.

```javascript
const torreRef = doc(db, 'torres', torreID);
const torreDoc = await getDoc(torreRef);

if (torreDoc.exists()) {
  const data = torreDoc.data();
  const pujas = data.pujas || [];

  if (pujas.length > 0) {
    const sortedPujas = pujas.sort((a, b) => b.Monto - a.Monto);
    const highestBid = sortedPujas[0];

    return {
      monto: highestBid.Monto || 0,
      usuario: highestBid.UsuarioPujaID || highestBid.UsuarioOfertaID || ''
    };
  }
}
```

#### b) `getCurrentBidsForMultipleCars(torreIDs)`
Obtiene ofertas de múltiples torres en paralelo.

```javascript
const promises = torreIDs.map(async (torreID) => {
  const offer = await getCurrentBidForCar(torreID);
  return { torreID, offer };
});

const results = await Promise.allSettled(promises);
```

#### c) `subscribeToMultipleCarBids(torreIDs, callback)`
Suscripción en tiempo real a múltiples torres.

```javascript
torreIDs.forEach((torreID) => {
  const torreRef = doc(db, 'torres', torreID);

  const unsubscribe = onSnapshot(torreRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const pujas = data.pujas || [];

      if (pujas.length > 0) {
        const sortedPujas = pujas.sort((a, b) => b.Monto - a.Monto);
        const highestBid = sortedPujas[0];

        offers[torreID] = {
          monto: highestBid.Monto || 0,
          usuario: highestBid.UsuarioPujaID || ''
        };
      }

      callback({ ...offers });
    }
  });

  unsubscribeFunctions.push(unsubscribe);
});
```

---

## 🔄 FLUJO COMPLETO DEL SISTEMA

### 1. CARGA INICIAL DE DATOS

```
┌─────────────┐
│   Usuario   │
│ accede a    │
│  /detalle   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Detail.jsx         │
│  - Llama API        │
│  - Obtiene datos    │
│    iniciales del    │
│    vehículo         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  useCarDetail       │
│  - Recibe datos     │
│  - Guarda en state  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Renderiza UI       │
└─────────────────────┘
```

### 2. TIEMPO REAL (FIREBASE)

```
┌─────────────────────┐
│  AuctionBidding     │
│  - onSnapshot()     │
│    escucha torre    │
└──────┬──────────────┘
       │
       ▼ cada cambio
┌─────────────────────┐
│  Firebase detecta   │
│  nueva puja/        │
│  comentario         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Callback ejecuta   │
│  - dispatch Redux   │
│    (fechaFin)       │
│    (comentarios)    │
│    (ofertas)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  useCarDetail       │
│  - Lee Redux        │
│  - Combina datos    │
│  - Aplica debounce  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  UI se actualiza    │
│  automáticamente    │
└─────────────────────┘
```

### 3. EXTENSIÓN AUTOMÁTICA DE TIEMPO

```
┌─────────────────────┐
│  Usuario hace puja  │
│  (desde frontend)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  API Backend recibe │
│  - Valida puja      │
│  - Determina si     │
│    extiende tiempo  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Backend actualiza  │
│  Firebase:          │
│  - Agrega puja      │
│  - Actualiza fechaFin│
│  - Agrega comentario│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  onSnapshot detecta │
│  cambio en Firebase │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  TODOS los clientes │
│  conectados reciben │
│  actualización      │
│  automáticamente    │
└─────────────────────┘
```

---

## 📋 REDUX STORE STRUCTURE

### Slice: `auctionReducer`

```javascript
{
  // Datos de la torre actual en tiempo real
  fechaFin: "2026-11-30T21:08",
  ofertas: [
    {
      Monto: 24000,
      Nickname: "usuario1",
      UsuarioPujaID: "uuid-123",
      Fecha: "2025-11-28T19:51:43"
    }
  ],
  comentarios: [
    {
      Comentario: "Excelente auto",
      NickName: "usuario1",
      UsuarioID: "uuid-123",
      Fecha: "2025-11-28T17:04:14"
    }
  ],
  ofertaMayor: {
    monto: 24000,
    usuario: "uuid-123"
  },
  currentCar: { /* datos del auto actual */ }
}
```

### Actions Principales:
- `setFechaFin(fechaFin)` - Actualiza fecha fin desde Firebase
- `setOfertaMayor({ monto, usuario })` - Actualiza oferta mayor
- `setTorreComentarios(comentarios)` - Actualiza comentarios

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS EN UNIQUE

### ✅ Sistema de Pujas en Tiempo Real
- Escucha cambios con `onSnapshot()`
- Ordena por monto descendente
- Muestra top 5 ofertas
- Actualiza Redux automáticamente

### ✅ Sistema de Comentarios en Tiempo Real
- Escucha cambios con `onSnapshot()`
- Ordena por fecha descendente
- Sincroniza con Redux

### ✅ Extensión Automática de Tiempo
- Backend actualiza `fechaFin` en Firebase
- Frontend recibe cambio automáticamente
- Cronómetro se actualiza sin recargar

### ✅ Badges de Ofertas en Listados
- `multipleOffersService.js` obtiene ofertas de múltiples autos
- Muestra badge con monto mayor en cards
- Actualización en tiempo real opcional

### ✅ Debounce de Actualizaciones
- Evita re-renders excesivos
- 300ms de delay en `useCarDetail`
- Mejor performance

### ✅ Manejo de Sesión
- Requiere login para ver ofertas
- Validación de usuario activo
- Mensajes de sesión

---

## 🚀 PLAN DE IMPLEMENTACIÓN EN SUBASTA TOTAL

### FASE 1: Configuración Base (✅ COMPLETADO)
- [x] Crear estructura de directorios Firebase
- [x] Configurar variables de entorno
- [x] Instalar dependencias
- [x] Crear firebaseHelpers.js
- [x] Probar conexión

### FASE 2: Componentes Core (⏳ SIGUIENTE)
- [ ] Crear componente `AuctionBidding` (copia de Unique)
- [ ] Crear hook `useCarDetail` (adaptado)
- [ ] Crear servicio `multipleOffersService`
- [ ] Integrar con Redux

### FASE 3: Redux Integration
- [ ] Crear slice `auctionSlice` con actions:
  - `setFechaFin`
  - `setOfertaMayor`
  - `setTorreComentarios`
- [ ] Configurar store
- [ ] Conectar componentes

### FASE 4: UI Components
- [ ] Crear `BiddingForm` (formulario de puja)
- [ ] Crear `BiddingButtons` (botones rápidos)
- [ ] Crear `BiddingList` (lista de ofertas)
- [ ] Crear badges para listados

### FASE 5: Testing y Optimización
- [ ] Probar listeners en tiempo real
- [ ] Verificar debounce
- [ ] Testing con múltiples usuarios
- [ ] Optimizar performance

---

## 📝 ARCHIVOS A CREAR EN SUBASTA TOTAL

```
src/
├── components/
│   └── auction/
│       ├── AuctionBidding.jsx         ← Componente principal
│       ├── BiddingForm.jsx            ← Formulario de puja
│       ├── BiddingButtons.jsx         ← Botones rápidos
│       └── BiddingList.jsx            ← Lista de ofertas
│
├── hooks/
│   ├── useCarDetail.js                ← Hook para detalle
│   └── useBiddingHistory.js           ← Hook para historial
│
├── services/
│   └── multipleOffersService.js       ← Servicio de ofertas
│
├── redux/
│   └── features/
│       └── auction/
│           ├── auctionSlice.js        ← Slice Redux
│           └── auctionThunks.js       ← Thunks async
│
└── utils/
    └── firebaseHelpers.js             ← ✅ YA EXISTE
```

---

## 🔍 DIFERENCIAS CLAVE: UNIQUE vs SUBASTA TOTAL

| Aspecto | Unique Motors | Subasta Total |
|---------|--------------|---------------|
| **Firebase Project** | fir-subasta-63f80 | fir-subasta-63f80 ✅ MISMO |
| **Colección** | `torres` | `torres` ✅ MISMO |
| **Datos** | Compartidos | Compartidos ✅ MISMO |
| **Componentes** | Implementados | Faltan implementar ⏳ |
| **Redux** | Configurado | Falta configurar ⏳ |
| **UI** | Completa | Falta integrar ⏳ |

---

## ⚠️ IMPORTANTE: NOTA DE NOMENCLATURA

Firebase usa `pujas` pero los helpers devuelven `ofertas` para consistencia con el frontend:

```javascript
// En Firebase:
{
  "pujas": [{ Monto: 1000, ... }]
}

// En helpers (retorno):
{
  "ofertas": [{ Monto: 1000, ... }],  // top 5
  "pujas": [{ Monto: 1000, ... }]      // todas
}
```

---

## 🎓 CONCLUSIÓN

**Subasta Total** ya tiene:
- ✅ Conexión a Firebase configurada
- ✅ Helpers básicos implementados
- ✅ Acceso a todos los datos de torres
- ✅ Mismo proyecto Firebase que Unique

**Falta implementar**:
- ⏳ Componentes React de pujas/comentarios
- ⏳ Redux store y slices
- ⏳ Integración en páginas de detalle
- ⏳ Badges en listados

**Próximo paso**: Copiar componente `AuctionBidding.jsx` y adaptarlo a Subasta Total.

---

**Documento creado**: 2025-12-08
**Última actualización**: 2025-12-08
**Estado**: Análisis completo terminado ✅
