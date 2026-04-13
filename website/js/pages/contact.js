// Contact page — handles WhatsApp routing or direct API submission
(function () {
  var form = document.getElementById('contact-form');
  var feedback = document.getElementById('contact-feedback');
  var submitBtn = document.getElementById('contact-submit');
  if (!form) return;

  function showFeedback(kind, message) {
    if (!feedback) return;
    feedback.style.display = 'block';
    feedback.className = 'status-panel ' + (kind === 'ok' ? 'status-panel--ok' : 'status-panel--error');
    feedback.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    var whatsapp = form.dataset.whatsapp;

    if (whatsapp) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';

      var text = [
        name ? 'Name: ' + name : '',
        phone ? 'Phone: ' + phone : '',
        email ? 'Email: ' + email : '',
        message ? 'Message: ' + message : '',
      ].filter(Boolean).join('\n');

      window.open(
        'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(text),
        '_blank',
        'noopener,noreferrer',
      );
      return;
    }

    // API submission fallback
    e.preventDefault();
    var data = {
      name: (form.querySelector('[name="name"]') || {}).value || '',
      phone: (form.querySelector('[name="phone"]') || {}).value || '',
      email: (form.querySelector('[name="email"]') || {}).value || '',
      message: (form.querySelector('[name="message"]') || {}).value || '',
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      var label = submitBtn.querySelector('span:last-child');
      if (label) label.textContent = 'Sending...';
    }

    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    })
      .then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (result) {
        showFeedback(
          result.ok ? 'ok' : 'error',
          result.ok
            ? 'Your message has been sent. We will be in touch shortly.'
            : ((result.body && result.body.message) || 'Something went wrong. Please try again.')
        );
        if (result.ok) form.reset();
      })
      .catch(function () {
        showFeedback('error', 'Network error. Please check your connection and try again.');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          var lbl = submitBtn.querySelector('span:last-child');
          if (lbl) lbl.textContent = 'Send Message';
        }
      });
  });
})();
