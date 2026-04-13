/**
 * Insurance Page Script
 * - Search/filter insurance companies
 */
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('insurance-search');
  const cards = document.querySelectorAll('[data-company-name]');

  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', function () {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach(function (card) {
      const name = (card.getAttribute('data-company-name') || '').toLowerCase();
      card.style.display = (!q || name.includes(q)) ? '' : 'none';
    });
  });
});
