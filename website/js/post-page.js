(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setMetaTag(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute('content', value || '');
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function getSlug() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts.length ? decodeURIComponent(parts[parts.length - 1]) : '';
  }

  function labelType(type) {
    if (type === 'update') return "What's New";
    if (type === 'article') return 'Article';
    return 'News';
  }

  function isDirectVideoUrl(url) {
    return /(\.mp4|\.webm|\.ogv|\.ogg|\.mov|\.m4v)(\?|#|$)/i.test(url || '') || /^\/uploads\/vid-/i.test(url || '');
  }

  function toEmbedUrl(url) {
    const rawUrl = String(url || '').trim();
    if (!rawUrl) return '';
    // YouTube: watch?v= format
    if (/youtube\.com\/watch\?v=/i.test(rawUrl)) {
      const videoId = (rawUrl.split('v=')[1] || '').split('&')[0];
      return videoId ? 'https://www.youtube.com/embed/' + videoId : '';
    }
    // YouTube: short URL format
    if (/youtu\.be\//i.test(rawUrl)) {
      const shortId = rawUrl.split('youtu.be/')[1].split(/[?&]/)[0];
      return shortId ? 'https://www.youtube.com/embed/' + shortId : '';
    }
    // Facebook: any video page or reel
    if (/facebook\.com\//i.test(rawUrl) && (/\/video|reel|watch/i.test(rawUrl) || /facebook\.com\/.*\/(video|reel)\//i.test(rawUrl))) {
      return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(rawUrl) + '&show_text=false&width=560';
    }
    // Vimeo: numeric video ID
    if (/vimeo\.com\/\d+/i.test(rawUrl)) {
      const vmId = (rawUrl.match(/vimeo\.com\/(\d+)/i) || [])[1];
      return vmId ? 'https://player.vimeo.com/video/' + vmId : '';
    }
    // Already embed URLs - pass through
    if (/youtube\.com\/embed\//i.test(rawUrl) || /youtube-nocookie\.com\/embed\//i.test(rawUrl) || /player\.vimeo\.com\/video\//i.test(rawUrl) || /facebook\.com\/plugins\/video\.php/i.test(rawUrl)) {
      return rawUrl;
    }
    return '';
  }

  function render(post) {
    const loading = document.getElementById('loadingState');
    const article = document.getElementById('postArticle');
    const meta = document.getElementById('postMeta');
    const title = document.getElementById('postTitle');
    const excerpt = document.getElementById('postExcerpt');
    const image = document.getElementById('postImage');
    const video = document.getElementById('postVideo');
    const videoEmbed = document.getElementById('postVideoEmbed');
    const content = document.getElementById('postContent');
    const tags = document.getElementById('postTags');
    const typeLink = document.getElementById('postTypeLink');

    loading.classList.add('hidden');
    article.classList.remove('hidden');

    const typeLabel = labelType(post.type);
    const dateLabel = formatDate(post.createdAt);
    meta.textContent = typeLabel + (dateLabel ? ' • ' + dateLabel : '') + (post.author ? ' • ' + post.author : '');
    title.textContent = post.title || '';
    excerpt.textContent = post.excerpt || '';
    content.innerHTML = post.content || '';

    if (post.videoUrl) {
      if (isDirectVideoUrl(post.videoUrl)) {
        video.src = post.videoUrl;
        video.classList.remove('hidden');
        videoEmbed.classList.add('hidden');
        videoEmbed.removeAttribute('src');
      } else {
        const embedUrl = toEmbedUrl(post.videoUrl);
        if (embedUrl) {
          videoEmbed.src = embedUrl;
          videoEmbed.classList.remove('hidden');
          video.classList.add('hidden');
          video.removeAttribute('src');
        }
      }
      image.classList.add('hidden');
    } else if (post.featuredImage) {
      image.src = post.featuredImage;
      image.alt = post.title || 'Post image';
      image.classList.remove('hidden');
      video.classList.add('hidden');
      video.removeAttribute('src');
      videoEmbed.classList.add('hidden');
      videoEmbed.removeAttribute('src');
    }

    tags.innerHTML = (post.tags || []).map(function (tag) {
      return '<span class="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">#' + escapeHtml(tag) + '</span>';
    }).join('');

    typeLink.textContent = typeLabel;
    typeLink.href = '/#' + (post.type === 'article' ? 'articles' : post.type === 'update' ? 'updates' : 'news');

    const metaTitle = post.seoTitle || post.title || 'Article';
    const metaDescription = post.seoDescription || post.excerpt || '';
    document.title = metaTitle;
    setMetaTag('meta[name="description"]', metaDescription);
    setMetaTag('meta[property="og:title"]', metaTitle);
    setMetaTag('meta[property="og:description"]', metaDescription);
    setMetaTag('meta[name="twitter:title"]', metaTitle);
    setMetaTag('meta[name="twitter:description"]', metaDescription);
    if (post.featuredImage) {
      setMetaTag('meta[property="og:image"]', post.featuredImage);
      setMetaTag('meta[name="twitter:image"]', post.featuredImage);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/posts/' + encodeURIComponent(post.slug));

    // If Facebook embed was added, parse it with FB SDK
    if (window.FB && window.FB.XFBML && post.videoUrl && /facebook\.com\//i.test(post.videoUrl)) {
      setTimeout(function() {
        try {
          window.FB.XFBML.parse();
        } catch (e) {
          // FB SDK might not be fully ready
        }
      }, 100);
    }
  }

  function showError(message) {
    document.getElementById('loadingState').classList.add('hidden');
    const box = document.getElementById('errorState');
    box.classList.remove('hidden');
    box.textContent = message || 'Failed to load this post.';
  }

  const slug = getSlug();
  if (!slug) {
    showError('Post slug is missing.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const isPreview = params.get('preview') === '1';
  const previewId = params.get('id') || '';
  const endpoint = isPreview && previewId
    ? '/api/admin/posts/id/' + encodeURIComponent(previewId)
    : '/api/posts/' + encodeURIComponent(slug);

  fetch(endpoint, { credentials: 'same-origin' })
    .then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error(data.error || 'Post not found');
        return data;
      });
    })
    .then(render)
    .catch(function (err) {
      showError(err.message);
    });
})();
