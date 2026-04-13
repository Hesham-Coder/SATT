/**
 * Utility Functions
 * Common helpers for all pages
 */

const utils = {
  /**
   * Format date to readable string
   */
  formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return String(text).replace(/[&<>"']/g, (c) => map[c]);
  },

  /**
   * Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Show loading state on element
   */
  showLoading(element) {
    if (!element) return;
    element.innerHTML = '<div class="animate-spin">Loading...</div>';
    element.setAttribute('aria-busy', 'true');
  },

  /**
   * Show error state on element
   */
  showError(element, message = 'An error occurred') {
    if (!element) return;
    element.innerHTML = `<div class="text-red-500 p-4 rounded">${this.escapeHtml(message)}</div>`;
    element.setAttribute('role', 'alert');
  },

  /**
   * Create element from HTML string
   */
  createElement(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },
};

// Make available globally
window.utils = utils;
