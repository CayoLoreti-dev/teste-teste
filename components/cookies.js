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

function initCookies() {
  if (document.getElementById('cookieBanner')) return;

  const bannerWrapper = document.createElement('div');
  bannerWrapper.innerHTML = getCookieBannerHTML();
  document.body.appendChild(bannerWrapper.firstElementChild);

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieNecessary = document.getElementById('cookieNecessary');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieRejectAll = document.getElementById('cookieRejectAll');

  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }

  if (cookieNecessary) {
    cookieNecessary.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'necessary');
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      localStorage.setItem('theme', currentTheme);
      localStorage.setItem('userHasChosenTheme', 'true');
      if (cookieBanner) cookieBanner.classList.remove('show');
      if (typeof auth !== 'undefined') {
        auth.persistMemoryUser();
      }
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'necessary' } }));
      console.log('Cookies: Apenas necessários aceitos');
    });
  }

  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'all');
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      localStorage.setItem('theme', currentTheme);
      localStorage.setItem('userHasChosenTheme', 'true');
      if (cookieBanner) cookieBanner.classList.remove('show');
      if (typeof auth !== 'undefined') {
        auth.persistMemoryUser();
      }
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'all' } }));
      console.log('Cookies: Todos aceitos');
    });
  }

  if (cookieRejectAll) {
    cookieRejectAll.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'none');
      localStorage.removeItem('theme');
      localStorage.removeItem('userHasChosenTheme');
      if (typeof auth !== 'undefined') {
        auth.clearStoredUser();
        auth.updateAccountLabels();
      }
      if (cookieBanner) cookieBanner.classList.remove('show');
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'none' } }));
      console.log('Cookies: Todos recusados');
    });
  }
}