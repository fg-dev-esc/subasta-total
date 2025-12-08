# 🔄 FLUJO COMPLETO DEL SISTEMA - SUBASTA TOTAL

## 📊 ARQUITECTURA REAL

```
┌─────────────────────────────────────────────────────────────┐
│                    TU BACKEND API                            │
│         https://prod1-backend.subastatotal.com.mx            │
│                                                              │
│  Base de datos principal con:                               │
│  - Subastas (GetSubastas)                                   │
│  - Torres/Artículos (GetTorres, GetTorre)                   │
│  - Usuarios, garantías, adjudicaciones                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ GET inicial de datos
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (React)                             │
│                                                              │
│  1. Obtiene datos de subasta desde API                      │
│  2. Extrae torreID de la respuesta                          │
│  3. Usa torreID para conectar a Firebase                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ torreID
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              FIREBASE (fir-subasta-63f80)                    │
│                                                              │
│  Colección: torres/{torreID}                                │
│  - Pujas en tiempo real                                     │
│  - Comentarios en tiempo real                               │
│  - fechaFin (se actualiza cuando hay extensión)             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 FLUJO DETALLADO

### 1. CARGA INICIAL DE PÁGINA `/detalle/:id`

```javascript
// Detalle.jsx línea 28-69

useEffect(() => {
  const fetchPropertyData = async () => {
    // ✅ 1. Obtener datos de la torre desde tu API
    const torreResponse = await fetch(
      `https://prod1-backend.subastatotal.com.mx/api/Subasta/GetTorre/${id}`
    );
    const torreData = await torreResponse.json();

    // Datos que vienen de tu API:
    // {
    //   torreID: "RAFvDAM9Ea",
    //   nombre: "Nombre del artículo",
    //   descripcion: "...",
    //   montoSalida: 350000,
    //   fechaFin: "2025-12-31T00:00",
    //   categoria: "...",
    //   subCategoria: "...",
    //   urlImgPrincipal: "...",
    //   imagenes: [...]
    // }

    setPropertyData(torreData);

    // ✅ 2. Cargar ofertas iniciales desde Redux (que consulta tu API)
    dispatch(fetchOfertasTorre(id));
    // Esto llama: /api/AdminPujas/GetPujasTorre/{torreID}

    // ✅ 3. Buscar subasta padre para navegación
    // (para el botón "Volver a Subasta")
  };

  fetchPropertyData();
}, [id]);
```

### 2. CONEXIÓN A FIREBASE (Tiempo Real)

```javascript
// AuctionBidding.jsx (componente que debes crear)

useEffect(() => {
  // ✅ Conectar a Firebase usando el torreID
  const unsuscribe = onSnapshot(
    doc(db, "torres", torreID),  // ← torreID viene de tu API
    documento => {
      // Recibir datos en tiempo real:
      const data = documento.data();

      // {
      //   fechaFin: "2025-12-31T00:00",
      //   pujas: [{ Monto, Nickname, UsuarioPujaID, Fecha }, ...],
      //   comentarios: [{ Comentario, NickName, UsuarioID, Fecha }, ...]
      // }

      // Actualizar Redux con datos en tiempo real
      dispatch(setFechaFin(data.fechaFin));
      dispatch(setTorreComentarios(data.comentarios));

      // Ordenar y mostrar top 5 ofertas
      const ofertas = data.pujas.sort((a,b) => b.Monto - a.Monto);
      setOfertas(ofertas.slice(0, 5));
      dispatch(setOfertaMayor({
        monto: ofertas[0].Monto,
        usuario: ofertas[0].UsuarioPujaID
      }));
    }
  );

  return () => unsuscribe();
}, [torreID]);
```

### 3. USUARIO HACE UNA PUJA

```javascript
// Detalle.jsx línea 219-232

