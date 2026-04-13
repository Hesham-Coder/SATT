(function () {
  var STORAGE_KEY = 'lang';
  var COOKIE_KEY = 'site_lang';

  function setCookie(lang) {
    document.cookie = COOKIE_KEY + '=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
  }

  function applyLang(lang) {
    var next = lang === 'ar' ? 'ar' : 'en';
    var html = document.documentElement;
    html.setAttribute('lang', next);
    html.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    html.classList.toggle('lang-ar', next === 'ar');
    html.classList.toggle('lang-en', next !== 'ar');

    var label = document.getElementById('lang-toggle-label');
    if (label) {
      label.textContent = next === 'ar' ? 'English' : 'العربية';
    }
  }

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (error) {
      return 'en';
    }
  }

  applyLang(getStoredLang());

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('lang-toggle-btn');
    if (!button) return;

    button.addEventListener('click', function () {
      var current = getStoredLang();
      var next = current === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {}
      setCookie(next);
      applyLang(next);
      window.location.reload();
    });
  });
})();
