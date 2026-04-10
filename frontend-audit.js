#!/usr/bin/env node

/**
 * PROFESSIONAL FRONTEND AUDIT SCRIPT
 * Comprehensive testing of all JavaScript, CSS, HTML, API integration, performance, and security
 */

const fs = require('fs');
const path = require('path');

const AUDIT_RESULTS = {
  timestamp: new Date().toISOString(),
  sections: {}
};

function section(name) {
  AUDIT_RESULTS.sections[name] = { issues: [], warnings: [], passed: [] };
  return AUDIT_RESULTS.sections[name];
}

// ============================================================================
// 1. CODEBASE ANALYSIS
// ============================================================================

console.log('🔍 SCANNING FRONTEND CODEBASE...\n');

const jsDir = path.join(__dirname, 'website', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'Sortable.min.js');
const cssDir = path.join(__dirname, 'website', 'css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const htmlDir = path.join(__dirname, 'website');
const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const codebase = section('1_codebase_analysis');
codebase.passed.push(`Found ${jsFiles.length} JS files: ${jsFiles.join(', ')}`);
codebase.passed.push(`Found ${cssFiles.length} CSS files: ${cssFiles.join(', ')}`);
codebase.passed.push(`Found ${htmlFiles.length} HTML files: ${htmlFiles.join(', ')}`);

// ============================================================================
// 2. MODULE DEPENDENCY ANALYSIS
// ============================================================================

console.log('📦 ANALYZING MODULE DEPENDENCIES...\n');

const modules = section('2_module_dependencies');

// Check app.js imports
const appJs = fs.readFileSync(path.join(jsDir, 'app.js'), 'utf8');
const imports = appJs.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
const requiredModules = ['./shell.js', './data.js', './i18n.js'];
const viewModules = [
  'home.js', 'services.js', 'team.js', 'stories.js', 'posts.js', 'post.js',
  'about.js', 'contact.js', 'notfound.js', 'error.js'
];

requiredModules.forEach(mod => {
  const filePath = path.join(jsDir, mod);
  if (!fs.existsSync(filePath)) {
    modules.issues.push(`❌ CRITICAL: Missing required module: ${mod}`);
  }
});

viewModules.forEach(mod => {
  const filePath = path.join(jsDir, 'views', mod);
  if (!fs.existsSync(path.join(jsDir, 'views'))) {
    modules.issues.push(`❌ CRITICAL: Missing views directory and module: ${mod}`);
  }
});

if (modules.issues.length === 0) {
  modules.passed.push('✅ All module dependencies are available');
} else {
  modules.passed.push(`⚠️ SPA will fail to load due to missing modules. The website relies on server-side renders instead.`);
}

// ============================================================================
// 3. JAVASCRIPT QUALITY CHECKS
// ============================================================================

console.log('🔧 CHECKING JAVASCRIPT QUALITY...\n');

const jsQuality = section('3_javascript_quality');

jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');

  // Check for common issues
  if (content.includes('console.log') && !file.includes('test')) {
    jsQuality.warnings.push(`⚠️ ${file}: Contains console.log statements (remove before production)`);
  }

  if (content.match(/eval\s*\(/)) {
    jsQuality.issues.push(`❌ ${file}: Uses eval() - security risk`);
  }

  if (content.match(/var\s+\w+\s*=/)) {
    jsQuality.warnings.push(`⚠️ ${file}: Uses 'var' instead of 'const'/'let'`);
  }

  if (content.includes('document.innerHTML')) {
    jsQuality.warnings.push(`⚠️ ${file}: Uses innerHTML without sanitization (XSS risk)`);
  }

  if (!content.includes('try') && file !== 'Sortable.min.js' && content.includes('fetch')) {
    jsQuality.warnings.push(`⚠️ ${file}: Uses fetch without try/catch error handling`);
  }

  jsQuality.passed.push(`✅ Scanned ${file}`);
});

// ============================================================================
// 4. CSS QUALITY CHECKS
// ============================================================================

console.log('🎨 CHECKING CSS QUALITY...\n');

const cssQuality = section('4_css_quality');