const handleBidSubmit = async (e) => {
  e.preventDefault();

  // ✅ 1. Validar oferta mínima
  const minOferta = ofertaActual.monto + 1000;
  if (parseFloat(bidAmount) < minOferta) {
    setBidError(`La oferta mínima es ${formatPrice(minOferta)}`);
    return;
  }

  // ✅ 2. Enviar puja a tu API Backend
  dispatch(realizarOferta({
    torreID: id,
    monto: parseFloat(bidAmount)
  }));
  // Esto llama: POST /api/Pujas/Pujar
  // Con: { torreID, usuarioID, monto, ... }
};
```

### 4. BACKEND PROCESA LA PUJA

```
┌─────────────────────────────────────────────┐
│    TU BACKEND RECIBE LA PUJA               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 1. Validar usuario autenticado              │
│ 2. Validar monto mínimo                     │
│ 3. Guardar en base de datos principal       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 4. ¿Extender tiempo de subasta?             │
│    (si quedan < 5 minutos, agregar +5 min)  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 5. ACTUALIZAR FIREBASE:                     │
│                                             │
│    updateDoc(doc(db, "torres", torreID), {  │
│      pujas: arrayUnion(nuevaPuja),          │
│      fechaFin: nuevaFechaFin, // ← extendida│
│      comentarios: arrayUnion(comentario)    │
│    });                                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ FIREBASE NOTIFICA A TODOS LOS CLIENTES      │
│ CONECTADOS (onSnapshot se dispara)          │
└─────────────────────────────────────────────┘
```

### 5. TODOS LOS USUARIOS VEN LA ACTUALIZACIÓN

```javascript
// En TODOS los navegadores abiertos en esa torre:

onSnapshot(doc(db, "torres", torreID), documento => {
  // ✅ Se recibe la nueva puja automáticamente
  // ✅ Se recibe la nueva fechaFin (extendida)
  // ✅ Se recibe el nuevo comentario

  // UI se actualiza automáticamente:
  // - Lista de ofertas
  // - Cronómetro (con nueva fechaFin)
  // - Contador de ofertas
  // - Badge de oferta mayor
});
```

## 🔑 PUNTOS CLAVE

### 1. **torreID es la clave de conexión**

```javascript
// Desde tu API obtienes:
{
  torreID: "RAFvDAM9Ea",  // ← Este ID conecta API con Firebase
  nombre: "Artículo X",
  montoSalida: 350000,
  ...
}

// Usas ese torreID para Firebase:
onSnapshot(doc(db, "torres", "RAFvDAM9Ea"), ...)
```

### 2. **No hay colisión entre proyectos**

```
Unique Motors:
  API → torreID "ABC123" → Firebase torres/ABC123

Subasta Total:
  API → torreID "XYZ789" → Firebase torres/XYZ789

✅ Cada proyecto usa diferentes torreIDs
✅ Comparten el mismo Firebase, pero documentos diferentes
✅ No se pisan datos porque cada torre es un documento único
```

### 3. **Firebase solo maneja datos en tiempo real**

```
TU API (Backend):
✅ Datos maestros de torres/artículos
✅ Usuarios, autenticación
✅ Garantías, adjudicaciones
✅ Lógica de negocio
✅ Validaciones
✅ Extensión de tiempo

FIREBASE:
✅ Solo pujas en tiempo real
✅ Solo comentarios en tiempo real
✅ Solo fechaFin actualizada
✅ Sincronización entre clientes
```

## 📋 ESTRUCTURA DE DATOS

### Datos de tu API (`/api/Subasta/GetTorre/:id`):

```json
{
  "torreID": "RAFvDAM9Ea",
  "nombre": "Casa en Polanco",
  "descripcion": "Hermosa casa...",
  "montoSalida": 350000,
  "fechaInicio": "2025-12-01T00:00",
  "fechaFin": "2025-12-31T00:00",
  "categoria": "Inmuebles",
  "subCategoria": "Residencial",
  "urlImgPrincipal": "https://...",
  "imagenes": [
    { "url": "https://..." }
  ],
  "subastaID": "SUB001"
}
```

### Datos de Firebase (`torres/RAFvDAM9Ea`):

```json
{
  "fechaFin": "2025-12-31T00:00",
  "pujas": [
    {
      "Monto": 378000,
      "Nickname": "Wormhole384",
      "UsuarioPujaID": "57509edb-...",
      "Fecha": "2025-12-05T17:47:19"
    }
  ],
  "comentarios": [
    {
      "Comentario": "Puja de Wormhole384...",
      "NickName": "Wormhole384",
      "UsuarioID": "57509edb-...",
      "Fecha": "2025-12-05T17:47:19"
    }
  ]
}
```

## 🚀 LO QUE FALTA IMPLEMENTAR

### 1. Crear componente `AuctionBidding` con Firebase

```javascript
// src/components/auction/AuctionBidding.jsx

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../db/firebase';

