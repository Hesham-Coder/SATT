/**
 * Website Theme Manager
 * Manages theme switching for the public website
 * Supports: auto, dark, light, ocean, sunset
 */

window.WebsiteThemeManager = (function() {
  const STORAGE_KEY = 'site-theme';
  const THEME_ATTR = 'data-site-theme';
  
  // Available themes
  const THEMES = ['auto', 'dark', 'light', 'ocean', 'sunset'];
  
  /**
   * Resolve auto theme to actual theme
   * @returns {string} Resolved theme (dark, light, ocean, or sunset)
   */
  function resolveAutoTheme() {
    // Check OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Time-based fallback (6am-7pm = light, else dark)
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 19;
    
    // Return based on preference, fallback to time
    return prefersDark ? 'dark' : (isDay ? 'light' : 'dark');
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  function getCurrentTheme() {
    const stored = localStorage.getItem(STORAGE_KEY) || 'auto';
    return stored;
  }

  /**
   * Get actual theme (resolves 'auto' to real theme)
   * @returns {string} Actual theme (dark, light, ocean, sunset)
   */
  function getActualTheme() {
    const current = getCurrentTheme();
    if (current === 'auto') {
      return resolveAutoTheme();
    }
    return current;
  }

  /**
   * Apply theme to page
   * @param {string} theme - Theme name
   */
  function applyTheme(theme) {
    if (!THEMES.includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    const actual = theme === 'auto' ? resolveAutoTheme() : theme;
    document.documentElement.setAttribute(THEME_ATTR, actual);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Initialize theme system
   */
  function init() {
    // Apply saved or auto theme
    const saved = localStorage.getItem(STORAGE_KEY) || 'auto';
    applyTheme(saved);

    // Listen for OS theme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', () => {
      if (getCurrentTheme() === 'auto') {
        const actual = resolveAutoTheme();
        document.documentElement.setAttribute(THEME_ATTR, actual);
      }
    });

    // Create and add theme switcher button (mobile only)
    createThemeSwitcher();
  }

  /**
   * Create floating theme switcher button (mobile)
   */
  function createThemeSwitcher() {
    // Check if button already exists
    if (document.querySelector('.site-theme-switcher')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'site-theme-switcher';
    button.setAttribute('aria-label', 'Toggle theme');
    button.innerHTML = '🌙'; // Moon icon for dark mode
    
    // Update icon based on theme
    function updateIcon() {
      const actual = getActualTheme();
      button.innerHTML = actual === 'dark' ? '☀️' : '🌙';
    }
    updateIcon();

    // Toggle on click
    button.addEventListener('click', () => {
      const current = getActualTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      updateIcon();
    });

    document.body.appendChild(button);
  }

  /**
   * Get all available themes
   * @returns {string[]} Array of theme names
   */
  function getAvailableThemes() {
    return [...THEMES];
  }

  /**
   * Public API
   */
  return {
    init,
    applyTheme,
    getCurrentTheme,
    getActualTheme,
    resolveAutoTheme,
    getAvailableThemes,
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.WebsiteThemeManager.init();
  });
} else {
  window.WebsiteThemeManager.init();
}
