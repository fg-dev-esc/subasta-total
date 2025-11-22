import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, buildUrl } from '../../../config/apiConfig';

// Thunk para cargar ofertas de una torre
export const fetchOfertasTorre = createAsyncThunk(
  'auction/fetchOfertasTorre',
  async (torreID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildUrl(API_CONFIG.PUJAS.GET_PUJAS_TORRE(torreID)), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error('Error al cargar ofertas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para realizar una oferta
export const realizarOferta = createAsyncThunk(
  'auction/realizarOferta',
  async ({ torreID, monto }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para hacer una oferta');
      }

      const response = await fetch(buildUrl(API_CONFIG.PUJAS.PUJAR), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ torreID, monto })
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || 'Error al realizar la oferta');
      }

      // Recargar ofertas después de oferta exitosa
      dispatch(fetchOfertasTorre(torreID));

      return { monto, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  ofertas: [],
  ofertaActual: null,
  totalOfertas: 0,
  loading: false,
  loadingOferta: false,
  error: null,
  ofertaExitosa: null
};

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    clearOfertaExitosa: (state) => {
      state.ofertaExitosa = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuction: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOfertasTorre
      .addCase(fetchOfertasTorre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfertasTorre.fulfilled, (state, action) => {
        state.loading = false;
        state.ofertas = action.payload;
        state.totalOfertas = action.payload.length;
        // La primera oferta es la más alta
        if (action.payload.length > 0) {
          // Ordenar por monto desc para asegurar
          const sorted = [...action.payload].sort((a, b) => b.monto - a.monto);
          state.ofertaActual = sorted[0];
        } else {
          state.ofertaActual = null;
        }
      })
      .addCase(fetchOfertasTorre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // realizarOferta
      .addCase(realizarOferta.pending, (state) => {
        state.loadingOferta = true;
        state.error = null;
        state.ofertaExitosa = null;
      })
      .addCase(realizarOferta.fulfilled, (state, action) => {
        state.loadingOferta = false;
        state.ofertaExitosa = action.payload.monto;
      })
      .addCase(realizarOferta.rejected, (state, action) => {
        state.loadingOferta = false;
        state.error = action.payload;
      });
  }
});

export const { clearOfertaExitosa, clearError, resetAuction } = auctionSlice.actions;
export default auctionSlice.reducer;
