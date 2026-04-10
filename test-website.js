/**
 * COMPREHENSIVE WEBSITE TEST REPORT
 * Tests pages, assets, API functionality, security, and performance
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// Helper HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': options.cookie || '',
        ...options.headers,
      },
      timeout: 5000,
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          contentType: res.headers['content-type'],
          size: Buffer.byteLength(data),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

// Test result logger
function logResult(name, result) {
  TEST_RESULTS.push({ name, ...result });
  const status = result.passed ? '✅' : '❌';
  console.log(`${status} ${name}: ${result.message}`);
}

// Main testing suite
async function runTests() {
  console.log('='.repeat(70));
  console.log('WEBSITE COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(70));
  console.log('');

  // 1. Test main website pages
  console.log('📄 TESTING WEBSITE PAGES');
  console.log('-'.repeat(70));

  const pages = [
    { url: '/', name: 'Home Page (index.html)' },
    { url: '/post.html', name: 'Post Page' },
    { url: '/mobile.html', name: 'Mobile Page' },
    { url: '/desktop.html', name: 'Desktop Page' },
    { url: '/post-desktop.html', name: 'Post Desktop Page' },
  ];

  for (const page of pages) {
    try {
      const result = await makeRequest(BASE_URL + page.url);
      const hasContent = result.body.length > 0;
      const isHTML = result.contentType?.includes('html');
      const hasHtmlTag = result.body.includes('<html');
      
      logResult(page.name, {
        passed: result.status === 200 && hasContent && isHTML,
        message: `Status: ${result.status}, Size: ${result.size} bytes, Valid HTML: ${hasHtmlTag}`,
        statusCode: result.status,
      });
    } catch (err) {
      logResult(page.name, {
        passed: false,
        message: `Error: ${err.message}`,
        error: err.message,
      });
    }
  }

  // 2. Test admin pages
  console.log('');
  console.log('🔐 TESTING ADMIN PAGES');
  console.log('-'.repeat(70));

  const adminPages = [
    { url: '/dashboard.html', name: 'Admin Dashboard' },
    { url: '/content.html', name: 'Content Editor' },
    { url: '/login.html', name: 'Admin Login' },
  ];

  for (const page of adminPages) {
    try {
      const result = await makeRequest(BASE_URL + page.url);
      const hasContent = result.body.length > 0;
      const isHTML = result.contentType?.includes('html');
      
      logResult(page.name, {
        passed: result.status === 200 && hasContent && isHTML,
        message: `Status: ${result.status}, Size: ${result.size} bytes`,
        statusCode: result.status,
      });
    } catch (err) {
      logResult(page.name, {
        passed: false,
        message: `Error: ${err.message}`,
        error: err.message,
      });
    }
  }

  // 3. Test static assets
  console.log('');
  console.log('📦 TESTING STATIC ASSETS');
  console.log('-'.repeat(70));

  const assets = [
    { url: '/css/app.css', name: 'Main CSS (app.css)' },
    { url: '/css/site-themes.css', name: 'Theme CSS (site-themes.css)' },
    { url: '/css/tailwind.output.css', name: 'Tailwind CSS' },
    { url: '/js/app.js', name: 'App JavaScript' },
    { url: '/js/site-theme-manager.js', name: 'Theme Manager JS' },
    { url: '/js/router.js', name: 'Router JS' },
    { url: '/rtl-styles.css', name: 'RTL Styles' },
  ];

  for (const asset of assets) {
    try {
      const result = await makeRequest(BASE_URL + asset.url);
      const hasContent = result.body.length > 0;
      
      logResult(asset.name, {
        passed: result.status === 200,
        message: `Status: ${result.status}, Size: ${result.size} bytes, Empty: ${!hasContent}`,
        statusCode: result.status,
        isEmpty: !hasContent,
      });
    } catch (err) {
      logResult(asset.name, {
        passed: false,
        message: `Error: ${err.message}`,
        error: err.message,
      });
    }
  }

  // 4. Test API endpoints
  console.log('');
  console.log('🔌 TESTING API ENDPOINTS');
  console.log('-'.repeat(70));

  const apiEndpoints = [
    { url: '/api/content', name: 'GET /api/content', method: 'GET' },
    { url: '/api/content/published', name: 'GET /api/content/published', method: 'GET' },
    { url: '/api/auth/check', name: 'GET /api/auth/check', method: 'GET' },
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const result = await makeRequest(BASE_URL + endpoint.url, { method: endpoint.method });
      const isJSON = result.contentType?.includes('json');
      
      logResult(endpoint.name, {
        passed: result.status === 200 || result.status === 401,
        message: `Status: ${result.status}, IsJSON: ${isJSON}, Size: ${result.size} bytes`,
        statusCode: result.status,
      });
    } catch (err) {
      logResult(endpoint.name, {
        passed: false,
        message: `Error: ${err.message}`,
        error: err.message,
      });
    }
  }

  // 5. Test page content features
  console.log('');
  console.log('🎨 TESTING PAGE FEATURES');
  console.log('-'.repeat(70));

  try {
    const indexResult = await makeRequest(BASE_URL + '/');
    const features = {
      'Has <head> section': indexResult.body.includes('<head'),
      'Has <body> section': indexResult.body.includes('<body'),
      'Has Language script': indexResult.body.includes('localStorage.getItem("lang")'),
      'Has Zoom script': indexResult.body.includes('site-zoom'),
      'Has app.css link': indexResult.body.includes('/css/app.css'),
      'Has tailwind.css link': indexResult.body.includes('tailwind'),
      'Has app.js script': indexResult.body.includes('/js/app.js'),
      'Has title meta': indexResult.body.includes('<title>'),
      'Has description meta': indexResult.body.includes('description'),
    };

    for (const [feature, present] of Object.entries(features)) {
      logResult(`Index Page - ${feature}`, {
        passed: present,
        message: present ? 'Found' : 'Missing',
      });
    }
  } catch (err) {
    logResult('Index Page Feature Check', {
      passed: false,
      message: `Error: ${err.message}`,
      error: err.message,
    });
  }

  // 6. Check theme files status
  console.log('');
  console.log('🎭 CHECKING THEME FILES');
  console.log('-'.repeat(70));

  const themeFiles = [
    { path: 'website/css/site-themes.css', name: 'Site Themes CSS' },
    { path: 'website/js/site-theme-manager.js', name: 'Site Theme Manager JS' },
    { path: 'public/admin-themes.css', name: 'Admin Themes CSS' },
    { path: 'public/theme-manager.js', name: 'Admin Theme Manager JS' },
  ];

  for (const file of themeFiles) {
    try {
      const fullPath = path.join(__dirname, file.path);
      const exists = fs.existsSync(fullPath);
      let size = 0;
      let isEmpty = true;
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        size = stats.size;
        isEmpty = size === 0;
      }

      logResult(file.name, {
        passed: exists && !isEmpty,
        message: `Exists: ${exists}, Size: ${size} bytes, Empty: ${isEmpty}`,
      });
    } catch (err) {
      logResult(file.name, {
        passed: false,
        message: `Error: ${err.message}`,
      });
    }
  }

  // 7. Test data files
  console.log('');
  console.log('💾 CHECKING DATA FILES');
  console.log('-'.repeat(70));

  const dataFiles = [
    { path: 'data/content.json', name: 'Content Data' },
    { path: 'data/contacts.json', name: 'Contacts Data' },
  ];

  for (const file of dataFiles) {
    try {
      const fullPath = path.join(__dirname, file.path);
      const exists = fs.existsSync(fullPath);
      let size = 0;
      
      if (exists) {
        const content = fs.readFileSync(fullPath, 'utf8');
        size = content.length;
        try {
          JSON.parse(content);
          logResult(file.name, {
            passed: true,
            message: `Valid JSON, Size: ${size} bytes`,
          });
        } catch {
          logResult(file.name, {
            passed: false,
            message: `Exists but invalid JSON, Size: ${size} bytes`,
          });
        }
      } else {
        logResult(file.name, {
          passed: false,
          message: 'File does not exist',
        });
      }
    } catch (err) {
      logResult(file.name, {
        passed: false,
        message: `Error: ${err.message}`,
      });
    }
  }

  // 8. Summary
  console.log('');
  console.log('='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));

  const passed = TEST_RESULTS.filter(r => r.passed).length;
  const failed = TEST_RESULTS.filter(r => !r.passed).length;
  const total = TEST_RESULTS.length;
  const passPercentage = ((passed / total) * 100).toFixed(1);

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Pass Rate: ${passPercentage}%`);

  console.log('');
  console.log('FAILED TESTS:');
  const failedTests = TEST_RESULTS.filter(r => !r.passed);
  if (failedTests.length === 0) {
    console.log('  None - All tests passed! ✅');
  } else {
    failedTests.forEach(test => {
      console.log(`  ❌ ${test.name}: ${test.message}`);
    });
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total,
      passed,
      failed,
      passPercentage: parseFloat(passPercentage),
    },
    results: TEST_RESULTS,
  };

  fs.writeFileSync(
    path.join(__dirname, 'test-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('');
  console.log('📋 Detailed report saved to: test-report.json');
  console.log('='.repeat(70));
}

// Run tests
runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
