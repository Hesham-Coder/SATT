/**
 * About Page Script
 * - Animated stat counters (reuses same pattern as home.js)
 */
document.addEventListener('DOMContentLoaded', function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = String(target).includes('.');
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      progress = 1 - Math.pow(1 - progress, 3);
      var current = target * progress;
      el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animateCount(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { observer.observe(el); });
  } else {
    counters.forEach(animateCount);
  }
});
