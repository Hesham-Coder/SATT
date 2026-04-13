/**
 * Experts Page Script
 * - Filter visible experts by search query
 */
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('expert-search');
  const cards = document.querySelectorAll('[data-expert-name]');

  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', function () {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach(function (card) {
      const name = (card.getAttribute('data-expert-name') || '').toLowerCase();
      const title = (card.getAttribute('data-expert-title') || '').toLowerCase();
      card.style.display = (!q || name.includes(q) || title.includes(q)) ? '' : 'none';
    });
  });
});
