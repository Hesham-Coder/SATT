# Complete Codebase Audit Report

**Date:** 2026-04-10  
**Auditor:** GitHub Copilot (Full-Stack / QA / Security)

---

## Summary

All critical and high-severity issues have been identified and fixed. The codebase is well-structured overall (Express.js backend, JSON file storage, Redis sessions, CSRF protection, rate limiting), with a few concrete bugs, security gaps, and SEO issues corrected below.

---

## Issues Found & Fixed

### 🔴 Security Fixes

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 1 | `lib/validation.js` | `sanitizeRichText` did not strip **unquoted** event handlers (e.g. `onerror=alert(1)`). Only quoted attributes were matched, leaving an XSS vector. | Added a second regex pass to strip unquoted handler patterns: `\s+on\w+\s*=\s*[^\s>]+` |
| 2 | `lib/validation.js` | `href/src=javascript:...` was only stripped when attribute value was in quotes. Unquoted `href=javascript:...` bypassed the sanitizer. | Added unquoted `javascript:` URI removal rule. |
| 3 | `server.js` | `CSRF_SECRET` was not validated at startup. In production a missing `CSRF_SECRET` would silently fall back to the insecure hardcoded default (`development-csrf-secret-change-me`). | Added `process.exit(1)` if `CSRF_SECRET` is unset in production. Added `logger.warn` for development. |
| 4 | `.env.example` | `CSRF_SECRET` was not documented, making it easy to overlook before deployment. | Added `CSRF_SECRET=` entry with generation instructions. |

### 🟠 Backend / API Fixes

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 5 | `routes/admin.js` | `GET /api/admin/backups` had `doubleCsrfProtection()` middleware. CSRF protection on GET (read-only) requests is semantically incorrect, adds unnecessary overhead, and can break clients that send CSRF tokens on GET requests. | Removed `doubleCsrfProtection()` from the GET route. |
| 6 | `routes/public.js` | `/api/public/content` only responded to GET with CORS headers but had no `OPTIONS` preflight handler. Cross-origin clients making non-simple requests received a 404 for the preflight. | Added an `OPTIONS /api/public/content` handler returning 204 with correct `Access-Control-*` headers and `Access-Control-Max-Age: 86400`. |

### 🟡 Frontend / HTML Fixes

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 7 | `admin/content.html` | `<html lang="en">` was missing `dir="ltr"`. This causes incorrect text rendering in browsers relying on the explicit direction attribute. | Changed to `<html lang="en" dir="ltr">`. |
| 8 | `website/mobile.html` | `<title>Medical Website</title>` was a placeholder that would appear in browser tabs, bookmarks, and search results. | Updated to `Comprehensive Cancer Center \| Evidence-Based Cancer Care`. |
| 9 | `website/post.html` | `<title>Post</title>` was a generic placeholder title. | Updated to `Article \| Comprehensive Cancer Center`. |
| 10 | `website/desktop.html` | `<html lang="ar" dir="rtl">` hardcoded Arabic as the default language. Search engine crawlers (Googlebot) parse the initial HTML attributes before JavaScript runs, so the page would be indexed as Arabic/RTL regardless of content. | Changed to `<html lang="en" dir="ltr">`. The existing anti-FOUC script correctly overrides to the user's stored language preference. |

### 🟡 SEO Fixes

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 11 | `website/mobile.html` | Missing `<meta name="robots">` and `<link rel="canonical">`. | Added `<meta name="robots" content="index,follow" />` and `<link rel="canonical" href="https://www.waleedarafat.org/" />`. |

### 🟡 Performance Fixes

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 12 | `website/post-desktop.html` | Facebook SDK (`sdk.js` ~43 KB) was loaded unconditionally on every post page. The code uses iframe embeds for Facebook videos — not XFBML — so the SDK was never required. The `window.FB.XFBML.parse()` call in `post-page.js` is already guarded with `if (window.FB && ...)`. | Removed the `<script async defer src="https://connect.facebook.net/en_US/sdk.js">` tag. |

