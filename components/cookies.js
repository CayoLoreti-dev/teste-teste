/**
 * COOKIES - Banner e consentimento
 * 
 * HTML e lógica do banner de cookies, separado dos modais.
 */

function getCookieBannerHTML() {
  return `
    <div class="cookie-banner" id="cookieBanner">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3>🍪 Usamos cookies</h3>
          <p>Utilizamos cookies para melhorar sua experiência em nosso site. Você pode escolher quais cookies aceitar.</p>
        </div>
        <div class="cookie-buttons">
          <button class="cookie-btn cookie-btn-necessary" id="cookieNecessary">Apenas Necessários</button>
          <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">Aceitar Tudo</button>
          <button class="cookie-btn cookie-btn-reject" id="cookieRejectAll">Recusar Tudo</button>
        </div>
      </div>
    </div>
  `;
}

function applyCookieConsent(consent) {
  if (consent === 'necessary' || consent === 'all') {
    setCookie('cookieConsent', consent, 30);
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    setCookie('theme', currentTheme, 30);
    setCookie('userHasChosenTheme', 'true', 30);
    if (typeof auth !== 'undefined') {
      auth.persistMemoryUser();
    }
    document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent } }));
    localStorage.removeItem('theme');
    localStorage.removeItem('userHasChosenTheme');
    localStorage.removeItem('cookieConsent');
    return;
  }

  if (consent === 'none') {
    setCookie('cookieConsent', 'none', 30);
    removeCookie('theme');
    removeCookie('userHasChosenTheme');
    if (typeof auth !== 'undefined') {
      auth.clearStoredUser();
      auth.updateAccountLabels();
    }
    document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'none' } }));
    localStorage.removeItem('theme');
    localStorage.removeItem('userHasChosenTheme');
    localStorage.removeItem('cookieConsent');
  }
}

function initCookies() {
  if (document.getElementById('cookieBanner')) return;

  const legacyConsent = localStorage.getItem('cookieConsent');
  if (!getCookie('cookieConsent') && legacyConsent) {
    setCookie('cookieConsent', legacyConsent, 30);
    localStorage.removeItem('cookieConsent');
  }

  const bannerWrapper = document.createElement('div');
  bannerWrapper.innerHTML = getCookieBannerHTML();
  document.body.appendChild(bannerWrapper.firstElementChild);

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieNecessary = document.getElementById('cookieNecessary');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieRejectAll = document.getElementById('cookieRejectAll');

  const cookieConsent = getCookie('cookieConsent');
  if (!cookieConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }

  if (cookieNecessary) {
    cookieNecessary.addEventListener('click', () => {
      if (cookieBanner) cookieBanner.classList.remove('show');
      applyCookieConsent('necessary');
    });
  }

  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', () => {
      if (cookieBanner) cookieBanner.classList.remove('show');
      applyCookieConsent('all');
    });
  }

  if (cookieRejectAll) {
    cookieRejectAll.addEventListener('click', () => {
      if (cookieBanner) cookieBanner.classList.remove('show');
      applyCookieConsent('none');
    });
  }
}