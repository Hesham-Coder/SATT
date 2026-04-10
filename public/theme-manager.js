/**
 * Admin Dashboard Theme Manager
 * Manages themes for admin dashboard and website
 * Provides theme switching UI and persistence
 */

window.ThemeManager = (function() {
  const STORAGE_KEY = 'admin-theme';
  const WEBSITE_STORAGE_KEY = 'site-theme';
  const THEME_ATTR = 'data-theme';
  const WEBSITE_THEME_ATTR = 'data-site-theme';
  
  // Available admin themes
  const ADMIN_THEMES = {
    dark: { name: 'Dark', icon: '🌙', gradient: 'linear-gradient(135deg, #0f1419, #1a1f28)' },
    light: { name: 'Light', icon: '☀️', gradient: 'linear-gradient(135deg, #ffffff, #f5f5f5)' },
    ocean: { name: 'Ocean', icon: '🌊', gradient: 'linear-gradient(135deg, #0d1b2a, #1b263b)' },
    sunset: { name: 'Sunset', icon: '🌅', gradient: 'linear-gradient(135deg, #1a0f2e, #2d1b47)' },
    custom: { name: 'Custom', icon: '✨', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  };

  const WEBSITE_THEMES = {
    auto: { name: 'Auto', description: 'OS Default' },
    dark: { name: 'Dark', description: 'Dark Mode' },
    light: { name: 'Light', description: 'Light Mode' },
    ocean: { name: 'Ocean', description: 'Ocean Theme' },
    sunset: { name: 'Sunset', description: 'Sunset Theme' },
  };

  // Custom theme configuration
  let customThemeConfig = {
    bg: '#0f1419',
    primary: '#4a9eff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  /**
   * Get current admin theme
   */
  function getCurrentAdminTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  /**
   * Apply admin theme to page
   */
  function applyAdminTheme(theme) {
    if (!Object.keys(ADMIN_THEMES).includes(theme)) {
      console.warn(`Invalid admin theme: ${theme}`);
      return;
    }

    document.documentElement.setAttribute(THEME_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update UI
    updateThemeUI();
    
    // Trigger custom event
    const event = new CustomEvent('themechange', { 
      detail: { theme, type: 'admin' } 
    });
    window.dispatchEvent(event);
  }

  /**
   * Get current website theme
   */
  function getCurrentWebsiteTheme() {
    return localStorage.getItem(WEBSITE_STORAGE_KEY) || 'auto';
  }

  /**
   * Apply website theme
   */
  function applyWebsiteTheme(theme) {
    if (!Object.keys(WEBSITE_THEMES).includes(theme)) {
      console.warn(`Invalid website theme: ${theme}`);
      return;
    }

    localStorage.setItem(WEBSITE_STORAGE_KEY, theme);

    // Trigger custom event
    const event = new CustomEvent('websitethemechange', { 
      detail: { theme } 
    });
    window.dispatchEvent(event);
  }

  /**
   * Apply custom theme colors
   */
  function applyCustomTheme(config) {
    customThemeConfig = config;

    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--admin-bg', config.bg || '#0f1419');
    root.style.setProperty('--admin-primary', config.primary || '#4a9eff');
    root.style.setProperty('--admin-success', config.success || '#10b981');
    root.style.setProperty('--admin-warning', config.warning || '#f59e0b');
    root.style.setProperty('--admin-error', config.error || '#ef4444');

    // Save to localStorage
    localStorage.setItem('admin-custom-theme', JSON.stringify(config));

    applyAdminTheme('custom');

    // Trigger custom event
    const event = new CustomEvent('customthemeapplied', { 
      detail: { config } 
    });
    window.dispatchEvent(event);
  }

  /**
   * Get custom theme config
   */
  function getCustomThemeConfig() {
    const saved = localStorage.getItem('admin-custom-theme');
    return saved ? JSON.parse(saved) : customThemeConfig;
  }

  /**
   * Initialize theme system and create UI
   */
  function init() {
    // Apply saved admin theme
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyAdminTheme(saved);

    // Load custom theme if it exists
    const customSaved = localStorage.getItem('admin-custom-theme');
    if (customSaved) {
      try {
        customThemeConfig = JSON.parse(customSaved);
      } catch (e) {
        console.warn('Failed to load custom theme config');
      }
    }
  }

  /**
   * Create theme picker UI
   */
  function initUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container not found: ${containerId}`);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Create theme grid
    const grid = document.createElement('div');
    grid.className = 'theme-picker-container';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
    grid.style.gap = '16px';
    grid.style.marginBottom = '20px';

    const current = getCurrentAdminTheme();

    // Add theme swatches
    for (const [themeId, themeData] of Object.entries(ADMIN_THEMES)) {
      const swatch = document.createElement('div');
      swatch.className = `theme-swatch ${themeId === current ? 'active' : ''}`;
      swatch.style.cssText = `
        aspect-ratio: 1;
        border-radius: 8px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        background: ${themeData.gradient};
        padding: 8px;
        font-weight: 600;
        font-size: 13px;
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      `;

      if (themeId === current) {
        swatch.style.borderColor = 'white';
        swatch.style.boxShadow = '0 0 0 3px #4a9eff, 0 4px 12px rgba(0, 0, 0, 0.3)';
      }

      swatch.innerHTML = `
        <div style="font-size: 24px;">${themeData.icon}</div>
        <div>${themeData.name}</div>
      `;

      swatch.addEventListener('click', () => {
        applyAdminTheme(themeId);
      });

      swatch.addEventListener('mouseenter', () => {
        if (themeId !== current) {
          swatch.style.transform = 'scale(1.05)';
          swatch.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        }
      });

      swatch.addEventListener('mouseleave', () => {
        if (themeId !== current) {
          swatch.style.transform = 'scale(1)';
          swatch.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }
      });

      grid.appendChild(swatch);
    }

    container.appendChild(grid);

    // Add divider
    const divider = document.createElement('hr');
    divider.style.cssText = 'margin: 20px 0; opacity: 0.3;';
    container.appendChild(divider);

    // Add custom theme section
    const customSection = document.createElement('div');
    customSection.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;';

    const colors = [
      { key: 'bg', label: 'Background', default: '#0f1419' },
      { key: 'primary', label: 'Primary', default: '#4a9eff' },
      { key: 'success', label: 'Success', default: '#10b981' },
      { key: 'warning', label: 'Warning', default: '#f59e0b' },
      { key: 'error', label: 'Error', default: '#ef4444' },
    ];

    colors.forEach(color => {
      const group = document.createElement('div');
      group.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

      const label = document.createElement('label');
      label.textContent = color.label;
      label.style.cssText = 'font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;';

      const input = document.createElement('input');
      input.type = 'color';
      input.value = customThemeConfig[color.key] || color.default;
      input.style.cssText = 'width: 100%; height: 50px; border-radius: 6px; cursor: pointer; border: none;';

      input.addEventListener('change', () => {
        customThemeConfig[color.key] = input.value;
        applyCustomTheme(customThemeConfig);
      });

      group.appendChild(label);
      group.appendChild(input);
      customSection.appendChild(group);
    });

    container.appendChild(customSection);
  }

  /**
   * Update theme picker UI after theme change
   */
  function updateThemeUI() {
    const swatches = document.querySelectorAll('.theme-swatch');
    const current = getCurrentAdminTheme();

    swatches.forEach(swatch => {
      swatch.classList.remove('active');
      swatch.style.borderColor = 'transparent';
      swatch.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });

    const activeSwatches = document.querySelectorAll(
      `.theme-swatch:has(> div:nth-child(2):contains("${ADMIN_THEMES[current]?.name}"))`
    );
    if (activeSwatches.length === 0) {
      // Fallback: find by theme name in innerHTML
      swatches.forEach(swatch => {
        if (swatch.innerHTML.includes(ADMIN_THEMES[current]?.name)) {
          swatch.classList.add('active');
          swatch.style.borderColor = 'white';
          swatch.style.boxShadow = '0 0 0 3px #4a9eff, 0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      });
    }
  }

  /**
   * Get available admin themes
   */
  function getAdminThemes() {
    return ADMIN_THEMES;
  }

  /**
   * Get available website themes
   */
  function getWebsiteThemes() {
    return WEBSITE_THEMES;
  }

  /**
   * Preview theme without applying
   */
  function previewTheme(theme) {
    if (!Object.keys(ADMIN_THEMES).includes(theme)) return;
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  /**
   * Reset to default theme
   */
  function resetToDefault() {
    applyAdminTheme('dark');
    localStorage.removeItem('admin-custom-theme');
  }

  /**
   * Export theme configuration
   */
  function exportTheme(theme) {
    if (theme === 'custom') {
      return getCustomThemeConfig();
    }
    return { theme };
  }

  /**
   * Import theme configuration
   */
  function importTheme(config) {
    if (config.theme) {
      applyAdminTheme(config.theme);
    } else if (config.bg || config.primary) {
      applyCustomTheme(config);
    }
  }

  /**
   * Public API
   */
  return {
    init,
    initUI,
    applyAdminTheme,
    applyWebsiteTheme,
    applyCustomTheme,
    getCurrentAdminTheme,
    getCurrentWebsiteTheme,
    getCustomThemeConfig,
    getAdminThemes,
    getWebsiteThemes,
    previewTheme,
    resetToDefault,
    exportTheme,
    importTheme,
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ThemeManager.init();
  });
} else {
  window.ThemeManager.init();
}
