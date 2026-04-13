window.WebsiteThemeManager = (function () {
  var STORAGE_KEY = 'site-theme';
  var THEME_ATTR = 'data-site-theme';
  var THEMES = ['auto', 'dark', 'light', 'ocean', 'sunset'];

  function resolveAutoTheme() {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var hour = new Date().getHours();
    var isDay = hour >= 6 && hour < 19;
    return prefersDark ? 'dark' : (isDay ? 'light' : 'dark');
  }

  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function getActualTheme() {
    var current = getCurrentTheme();
    return current === 'auto' ? resolveAutoTheme() : current;
  }

  function applyTheme(theme) {
    if (THEMES.indexOf(theme) === -1) {
      return;
    }
    var actualTheme = theme === 'auto' ? resolveAutoTheme() : theme;
    document.documentElement.setAttribute(THEME_ATTR, actualTheme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function bindToggleButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var current = getActualTheme();
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });
  }

  function init() {
    applyTheme(getCurrentTheme());

    var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', function () {
      if (getCurrentTheme() === 'auto') {
        document.documentElement.setAttribute(THEME_ATTR, resolveAutoTheme());
      }
    });

    bindToggleButtons();
  }

  return {
    init: init,
    applyTheme: applyTheme,
    getCurrentTheme: getCurrentTheme,
    getActualTheme: getActualTheme,
    resolveAutoTheme: resolveAutoTheme,
    getAvailableThemes: function () { return THEMES.slice(); },
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    window.WebsiteThemeManager.init();
  });
} else {
  window.WebsiteThemeManager.init();
}
