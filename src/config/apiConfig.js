export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,

  AUTH: {
    REGISTRO: '/api/Actions/RegistroComprador',
    LOGIN: '/api/Login'
  },

  SUBASTAS: {
    GET_ALL: '/api/Subasta/GetSubastas',
    GET_BY_ID: (id) => `/api/Subasta/GetSubasta/${id}`,
    GET_TORRES: (subastaID) => `/api/Subasta/GetTorres/${subastaID}`,
    GET_TORRE: (torreID) => `/api/Subasta/GetTorre/${torreID}`
  },

  PUJAS: {
    PUJAR: '/api/Pujas/Pujar',
    GET_PUJAS_USUARIO: (usuarioID, torreID) => `/api/Pujas/GetPujasUsuario/${usuarioID}/${torreID}`,
    GET_PUJAS_TORRE: (torreID) => `/api/AdminPujas/GetPujasTorre/${torreID}`
  },

  COMPRADOR: {
    GET_GARANTIAS: '/api/CompradorGarantias/GetGarantias',
    GET_TIPO_GARANTIA: '/api/Garantias/GetTipoGarantia',
    GET_ADJUDICACIONES: '/api/InfoComprador/GetAdjudicaciones'
  },

  COMENTARIOS: {
    ENVIAR: '/api/Comentarios'
  }
};

export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