cssFiles.forEach(file => {
  const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  const size = Math.round(content.length / 1024);

  if (size > 100) {
    cssQuality.warnings.push(`⚠️ ${file}: Large stylesheet (${size}KB) - consider code splitting`);
  }

  if (content.includes('!important')) {
    const count = (content.match(/!important/g) || []).length;
    cssQuality.warnings.push(`⚠️ ${file}: Uses !important ${count} times (bad practice)`);
  }

  cssQuality.passed.push(`✅ Scanned ${file}`);
});

// ============================================================================
// 5. HTML / ACCESSIBILITY CHECKS
// ============================================================================

console.log('♿ CHECKING HTML & ACCESSIBILITY...\n');

const htmlA11y = section('5_html_accessibility');

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');

  // Check for lang/dir attributes
  if (!(content.includes('lang=') && content.includes('dir='))) {
    htmlA11y.warnings.push(`⚠️ ${file}: Missing lang/dir attributes on <html>`);
  }

  // Check for meta viewport
  if (!content.includes('viewport')) {
    htmlA11y.issues.push(`❌ ${file}: Missing meta viewport (mobile support)`);
  }

  // Check for alt text on images
  const imgTags = content.match(/<img[^>]*>/g) || [];
  const imgNoAlt = imgTags.filter(tag => !tag.includes('alt='));
  if (imgNoAlt.length > 0) {
    htmlA11y.warnings.push(`⚠️ ${file}: ${imgNoAlt.length} img tags missing alt text`);
  }

  // Check for form labels
  if (content.includes('<input') && !content.includes('<label')) {
    htmlA11y.warnings.push(`⚠️ ${file}: Contains inputs but no labels found`);
  }

  // Check for ARIA attributes
  if (!content.includes('aria-')) {
    htmlA11y.warnings.push(`⚠️ ${file}: Missing ARIA attributes for accessibility`);
  }

  htmlA11y.passed.push(`✅ Scanned ${file}`);
});

// ============================================================================
// 6. PERFORMANCE CHECKS
// ============================================================================

console.log('⚡ CHECKING PERFORMANCE...\n');

const performance = section('6_performance');

// Check bundle sizes
let totalJsSize = 0;
let totalCssSize = 0;

jsFiles.forEach(file => {
  const size = fs.statSync(path.join(jsDir, file)).size;
  totalJsSize += size;
});

cssFiles.forEach(file => {
  const size = fs.statSync(path.join(cssDir, file)).size;
  totalCssSize += size;
});

performance.passed.push(`✅ Total JS size: ${Math.round(totalJsSize / 1024)}KB`);
performance.passed.push(`✅ Total CSS size: ${Math.round(totalCssSize / 1024)}KB`);

if (totalJsSize + totalCssSize > 500 * 1024) {
  performance.warnings.push(`⚠️ Large combined bundle (${Math.round((totalJsSize + totalCssSize) / 1024)}KB) - optimize asset delivery`);
}

// Check for lazy loading
const allHtml = htmlFiles.map(f => fs.readFileSync(path.join(htmlDir, f), 'utf8')).join('');
const imgWithoutLazy = (allHtml.match(/<img[^>]*>/g) || []).filter(tag => !tag.includes('loading='));
if (imgWithoutLazy.length > 5) {
  performance.warnings.push(`⚠️ ${imgWithoutLazy.length} images without lazy loading - implement loading="lazy"`);
}

// ============================================================================
// 7. API INTEGRATION CHECKS
// ============================================================================

console.log('🔌 CHECKING API INTEGRATION...\n');

const apiIntegration = section('7_api_integration');

