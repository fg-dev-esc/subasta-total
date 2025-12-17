import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG, buildUrl } from '../../config/apiConfig';
import useScrollTrigger from '../../hooks/useScrollTrigger';
import './perfil.css';

const Perfil = () => {
  useScrollTrigger();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, loading: authLoading, getToken } = useAuth();

  // Obtener tab del query parameter
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'ofertas') return 'ofertas';
    if (tab === 'documentos') return 'documentos';
    return 'datos';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [ofertas, setOfertas] = useState([]);
  const [garantias, setGarantias] = useState([]);
  const [tipoGarantia, setTipoGarantia] = useState(null);
  const [tipoPersona, setTipoPersona] = useState('fisica');
  const [loadingOfertas, setLoadingOfertas] = useState(false);
  const [loadingGarantias, setLoadingGarantias] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [archivosCargados, setArchivosCargados] = useState([]);
  const [loadingArchivos, setLoadingArchivos] = useState(false);
  const [puedeOfertar, setPuedeOfertar] = useState(null);
  const [loadingPuedeOfertar, setLoadingPuedeOfertar] = useState(false);

  // Mock data para documentos
  const [documentos, setDocumentos] = useState([
    { tipoDocumento: 'identificacion', nombre: 'Identificación Oficial', status: 'validado', fechaCarga: '2025-01-15', comentario: 'Documento verificado' },
    { tipoDocumento: 'cSF', nombre: 'Constancia de Situación Fiscal', status: 'en_revision', fechaCarga: '2025-01-10', comentario: 'Datos no legibles' },
    { tipoDocumento: 'curp', nombre: 'CURP', status: 'no_cargado', fechaCarga: null },
    { tipoDocumento: 'comprobanteDomicilio', nombre: 'Comprobante de Domicilio', status: 'validado', fechaCarga: '2025-01-12', comentario: 'Documento verificado' },
    { tipoDocumento: 'estadoCuenta', nombre: 'Estado de Cuenta Bancario', status: 'rechazado', fechaCarga: '2025-01-08', comentario: 'Los datos no coinciden' }
  ]);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/auth?tab=login');
    }
  }, [authLoading, isLoggedIn, navigate]);

  // Actualizar tab cuando cambia la URL
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  // Cargar garantías del usuario
  useEffect(() => {
    const fetchGarantias = async () => {
      const token = getToken();
      if (!token) return;

      setLoadingGarantias(true);
      try {
        const [garantiasRes, tipoRes] = await Promise.all([
          fetch(buildUrl(API_CONFIG.COMPRADOR.GET_GARANTIAS), {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(buildUrl(API_CONFIG.COMPRADOR.GET_TIPO_GARANTIA), {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (garantiasRes.ok) {
          const data = await garantiasRes.json();
          setGarantias(data);
        }
        if (tipoRes.ok) {
          const data = await tipoRes.json();
          setTipoGarantia(data);
        }
      } catch (err) {
        console.error('Error fetching garantias:', err);
      } finally {
        setLoadingGarantias(false);
      }
    };

    if (isLoggedIn) {
      fetchGarantias();
    }
  }, [isLoggedIn, getToken]);


  // Cargar ofertas del usuario
  useEffect(() => {
    const fetchOfertas = async () => {
      const token = getToken();
      if (!token || !user?.usuarioID) return;

      setLoadingOfertas(true);
      try {
        // Primero obtener todas las subastas
        const subastasRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_ALL));
        const subastas = await subastasRes.json();

        const todasLasOfertas = [];

        // Por cada subasta, obtener las torres
        for (const subasta of subastas) {
          const torresRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRES(subasta.subastaID)));
          const torres = await torresRes.json();
          const torresArray = Array.isArray(torres) ? torres : [];

          // Por cada torre, verificar si el usuario tiene ofertas
          for (const torre of torresArray) {
            const pujasRes = await fetch(
              buildUrl(API_CONFIG.PUJAS.GET_PUJAS_USUARIO(user.usuarioID, torre.torreID)),
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (pujasRes.ok) {
              const pujas = await pujasRes.json();
              if (pujas && pujas.length > 0) {
                // Obtener detalles completos de la torre
                const torreDetalleRes = await fetch(buildUrl(API_CONFIG.SUBASTAS.GET_TORRE(torre.torreID)));
                const torreDetalle = await torreDetalleRes.json();

                todasLasOfertas.push({
                  torre: {
                    ...torre,
                    ...torreDetalle
                  },
                  subasta,
                  pujas: pujas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
                  mejorOferta: Math.max(...pujas.map(p => p.monto))
                });
              }
            }
          }
        }

        setOfertas(todasLasOfertas);
      } catch (err) {
        console.error('Error fetching ofertas:', err);
      } finally {
        setLoadingOfertas(false);
      }
    };

    if (isLoggedIn && activeTab === 'ofertas') {
      fetchOfertas();
    }
  }, [isLoggedIn, user, activeTab, getToken]);

  // Función para cargar datos de puedo ofertar
  const fetchPuedeOfertar = async () => {
    const token = getToken();
    if (!token) return;

    setLoadingPuedeOfertar(true);
    try {
      const response = await fetch(buildUrl('/api/Perfil/PuedeOfertar'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPuedeOfertar(data);
      } else {
        setPuedeOfertar({ documentos: false, garantia: false, estaActivo: false, datosCompletos: false });
      }
    } catch (err) {
      console.error('Error al obtener estado de ofertar:', err);
      setPuedeOfertar({ documentos: false, garantia: false, estaActivo: false, datosCompletos: false });
    } finally {
      setLoadingPuedeOfertar(false);
    }
  };

  // Cargar datos de puedo ofertar
  useEffect(() => {
    if (isLoggedIn && activeTab === 'datos') {
      fetchPuedeOfertar();
    }
  }, [isLoggedIn, activeTab]);

  // Cargar archivos cargados del usuario
  useEffect(() => {
    const fetchArchivos = async () => {
      const token = getToken();
      if (!token) return;

      setLoadingArchivos(true);
      try {
        const response = await fetch(buildUrl('/api/FilesComprador/GetDocumentos/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const archivosArray = Array.isArray(data) ? data : [];

          // Construir URL de descarga para cada archivo
          const archivosConUrl = archivosArray.map(archivo => ({
            ...archivo,
            downloadUrl: buildUrl(`/api/FilesComprador/DownloadFile/${archivo.compradorDocumentoID}`)
          }));

          setArchivosCargados(archivosConUrl);
        }
      } catch (err) {
        console.error('Error fetching archivos:', err);
      } finally {
        setLoadingArchivos(false);
      }
    };

    if (isLoggedIn && activeTab === 'documentos') {
      fetchArchivos();
    }
  }, [isLoggedIn, activeTab, getToken]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/perfil?tab=${tab}`, { replace: true });
  };

  const handleDocumentoUpload = async (nombre, file) => {
    if (!file || !nombre) return;

    const token = getToken();
    if (!token) return;

    setUploadingDoc(nombre);

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('file', file);

      const response = await fetch(buildUrl('/api/FilesComprador/PostDocumento'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const updatedRes = await fetch(buildUrl('/api/FilesComprador/GetDocumentos/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          const archivosArray = Array.isArray(data) ? data : [];

          const archivosConUrl = archivosArray.map(archivo => ({
            ...archivo,
            downloadUrl: buildUrl(`/api/FilesComprador/DownloadFile/${archivo.compradorDocumentoID}`)
          }));

          setArchivosCargados(archivosConUrl);
        }
      }
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploadingDoc(null);
    }
  };

  const getDocumentosForPersona = (tipo) => {
    if (tipo === 'fisica') {
      return [
        { id: 'identificacion', nombre: 'Identificación Oficial' },
        { id: 'cSF', nombre: 'Constancia de Situación Fiscal' },
        { id: 'curp', nombre: 'CURP' },
        { id: 'comprobanteDomicilio', nombre: 'Comprobante de Domicilio' },
        { id: 'estadoCuenta', nombre: 'Estado de Cuenta Bancario' }
      ];
    } else {
      return [
        { id: 'actaConstitutiva', nombre: 'Acta Constitutiva' },
        { id: 'poderNotarial', nombre: 'Poder Notarial' },
        { id: 'idApoderado', nombre: 'Identificación Oficial del Apoderado Legal' },
        { id: 'cSF', nombre: 'Constancia de Situación Fiscal' },
        { id: 'boletaRegistro', nombre: 'Boleta de Inscripción al Registro Público de Comercio' },
        { id: 'comprobanteDomicilio', nombre: 'Comprobante de Domicilio' },
        { id: 'estadoCuenta', nombre: 'Estado de Cuenta Bancario' }
      ];
    }
  };

  const getDocumentoStatus = (documentoId) => {
    const doc = documentos.find(d => d.tipoDocumento === documentoId);
    return doc?.status || 'no_cargado';
  };

  const getPropertyImage = (torre) => {
    if (torre?.imagenes && torre.imagenes.length > 0) {
      return torre.imagenes[0].url;
    }
    return torre?.urlImgPrincipal || '/assets/img/placeholder-property.jpg';
  };

  if (authLoading) {
    return (
      <div className="perfil-page page-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Obtener inicial del nombre
  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="perfil-page page-container">
      {/* Hero Section */}
      <section className="st-perfil-hero-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="st-perfil-hero-content">
                <div className="st-perfil-avatar">
                  {getInitial(user?.nombre)}
                </div>
                <div className="st-perfil-info">
                  <span className="st-perfil-greeting">Bienvenido</span>
                  <h1>{user?.nombre || 'Usuario'}</h1>
                  <p className="st-perfil-email">
                    <i className="fas fa-envelope me-2"></i>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="st-perfil-tabs-section">
        <div className="container">
          <div className="st-perfil-tabs">
            <button
              className={`st-perfil-tab ${activeTab === 'datos' ? 'active' : ''}`}
              onClick={() => handleTabChange('datos')}
            >
              <i className="fas fa-user"></i>
              Mis Datos
            </button>
            <button
              className={`st-perfil-tab ${activeTab === 'ofertas' ? 'active' : ''}`}
              onClick={() => handleTabChange('ofertas')}
            >
              <i className="fas fa-gavel"></i>
              Mis Ofertas
            </button>
            <button
              className={`st-perfil-tab ${activeTab === 'documentos' ? 'active' : ''}`}
              onClick={() => handleTabChange('documentos')}
            >
              <i className="fas fa-file-contract"></i>
              Mis Documentos
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="st-perfil-content-section">
        <div className="container">
          {activeTab === 'datos' && (
            <div className="st-perfil-datos">
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <div className="st-perfil-card">
                    <h3><i className="fas fa-id-card"></i> Información Personal</h3>
                    <div className="st-perfil-field">
                      <label>Nombre</label>
                      <p>{user?.nombre || '-'}</p>
                    </div>
                    <div className="st-perfil-field">
                      <label>Email</label>
                      <p>{user?.email || '-'}</p>
                    </div>
                    <div className="st-perfil-field">
                      <label>ID de Comprador</label>
                      <p className="st-perfil-id">{user?.compradorID || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mb-4">
                  <div className="st-perfil-card">
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                      <h3 style={{margin: 0}}><i className="fas fa-check-double"></i>Estatus</h3>
                      <button
                        onClick={fetchPuedeOfertar}
                        disabled={loadingPuedeOfertar}
                        className="btn btn-sm"
                        style={{
                          background: 'var(--st-green)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 15px',
                          fontSize: '13px',
                          cursor: loadingPuedeOfertar ? 'not-allowed' : 'pointer',
                          opacity: loadingPuedeOfertar ? 0.6 : 1,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loadingPuedeOfertar ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-1"></i>
                            Verificando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sync-alt me-1"></i>
                            Verificar
                          </>
                        )}
                      </button>
                    </div>
                    {loadingPuedeOfertar ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : puedeOfertar ? (
                      <div className="st-puedo-ofertar">
                        <div className="st-estado-item" style={{marginBottom: '15px', padding: '10px', borderRadius: '4px'}}>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><i className="fas fa-shield-alt"></i> Garantía</span>
                            {puedeOfertar.garantia ? (
                              <span style={{color: '#28a745'}}><i className="fas fa-check-circle"></i> Validado</span>
                            ) : (
                              <span style={{color: '#ffc107'}}><i className="fas fa-exclamation-circle"></i> Pendiente</span>
                            )}
                          </div>
                        </div>
                        <div className="st-estado-item" style={{marginBottom: '15px', padding: '10px', borderRadius: '4px'}}>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><i className="fas fa-file-contract"></i> Documentos</span>
                            {puedeOfertar.documentos ? (
                              <span style={{color: '#28a745'}}><i className="fas fa-check-circle"></i> Validado</span>
                            ) : (
                              <span style={{color: '#ffc107'}}><i className="fas fa-exclamation-circle"></i> Pendiente</span>
                            )}
                          </div>
                        </div>
                        <div className="st-estado-item" style={{marginBottom: '15px', padding: '10px', borderRadius: '4px'}}>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><i className="fas fa-check"></i> Activo</span>
                            {puedeOfertar.estaActivo ? (
                              <span style={{color: '#28a745'}}><i className="fas fa-check-circle"></i> Validado</span>
                            ) : (
                              <span style={{color: '#ffc107'}}><i className="fas fa-exclamation-circle"></i> Pendiente</span>
                            )}
                          </div>
                        </div>
                        <div className="st-estado-item" style={{marginBottom: '20px', padding: '10px', borderRadius: '4px'}}>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><i className="fas fa-user-check"></i> Datos Completos</span>
                            {puedeOfertar.datosCompletos ? (
                              <span style={{color: '#28a745'}}><i className="fas fa-check-circle"></i> Validado</span>
                            ) : (
                              <span style={{color: '#ffc107'}}><i className="fas fa-exclamation-circle"></i> Pendiente</span>
                            )}
                          </div>
                        </div>
                        {puedeOfertar.garantia && puedeOfertar.documentos && puedeOfertar.estaActivo && puedeOfertar.datosCompletos ? (
                          <div style={{
                            background: '#28a745',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginTop: '10px'
                          }}>
                            <i className="fas fa-gavel me-2"></i>
                            Puede Ofertar
                          </div>
                        ) : (
                          <div style={{
                            background: '#dc3545',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginTop: '10px'
                          }}>
                            <i className="fas fa-times-circle me-2"></i>
                            AÚN NO PUEDES OFERTAR
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ofertas' && (
            <div className="st-perfil-ofertas">
              {loadingOfertas ? (
                <div className="st-loading-ofertas">
                  <div className="st-loading-spinner"></div>
                  <p>Buscando tus ofertas...</p>
                </div>
              ) : ofertas.length === 0 ? (
                <div className="st-perfil-empty">
                  <i className="fas fa-gavel"></i>
                  <h3>No tienes ofertas activas</h3>
                  <p>Explora nuestras subastas y realiza tu primera oferta</p>
                  <button
                    className="st-property-btn"
                    onClick={() => navigate('/subastas')}
                  >
                    Ver Subastas
                  </button>
                </div>
              ) : (
                <div className="row">
                  {ofertas.map((oferta, index) => (
                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                      <div className="st-oferta-card">
                        <div className="st-oferta-image">
                          <img
                            src={getPropertyImage(oferta.torre)}
                            alt={oferta.torre.nombre}
                            onError={(e) => {
                              e.target.src = '/assets/img/placeholder-property.jpg';
                            }}
                          />
                          <div className="st-oferta-badge">
                            <span className="badge bg-success">
                              <i className="fas fa-gavel me-1"></i>
                              {oferta.pujas.length} {oferta.pujas.length === 1 ? 'oferta' : 'ofertas'}
                            </span>
                          </div>
                        </div>
                        <div className="st-oferta-content">
                          <h5 className="st-oferta-title">{oferta.torre.nombre}</h5>
                          <p className="st-oferta-location">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {oferta.torre.municipio || oferta.torre.estado || 'Sin ubicación'}
                          </p>
                          <div className="st-oferta-details">
                            <div className="st-oferta-detail">
                              <span className="label">Mi mejor oferta</span>
                              <span className="value text-success">{formatPrice(oferta.mejorOferta)}</span>
                            </div>
                            <div className="st-oferta-detail">
                              <span className="label">Precio inicial</span>
                              <span className="value">{formatPrice(oferta.torre.montoSalida)}</span>
                            </div>
                            <div className="st-oferta-detail">
                              <span className="label">Última oferta</span>
                              <span className="value text-muted">{formatDate(oferta.pujas[0].fecha)}</span>
                            </div>
                          </div>
                          <button
                            className="st-oferta-btn"
                            onClick={() => navigate(`/detalle/${oferta.torre.torreID}`)}
                          >
                            Ver Artículo
                            <i className="fas fa-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="st-perfil-documentos">
              {/* Fila superior: Documentos Requeridos y Formulario de Carga */}
              <div className="row mb-4">
                {/* Columna Izquierda: Documentos Requeridos */}
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <div className="st-perfil-card">
                    <h3 style={{color: 'var(--st-green)', marginBottom: '20px'}}>
                      <i className="fas fa-file-check" style={{marginRight: '10px'}}></i>
                      Documentos Requeridos
                    </h3>
                    <div className="st-docs-required-list">
                      {tipoPersona === 'fisica' ? (
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-id-card" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Identificación Oficial</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-file-invoice-dollar" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Constancia de Situación Fiscal</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-home" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Comprobante de Domicilio</span>
                          </li>
                          <li style={{padding: '12px 0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-university" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Estado de Cuenta Bancario</span>
                          </li>
                        </ul>
                      ) : (
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-user-tie" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Identificación del Apoderado Legal</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-file-contract" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Acta Constitutiva</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-stamp" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Poder Notarial</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-receipt" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Cédula Fiscal</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-file-invoice-dollar" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Constancia de Situación Fiscal</span>
                          </li>
                          <li style={{padding: '12px 0', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-home" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Comprobante de Domicilio</span>
                          </li>
                          <li style={{padding: '12px 0', display: 'flex', alignItems: 'center'}}>
                            <i className="fas fa-university" style={{color: 'var(--st-green)', marginRight: '12px', minWidth: '20px', fontSize: '18px'}}></i>
                            <span style={{fontSize: '15px'}}>Estado de Cuenta Bancario</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Formulario de Carga */}
                <div className="col-lg-6">
                  <div className="st-perfil-card">
                    <h3 style={{color: 'var(--st-green)', marginBottom: '20px'}}>
                      <i className="fas fa-file-upload" style={{marginRight: '10px'}}></i>
                      Subir Documentos
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const nombre = document.getElementById('doc-nombre')?.value;
                      const file = document.getElementById('doc-file')?.files?.[0];
                      if (nombre && file) {
                        handleDocumentoUpload(nombre, file);
                        document.getElementById('doc-nombre').value = '';
                        document.getElementById('doc-file').value = '';
                      }
                    }} className="st-upload-form">
                      <div className="st-form-group" style={{marginBottom: '20px'}}>
                        <label htmlFor="doc-nombre" style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Nombre del Documento</label>
                        <input
                          type="text"
                          id="doc-nombre"
                          className="form-control"
                          placeholder="Ej: Identificación oficial"
                          required
                          style={{padding: '10px', fontSize: '14px'}}
                        />
                      </div>
                      <div className="st-form-group" style={{marginBottom: '20px'}}>
                        <label htmlFor="doc-file" style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Archivo</label>
                        <input
                          type="file"
                          id="doc-file"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          style={{padding: '10px', fontSize: '14px'}}
                        />
                      </div>
                      <button
                        type="submit"
                        className="st-property-btn"
                        style={{width: '100%', padding: '12px', fontSize: '16px'}}
                        disabled={uploadingDoc}
                      >
                        {uploadingDoc ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload me-2"></i>
                            Guardar documento
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Fila inferior: Documentos Cargados - Ancho completo */}
              <div className="row">
                <div className="col-12">
                  <div className="st-perfil-card">
                    <h3 style={{color: 'var(--st-green)', marginBottom: '20px'}}>
                      <i className="fas fa-file-contract" style={{marginRight: '10px'}}></i>
                      Documentos Cargados
                    </h3>
                    {loadingArchivos ? (
                      <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : archivosCargados.length === 0 ? (
                      <div className="text-center py-5" style={{color: '#6c757d'}}>
                        <i className="fas fa-folder-open" style={{fontSize: '48px', marginBottom: '15px', opacity: 0.5}}></i>
                        <p style={{fontSize: '16px', margin: 0}}>No hay documentos cargados aún</p>
                      </div>
                    ) : (
                      <div className="row">
                        {archivosCargados.map((archivo, idx) => (
                          <div key={idx} className="col-md-6 col-lg-4 mb-3">
                            <div className="card h-100" style={{border: '1px solid #e0e0e0', borderRadius: '8px', transition: 'all 0.3s ease'}}>
                              <div className="card-body" style={{padding: '20px'}}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <i className="fas fa-file-pdf" style={{fontSize: '24px', color: 'var(--st-green)'}}></i>
                                    <span style={{fontSize: '15px', fontWeight: '500', flex: 1, wordBreak: 'break-word'}}>
                                      {archivo.nombre || 'Sin nombre'}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const token = getToken();
                                      fetch(archivo.downloadUrl, {
                                        headers: { 'Authorization': `Bearer ${token}` }
                                      })
                                      .then(res => res.blob())
                                      .then(blob => {
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = archivo.nombre + archivo.ext;
                                        a.click();
                                      });
                                    }}
                                    className="btn btn-sm btn-primary"
                                    style={{width: '100%', padding: '8px 12px'}}
                                  >
                                    <i className="fas fa-download me-2"></i> Descargar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Perfil;
