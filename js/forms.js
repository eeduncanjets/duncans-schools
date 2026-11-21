/* Netlify Forms handler for Duncan's Tech Schools.
   Netlify must have form detection enabled for submissions to be stored. */
(function () {
  function encodeForm(form) {
    const data = new FormData(form);
    return new URLSearchParams(data).toString();
  }

  async function submitToNetlify(form, status) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button ? button.textContent : '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }
    if (status) status.textContent = 'Sending...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(form)
      });

      if (!response.ok) {
        throw new Error('Netlify returned HTTP ' + response.status);
      }

      if (status) {
        status.textContent = form.elements['form-name']?.value === 'newsletter'
          ? 'Thanks for subscribing! Your email has been submitted.'
          : 'Thank you. Your message has been submitted.';
      }
      form.reset();
    } catch (error) {
      console.error('Form submission failed:', error);
      if (status) {
        status.textContent = 'We could not submit this form. Please try again later.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const newsletter = document.querySelector('form[name="newsletter"]');
    if (newsletter) {
      newsletter.addEventListener('submit', function (event) {
        event.preventDefault();
        const status = document.getElementById('newsletter-msg');
        submitToNetlify(newsletter, status);
      });
    }

    document.querySelectorAll('form.ajax-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const status = form.parentElement.querySelector('.form-msg') ||
          document.getElementById('contact-msg');
        submitToNetlify(form, status);
      });
    });
  });
})();
