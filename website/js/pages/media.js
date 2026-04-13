// Research / media page interactions.
(function () {
  var gallery = document.getElementById('media-gallery');
  if (!gallery) return;

  var cards = Array.prototype.slice.call(gallery.querySelectorAll('[data-research-card]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.research-filter-chip'));
  var search = document.getElementById('media-search');
  var viewButtons = Array.prototype.slice.call(document.querySelectorAll('.research-view-switch button'));

  if (!cards.length) return;

  function getActiveFilter() {
    var active = chips.find(function (chip) {
      return chip.classList.contains('is-active');
    });
    return active ? active.getAttribute('data-filter') : 'all';
  }

  function applyFilters() {
    var q = (search && search.value ? search.value : '').trim().toLowerCase();
    var activeFilter = getActiveFilter();

    cards.forEach(function (card) {
      var filter = String(card.getAttribute('data-filter') || 'all').toLowerCase();
      var title = String(card.getAttribute('data-title') || '').toLowerCase();
      var excerpt = String(card.getAttribute('data-excerpt') || '').toLowerCase();
      var passFilter = activeFilter === 'all' || filter === activeFilter;
      var passSearch = !q || title.indexOf(q) !== -1 || excerpt.indexOf(q) !== -1;
      card.hidden = !(passFilter && passSearch);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (item) {
        item.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      applyFilters();
    });
  });

  if (search) {
    search.addEventListener('input', applyFilters);
    search.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      search.value = '';
      applyFilters();
    });
  }

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var view = button.getAttribute('data-view') || 'grid';
      viewButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      gallery.classList.toggle('is-compact', view === 'compact');
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card, index) {
      card.style.transitionDelay = String(Math.min(index * 36, 240)) + 'ms';
      observer.observe(card);
    });
  } else {
    cards.forEach(function (card) {
      card.classList.add('is-visible');
    });
  }

  applyFilters();
})();
