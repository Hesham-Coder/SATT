/**
 * Post Detail Page Script
 * - Estimated reading time
 * - Scroll-progress indicator
 * - Copy-link button
 */
document.addEventListener('DOMContentLoaded', function () {
  // --- Reading Time ---
  const body = document.getElementById('post-body');
  const readingTimeEl = document.getElementById('reading-time');
  if (body && readingTimeEl) {
    const words = body.innerText.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    readingTimeEl.textContent = mins + ' min read';
  }

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('read-progress');
  if (progressBar && body) {
    function updateProgress() {
      const bodyTop = body.getBoundingClientRect().top + window.scrollY;
      const bodyBottom = bodyTop + body.offsetHeight;
      const windowBottom = window.scrollY + window.innerHeight;
      const total = bodyBottom - bodyTop;
      const done = Math.min(Math.max(windowBottom - bodyTop, 0), total);
      progressBar.style.width = (done / total * 100).toFixed(1) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Copy Link ---
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-symbols-outlined text-base">check</span> Copied!';
        setTimeout(function () { copyBtn.innerHTML = original; }, 2000);
      });
    });
  }
});
