```
                        ███████╗ ██╗   ██╗ ██████╗   █████╗  ███████╗ ████████╗  █████╗
                        ██╔════╝ ██║   ██║ ██╔══██╗ ██╔══██╗ ██╔════╝ ╚══██╔══╝ ██╔══██╗
                        ███████╗ ██║   ██║ ██████╔╝ ███████║ ███████╗    ██║    ███████║
                        ╚════██║ ██║   ██║ ██╔══██╗ ██╔══██║ ╚════██║    ██║    ██╔══██║
                        ███████║ ╚██████╔╝ ██████╔╝ ██║  ██║ ███████║    ██║    ██║  ██║
                        ╚══════╝  ╚═════╝  ╚═════╝  ╚═╝  ╚═╝ ╚══════╝    ╚═╝    ╚═╝  ╚═╝
                       
                               ████████╗  ██████╗  ████████╗  █████╗  ██╗
                               ╚══██╔══╝ ██╔═══██╗ ╚══██╔══╝ ██╔══██╗ ██║
                                  ██║    ██║   ██║    ██║    ███████║ ██║
                                  ██║    ██║   ██║    ██║    ██╔══██║ ██║
                                  ██║    ╚██████╔╝    ██║    ██║  ██║ ███████╗
                                  ╚═╝     ╚═════╝     ╚═╝    ╚═╝  ╚═╝ ╚══════╝
```
<div align="center">

**Primera plataforma online especializada en subastas de inmuebles en México**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-6.0-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)

![Version](https://img.shields.io/badge/version-0.0.2-green.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-development-yellow.svg?style=flat-square)
![Architecture](https://img.shields.io/badge/architecture-feature--based-blue.svg?style=flat-square)

</div>


## Arquitectura Feature-Based

Este proyecto utiliza una arquitectura feature-based.

```
src/
├── styles/
│   └── subasta-total-main.css
├── layout/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── header.css
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── footer.css
│   └── Layout.jsx
├── views/
│   ├── homepage/
│   │   └── Homepage.jsx
│   ├── auth/                    
│   │   └── [componentes auth]
│   ├── nosotros/                
│   │   └── [about components]
│   ├── compradores/          
│   │   └── [buyer components]
│   ├── vendedores/           
│   │   └── [seller components]
│   ├── subastas/              
│   │   └── [auction components]
│   └── contacto/               
│       └── [contact components]
├── shared/
│   └── components/             
└── App.jsx                     
```

## Estructura de Views (Feature-Based)

En la carpeta `views/`cada subcarpeta representa una funcionalidad completa del sitio:

### Homepage (`/views/homepage/`)
- **Propósito**: Landing page principal con hero section
- **Características**: Gradientes, call-to-actions, propuesta

### Auth (`/views/auth/`)
- **Características**: Login, registro, recuperación de contraseña
- **Integración**: Modal de acceso desde dropdown del header

### Nosotros (`/views/nosotros/`)
- **Propósito**: Página corporativa e institucional
- **Características**: Historia de la empresa, misión, valores, equipo
- **Contenido**: 14+ años de experiencia en subastas inmobiliarias

### Compradores (`/views/compradores/`)
- **Propósito**: Portal dedicado a compradores potenciales
- **Características**: Proceso de registro, beneficios, requisitos
- **Flujo**: Onboarding completo para nuevos compradores

### Vendedores (`/views/vendedores/`)
- **Propósito**: Portal para propietarios que quieren vender
- **Características**: Proceso de venta, comisiones, tipos de propiedad
- **Integración**: Formularios de alta de propiedades

### Subastas (`/views/subastas/`)
- **Propósito**: Catálogo principal de propiedades en subasta
- **Características**: Listado, filtros, detalles, sistema de ofertas
- **Funcionalidad Principal**: Sistema de subastas en tiempo real

### Contacto (`/views/contacto/`)
- **Propósito**: Canal de comunicación con prospectos y clientes
- **Características**: Formulario de contacto, información, localización
- **Integración**: Newsletter y soporte técnico

## Sistema de Colores

- **Verde Principal**: `#21504c` - Color corporativo principal
- **Negro**: `#000000` - Textos y elementos de contraste
- **Blanco**: `#FFFFFF` - Fondos y textos sobre verde
- **Grises**: Escala completa para backgrounds y elementos UI

### Variables CSS
```css
:root {
  --st-green: #21504c;
  --st-green-light: #2a6157;
  --st-green-dark: #1a403c;
  --st-black: #000000;
  --st-white: #FFFFFF;
  --st-gray-[50-900]: /* Escala completa de grises */
}
```

---

<div align="center">
  <p>Desarrollado por Luis Felipe Fernández Gurrola para ESCOTEL® </p>
  <p>Subasta Total • Plataforma de Subastas • Tiempo Real</p>
  
  ![License](https://img.shields.io/badge/Template-ThemesLand-FF6B35?style=flat-square)
  ![React](https://img.shields.io/badge/React_Code-Luis_Fernández-61DAFB?style=flat-square)
  ![Status](https://img.shields.io/badge/License-Compliant-4CAF50?style=flat-square)
</div>
