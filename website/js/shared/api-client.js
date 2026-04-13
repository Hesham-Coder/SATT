/**
 * Centralized API Client
 * Handles all API requests with error handling and loading states
 */

const apiClient = {
  baseUrl: '/api',
  
  /**
   * Generic GET request
   */
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'same-origin',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  /**
   * Generic POST request
   */
  async post(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  /**
   * Fetch featured content for home page
   */
  async getFeaturedContent() {
    return this.get('/featured');
  },

  /**
   * Fetch posts with pagination
   */
  async getPosts(type = 'all', page = 1, limit = 10) {
    return this.get(`/posts?type=${type}&page=${page}&limit=${limit}`);
  },

  /**
   * Fetch single post by slug
   */
  async getPostBySlug(slug) {
    return this.get(`/posts/${slug}`);
  },

  /**
   * Submit contact form
   */
  async submitContact(data) {
    return this.post('/contact', data);
  },
};

// Make available globally
window.apiClient = apiClient;
