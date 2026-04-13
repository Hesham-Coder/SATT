/**
 * Layout Renderer - Manages page templates and rendering
 * Injects common header/footer, SEO tags, and page content
 */

const fs = require('fs').promises;
const path = require('path');

class LayoutRenderer {
  constructor(websiteDir) {
    this.websiteDir = websiteDir;
    this.layoutsDir = path.join(websiteDir, 'layouts');
    this.componentsDir = path.join(websiteDir, 'components');
    this.cache = {};
  }

  /**
   * Loads a template file with caching
   */
  async loadTemplate(filename) {
    const filePath = path.join(this.layoutsDir, filename);
    if (this.cache[filePath]) {
      return this.cache[filePath];
    }
    const content = await fs.readFile(filePath, 'utf-8');
    this.cache[filePath] = content;
    return content;
  }

  /**
   * Loads a component file
   */
  async loadComponent(componentName) {
    const filePath = path.join(this.componentsDir, `${componentName}.html`);
    return fs.readFile(filePath, 'utf-8');
  }

  /**
   * Renders a page with layout
   * @param {string} pageHtml - The page HTML content
   * @param {object} config - Configuration object
   * @param {string} config.title - Page title
   * @param {string} config.description - Meta description
   * @param {string} config.currentPath - Current URL path (for nav highlighting)
   * @param {string} config.language - Language (en|ar)
   * @param {object} config.ogTags - Open Graph tags
   * @param {object} config.data - Page-specific data
   */
  async render(pageHtml, config = {}) {
    const {
      title = 'Page',
      description = '',
      currentPath = '/',
      language = 'en',
      ogTags = {},
      data = {},
      componentData = {},
      canonicalUrl = '',
      keywords = '',
      siteName = '',
      direction = language === 'ar' ? 'rtl' : 'ltr',
    } = config;

    try {
      // Load main layout
      const layout = await this.loadTemplate('main.html');

      // Load shared components
      const header = await this.loadComponent('navbar');
      const footer = await this.loadComponent('footer');

      // Build SEO meta tags
      const seoTags = this.buildSeoTags({
        title,
        description,
        canonicalUrl,
        keywords,
        ogTags,
        language,
        siteName,
      });

      // Build page HTML
      let html = this.replaceLayoutTokens(layout, {
        TITLE: this.escapeHtml(title),
        SEO_TAGS: seoTags,
        HEADER: header,
        CONTENT: pageHtml,
        FOOTER: footer,
        CURRENT_PATH: this.escapeHtml(currentPath),
        LANGUAGE: this.escapeHtml(language),
        DIRECTION: this.escapeHtml(direction),
      });

      // Replace any data variables (e.g., {{data.title}})
      html = this.replaceDataVariables(html, data);

      // Replace component template variables (e.g., {{LOGO_NAME}})
      html = this.replaceComponentVariables(html, componentData);

      return html;
    } catch (error) {
      console.error('Layout renderer error:', error);
      throw error;
    }
  }

  /**
   * Builds SEO meta tags
   */
  buildSeoTags(config) {
    const {
      title,
      description,
      canonicalUrl,
      keywords,
      ogTags = {},
      language,
      siteName,
    } = config;

    let tags = '';

    // Standard meta tags
    tags += `<meta name="description" content="${this.escapeHtml(description)}" />\n`;
    if (keywords) {
      tags += `<meta name="keywords" content="${this.escapeHtml(keywords)}" />\n`;
    }
    tags += `<meta name="robots" content="index, follow" />\n`;
    tags += `<meta name="language" content="${language}" />\n`;

    // Canonical URL
    if (canonicalUrl) {
      tags += `<link rel="canonical" href="${this.escapeHtml(canonicalUrl)}" />\n`;
    }

    // Open Graph tags
    tags += `<meta property="og:title" content="${this.escapeHtml(title)}" />\n`;
    tags += `<meta property="og:description" content="${this.escapeHtml(description)}" />\n`;
    if (siteName) {
      tags += `<meta property="og:site_name" content="${this.escapeHtml(siteName)}" />\n`;
    }
    if (ogTags.image) {
      tags += `<meta property="og:image" content="${this.escapeHtml(ogTags.image)}" />\n`;
    }
    if (ogTags.url) {
      tags += `<meta property="og:url" content="${this.escapeHtml(ogTags.url)}" />\n`;
    }
    if (ogTags.type) {
      tags += `<meta property="og:type" content="${this.escapeHtml(ogTags.type)}" />\n`;
    }

    // Twitter tags
    tags += `<meta name="twitter:title" content="${this.escapeHtml(title)}" />\n`;
    tags += `<meta name="twitter:description" content="${this.escapeHtml(description)}" />\n`;
    if (ogTags.image) {
      tags += `<meta name="twitter:image" content="${this.escapeHtml(ogTags.image)}" />\n`;
    }
    tags += `<meta name="twitter:card" content="summary_large_image" />\n`;

    // Structured Data (JSON-LD) for Organization
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': siteName || 'Comprehensive Cancer Center',
      'url': ogTags.url || '',
      'description': description,
    };
    tags += `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n`;

    return tags;
  }

  /**
   * Replace component variables in HTML (e.g., {{LOGO_NAME}})
   */
  replaceComponentVariables(html, componentData) {
    return html.replace(/\{\{([A-Z][A-Z0-9_]*)\}\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(componentData, key)) {
        return this.escapeHtml(String(componentData[key]));
      }
      return '';
    });
  }

  /**
   * Replace data variables in HTML (e.g., {{data.title}})
   */
  replaceDataVariables(html, data) {
    return html.replace(/\{\{data\.(\w+)\}\}/g, (match, key) => {
      return this.escapeHtml(String(data[key] || ''));
    });
  }

  /**
   * Replace raw layout tokens like {{TITLE}} or {{CONTENT}} in all occurrences.
   */
  replaceLayoutTokens(html, values) {
    let output = html;
    Object.entries(values).forEach(([key, value]) => {
      output = output.split(`{{${key}}}`).join(String(value));
    });
    return output;
  }

  /**
   * Escape HTML characters
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
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache() {
    this.cache = {};
  }
}

module.exports = LayoutRenderer;
