// Sean Patrick Mantica — Portfolio (shared by all pages)
(function () {
  var nav = document.getElementById('site-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.nav-toggle');
  var isNavigating = false;
  var activeNavLink = nav.querySelector('.nav-links a.active');

  if (activeNavLink && document.referrer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var previousPage = new URL(document.referrer);
    if (previousPage.origin === window.location.origin) {
      var previousNavLink = null;
      nav.querySelectorAll('.nav-links a').forEach(function (a) {
        if (new URL(a.href).pathname === previousPage.pathname) {
          previousNavLink = a;
        }
      });

      if (previousNavLink && previousNavLink !== activeNavLink) {
        var previousPosition = previousNavLink.getBoundingClientRect();
        var activePosition = activeNavLink.getBoundingClientRect();
        activeNavLink.style.setProperty('--nav-slide-x', (previousPosition.left - activePosition.left) + 'px');
        activeNavLink.style.setProperty('--nav-slide-y', (previousPosition.top - activePosition.top) + 'px');
        activeNavLink.classList.add('nav-sliding-in');
      }
    }
  }

  // Mobile menu
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close the mobile menu after choosing a link
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function (event) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        a.hasAttribute('download') ||
        (a.target && a.target !== '_self') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      var destination = new URL(a.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        !/\.html$/i.test(destination.pathname) ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      if (isNavigating) return;

      isNavigating = true;
      document.body.classList.add('page-leaving');
      window.setTimeout(function () {
        window.location.assign(destination.href);
      }, 240);
    });
  });

  window.addEventListener('pageshow', function () {
    document.body.classList.remove('page-leaving');
    isNavigating = false;
  });

  var certificationCount = document.querySelector('[data-certification-count]');
  if (certificationCount) {
    fetch('Certificates.html')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Certificates.html returned HTTP ' + response.status);
        }
        return response.text();
      })
      .then(function (html) {
        var certificatesPage = new DOMParser().parseFromString(html, 'text/html');
        certificationCount.textContent = certificatesPage.querySelectorAll('.cert-card').length;
      })
      .catch(function (error) {
        console.error('Unable to update the certification count from Certificates.html.', error);
      });
  }
})();