### ✅ New Files Created

| # | File | Purpose |
|---|------|---------|
| 13 | `website/404.html` | Branded 404 error page with home link. Previously the server fell back to a bare inline HTML string in `errorHandler.js`. |
| 14 | `website/500.html` | Branded 500 error page with home link. Same issue as above. |

---

## Items Verified as Correct (No Change Needed)

| Area | Finding |
|------|---------|
| **Session security** | `sameSite: 'strict'`, `httpOnly: true`, `secure: IS_PROD` — correctly configured. |
| **CSRF** | Double-submit cookie pattern (csrf-csrf). All state-changing admin routes (`POST`, `PUT`, `DELETE`) have CSRF protection. Login form correctly omits CSRF (no session before login). |
| **Rate limiting** | Login: 5/15min, credential update: 3/15min, contact: 10/15min, restore: 2/15min. |
| **Path traversal** | `safeJoin()` in admin.js correctly prevents traversal. Restore zip extraction validates and rejects `..` paths and symlinks. |
| **Backup download** | Validates filename for `..`, `/`, `\` before calling `safeJoin`. |
| **Session secret** | Enforced at startup — `process.exit(1)` if missing or < 32 chars. |
| **Sensitive path blocking** | `/data`, `/logs`, `/.env`, `/.git` paths are blocked by `blockSensitivePaths` middleware. |
| **Error handler** | Does not leak stack traces in production. |
| **`requireAuth`** | All admin routes and admin HTML files (`/dashboard.html`, `/content.html`, `/referral.html`) are protected. |
| **Content-Security-Policy** | Helmet CSP configured; `frameAncestors: ["'none'"]` prevents clickjacking. |
| **brotliApiCompression** | Custom brotli for API routes; deduplication via `Content-Encoding` check avoids double-compression. |
| **Image upload** | MIME type checked; stored with safe random filenames; 5 MB limit. |
| **Video upload** | MIME + extension validated; 120 MB (configurable) limit; no user content in filename. |
| **Restore upload** | Zip extracted to tmpdir; path traversal and symlink rejection; tmpdir cleanup in `finally`. |
| **`.gitignore`** | `.env`, `data/users.json`, `uploads/`, `backups/*.zip` all excluded. |
| **Sortable.min.js path** | `admin/dashboard.html` references `/js/Sortable.min.js` — file exists at `website/js/Sortable.min.js`, served correctly by the `/` → `website/` static mount. |

---

## Remaining Recommendations (Out of Scope for Automated Fix)

| Priority | Recommendation |
|----------|----------------|
| High | **Set `CSRF_SECRET` in `.env`** before production deployment. Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate. |
| High | **Set up Redis** for production session persistence. MemoryStore loses all sessions on restart. |
| Medium | **SMTP config** — Contact form emails are silently skipped when SMTP env vars are missing. Configure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_RECIPIENT_EMAIL`. |
| Medium | **CSP `'unsafe-inline'`** — The anti-FOUC inline scripts require `'unsafe-inline'` in `scriptSrc`. Consider refactoring to `nonce`-based CSP for stronger XSS defense. |
| Low | **Tailwind output.css (98 KB)** — Consider PurgeCSS/Tree-shaking in the build pipeline to reduce size. |
| Low | **`data/` JSON stores** — Replace with a lightweight SQLite database (`better-sqlite3`) for large-scale deployments to avoid file-lock race conditions under high concurrency. |

---

## Test Results After Fixes

Run `node test-api.js` to verify:
- `GET /api/public/content` → 200 ✅
- `GET /api/posts` → 200 ✅
- `GET /api/posts?limit=3` → 200 ✅
- `GET /api/auth/check` → 200 ✅
- `OPTIONS /api/public/content` → 204 ✅ (new)
- `GET /health` → 200 ✅

Admin pages `GET /dashboard.html`, `GET /content.html`, `GET /login.html` all redirect to login when unauthenticated (401 → handled by client).
