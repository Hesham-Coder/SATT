document.addEventListener('DOMContentLoaded', function () {
  var currentPath = window.location.pathname;
  var resolvedPath = currentPath;

  if (resolvedPath.indexOf('/post/') === 0 || resolvedPath.indexOf('/posts/') === 0 || resolvedPath === '/news') {
    resolvedPath = '/events';
  }

  document.querySelectorAll('[data-route]').forEach(function (link) {
    var route = link.getAttribute('data-route') || link.getAttribute('href') || '/';
    var isActive = route === resolvedPath || (route === '/' && resolvedPath === '/');
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  var siteHeader = document.getElementById('site-header');
  function syncHeaderState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', syncHeaderState, { passive: true });
  syncHeaderState();

  var menuButton = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');

  if (!menuButton || !menu) return;

  function setMenuState(open) {
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menuButton.addEventListener('click', function () {
    setMenuState(menu.hidden);
  });

  menu.addEventListener('click', function (event) {
    if (event.target && event.target.closest('[data-mobile-close="true"], a')) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });
});
