/**
 * Home Page Script
 * - Animated stat counters (number count-up on scroll)
 * - Smooth scroll for internal anchor links
 */
document.addEventListener('DOMContentLoaded', function () {
  // --- Animated Counters ---
  // Look for elements with data-count="<target>" and animate them up from 0
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
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

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var isFloat = String(target).includes('.');
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out
      progress = 1 - Math.pow(1 - progress, 3);
      var current = target * progress;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Subtle reveal on scroll ---
  var fadeEls = document.querySelectorAll('[data-fade]');
  if (!fadeEls.length) return;

  fadeEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 420ms ease, transform 420ms ease';
  });

  if (!('IntersectionObserver' in window)) {
    fadeEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach(function (el) {
    fadeObserver.observe(el);
  });
});
