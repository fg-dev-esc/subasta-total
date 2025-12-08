# 📋 PLAN DE IMPLEMENTACIÓN - PÁGINA DETALLE

## 🎯 OBJETIVO
Replicar exactamente la estructura de Unique Motors en Subasta Total

## 📐 ESTRUCTURA ACTUAL DE UNIQUE

```
┌─────────────────────────────────────────────────────────┐
│                      DETAIL.JSX                          │
│  - Carga datos desde API                                │
│  - Conecta Firebase con torreID                         │
│  - Pasa context a DetailSection                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   DETAIL SECTION                         │
│  ┌──────────────────┐  ┌──────────────────────────────┐│
│  │   CarImages      │  │      CarInfo                 ││
│  │  (col-lg-8)      │  │    (col-lg-4)                ││
│  │                  │  │                              ││
│  │  - Carrusel      │  │  - Precio actual             ││
│  │  - Miniaturas    │  │  - Botones rápidos           ││
│  │  - Badge dinámico│  │  - Formulario oferta         ││
│  │  - Timer         │  │  - Info del auto             ││
│  │  - Status        │  │                              ││
│  └──────────────────┘  └──────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                     CAR TABS                             │
│  ┌─────────┬──────────┬────────────┬──────────────┐   │
│  │ Ofertas │Comentarios│Descripción│Especificaciones│  │
│  └─────────┴──────────┴────────────┴──────────────┘   │
│                                                         │
│  [Contenido del tab seleccionado]                      │
└─────────────────────────────────────────────────────────┘
```

## 🎨 COMPONENTES DE UNIQUE

### 1. CarImages (Columna Izquierda)

**Badges en esquinas de la foto:**
```jsx
┌────────────────────────────────────┐
│ [Estado]           [Cronómetro]    │  ← Badges flotantes
│                                    │
│                                    │
│         IMAGEN PRINCIPAL           │
│                                    │
│                                    │
│ [1/4] 🔍 Click para ampliar       │  ← Info inferior
└────────────────────────────────────┘

[📷] [📷] [📷] [📷]  ← Miniaturas

┌────────────────────────────────────┐
│  🏆 ¡Vas ganando!                  │  ← Badge dinámico
│  Tu oferta: $378,000               │    (SOLO para quien
│  Mantente alerta...                │     va ganando)
└────────────────────────────────────┘
```

**Props:**
- `currentPrice` - Precio actual para calcular mínima
- Ref forwarded para scroll

**Estructura interna:**
```jsx
<CarImages currentPrice={currentBidAmount}>
  {/* Imagen principal con overlay badges */}
  <div className="car-single-main-image">
    {/* Badge estado (superior izquierda) */}
    <AuctionStatus />

    {/* Badge timer (superior derecha) */}
    <AuctionTimer endDate={...} />

    {/* Imagen con navegación */}
    <img ... />
    <button onClick={navigateImage('prev')} />
    <button onClick={navigateImage('next')} />

    {/* Info inferior */}
    <div>🔍 Click para ampliar</div>
    <div>1 / 4</div>
  </div>

  {/* Miniaturas */}
  <div className="car-thumbnails-gallery">
    {imagenes.map(...)}
  </div>

  {/* Badge dinámico (SOLO si usuario va ganando) */}
  {isHighestBidder && (
    <FadeTransition>
      <div className="alert alert-success">
        🏆 ¡Vas ganando!
        Tu oferta: ${userBidAmount}
      </div>
    </FadeTransition>
  )}
</CarImages>
```

### 2. CarInfo (Columna Derecha)

**Sin cambios - Ya lo tienes implementado**

### 3. CarTabs (Debajo de todo)

**Tabs:**
1. **Ofertas** - BiddingHistory component
2. **Comentarios** - CarComments component
3. **Descripción** - Texto del vehículo
4. **Especificaciones** - Tabla de especificaciones

## 📊 TAB: OFERTAS (BiddingHistory)

```
┌─────────────────────────────────────────────────────┐
│ Historial de Ofertas (43)                          │
├─────────────────────────────────────────────────────┤
│ Resumen de Subasta:                                 │
│ ┌──────────┬────────────┬──────────┬─────────────┐ │
│ │ Oferta   │ Oferta     │ Precio   │ Tiempo      │ │
│ │ Actual   │ Inicial    │ Reserva  │ Restante    │ │
│ │ $378,000 │ $350,000   │ $400,000 │ 23d 5h 12m  │ │
│ └──────────┴────────────┴──────────┴─────────────┘ │
│                                                     │
│ Estadísticas:                                       │
│ Total ofertas: 43 │ Participantes: 7 │ Promedio... │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🏆 Usuario1          $378,000    Hace 2 horas      │
│ ⚡ Usuario2          $373,000    Hace 5 horas      │
│ 💰 Usuario3          $372,000    Hace 1 día        │
│ ...                                                 │
│                                                     │
└─────────────────────────────────────────────────────┘

NO MOSTRAR FORMULARIO (ya está en CarInfo)
```

## 💬 TAB: COMENTARIOS (CarComments)

