/**
 * API Endpoint Testing
 * Tests the correct public API endpoints
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 5000,
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          size: Buffer.byteLength(data),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.abort(); reject(new Error('timeout')); });
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function testAPIs() {
  console.log('🔌 TESTING PUBLIC API ENDPOINTS');
  console.log('═'.repeat(70));

  const endpoints = [
    { url: '/api/public/content', name: 'Published Content', method: 'GET' },
    { url: '/api/posts', name: 'Posts List', method: 'GET' },
    { url: '/api/posts?limit=3', name: 'Posts with Pagination', method: 'GET' },
    { url: '/api/auth/check', name: 'Auth Check', method: 'GET' },
  ];

  let passed = 0, failed = 0;

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(BASE_URL + endpoint.url, { method: endpoint.method });
      const isJSON = result.headers['content-type']?.includes('json');
      const isPassed = result.status === 200;

      const status = isPassed ? '✅' : '❌';
      console.log(`${status} ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      console.log(`   Status: ${result.status}, Size: ${result.size} bytes, JSON: ${isJSON ? 'yes' : 'no'}`);

      if (isJSON && result.size > 0) {
        try {
          const data = JSON.parse(result.body);
          console.log(`   Response Type: ${Array.isArray(data) ? 'Array' : typeof data}`);
        } catch (e) {
          console.log(`   Response: Invalid JSON`);
        }
      }

      isPassed ? passed++ : failed++;
    } catch (err) {
      console.log(`❌ ${endpoint.name}`);
      console.log(`   Error: ${err.message}`);
      failed++;
    }
    console.log();
  }

  console.log('═'.repeat(70));
  console.log(`Results: ${passed} passed, ${failed} failed`);
}

testAPIs().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