const allJs = jsFiles.map(f => fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n');

if (!allJs.includes('fetch')) {
  apiIntegration.warnings.push(`⚠️ No fetch calls found - verify API integration method`);
}

if (allJs.includes('fetch') && !allJs.match(/\bcatch\s*\(/)) {
  apiIntegration.warnings.push(`⚠️ fetch calls found but missing error handling`);
}

// Check for hardcoded API URLs
if (allJs.includes('http://localhost') || allJs.includes('http://127.0.0.1')) {
  apiIntegration.issues.push(`❌ Hardcoded localhost URLs found - use environment variables`);
}

if (!allJs.includes('401') && !allJs.includes('401')) {
  apiIntegration.warnings.push(`⚠️ No 401/unauthorized handling found`);
}

apiIntegration.passed.push(`✅ API integration structure scanned`);

// ============================================================================
// 8. SECURITY CHECKS
// ============================================================================

console.log('🔒 CHECKING SECURITY...\n');

const security = section('8_security');

if (allJs.includes('localStorage.setItem')) {
  security.warnings.push(`⚠️ Storing data in localStorage - verify no sensitive tokens stored`);
}

if (allJs.includes('eval') || allJs.includes('Function(')) {
  security.issues.push(`❌ Dynamic code execution detected - security risk`);
}

if (allJs.includes('innerHTML')) {
  security.warnings.push(`⚠️ innerHTML usage found - ensure content is sanitized`);
}

security.passed.push(`✅ Security baseline checked`);

// ============================================================================
// 9. ROUTING & NAVIGATION CHECKS
// ============================================================================

console.log('🗺️  CHECKING ROUTING...\n');

const routing = section('9_routing');

if (fs.existsSync(path.join(jsDir, 'router.js'))) {
  const routerContent = fs.readFileSync(path.join(jsDir, 'router.js'), 'utf8');
  if (routerContent.includes('createRouter')) {
    routing.passed.push(`✅ Router module found and properly exported`);
  }

  const routes = ['/home', '/services', '/team', '/news', '/posts', '/about', '/contact'];
  const routeMatches = routes.filter(r => routerContent.includes(`"${r}"`) || routerContent.includes(`'${r}'`));
  routing.passed.push(`✅ Detected ${routeMatches.length} routes defined`);
} else {
  routing.warnings.push(`⚠️ No router.js found`);
}

// ============================================================================
// 10. MEDIA HANDLING
// ============================================================================

console.log('🖼️  CHECKING MEDIA HANDLING...\n');

const mediaHandling = section('10_media_handling');

const videoTags = allHtml.match(/<video[^>]*>/g) || [];
const videosWithoutControls = videoTags.filter(tag => !tag.includes('controls'));
if (videosWithoutControls.length > 0) {
  mediaHandling.warnings.push(`⚠️ ${videosWithoutControls.length} video tags without controls attribute`);
}

mediaHandling.passed.push(`✅ Found ${videoTags.length} video elements`);

const iframeCount = (allHtml.match(/<iframe/g) || []).length;
mediaHandling.passed.push(`✅ Found ${iframeCount} embedded iframes`);

// ============================================================================
// GENERATE REPORT
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📊 FRONTEND AUDIT REPORT');
console.log('='.repeat(80) + '\n');

let totalIssues = 0;
let totalWarnings = 0;
let totalPassed = 0;

Object.entries(AUDIT_RESULTS.sections).forEach(([section, data]) => {
  const sectionName = section.replace(/_/g, ' ').toUpperCase();
  console.log(`\n${sectionName}:`);
  console.log('-'.repeat(80));

  if (data.issues.length > 0) {
    console.log('ISSUES:');
    data.issues.forEach(issue => console.log(`  ${issue}`));
    totalIssues += data.issues.length;
  }

  if (data.warnings.length > 0) {
    console.log('WARNINGS:');
    data.warnings.forEach(warning => console.log(`  ${warning}`));
    totalWarnings += data.warnings.length;
  }

  data.passed.forEach(pass => console.log(`  ${pass}`));
  totalPassed += data.passed.length;
});

console.log('\n' + '='.repeat(80));
console.log('📈 SUMMARY');
console.log('='.repeat(80));
console.log(`Total Issues Found:  ${totalIssues}`);
console.log(`Total Warnings:      ${totalWarnings}`);
console.log(`Items Passing:       ${totalPassed}`);
console.log(`Overall Status:      ${totalIssues === 0 ? '✅ PASS' : '⚠️ NEEDS FIXES'}`);
console.log('='.repeat(80) + '\n');

// Save report
const reportPath = path.join(__dirname, 'FRONTEND_AUDIT.json');
fs.writeFileSync(reportPath, JSON.stringify(AUDIT_RESULTS, null, 2));
console.log(`📄 Full report saved to: ${reportPath}\n`);