```
┌─────────────────────────────────────────────────────┐
│ Comentarios (50)                                    │
├─────────────────────────────────────────────────────┤
│ Estadísticas de Subasta:                            │
│ ┌──────────────┬──────────────┬──────────────────┐ │
│ │ Oferta Actual│ Oferta Inicial│ Tiempo Restante │ │
│ │  $378,000    │   $350,000    │   23d 5h 12m    │ │
│ └──────────────┴──────────────┴──────────────────┘ │
│ ┌──────────────┬──────────────┬──────────────────┐ │
│ │Total Ofertas │ Participantes│ Última Oferta   │ │
│ │      43      │       7      │  Hace 2 horas   │ │
│ └──────────────┴──────────────┴──────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Dejar un comentario:                                │
│ [Textarea]                                          │
│ [Botón Enviar]                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 👤 Usuario1    Hace 3 horas                        │
│    Excelente vehículo, muy buen estado...          │
│                                                     │
│ 👤 Usuario2    Hace 1 día                          │
│    ¿Tiene documentos al corriente?                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🔄 INTEGRACIÓN REDUX + FIREBASE

### Redux Slice (auctionSlice.js)

```javascript
const auctionSlice = createSlice({
  name: 'auction',
  initialState: {
    // Firebase en tiempo real
    fechaFin: null,
    ofertas: [],        // Todas las ofertas de Firebase
    comentarios: [],    // Todos los comentarios de Firebase
    ofertaMayor: null,  // { monto, usuario }

    // Datos de API
    currentCar: null,
    subastaTorre: null,

    // UI State
    loading: false,
    error: null
  },
  reducers: {
    setFechaFin: (state, action) => {
      state.fechaFin = action.payload;
    },
    setOfertaMayor: (state, action) => {
      state.ofertaMayor = action.payload;
    },
    setTorreComentarios: (state, action) => {
      state.comentarios = action.payload;
    },
    setOfertas: (state, action) => {
      state.ofertas = action.payload;
    }
  }
});
```

### Firebase Subscription (auctionThunks.js)

```javascript
export const startFirebaseAuctionSubscription = (torreID) => {
  return (dispatch) => {
    const unsuscribe = onSnapshot(
      doc(db, "torres", torreID),
      documento => {
        const data = documento.data();

        // Actualizar Redux
        dispatch(setFechaFin(data.fechaFin));

        // Ordenar comentarios
        const comentarios = data.comentarios
          .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
        dispatch(setTorreComentarios(comentarios));

        // Ordenar ofertas y obtener mayor
        const ofertas = data.pujas
          .sort((a,b) => b.Monto - a.Monto);

        dispatch(setOfertas(ofertas));
        dispatch(setOfertaMayor({
          monto: ofertas[0]?.Monto || 0,
          usuario: ofertas[0]?.UsuarioPujaID || null
        }));
      }
    );

    return unsuscribe;
  };
};
```

## 📝 ARCHIVOS A CREAR/MODIFICAR

### ✅ YA TIENES:
- `src/views/detalle/Detalle.jsx` - Página principal
- `src/redux/features/auction/auctionSlice.js` - Redux slice básico
- Badge dinámico en Detalle.jsx

### 🆕 CREAR:

1. **Carrusel de Imágenes**
   - `src/components/auction/CarImages.jsx`
   - `src/components/auction/useCarImages.js`

2. **Badges de Status**
   - `src/components/ui/AuctionStatus.jsx`
   - `src/components/ui/AuctionTimer.jsx`

3. **Tabs System**
   - `src/components/auction/CarTabs.jsx`
   - `src/components/auction/BiddingHistory.jsx`
   - `src/components/auction/CarComments.jsx`
   - `src/components/auction/CarDescription.jsx`
   - `src/components/auction/CarSpecifications.jsx`

4. **Redux Integration**
   - Modificar `src/redux/features/auction/auctionSlice.js`
   - Crear `src/redux/features/auction/auctionThunks.js`

5. **Hooks**
   - `src/hooks/useUserBidStatus.js` - Detectar si usuario va ganando
   - `src/hooks/useBiddingHistory.js` - Hook para ofertas
   - `src/hooks/useCarComments.js` - Hook para comentarios

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### FASE 1: Estructura Visual (SIN Firebase)
1. ✅ Crear CarImages con carrusel
2. ✅ Agregar badges (AuctionStatus, AuctionTimer)
3. ✅ Crear sistema de tabs
4. ✅ Implementar BiddingHistory (con datos mock)
5. ✅ Implementar CarComments (con datos mock)

### FASE 2: Redux Integration
1. ✅ Crear auctionSlice completo
2. ✅ Crear auctionThunks con Firebase
3. ✅ Conectar CarImages con Redux
4. ✅ Conectar CarTabs con Redux

### FASE 3: Firebase Tiempo Real
1. ✅ Integrar onSnapshot en Detail.jsx
2. ✅ Actualizar ofertas en tiempo real
3. ✅ Actualizar comentarios en tiempo real
4. ✅ Actualizar cronómetro automáticamente

### FASE 4: Funcionalidad de Usuario
1. ✅ Implementar useUserBidStatus
2. ✅ Mostrar badge "¡Vas ganando!" solo al ganador
3. ✅ Formulario de comentarios funcional
4. ✅ Enviar comentarios a Firebase vía API

## 🚫 LO QUE NO HACER

❌ NO mostrar "por Usuario" en el precio actual
❌ NO mostrar lista de top 5 ofertas fuera del tab
❌ NO crear formulario de oferta en BiddingHistory (ya está en CarInfo)
❌ NO cambiar la estructura de CarInfo (columna derecha)

## ✅ LO QUE SÍ HACER

✅ Carrusel con miniaturas igual que Unique
✅ Badges flotantes en esquinas de foto
✅ Badge dinámico SOLO para quien va ganando
✅ Tabs debajo con Ofertas y Comentarios
✅ Estadísticas en cada tab
✅ Firebase en tiempo real para todo
✅ Redux para sincronizar datos

---

**Próximo paso**: Empezar con Fase 1 - Crear CarImages component
