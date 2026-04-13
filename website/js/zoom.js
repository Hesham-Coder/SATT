(function () {
  var ZOOM_KEY = "site-zoom-level";
  var MIN_ZOOM = 0.8;
  var MAX_ZOOM = 1.5;
  var DEFAULT_ZOOM = 1;
  var TRANSITION_MS = 250;

  function clampZoom(value) {
    var parsed = Number(value);
    if (!isFinite(parsed)) return DEFAULT_ZOOM;
    if (parsed < MIN_ZOOM) return MIN_ZOOM;
    if (parsed > MAX_ZOOM) return MAX_ZOOM;
    return Math.round(parsed * 100) / 100;
  }

  function formatUnit(value) {
    return String(Math.round(value * 100000) / 100000);
  }

  function getWrapper() {
    return document.getElementById("app-zoom-wrapper");
  }

  function getFrame() {
    return document.querySelector(".site-zoom-frame");
  }

  function getStoredZoom() {
    try {
      return clampZoom(localStorage.getItem(ZOOM_KEY));
    } catch (error) {
      return DEFAULT_ZOOM;
    }
  }

  function applyZoom(scale, options) {
    var settings = options || {};
    var frame = getFrame();
    var wrapper = getWrapper();
    var nextScale = clampZoom(scale);

    if (!wrapper) return nextScale;

    if (frame) {
      frame.style.width = "100%";
      frame.style.overflowX = "hidden";
    }

    wrapper.style.display = "block";
    wrapper.style.marginLeft = "auto";
    wrapper.style.marginRight = "auto";

    if (Math.abs(nextScale - 1) < 0.001) {
      wrapper.style.transformOrigin = "top center";
      wrapper.style.transform = "none";
      wrapper.style.width = "100%";
      wrapper.style.minHeight = "100vh";
    } else {
      wrapper.style.transformOrigin = "top center";
      wrapper.style.transform = "scale(" + nextScale + ")";
      wrapper.style.width = formatUnit(100 / nextScale) + "%";
      wrapper.style.minHeight = nextScale < 1 ? formatUnit(100 / nextScale) + "vh" : "100vh";
    }

    // Guard rail: if scaled content exceeds viewport width, reduce to the largest safe scale.
    if (nextScale > 1) {
      var rect = wrapper.getBoundingClientRect();
      var viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      var hasOverflow = rect.width > (viewportWidth + 1) || rect.left < -1 || rect.right > (viewportWidth + 1);
      if (hasOverflow && rect.width > 0 && viewportWidth > 0) {
        var fitRatio = viewportWidth / rect.width;
        var fittedScale = clampZoom(nextScale * fitRatio);
        if (fittedScale < nextScale) {
          nextScale = fittedScale;
          wrapper.style.transform = "scale(" + nextScale + ")";
          wrapper.style.width = formatUnit(100 / nextScale) + "%";
          wrapper.style.minHeight = nextScale < 1 ? formatUnit(100 / nextScale) + "vh" : "100vh";
        }
      }
    }

    wrapper.style.transition = settings.enableTransition ? "transform " + TRANSITION_MS + "ms ease, width " + TRANSITION_MS + "ms ease" : "none";
    wrapper.style.willChange = settings.enableTransition ? "transform" : "auto";
    wrapper.classList.toggle("zoom-ready", Boolean(settings.enableTransition));
    document.documentElement.style.setProperty("--site-zoom-level", String(nextScale));
    return nextScale;
  }

  function setZoom(scale) {
    var nextScale = clampZoom(scale);
    nextScale = applyZoom(nextScale, { enableTransition: true });
    try {
      localStorage.setItem(ZOOM_KEY, String(nextScale));
    } catch (error) {
      // Ignore storage failures and still apply the runtime zoom value.
    }
    window.dispatchEvent(new CustomEvent("site-zoom-change", { detail: { scale: nextScale } }));
    return nextScale;
  }

  function initZoom() {
    if (window.__siteZoomInitialized) return;
    window.__siteZoomInitialized = true;

    applyZoom(getStoredZoom(), { enableTransition: false });
    requestAnimationFrame(function () {
      applyZoom(getStoredZoom(), { enableTransition: true });
    });

    window.addEventListener("storage", function (event) {
      if (event.key && event.key !== ZOOM_KEY) return;
      applyZoom(getStoredZoom(), { enableTransition: true });
    });

    window.addEventListener("resize", function () {
      applyZoom(getStoredZoom(), { enableTransition: false });
    });
  }

  window.siteZoom = {
    getZoom: getStoredZoom,
    initZoom: initZoom,
    setZoom: setZoom,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initZoom, { once: true });
  } else {
    initZoom();
  }
})();