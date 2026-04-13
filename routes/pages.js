const express = require('express');
const { readPublishedContent, readContent } = require('../lib/contentStore');
const { queryPublishedPosts, getPublishedPostBySlug } = require('../lib/postStore');
const LayoutRenderer = require('../lib/layoutRenderer');
const { WEBSITE_DIR, SITE_URL } = require('../lib/config');

const router = express.Router();
const layoutRenderer = new LayoutRenderer(WEBSITE_DIR);
const SITE_BASE_URL = SITE_URL || 'https://www.waleedarafat.org';
const DEFAULT_LOGO_SRC = '/uploads/img-1770765094009-eigrur.jpg';

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function t(field, lang) {
  if (field == null) return '';
  if (typeof field === 'object' && !Array.isArray(field)) {
    return String(field[lang] || field.en || field.ar || '');
  }
  return String(field);
}

function i18n(lang, enValue, arValue) {
  return lang === 'ar' ? arValue : enValue;
}

function digitsOnly(value) {
  return String(value || '').replace(/\D+/g, '');
}

function truncateText(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim().replace(/[.,;:!?-]?$/, '') + '...';
}

function detectLanguage(req, res) {
  const queryLang = String((req.query && req.query.lang) || '').toLowerCase();
  const cookieLang = String((req.cookies && (req.cookies.site_lang || req.cookies.lang)) || '').toLowerCase();
  let lang = 'en';

  if (queryLang === 'ar' || queryLang === 'en') {
    lang = queryLang;
    if (res) {
      res.cookie('site_lang', lang, { maxAge: 31536000000, sameSite: 'lax' });
    }
  } else if (cookieLang === 'ar' || cookieLang === 'en') {
    lang = cookieLang;
  } else if (String(req.get('accept-language') || '').toLowerCase().includes('ar')) {
    lang = 'ar';
  }

  return lang;
}

async function getContent() {
  try {
    const published = await readPublishedContent();
    if (published && published.siteInfo) return published;
  } catch (_) {}

  try {
    return await readContent();
  } catch (_) {
    return {};
  }
}

function extractPosts(result) {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.items)) return result.items;
  return [];
}

function localDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function whatsappHref(number, message) {
  const digits = digitsOnly(number);
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(String(message || '').trim())}`;
}

function renderSectionHeader(kicker, title, summary, actionHtml) {
  return `
    <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: var(--spacing-8); margin-bottom: var(--spacing-12); flex-wrap: wrap;" data-fade-in>
      <div style="max-width: 600px;">
        ${kicker ? `<span class="txt-kicker">${esc(kicker)}</span>` : ''}
        <h2 class="txt-h2">${esc(title)}</h2>
        ${summary ? `<p class="txt-lead" style="margin-top: var(--spacing-4); margin-bottom: 0;">${esc(summary)}</p>` : ''}
      </div>
      ${actionHtml ? `<div>${actionHtml}</div>` : ''}
    </div>`;
}

function renderPageHero(options) {
  return `
    <section class="hero-sec" data-fade-in>
      <div class="shell-container">
        <div class="hero-grid">
          <div class="hero-content">
            ${options.kicker ? `<span class="txt-kicker">${esc(options.kicker)}</span>` : ''}
            <h1 class="txt-h1">${esc(options.title)}</h1>
            ${options.summary ? `<p class="txt-lead">${esc(options.summary)}</p>` : ''}
            ${options.actionsHtml ? `<div class="hero-actions">${options.actionsHtml}</div>` : ''}
            ${options.proofHtml ? `<div class="hero-trust">${options.proofHtml}</div>` : ''}
          </div>
          ${options.visualHtml || ''}
        </div>
      </div>
    </section>`;
}

function renderHeroVisual(options) {
  const listItems = Array.isArray(options.items) ? options.items : [];
  return `
    <aside class="hero-visual">
      ${options.imageUrl ? `<img src="${esc(options.imageUrl)}" alt="${esc(options.alt || '')}" loading="eager" />` : ''}
      <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(7, 46, 84, 0.4), rgba(7, 46, 84, 0.1));"></div>
    </aside>`;
}

function renderMetricBand(items) {
  return `
    <section class="page-section page-section--tint" style="padding-top: var(--spacing-16); padding-bottom: var(--spacing-16);" data-fade-in>
      <div class="shell-container">
        <div class="grid-4" style="text-align: center; gap: var(--spacing-12) var(--spacing-6);">
          ${items.map((item) => `
            <div>
              <div style="font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; color: var(--color-brand-blue-dark); line-height: 1;">${esc(item.value)}${esc(item.suffix || '')}</div>
              <p style="margin-top: var(--spacing-2); font-weight: 700; color: var(--color-ink-700);">${esc(item.label)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
}

function renderServiceCard(service, lang) {
  const icon = esc(service.icon || 'clinical_notes');
  const title = esc(t(service.title, lang));
  const desc = esc(t(service.description, lang));
  const imgUrl = service.imageUrl ? esc(service.imageUrl) : '';

  return `
    <article class="aaa-card" data-fade-in>
      ${imgUrl ? `<img src="${imgUrl}" alt="${title}" class="aaa-card__image" loading="lazy" />` : `<div class="aaa-card__icon"><span class="material-symbols-outlined" aria-hidden="true">${icon}</span></div>`}
      <h3 class="aaa-card__title">${title}</h3>
      <p class="aaa-card__copy">${desc}</p>
      <a href="/contact" class="aaa-card__action">${esc(i18n(lang, 'Plan a consultation', '???? ???????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
    </article>`;
}

function renderExpertCard(expert, lang) {
  const name = esc(expert.name || '');
  const title = esc(expert.title || '');
  const bio = esc(truncateText(expert.bio || '', 180));
  const imageUrl = expert.imageUrl ? esc(expert.imageUrl) : '';
  const experience = expert.experience ? esc(String(expert.experience)) : '';
  const icon = esc(expert.icon || 'medical_services');

  return `
    <article class="aaa-card" data-fade-in>
      ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="aaa-card__image" style="aspect-ratio: 1/1; object-fit: cover;" loading="lazy" />` : `<div class="aaa-card__icon"><span class="material-symbols-outlined" aria-hidden="true">${icon}</span></div>`}
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-ink-500); margin-bottom: var(--spacing-2); display: flex; gap: var(--spacing-3);">
        ${experience ? `<span>${experience}</span>` : ''}${title ? `<span>${title}</span>` : ''}
      </div>
      <h3 class="aaa-card__title">${name}</h3>
      ${bio ? `<p class="aaa-card__copy">${bio}</p>` : ''}
      <a href="/contact" class="aaa-card__action">${esc(i18n(lang, 'Request a meeting', '???? ??????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
    </article>`;
}

function renderPostCard(post, lang) {
  const title = esc(post.title || '');
  const excerpt = esc(truncateText(post.excerpt || post.content || '', 180));
  const slug = esc(post.slug || '');
  const img = post.featuredImage ? esc(post.featuredImage) : '';
  const date = localDate(post.createdAt, lang);
  const typeLabel = {
    news: i18n(lang, 'News', '???'),
    update: i18n(lang, 'Update', '?????'),
    article: i18n(lang, 'Article', '????'),
  }[post.type] || i18n(lang, 'Post', '?????');

  return `
    <article class="aaa-card" data-fade-in>
      ${img ? `<img src="${img}" alt="${title}" class="aaa-card__image" loading="lazy" />` : ''}
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-ink-500); margin-bottom: var(--spacing-2); display: flex; align-items: center; gap: var(--spacing-3);">
        <span style="display: inline-flex; align-items: center; border-radius: var(--radius-pill); background: var(--color-ink-50); padding: 4px 12px; border: 1px solid var(--color-ink-100);">${esc(typeLabel)}</span>
        ${date ? `<span>${esc(date)}</span>` : ''}
      </div>
      <h3 class="aaa-card__title">${title}</h3>
      ${excerpt ? `<p class="aaa-card__copy">${excerpt}</p>` : ''}
      <a href="/post/${slug}" class="aaa-card__action">${esc(i18n(lang, 'Read the article', '???? ??????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
    </article>`;
}

function renderInfoCard(icon, title, bodyHtml) {
  return `
    <article class="aaa-card" style="flex-direction: row; align-items: flex-start; gap: var(--spacing-4); padding: var(--spacing-6);">
      <div class="aaa-card__icon" style="margin: 0; width: var(--spacing-12); height: var(--spacing-12); flex-shrink: 0;"><span class="material-symbols-outlined" aria-hidden="true">${esc(icon)}</span></div>
      <div>
        <h3 class="aaa-card__title" style="margin-bottom: var(--spacing-1); font-size: 1.1rem;">${esc(title)}</h3>
        <div style="color: var(--color-ink-700);">${bodyHtml}</div>
      </div>
    </article>`;
}

function renderEmptyState(icon, title, body) {
  return `
    <article class="aaa-card" style="align-items: center; text-align: center; padding: var(--spacing-12);" data-fade-in>
      <div class="aaa-card__icon"><span class="material-symbols-outlined" aria-hidden="true">${esc(icon)}</span></div>
      <h3 class="aaa-card__title">${esc(title)}</h3>
      <p class="aaa-card__copy" style="margin: 0;">${esc(body)}</p>
    </article>`;
}

function getVisibleServices(content) {
  return (Array.isArray(content.services) ? content.services : []).filter((service) => service.visible !== false);
}

function getVisibleExperts(content) {
  return (Array.isArray(content.experts) ? content.experts : []).filter((expert) => expert.visible !== false && (expert.name || expert.title));
}

function collectMediaItems(content, posts, lang) {
  const items = [];
  const seen = new Set();

  function pushItem(src, title, type) {
    if (!src || seen.has(src)) return;
    seen.add(src);
    items.push({ src, title, type });
  }

  const siteInfo = content.siteInfo || {};
  pushItem(siteInfo.heroImageUrl, t(siteInfo.title, lang) || 'SATT', i18n(lang, 'Center', '??????'));
  getVisibleServices(content).forEach((service) => pushItem(service.imageUrl, t(service.title, lang), i18n(lang, 'Service', '????')));
  getVisibleExperts(content).forEach((expert) => pushItem(expert.imageUrl, expert.name, i18n(lang, 'Doctor', '????')));
  (Array.isArray(content.certificates) ? content.certificates : []).forEach((certificate) => pushItem(certificate.imageUrl || certificate.url, t(certificate.title, lang), i18n(lang, 'Certificate', '??????')));
  posts.forEach((post) => pushItem(post.featuredImage, post.title, i18n(lang, 'Story', '???')));

  return items;
}

function buildComponentData(content, lang) {
  const siteInfo = content.siteInfo || {};
  const contact = content.contact || {};
  const footer = content.footer || {};
  const aboutSection = content.aboutSection || {};
  const contactSettings = content.contactSettings || {};
  const services = getVisibleServices(content);
  const waNumber = digitsOnly(contactSettings.whatsappSupportNumber || contact.phone || contact.emergencyPhone || '');
  const fallbackServices = [
    i18n(lang, 'Multidisciplinary assessment', '??????? ????? ????????'),
    i18n(lang, 'Systemic therapies', '???????? ????????'),
    i18n(lang, 'Radiation oncology', '?????? ????????'),
    i18n(lang, 'Genetic guidance', '??????? ???????'),
    i18n(lang, 'Supportive care', '??????? ???????'),
  ];

  const serviceTitles = services.slice(0, 5).map((service) => t(service.title, lang)).filter(Boolean);
  while (serviceTitles.length < 5) {
    serviceTitles.push(fallbackServices[serviceTitles.length]);
  }

  return {
    LOGO_NAME: t(siteInfo.logoName, lang) || t(siteInfo.title, lang) || 'SATT',
    LOGO_SRC: t(siteInfo.logoUrl, lang) || DEFAULT_LOGO_SRC,
    LOGO_TAGLINE: t(siteInfo.tagline, lang) || i18n(lang, 'Evidence-based oncology care', '????? ????? ????? ??? ??????'),
    SUPPORT_LABEL: i18n(lang, 'Patient support', '??? ??????'),
    NAVBAR_PHONE: String(contactSettings.primaryNavbarNumber || contact.phone || ''),
    HEADER_INSURANCE_LABEL: i18n(lang, 'Insurance & coverage', '??????? ????????'),
    LANG_SWITCH_LABEL: lang === 'ar' ? 'English' : '???????',
    NAV_HOME: i18n(lang, 'Home', '????????'),
    NAV_ABOUT: i18n(lang, 'About', '?? ???'),
    NAV_SERVICES: i18n(lang, 'Services', '???????'),
    NAV_EXPERTS: i18n(lang, 'Doctors', '???????'),
    NAV_EVENTS: i18n(lang, 'News', '???????'),
    NAV_MEDIA: i18n(lang, 'Media', '???????'),
    NAV_CONTACT: i18n(lang, 'Contact', '???? ???'),
    HEADER_CTA_LABEL: i18n(lang, 'Request consultation', '???? ???????'),
    MOBILE_MENU_TITLE: i18n(lang, 'Browse pages', '???? ???????'),
    MOBILE_SUPPORT_LABEL: i18n(lang, 'Call our coordination desk', '????? ?? ???? ???????'),
    MOBILE_INSURANCE_LABEL: i18n(lang, 'Insurance', '???????'),
    FOOTER_ABOUT: t(aboutSection.footerBlurb, lang) || i18n(lang, 'Specialist oncology care with coordinated diagnostics, treatment planning, and patient support.', '????? ????? ?????? ?? ????? ??????? ???? ?????? ??????.'),
    FOOTER_EXPLORE_TITLE: i18n(lang, 'Explore', '??????'),
    FOOTER_SERVICES_TITLE: i18n(lang, 'Care pathways', '?????? ???????'),
    FOOTER_CONTACT_TITLE: i18n(lang, 'Contact', '???????'),
    FOOTER_HOME: i18n(lang, 'Home', '????????'),
    FOOTER_ABOUT_LABEL: i18n(lang, 'About', '?? ???'),
    FOOTER_SERVICES_LABEL: i18n(lang, 'Services', '???????'),
    FOOTER_EXPERTS_LABEL: i18n(lang, 'Doctors', '???????'),
    FOOTER_EVENTS_LABEL: i18n(lang, 'News', '???????'),
    FOOTER_MEDIA_LABEL: i18n(lang, 'Media', '???????'),
    FOOTER_CONTACT_LABEL: i18n(lang, 'Contact', '???? ???'),
    FOOTER_INSURANCE_LABEL: i18n(lang, 'Insurance', '???????'),
    FOOTER_SERVICE_1: serviceTitles[0],
    FOOTER_SERVICE_2: serviceTitles[1],
    FOOTER_SERVICE_3: serviceTitles[2],
    FOOTER_SERVICE_4: serviceTitles[3],
    FOOTER_SERVICE_5: serviceTitles[4],
    FOOTER_EMAIL_LABEL: i18n(lang, 'Email', '?????? ??????????'),
    FOOTER_PHONE_LABEL: i18n(lang, 'Phone', '??????'),
    FOOTER_ADDRESS_LABEL: i18n(lang, 'Address', '???????'),
    FOOTER_HOURS_LABEL: i18n(lang, 'Hours', '????? ?????'),
    FOOTER_EMERGENCY_LABEL: i18n(lang, 'Emergency', '???????'),
    FOOTER_EMAIL: t(contact.email, lang) || '',
    FOOTER_PHONE: String(contact.phone || ''),
    FOOTER_ADDRESS: t(contact.address, lang) || '',
    FOOTER_COPYRIGHT: t(footer.copyright, lang) || `\u00a9 ${new Date().getFullYear()} Comprehensive Cancer Center. All rights reserved.`,
    FOOTER_HOURS: t(footer.hours, lang) || i18n(lang, 'Sunday to Thursday with coordinated appointments throughout the day.', '?? ????? ??? ?????? ?? ????? ???????? ??? ???? ?????.'),
    FOOTER_EMERGENCY_TEXT: t(footer.emergencyText, lang) || String(contact.emergencyPhone || i18n(lang, 'Call local emergency services for urgent symptoms.', '???? ???????? ??????? ???????.')),
    WA_NUMBER: waNumber,
    WA_MESSAGE: t(contactSettings.whatsappWelcomeMessage, lang) || i18n(lang, 'Hello, I would like to speak with your support team.', '??????? ??? ?????? ?? ???? ?????.'),
  };
}

function pageConfig(content, lang, currentPath, config) {
  const componentData = buildComponentData(content, lang);
  return {
    currentPath,
    language: lang,
    componentData,
    ...config,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const [content, postsResult] = await Promise.all([
      getContent(),
      queryPublishedPosts({ limit: 3 }).catch(() => []),
    ]);

    const posts = extractPosts(postsResult);
    const siteInfo = content.siteInfo || {};
    const stats = content.stats || {};
    const servicesSection = content.servicesSection || {};
    const services = getVisibleServices(content);
    const ctaSection = content.ctaSection || {};
    const aboutSection = content.aboutSection || {};
    const contactSettings = content.contactSettings || {};

    const heroActions = `
      <a href="/contact" class="btn btn--primary">${esc(t(siteInfo.heroCtaPrimary, lang) || i18n(lang, 'Request consultation', '???? ???????'))}</a>
      <a href="/services" class="btn btn--ghost">${esc(t(siteInfo.heroCtaSecondary, lang) || i18n(lang, 'Explore services', '?????? ???????'))}</a>`;

    const heroProof = [
      i18n(lang, 'No referral required', '???? ????? ???'),
      i18n(lang, 'Multidisciplinary tumor board', '???? ????? ????? ????????'),
      i18n(lang, 'Response within 24 hours', '??????? ???? 24 ????'),
    ].map((item) => `<span class="proof-pill">${esc(item)}</span>`).join('');

    const heroVisual = renderHeroVisual({
      imageUrl: siteInfo.heroImageUrl,
      alt: t(siteInfo.title, lang) || 'Healthcare center',
      eyebrow: i18n(lang, 'Integrated oncology care', '????? ????? ???????'),
      title: i18n(lang, 'Coordinated pathways for every diagnosis', '?????? ?????? ????? ??? ?????'),
      text: i18n(lang, 'Consultants, diagnostics, and support teams aligned around one treatment plan.', '??????????? ???????? ?????? ?????? ??? ??? ???? ?????.'),
      items: [
        i18n(lang, 'Evidence-based treatment plans', '??? ???? ????? ??? ??????'),
        i18n(lang, 'Rapid diagnostics and staging', '????? ?????? ????? ????? ?????'),
        i18n(lang, 'Continuous patient coordination', '????? ????? ????? ??????'),
      ],
    });

    const metrics = renderMetricBand([
      { value: stats.patientsServed || 5000, suffix: '+', label: i18n(lang, 'Patients served', '???? ???? ???????') },
      { value: stats.successRate || 95, suffix: '%', label: i18n(lang, 'Positive outcomes', '?????? ????? ???????') },
      { value: stats.specialists || 50, suffix: '+', label: i18n(lang, 'Specialists', '??????? ??????') },
      { value: stats.yearsExperience || 20, suffix: '+', label: i18n(lang, 'Years of experience', '??? ????') },
    ]);

    const servicesGrid = services.length
      ? services.slice(0, 6).map((service) => renderServiceCard(service, lang)).join('')
      : renderEmptyState('medical_services', i18n(lang, 'Services will be published soon', '???? ??? ??????? ??????'), i18n(lang, 'Our clinical pathways are currently being updated.', '???? ?????? ??? ????? ?????? ???????.'));

    const aboutHighlights = (Array.isArray(aboutSection.highlights) ? aboutSection.highlights : [])
      .slice(0, 4)
      .map((item) => `<li class="stack-item"><span class="material-symbols-outlined" aria-hidden="true">check_circle</span><span>${esc(t(item, lang))}</span></li>`)
      .join('');

    const postsGrid = posts.length
      ? posts.map((post) => renderPostCard(post, lang)).join('')
      : renderEmptyState('article', i18n(lang, 'No published updates yet', '?? ???? ??????? ?????? ????'), i18n(lang, 'New clinical updates and educational stories will appear here.', '????? ??? ????????? ?????? ???????? ???????.'));

    const ctaHref = whatsappHref(contactSettings.whatsappSupportNumber || (content.contact || {}).phone, t(contactSettings.whatsappWelcomeMessage, lang));

    const pageContent = [
      renderPageHero({
        kicker: t(siteInfo.tagline, lang) || i18n(lang, 'Evidence-based oncology care', '????? ????? ????? ??? ??????'),
        title: t(siteInfo.heroHeading, lang) || i18n(lang, 'Science that heals. Care that connects.', '??? ????. ????? ?????.'),
        summary: t(siteInfo.heroDescription, lang) || i18n(lang, 'A premium oncology experience focused on safety, clarity, and coordinated treatment decisions.', '????? ???? ????? ?????? ???? ??? ?????? ??????? ?????? ???????? ????????.'),
        actionsHtml: heroActions,
        proofHtml: heroProof,
        visualHtml: heroVisual,
      }),
      metrics,
      `<section class="page-section page-section--tint"><div class="shell-container">${renderSectionHeader(
        t(servicesSection.badge, lang) || i18n(lang, 'Clinical pathways', '?????? ????? ??????'),
        t(servicesSection.heading, lang) || i18n(lang, 'Comprehensive cancer care services', '????? ????? ????? ???????'),
        t(servicesSection.subheading, lang) || i18n(lang, 'From diagnosis and planning to treatment and survivorship support.', '?? ??????? ???????? ??? ?????? ?????? ??? ??????.'),
        `<a class="btn btn--ghost" href="/services">${esc(i18n(lang, 'View all services', '??? ???? ???????'))}</a>`
      )}<div class="grid-3">${servicesGrid}</div></div></section>`,
      `<section class="page-section"><div class="shell-container"><div class="spotlight-panel"><article class="spotlight-panel__content">${renderSectionHeader(
        i18n(lang, 'Why choose us', '????? ???????'),
        t(aboutSection.heading, lang) || i18n(lang, 'Coordinated oncology, led by specialists', '????? ????? ????? ?????? ???????'),
        t((Array.isArray(aboutSection.paragraphs) ? aboutSection.paragraphs[0] : ''), lang),
        `<a class="btn btn--ghost" href="/about">${esc(i18n(lang, 'Learn more', '???? ??????'))}</a>`
      )}${aboutHighlights ? `<ul class="stack-list">${aboutHighlights}</ul>` : ''}</article><aside class="spotlight-panel__aside"><div class="card-media">${siteInfo.heroImageUrl ? `<img src="${esc(siteInfo.heroImageUrl)}" alt="${esc(t(siteInfo.title, lang) || 'Center image')}" loading="lazy" />` : ''}</div><p class="card-copy">${esc(i18n(lang, 'Our team aligns diagnostics, treatment, and patient support in one continuous care pathway.', '?????? ???? ??????? ??????? ???? ?????? ??? ???? ????? ????.'))}</p></aside></div></div></section>`,
      `<section class="page-section page-section--tint"><div class="shell-container">${renderSectionHeader(
        i18n(lang, 'Latest updates', '???? ?????????'),
        i18n(lang, 'News and patient education', '??????? ???????? ?????'),
        i18n(lang, 'Medical updates, guidance articles, and center announcements.', '??????? ???? ??????? ?????? ???????? ??????.'),
        `<a class="btn btn--ghost" href="/events">${esc(i18n(lang, 'View all news', '??? ?? ???????'))}</a>`
      )}<div class="grid-3">${postsGrid}</div></div></section>`,
      `<section class="page-section page-section--tight"><div class="shell-container"><div class="cta-panel"><span class="section-kicker">${esc(i18n(lang, 'Need guidance now?', '????? ?????? ?????'))}</span><h2 class="section-title">${esc(t(ctaSection.heading, lang) || i18n(lang, 'You do not have to face cancer alone.', '??? ???? ?? ???? ??????.'))}</h2><p class="section-summary">${esc(t(ctaSection.subheading, lang) || i18n(lang, 'Talk with our care coordination team and get a clear next step.', '???? ?? ???? ????? ??????? ????? ??? ?????? ??????? ?????.'))}</p><div class="cta-panel__actions"><a class="btn btn--secondary" href="${esc(ctaHref || '/contact')}" ${ctaHref ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(t(ctaSection.buttonLabel, lang) || i18n(lang, 'Request consultation', '???? ???????'))}</a></div></div></div></section>`,
      '<script src="/js/pages/home.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/', {
      title: `${t(siteInfo.title, lang) || 'SATT'} | ${t(siteInfo.heroHeading, lang) || i18n(lang, 'Premium oncology care', '????? ????? ??????')}`,
      description: t(siteInfo.heroDescription, lang) || i18n(lang, 'Evidence-based oncology care with coordinated treatment pathways.', '????? ????? ????? ??? ?????? ?? ????? ?????? ????? ??????.'),
      canonicalUrl: `${SITE_BASE_URL}/`,
      keywords: i18n(lang, 'oncology, cancer center, treatment, specialists', '?????, ???? ???????, ???? ???, ?????????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/about', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const content = await getContent();
    const siteInfo = content.siteInfo || {};
    const aboutSection = content.aboutSection || {};
    const stats = content.stats || {};

    const paragraphs = (Array.isArray(aboutSection.paragraphs) ? aboutSection.paragraphs : [])
      .map((text) => `<p>${esc(t(text, lang))}</p>`)
      .join('');

    const highlights = (Array.isArray(aboutSection.highlights) ? aboutSection.highlights : [])
      .map((text) => `<li class="stack-item"><span class="material-symbols-outlined" aria-hidden="true">verified</span><span>${esc(t(text, lang))}</span></li>`)
      .join('');

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'About SATT', '?? ??????'),
        title: t(aboutSection.heading, lang) || i18n(lang, 'Clinical excellence with human-centered care', '???? ??? ?????? ??????? ???????'),
        summary: t((Array.isArray(aboutSection.paragraphs) ? aboutSection.paragraphs[0] : ''), lang),
        actionsHtml: `<a class="btn btn--primary" href="/contact">${esc(i18n(lang, 'Talk to our team', '????? ?? ??????'))}</a>`,
        visualHtml: renderHeroVisual({
          imageUrl: siteInfo.heroImageUrl,
          alt: t(siteInfo.title, lang),
          eyebrow: i18n(lang, 'Institutional trust', '??????? ??????'),
          title: i18n(lang, 'Built around multidisciplinary decision-making', '???? ??? ?????? ?????? ?????? ????????'),
          text: i18n(lang, 'Every patient plan is reviewed across specialties to ensure safety and precision.', '?? ??? ?????? ??? ???????? ??? ???????? ????? ????? ???????.'),
        }),
      }),
      renderMetricBand([
        { value: stats.patientsServed || 5000, suffix: '+', label: i18n(lang, 'Patients served', '???? ???? ???????') },
        { value: stats.successRate || 95, suffix: '%', label: i18n(lang, 'Positive outcomes', '????? ???????') },
        { value: stats.specialists || 50, suffix: '+', label: i18n(lang, 'Specialists', '??????? ??????') },
        { value: stats.yearsExperience || 20, suffix: '+', label: i18n(lang, 'Years of experience', '??? ????') },
      ]),
      `<section class="page-section"><div class="shell-container"><div class="spotlight-panel"><article class="spotlight-panel__content editorial">${paragraphs || `<p>${esc(i18n(lang, 'Detailed center information will be published soon.', '???? ??? ???????? ??????? ??????.'))}</p>`}</article><aside class="spotlight-panel__aside">${renderSectionHeader(
        i18n(lang, 'Why patients choose us', '????? ??????? ??????'),
        t(aboutSection.highlightsHeading, lang) || i18n(lang, 'Trust anchors', '??????? ?????'),
        i18n(lang, 'Practical factors that shape outcomes and confidence.', '????? ????? ???? ?????? ?? ??????? ??????.')
      )}${highlights ? `<ul class="stack-list">${highlights}</ul>` : ''}</aside></div></div></section>`,
      '<script src="/js/pages/about.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/about', {
      title: `${i18n(lang, 'About', '?? ???')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t((Array.isArray(aboutSection.paragraphs) ? aboutSection.paragraphs[0] : ''), lang) || i18n(lang, 'Learn how our oncology team coordinates care pathways.', '???? ??? ????? ????? ???? ??????? ??????? ???????.'),
      canonicalUrl: `${SITE_BASE_URL}/about`,
      keywords: i18n(lang, 'about oncology center, mission, values, specialists', '?? ??????, ???????, ?????, ???????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/about`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/services', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const content = await getContent();
    const siteInfo = content.siteInfo || {};
    const servicesSection = content.servicesSection || {};
    const services = getVisibleServices(content);
    const features = Array.isArray(content.features) ? content.features : [];

    const servicesGrid = services.length
      ? services.map((service) => renderServiceCard(service, lang)).join('')
      : renderEmptyState('medical_services', i18n(lang, 'No services published yet', '?? ???? ????? ??????'), i18n(lang, 'Please publish services from the admin dashboard.', '???? ??? ??????? ?? ???? ??????.'));

    const featureCards = features.length
      ? features.map((feature) => `
        <article class="card-panel">
          <span class="card-icon"><span class="material-symbols-outlined" aria-hidden="true">stars</span></span>
          <h3 class="card-title">${esc(t(feature.title, lang) || feature.title || '')}</h3>
          <p class="card-copy">${esc(t(feature.description, lang) || feature.description || '')}</p>
        </article>`).join('')
      : '';

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: t(servicesSection.badge, lang) || i18n(lang, 'Care pathways', '?????? ???????'),
        title: t(servicesSection.heading, lang) || i18n(lang, 'Comprehensive cancer care services', '????? ????? ????? ???????'),
        summary: t(servicesSection.subheading, lang),
        actionsHtml: `<a class="btn btn--primary" href="/contact">${esc(i18n(lang, 'Book consultation', '???? ???????'))}</a>`,
      }),
      `<section class="page-section"><div class="shell-container"><div class="grid-3">${servicesGrid}</div></div></section>`,
      featureCards ? `<section class="page-section page-section--tint"><div class="shell-container">${renderSectionHeader(
        i18n(lang, 'Why this approach works', '????? ???? ??? ?????'),
        t(servicesSection.highlightsHeading, lang) || i18n(lang, 'Service quality standards', '?????? ???? ??????'),
        i18n(lang, 'Clinical consistency and patient communication standards.', '?????? ????? ?????? ???????? ?? ??????.')
      )}<div class="grid-3">${featureCards}</div></div></section>` : '',
      '<script src="/js/pages/services.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/services', {
      title: `${i18n(lang, 'Services', '???????')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t(servicesSection.subheading, lang) || i18n(lang, 'Explore clinical and supportive oncology services.', '?????? ??????? ???????? ???????? ?? ???? ???????.'),
      canonicalUrl: `${SITE_BASE_URL}/services`,
      keywords: i18n(lang, 'oncology services, treatment pathways, supportive care', '????? ???????, ??????, ??????? ???????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/services`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/events', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const requestedType = String(req.query.type || 'all').toLowerCase();
    const allowedType = ['all', 'news', 'update', 'article'].includes(requestedType) ? requestedType : 'all';
    const [content, postsResult] = await Promise.all([
      getContent(),
      queryPublishedPosts({ limit: 40, type: allowedType !== 'all' ? allowedType : undefined }).catch(() => []),
    ]);

    const siteInfo = content.siteInfo || {};
    const posts = extractPosts(postsResult);
    const filteredPosts = allowedType === 'all' ? posts : posts.filter((post) => post.type === allowedType);

    const tabs = [
      { type: 'all', label: i18n(lang, 'All', '????') },
      { type: 'news', label: i18n(lang, 'News', '?????') },
      { type: 'update', label: i18n(lang, 'Updates', '???????') },
      { type: 'article', label: i18n(lang, 'Articles', '??????') },
    ].map((tab) => {
      const active = tab.type === allowedType;
      const href = tab.type === 'all' ? '/events' : `/events?type=${tab.type}`;
      return `<a href="${href}" class="button ${active ? 'button--primary' : 'button--quiet'} button--sm">${esc(tab.label)}</a>`;
    }).join('');

    const postsGrid = filteredPosts.length
      ? filteredPosts.map((post) => renderPostCard(post, lang)).join('')
      : renderEmptyState('article', i18n(lang, 'No posts found', '?? ???? ??????? ??????'), i18n(lang, 'Try another filter or check again later.', '??? ??????? ??? ?? ?? ??????.'));

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'Updates', '?????????'),
        title: i18n(lang, 'News and medical insights', '??????? ?????? ??????'),
        summary: i18n(lang, 'Stay up to date with clinical announcements, education, and center stories.', '???? ??? ????????? ?????? ???????? ??????? ???? ??????.'),
      }),
      `<section class="page-section page-section--tight"><div class="shell-container"><div class="hero-actions">${tabs}</div></div></section>`,
      `<section class="page-section"><div class="shell-container">${renderSectionHeader(
        i18n(lang, 'Browse posts', '???? ?????????'),
        i18n(lang, 'Latest publications', '???? ?????????'),
        i18n(lang, 'Use search to quickly find a topic.', '?????? ????? ?????? ?????? ??????? ???????.'),
        `<input id="events-search" type="search" placeholder="${esc(i18n(lang, 'Search posts...', '???? ?? ?????????...'))}" class="input" style="max-width: 280px;" />`
      )}<div class="grid-3">${postsGrid}</div></div></section>`,
      '<script src="/js/pages/events.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/events', {
      title: `${i18n(lang, 'News', '???????')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: i18n(lang, 'Latest news, updates, and educational posts from our center.', '???? ??????? ?????????? ????????? ???????? ?? ??????.'),
      canonicalUrl: `${SITE_BASE_URL}/events`,
      keywords: i18n(lang, 'news, updates, oncology articles, events', '?????, ???????, ?????? ?????, ???????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/events`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/media', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const [content, postsResult] = await Promise.all([
      getContent(),
      queryPublishedPosts({ limit: 40 }).catch(() => []),
    ]);

    const siteInfo = content.siteInfo || {};
    const posts = extractPosts(postsResult).slice(0, 18);
    const mediaItems = collectMediaItems(content, extractPosts(postsResult), lang).slice(0, 12);

    const labelByType = {
      news: i18n(lang, 'Oncology', '??????'),
      update: i18n(lang, 'Genetics', '??????'),
      article: i18n(lang, 'Patient Support', '???: ??????'),
      media: i18n(lang, 'Neuroscience', '????? ??????'),
    };

    const badgeByType = {
      news: i18n(lang, 'Insight', '?????'),
      update: i18n(lang, 'Gallery', '??????'),
      article: i18n(lang, 'Research Summary', '???? ?????'),
      media: i18n(lang, 'Video', '?????'),
    };

    const imageByFallback = [
      '/uploads/img-1770765094009-eigrur.jpg',
      siteInfo.heroImageUrl || '',
      '/uploads/img-1770765094009-eigrur.jpg',
    ].filter(Boolean);

    const normalizedCards = posts.map((post, idx) => {
      const type = String(post.type || '').toLowerCase();
      return {
        title: post.title || i18n(lang, 'Untitled insight', '????? ??? ?????'),
        excerpt: truncateText(post.excerpt || post.content || '', 170),
        href: `/post/${esc(post.slug || '')}`,
        image: post.featuredImage || imageByFallback[idx % imageByFallback.length] || '',
        date: localDate(post.createdAt, lang),
        category: labelByType[type] || i18n(lang, 'All Insights', '?? ???????'),
        badge: badgeByType[type] || i18n(lang, 'Insight', '?????'),
        isVideo: Boolean(post.videoUrl),
        rawType: type || 'news',
      };
    });

    if (!normalizedCards.length) {
      mediaItems.forEach((item, idx) => {
        normalizedCards.push({
          title: item.title || i18n(lang, 'Clinical media item', '???? ????? ?????'),
          excerpt: i18n(lang, 'A curated clinical visual and educational update from our center.', '????? ?????? ???????? ????????? ?? ??????.'),
          href: '/events',
          image: item.src || imageByFallback[idx % imageByFallback.length] || '',
          date: '',
          category: item.type || i18n(lang, 'All Insights', '?? ???????'),
          badge: i18n(lang, 'Gallery', '??????'),
          isVideo: false,
          rawType: 'media',
        });
      });
    }

    const filterMap = {
      all: i18n(lang, 'All Insights', '?? ???????'),
      news: i18n(lang, 'Oncology', '??????'),
      update: i18n(lang, 'Genetics', '??????'),
      article: i18n(lang, 'Patient Support', '???: ??????'),
      media: i18n(lang, 'Neuroscience', '????? ??????'),
    };

    const filterTabs = Object.entries(filterMap).map(([key, label], idx) => (
      `<button class="research-filter-chip ${idx === 0 ? 'is-active' : ''}" type="button" data-filter="${esc(key)}">${esc(label)}</button>`
    )).join('');

    const topCards = normalizedCards.slice(0, 4).map((item, idx) => `
      <article class="research-card ${idx === 0 ? 'research-card--feature' : ''}" data-research-card data-filter="${esc(item.rawType)}" data-title="${esc(item.title)}" data-excerpt="${esc(item.excerpt)}">
        <div class="research-card__media">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" />` : ''}
          <span class="research-card__badge">${esc(item.badge)}</span>
          ${item.isVideo ? '<span class="research-card__play material-symbols-outlined" aria-hidden="true">play_arrow</span>' : ''}
        </div>
        <div class="research-card__body">
          <p class="research-card__category">${esc(item.category)}</p>
          <h3>${esc(item.title)}</h3>
          ${item.excerpt ? `<p class="research-card__excerpt">${esc(item.excerpt)}</p>` : ''}
          <div class="research-card__meta">
            <span>${esc(item.date || '')}</span>
            <a href="${item.href}">${esc(i18n(lang, 'Explore', '??????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
          </div>
        </div>
      </article>`).join('');

    const campaignCard = `
      <article class="research-campaign" data-research-card data-filter="article" data-title="${esc(i18n(lang, 'Precision medicine awareness', '????? ??????'))}" data-excerpt="${esc(i18n(lang, 'Educational session for patients and families.', '???? ??????? ???????? ???????.'))}">
        <div class="research-campaign__copy">
          <p>${esc(i18n(lang, 'Community Awareness', '???? ???????'))}</p>
          <h3>${esc(i18n(lang, 'Precision Medicine: Changing the Landscape of Pediatric Care', '????? ????????: ??? ???? ???? ?????? ???????'))}</h3>
          <p class="research-campaign__lead">${esc(i18n(lang, 'Join an upcoming webinar where our specialists explain how genetic profiling personalizes care pathways.', '???? ?? ????? ?????? ??? ????? ?????? ????? ??????? ??? ????? ???????.'))}</p>
          <a class="research-campaign__cta" href="/contact">${esc(i18n(lang, 'Register for Awareness Talk', '??? ?????? ?? ??????'))}</a>
        </div>
        <div class="research-campaign__media">
          ${siteInfo.heroImageUrl ? `<img src="${esc(siteInfo.heroImageUrl)}" alt="${esc(i18n(lang, 'Pediatric care', '????? ???????'))}" loading="lazy" />` : ''}
        </div>
      </article>`;

    const lowerCards = normalizedCards.slice(4, 10).map((item) => `
      <article class="research-card" data-research-card data-filter="${esc(item.rawType)}" data-title="${esc(item.title)}" data-excerpt="${esc(item.excerpt)}">
        <div class="research-card__media">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" />` : ''}
          <span class="research-card__badge">${esc(item.badge)}</span>
        </div>
        <div class="research-card__body">
          <p class="research-card__category">${esc(item.category)}</p>
          <h3>${esc(item.title)}</h3>
          ${item.excerpt ? `<p class="research-card__excerpt">${esc(item.excerpt)}</p>` : ''}
          <div class="research-card__meta">
            <span>${esc(item.date || '')}</span>
            <a href="${item.href}">${esc(i18n(lang, 'Read more', '???? ??????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
          </div>
        </div>
      </article>`).join('');

    const summaryCard = `
      <article class="research-summary" data-research-card data-filter="news" data-title="${esc(i18n(lang, 'Global impact report', '???? ?????'))}" data-excerpt="${esc(i18n(lang, 'Urban prevention outcomes summary.', '???? ??????? ??????? ?? ??????.'))}">
        <span class="material-symbols-outlined" aria-hidden="true">description</span>
        <p>${esc(i18n(lang, 'Research Summary', '???? ?????'))}</p>
        <h3>${esc(i18n(lang, 'Global Impact Report: Cardiovascular Prevention in Urban Areas', '???? ????? ??????: ????? ??????? ?? ??????? ???????'))}</h3>
        <p class="research-summary__copy">${esc(i18n(lang, 'Longitudinal analysis highlights measurable reductions in chronic risk when communities adopt early screening.', '?????? ?????? ?????? ?? ?????? ??????? ???? ?????? ???????? ??????.'))}</p>
        <div class="research-summary__meta">
          <span>${esc(localDate(new Date().toISOString(), lang))}</span>
          <a href="/events">${esc(i18n(lang, 'Read abstract', '??? ?????'))}<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
        </div>
      </article>`;

    const hasCards = Boolean(topCards || lowerCards);

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'Scientific Research', '????? ??????'),
        title: i18n(lang, 'Scientific Insights & Media', '?????? ?????????? ????????'),
        summary: i18n(lang, 'Advancing global healthcare through rigorous research, clinical innovation, and evidence-based storytelling.', '???? ??????? ?????? ?? ???? ????? ?????? ???????? ?????????? ???? ??? ??????.'),
      }),
      `<section class="page-section page-section--tight"><div class="shell-container"><div class="research-toolbar"><div class="research-filters" role="tablist" aria-label="${esc(i18n(lang, 'Media filters', '?????? ?????'))}">${filterTabs}</div><div class="research-tools"><label class="research-search"><span class="material-symbols-outlined" aria-hidden="true">search</span><input id="media-search" type="search" placeholder="${esc(i18n(lang, 'Search research...', '???? ?? ?????????? ...'))}" /></label><div class="research-view-switch" role="group" aria-label="${esc(i18n(lang, 'View mode', '??? ?????'))}"><button type="button" class="is-active" data-view="grid" aria-label="${esc(i18n(lang, 'Grid view', '??? ??????'))}"><span class="material-symbols-outlined" aria-hidden="true">grid_view</span></button><button type="button" data-view="compact" aria-label="${esc(i18n(lang, 'Compact view', '??? ?????'))}"><span class="material-symbols-outlined" aria-hidden="true">view_agenda</span></button></div></div></div></div></section>`,
      hasCards
        ? `<section class="page-section" style="padding-top: 0;"><div class="shell-container"><div id="media-gallery" class="research-grid">${topCards}${summaryCard}${campaignCard}${lowerCards}</div><div class="research-loading"><div class="research-loading__dots" aria-hidden="true"><span></span><span></span><span></span></div><p>${esc(i18n(lang, 'Loading more insights', '???? ?? ?????????? ...'))}</p></div></div></section>`
        : `<section class="page-section"><div class="shell-container">${renderEmptyState('photo_library', i18n(lang, 'Media gallery coming soon', '???? ??????? ???? ??????'), i18n(lang, 'Upload photos and videos from the dashboard to populate this page.', '??? ????? ??????????? ?? ???? ?????? ?????? ???.'))}</div></section>`,
      '<script src="/js/pages/media.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/media', {
      title: `${i18n(lang, 'Media', '???????')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: i18n(lang, 'Browse photos and videos from our center.', '???? ????? ??????????? ?? ??????.'),
      canonicalUrl: `${SITE_BASE_URL}/media`,
      keywords: i18n(lang, 'gallery, media, photos, videos', '????, ?????, ???, ?????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/media`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/contact', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const content = await getContent();
    const siteInfo = content.siteInfo || {};
    const contactSection = content.contactSection || {};
    const contact = content.contact || {};
    const contactSettings = content.contactSettings || {};

    const whatsappNumber = digitsOnly(contactSettings.whatsappSupportNumber || contact.phone || contact.emergencyPhone || '');

    const details = [
      contact.phone ? renderInfoCard('call', i18n(lang, 'Phone', '??????'), `<a href="tel:${esc(String(contact.phone))}">${esc(String(contact.phone))}</a>`) : '',
      t(contact.email, lang) ? renderInfoCard('mail', i18n(lang, 'Email', '?????? ??????????'), `<a href="mailto:${esc(t(contact.email, lang))}">${esc(t(contact.email, lang))}</a>`) : '',
      t(contact.address, lang) ? renderInfoCard('location_on', i18n(lang, 'Address', '???????'), `<strong>${esc(t(contact.address, lang))}</strong>`) : '',
      contact.emergencyPhone ? renderInfoCard('emergency', i18n(lang, 'Emergency', '???????'), `<a href="tel:${esc(String(contact.emergencyPhone))}">${esc(String(contact.emergencyPhone))}</a>`) : '',
    ].filter(Boolean).join('');

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'Contact', '???????'),
        title: t(contactSection.heading, lang) || i18n(lang, 'Request a consultation', '???? ???????'),
        summary: t(contactSection.subheading, lang) || i18n(lang, 'Share your details and our team will contact you.', '???? ??????? ???????? ??? ??????.'),
      }),
      `<section class="page-section"><div class="shell-container"><div class="contact-layout"><article class="form-panel"><form id="contact-form" ${whatsappNumber ? `data-whatsapp="${esc(whatsappNumber)}"` : ''} novalidate><div class="field-grid"><div class="field"><label for="fc-name">${esc(i18n(lang, 'Full name', '????? ??????'))}</label><input id="fc-name" name="name" type="text" required placeholder="${esc(i18n(lang, 'Your full name', '???? ???? ???????'))}" /></div><div class="field"><label for="fc-phone">${esc(i18n(lang, 'Phone', '??????'))}</label><input id="fc-phone" name="phone" type="tel" inputmode="tel" required placeholder="${esc(i18n(lang, '+20 ...', '+20 ...'))}" /></div></div><div class="field"><label for="fc-email">${esc(i18n(lang, 'Email', '?????? ??????????'))}</label><input id="fc-email" name="email" type="email" placeholder="name@example.com" /></div><div class="field"><label for="fc-message">${esc(i18n(lang, 'How can we help?', '??? ?????? ????????'))}</label><textarea id="fc-message" name="message" rows="6" required placeholder="${esc(i18n(lang, 'Write a short summary of your concern', '???? ?????? ??????? ??????'))}"></textarea></div><p class="inline-note">${esc(t(contactSection.privacyNotice, lang) || i18n(lang, 'We only use your details to coordinate your consultation request.', '?????? ??????? ??? ?????? ??? ?????????.'))}</p><button id="contact-submit" type="submit" class="btn btn--primary"><span class="material-symbols-outlined" aria-hidden="true">${whatsappNumber ? 'chat' : 'send'}</span><span>${esc(whatsappNumber ? i18n(lang, 'Send via WhatsApp', '????? ??? ??????') : i18n(lang, 'Send message', '????? ???????'))}</span></button><div id="contact-feedback" class="status-panel" role="status" aria-live="polite"></div></form></article><aside class="details-panel"><div class="info-stack">${details}</div></aside></div></div></section>`,
      '<script src="/js/pages/contact.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/contact', {
      title: `${i18n(lang, 'Contact', '???? ???')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t(contactSection.subheading, lang) || i18n(lang, 'Reach our team for consultation and patient support.', '????? ?? ?????? ????????? ???? ??????.'),
      canonicalUrl: `${SITE_BASE_URL}/contact`,
      keywords: i18n(lang, 'contact, consultation, patient support', '?????, ???????, ??? ??????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/contact`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/experts', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const content = await getContent();
    const siteInfo = content.siteInfo || {};
    const teamSection = content.teamSection || {};
    const experts = getVisibleExperts(content);

    const expertsGrid = experts.length
      ? experts.map((expert) => renderExpertCard(expert, lang)).join('')
      : renderEmptyState('group', i18n(lang, 'Team profiles will be published soon', '???? ??? ????? ?????? ??????'), i18n(lang, 'Please add specialist profiles in the dashboard.', '???? ????? ????? ??????? ?? ???? ??????.'));

    const searchControl = experts.length > 4
      ? `<input id="expert-search" type="search" placeholder="${esc(i18n(lang, 'Search specialists...', '???? ?? ????...'))}" class="input" style="max-width: 320px;" />`
      : '';

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'Specialists', '???????'),
        title: t(teamSection.heading, lang) || i18n(lang, 'Meet our medical team', '???? ??? ?????? ?????'),
        summary: t(teamSection.subheading, lang) || i18n(lang, 'Board-certified specialists across oncology pathways.', '????????? ??????? ??? ????? ?????? ???? ???????.'),
      }),
      `<section class="page-section"><div class="shell-container">${renderSectionHeader(
        i18n(lang, 'Clinical leadership', '??????? ??????'),
        i18n(lang, 'Our specialists', '??????? ?????????'),
        i18n(lang, 'Search by name or role to find the right specialist.', '???? ?????? ?? ????? ?????? ?????? ???????.'),
        searchControl
      )}<div class="grid-3">${expertsGrid}</div></div></section>`,
      '<script src="/js/pages/experts.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/experts', {
      title: `${i18n(lang, 'Doctors', '???????')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t(teamSection.subheading, lang) || i18n(lang, 'Meet our oncology specialists and consultants.', '???? ??? ???????? ???????? ???????.'),
      canonicalUrl: `${SITE_BASE_URL}/experts`,
      keywords: i18n(lang, 'doctors, specialists, oncology team', '?????, ?????????, ???? ???????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/experts`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get('/insurance', async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const content = await getContent();
    const siteInfo = content.siteInfo || {};
    const insurance = content.insurance || {};

    const rawList = t(insurance.coverageList, lang) || t(insurance.coverageList, 'en') || '';
    const companies = rawList
      .split(/\n{2,}/)
      .map((block) => block.split('\n').map((line) => line.trim()).filter(Boolean).join(' '))
      .filter(Boolean);

    const companyCards = companies.length
      ? companies.map((name) => `
          <article class="card-panel" data-company-name="${esc(name.toLowerCase())}">
            <span class="card-icon"><span class="material-symbols-outlined" aria-hidden="true">verified</span></span>
            <h3 class="card-title">${esc(name)}</h3>
            <p class="card-copy">${esc(i18n(lang, 'Coverage verification available before your visit.', '??????? ?????? ?? ??????? ??? ???????.'))}</p>
          </article>`).join('')
      : renderEmptyState('verified', i18n(lang, 'Coverage list coming soon', '????? ??????? ?????? ??????'), i18n(lang, 'Add insurance partners in content settings.', '??? ????? ??????? ?? ??????? ???????.'));

    const searchControl = companies.length > 8
      ? `<input id="insurance-search" type="search" placeholder="${esc(i18n(lang, 'Search insurance companies...', '???? ?? ???? ?????...'))}" class="input" style="max-width: 340px;" />`
      : '';

    const pageContent = [
      renderPageHero({
        compact: true,
        kicker: i18n(lang, 'Insurance', '???????'),
        title: i18n(lang, 'Insurance and coverage support', '??? ??????? ????????'),
        summary: t(insurance.blurb, lang) || i18n(lang, 'Review accepted plans and contact us for eligibility guidance.', '???? ????? ???????? ?????? ???? ?????? ?? ???????.'),
      }),
      `<section class="page-section"><div class="shell-container">${renderSectionHeader(
        i18n(lang, 'Partners', '???????'),
        i18n(lang, 'Accepted plans', '????? ????????'),
        i18n(lang, 'Search by insurer name to confirm your plan.', '???? ???? ???? ??????? ?????? ?? ????.'),
        searchControl
      )}<div class="grid-3">${companyCards}</div></div></section>`,
      '<script src="/js/pages/insurance.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/insurance', {
      title: `${i18n(lang, 'Insurance', '???????')} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t(insurance.blurb, lang) || i18n(lang, 'Insurance coverage guidance and accepted plans.', '??????? ??????? ???????? ?????? ????????.'),
      canonicalUrl: `${SITE_BASE_URL}/insurance`,
      keywords: i18n(lang, 'insurance, coverage, partner plans', '?????, ?????, ??? ?????'),
      ogTags: { type: 'website', url: `${SITE_BASE_URL}/insurance`, image: siteInfo.heroImageUrl || '' },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

router.get(['/post/:slug', '/posts/:slug'], async (req, res, next) => {
  try {
    const lang = detectLanguage(req, res);
    const slug = String(req.params.slug || '').trim().toLowerCase();

    const [content, post] = await Promise.all([
      getContent(),
      getPublishedPostBySlug(slug).catch(() => null),
    ]);

    if (!post) {
      res.status(404);
      const notFoundHtml = `<section class="page-section"><div class="shell-container"><div class="card-grid"><article class="card-panel"><span class="card-icon"><span class="material-symbols-outlined" aria-hidden="true">article</span></span><h1 class="card-title">${esc(i18n(lang, 'Post not found', '??????? ??? ?????'))}</h1><p class="card-copy">${esc(i18n(lang, 'The requested post is unavailable or the URL is incorrect.', '??????? ??????? ??? ???? ?? ?? ?????? ??? ????.'))}</p><a class="btn btn--primary" href="/events">${esc(i18n(lang, 'Back to news', '?????? ??? ???????'))}</a></article></div></div></section>`;
      const notFound = await layoutRenderer.render(notFoundHtml, pageConfig(content, lang, '/events', {
        title: i18n(lang, 'Post not found', '??????? ??? ?????'),
        description: i18n(lang, 'The requested post was not found.', '???? ?????? ??? ??????? ???????.'),
        canonicalUrl: `${SITE_BASE_URL}/events`,
      }));
      return res.send(notFound);
    }

    const siteInfo = content.siteInfo || {};
    const title = post.seoTitle || post.title || '';
    const description = post.seoDescription || post.excerpt || truncateText(post.content || '', 180);
    const date = localDate(post.createdAt, lang);
    const typeLabel = {
      news: i18n(lang, 'News', '???'),
      update: i18n(lang, 'Update', '?????'),
      article: i18n(lang, 'Article', '????'),
    }[post.type] || i18n(lang, 'Post', '?????');

    const bodyHtml = (post.content || '')
      .split(/\n{2,}/)
      .filter((paragraph) => paragraph.trim())
      .map((paragraph) => `<p>${esc(paragraph.trim()).replace(/\n/g, '<br />')}</p>`)
      .join('');

    const tags = Array.isArray(post.tags)
      ? post.tags.filter(Boolean).map((tag) => `<span class="badge">${esc(tag)}</span>`).join('')
      : '';

    const relatedResult = await queryPublishedPosts({ limit: 8, type: post.type }).catch(() => []);
    const relatedPosts = extractPosts(relatedResult).filter((item) => item.slug !== post.slug).slice(0, 3);
    const relatedGrid = relatedPosts.length
      ? relatedPosts.map((item) => renderPostCard(item, lang)).join('')
      : '';

    const pageContent = [
      `<div id="read-progress" class="article-progress" aria-hidden="true"></div>`,
      `<section class="page-section page-section--tight"><div class="shell-container article-layout"><article><header class="article-header"><span class="badge">${esc(typeLabel)}</span><h1 class="article-title">${esc(post.title || '')}</h1><div class="article-meta">${date ? `<span>${esc(date)}</span>` : ''}${post.author ? `<span>${esc(post.author)}</span>` : ''}</div>${post.excerpt ? `<p class="article-lead">${esc(post.excerpt)}</p>` : ''}${tags ? `<div class="hero-proof">${tags}</div>` : ''}</header>${post.featuredImage ? `<div class="card-media" style="margin-top:22px;"><img src="${esc(post.featuredImage)}" alt="${esc(post.title || '')}" loading="eager" /></div>` : ''}</article><aside class="article-toolbar"><div class="article-meta"><span class="material-symbols-outlined" aria-hidden="true">schedule</span><span id="reading-time">...</span></div><button id="copy-link-btn" class="btn btn--ghost button--sm" type="button">${esc(i18n(lang, 'Copy link', '??? ??????'))}</button></aside></div></section>`,
      `<section class="page-section"><div class="shell-container"><article id="post-body" class="article-body editorial">${bodyHtml || `<p>${esc(i18n(lang, 'No content available.', '?? ???? ????? ????.'))}</p>`}</article></div></section>`,
      relatedGrid ? `<section class="page-section page-section--tint"><div class="shell-container">${renderSectionHeader(i18n(lang, 'Continue reading', '???? ?????'), i18n(lang, 'Related posts', '??????? ??? ???'), '')}<div class="grid-3">${relatedGrid}</div></div></section>` : '',
      '<script src="/js/pages/post.js"></script>',
    ].join('');

    const html = await layoutRenderer.render(pageContent, pageConfig(content, lang, '/events', {
      title: `${t(title, lang) || title} | ${t(siteInfo.title, lang) || 'SATT'}`,
      description: t(description, lang) || description,
      canonicalUrl: `${SITE_BASE_URL}/post/${esc(post.slug)}`,
      keywords: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      ogTags: {
        type: 'article',
        url: `${SITE_BASE_URL}/post/${esc(post.slug)}`,
        image: post.featuredImage || '',
      },
    }));

    res.set('Cache-Control', 'no-cache');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
