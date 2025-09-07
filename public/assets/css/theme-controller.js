/**
 * CONTROLADOR DE TEMAS
 * Sistema para cambiar entre paletas de colores
 */

class ThemeController {
  constructor() {
    this.themes = {
      'original': 'Original',
      'subasta': 'Subasta Segura',
      'dark': 'Modo Oscuro'
    };
    
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
    this.createThemeSelector();
  }

  /**
   * Aplica un tema específico
   */
  applyTheme(themeName) {
    // Remover todas las clases de tema
    Object.keys(this.themes).forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme}`);
    });
    
    // Aplicar el nuevo tema
    document.documentElement.classList.add(`theme-${themeName}`);
    this.currentTheme = themeName;
    
    // Guardar en localStorage
    localStorage.setItem('selectedTheme', themeName);
    
    // Evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeName } 
    }));
    
  }

  /**
   * Carga el tema guardado o usa el por defecto
   */
  loadTheme() {
    return localStorage.getItem('selectedTheme') || 'subasta';
  }

  /**
   * Crea un selector de temas moderno
   */
  createThemeSelector() {
    // Desactivado - no crear el selector
    return;
  }

  /**
   * Obtiene el icono para cada tema
   */
  getThemeIcon(theme) {
    const icons = {
      'original': '🎨',
      'subasta': '🔧', 
      'dark': '🌙'
    };
    return icons[theme] || '🎨'; 
  }

  /**
   * Configura eventos del selector
   */
  setupSelectorEvents() {
    const selector = document.getElementById('theme-selector');
    const trigger = selector.querySelector('.theme-selector-trigger');
    const dropdown = document.getElementById('theme-dropdown');
    const options = dropdown.querySelectorAll('.theme-option');

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selector.classList.toggle('open');
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', () => {
      selector.classList.remove('open');
    });

    // Prevenir cierre al hacer click dentro del dropdown
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Manejar selección de tema
    options.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        this.updateSelectorUI();
        selector.classList.remove('open');
      });
    });
  }

  /**
   * Alterna entre los dos temas
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'original' ? 'subasta' : 'original';
    this.applyTheme(newTheme);
    this.updateToggleUI();
  }

  /**
   * Actualiza la interfaz del toggle
   */
  updateToggleUI() {
    const toggleSwitch = document.getElementById('toggle-switch');
    const toggleLabel = document.querySelector('.toggle-label');
    
    if (toggleSwitch && toggleLabel) {
      const isSubasta = this.currentTheme === 'subasta';
      
      if (isSubasta) {
        toggleSwitch.classList.add('active');
        toggleLabel.textContent = 'Subasta Segura';
      } else {
        toggleSwitch.classList.remove('active');
        toggleLabel.textContent = 'Original';
      }
    }
  }

  /**
   * Obtiene el tema actual
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Obtiene todos los temas disponibles
   */
  getAvailableThemes() {
    return this.themes;
  }

  /**
   * Método para integrar con React/otros frameworks
   */
  onThemeChange(callback) {
    window.addEventListener('themeChanged', callback);
  }

  /**
   * Remueve el toggle de temas
   */
  removeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.remove();
    }
  }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.themeController = new ThemeController();
});

// También exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeController;
}