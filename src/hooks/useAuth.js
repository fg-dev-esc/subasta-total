import { useState, useEffect, useCallback } from 'react';

// Decodificar JWT sin librerías externas
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Verificar si el token ha expirado
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');

    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token);
      setUser({
        email: decoded.email,
        nombre: decoded.nombre,
        usuarioID: decoded.usuarioID,
        compradorID: decoded.CompradorID,
        vendedorID: decoded.VendedorID
      });
      setIsLoggedIn(true);
    } else {
      if (token) {
        localStorage.removeItem('token');
      }
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();

    // Escuchar cambios en localStorage (para sincronizar entre tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    // Escuchar evento custom para login/logout en la misma ventana
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  return {
    isLoggedIn,
    user,
    loading,
    logout,
    getToken,
    checkAuth
  };
};
