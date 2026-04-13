/**
 * Events / News Page Script
 * - Live search filter across visible post cards
 * - Keyboard navigation support for filter tabs
 */
document.addEventListener('DOMContentLoaded', function () {
  // ── Live search ──────────────────────────────────────────────────
  var searchInput = document.getElementById('events-search');
  var postCards = document.querySelectorAll('[data-post-title]');

  if (searchInput && postCards.length) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      postCards.forEach(function (card) {
        var title = (card.getAttribute('data-post-title') || '').toLowerCase();
        var excerpt = (card.getAttribute('data-post-excerpt') || '').toLowerCase();
        var visible = !q || title.includes(q) || excerpt.includes(q);
        card.style.display = visible ? '' : 'none';
      });
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        postCards.forEach(function (card) { card.style.display = ''; });
      }
    });
  }
});