export const AuctionBidding = ({ torreID }) => {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const unsuscribe = onSnapshot(
      doc(db, "torres", torreID),
      documento => {
        const data = documento.data();

        // Actualizar ofertas en tiempo real
        const arregloOfertas = data.pujas
          .sort((a,b) => b.Monto - a.Monto);

        setOfertas(arregloOfertas.slice(0, 5));
      }
    );

    return () => unsuscribe();
  }, [torreID]);

  return (
    <div className="auction-bidding">
      <h3>Últimas 5 Ofertas:</h3>
      {ofertas.map((oferta, idx) => (
        <div key={idx}>
          <strong>${oferta.Monto.toLocaleString()}</strong> - {oferta.Nickname}
        </div>
      ))}
    </div>
  );
};
```

### 2. Integrar en página de Detalle

```javascript
// src/views/detalle/Detalle.jsx

import { AuctionBidding } from '../../components/auction/AuctionBidding';

// Dentro del componente:
return (
  <div className="detalle-page">
    {/* ... código existente ... */}

    {/* Agregar componente de pujas en tiempo real */}
    {propertyData && (
      <AuctionBidding torreID={id} />
    )}
  </div>
);
```

### 3. Crear servicio para badges en listados

```javascript
// src/services/multipleOffersService.js

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../db/firebase';

export const getCurrentBidForCar = async (torreID) => {
  const torreRef = doc(db, 'torres', torreID);
  const torreDoc = await getDoc(torreRef);

  if (torreDoc.exists()) {
    const data = torreDoc.data();
    const pujas = data.pujas || [];

    if (pujas.length > 0) {
      const sortedPujas = pujas.sort((a, b) => b.Monto - a.Monto);
      return {
        monto: sortedPujas[0].Monto,
        usuario: sortedPujas[0].UsuarioPujaID
      };
    }
  }

  return null;
};
```

### 4. Mostrar badges en cards de subastas

```javascript
// src/views/subasta-detalle/SubastaDetalle.jsx

const [ofertas, setOfertas] = useState({});

useEffect(() => {
  // Obtener ofertas actuales para todas las torres
  const loadOfertas = async () => {
    const torreIDs = torres.map(t => t.torreID);
    const ofertas = await getCurrentBidsForMultipleCars(torreIDs);
    setOfertas(ofertas);
  };

  if (torres.length > 0) {
    loadOfertas();
  }
}, [torres]);

// En el render de cada card:
{ofertas[torre.torreID] && (
  <div className="badge-oferta">
    ${ofertas[torre.torreID].monto.toLocaleString()}
  </div>
)}
```

## ✅ RESUMEN

1. **Tu API** proporciona datos maestros (torreID, nombre, fotos, etc.)
2. **Firebase** maneja solo datos en tiempo real (pujas, comentarios)
3. **torreID** es el puente entre ambos sistemas
4. **No hay colisión** porque cada torre tiene su propio documento
5. **Backend actualiza Firebase** cuando hay nueva puja
6. **Frontend escucha Firebase** para actualizaciones en tiempo real

---

**Fecha**: 2025-12-08
**Estado**: Arquitectura clarificada ✅
**Próximo paso**: Implementar componentes de tiempo real
