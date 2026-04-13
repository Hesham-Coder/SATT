/**
 * Services Page Script
 * - "Show more" toggle for long service descriptions
 * - Fade-in on scroll for service cards
 */
document.addEventListener('DOMContentLoaded', function () {
  // ── Show more / less for descriptions ────────────────────────────
  document.querySelectorAll('[data-expandable]').forEach(function (container) {
    var toggle = container.querySelector('[data-expand-btn]');
    var body = container.querySelector('[data-expand-body]');
    if (!toggle || !body) return;

    toggle.addEventListener('click', function () {
      var expanded = body.getAttribute('data-expanded') === 'true';
      if (expanded) {
        body.style.maxHeight = body.getAttribute('data-collapsed-h') || '96px';
        body.setAttribute('data-expanded', 'false');
        toggle.textContent = 'Show more';
      } else {
        body.setAttribute('data-collapsed-h', body.style.maxHeight || '96px');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.setAttribute('data-expanded', 'true');
        toggle.textContent = 'Show less';
      }
    });
  });

  // ── Fade-in on scroll ────────────────────────────────────────────
  var cards = document.querySelectorAll('[data-service-card]');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = 'opacity 380ms ease, transform 380ms ease';
  });

  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (card) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 40);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });
});
