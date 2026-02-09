/**
 * APP.JS - FUNCIONALIDADES COMUNS
 * 
 * Script principal que inicializa funcionalidades compartilhadas entre todas as páginas.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o sistema de autenticação
  initAuth();

  const getCookieConsent = () => getCookie('cookieConsent') || localStorage.getItem('cookieConsent');
  const getThemeStorage = () => {
    const consent = getCookieConsent();
    if (consent === 'necessary' || consent === 'all') return 'cookie';
    if (consent === null) return 'session';
    return 'none';
  };
  const setThemeValue = (key, value) => {
    const storage = getThemeStorage();
    if (storage === 'cookie') setCookie(key, value, 30);
    if (storage === 'session') sessionStorage.setItem(key, value);
  };
  const getThemeValue = (key) => {
    const storage = getThemeStorage();
    if (storage === 'cookie') return getCookie(key);
    if (storage === 'session') return sessionStorage.getItem(key);
    return null;
  };
  const clearThemeStorage = () => {
    removeCookie('theme');
    removeCookie('userHasChosenTheme');
    sessionStorage.removeItem('theme');
    sessionStorage.removeItem('userHasChosenTheme');
    localStorage.removeItem('theme');
    localStorage.removeItem('userHasChosenTheme');
  };

  const legacyTheme = localStorage.getItem('theme');
  const legacyChosen = localStorage.getItem('userHasChosenTheme');
  if (legacyTheme && !getCookie('theme')) {
    setCookie('theme', legacyTheme, 30);
  }
  if (legacyChosen && !getCookie('userHasChosenTheme')) {
    setCookie('userHasChosenTheme', legacyChosen, 30);
  }
  if (localStorage.getItem('cookieConsent') && !getCookie('cookieConsent')) {
    setCookie('cookieConsent', localStorage.getItem('cookieConsent'), 30);
  }

  if (getCookieConsent() === 'none') {
    clearThemeStorage();
  }

  // ===== MODO ESCURO =====
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-left');
  
  // Função para obter o tema inicial (sistema ou localStorage)
  const getInitialTheme = () => {
    // Se o usuário nunca escolheu manualmente, usar a preferência do sistema
    const storedTheme = getThemeValue('theme');
    const userHasChosenTheme = getThemeValue('userHasChosenTheme');
    
    if (!userHasChosenTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return storedTheme || 'light';
  };
  
  // Define o tema inicial
  document.body.setAttribute('data-theme', getInitialTheme());

  // Atualiza os botões de toggle
  const updateThemeToggles = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-pressed', String(isDark));
      const label = btn.querySelector('.theme-label');
      const icon = btn.querySelector('.theme-icon');
      if (label) label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    });
  };

  document.addEventListener('cookie-consent-changed', (event) => {
    const consent = event?.detail?.consent;
    if (consent === 'none') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      clearThemeStorage();
      updateThemeToggles();
      return;
    }

    if (consent === 'necessary' || consent === 'all') {
      const sessionTheme = sessionStorage.getItem('theme');
      const sessionChosen = sessionStorage.getItem('userHasChosenTheme');
      if (sessionTheme) {
        setCookie('theme', sessionTheme, 30);
      }
      if (sessionChosen) {
        setCookie('userHasChosenTheme', sessionChosen, 30);
      }
      sessionStorage.removeItem('theme');
      sessionStorage.removeItem('userHasChosenTheme');

      const storedTheme = getCookie('theme');
      if (storedTheme) {
        document.body.setAttribute('data-theme', storedTheme);
      }
      updateThemeToggles();
    }
  });

  // Event listener para os botões de tema
  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      setThemeValue('theme', nextTheme);
      setThemeValue('userHasChosenTheme', 'true');
      updateThemeToggles();
    });
  });

  // Observa mudanças na preferência de tema do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Só atualiza automaticamente se o usuário não tiver escolhido manualmente
    const userHasChosenTheme = getThemeValue('userHasChosenTheme');
    if (!userHasChosenTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      updateThemeToggles();
    }
  });

  updateThemeToggles();

  // ===== MENU HAMBURGUÊS =====
  const setupMenu = () => {
    const menuHamburger = document.getElementById('menuHamburger');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.querySelector('.drawer-overlay');

    if (!menuHamburger || !drawer) return;
    if (menuHamburger.dataset.bound === 'true') return;

    const openDrawer = () => {
      menuHamburger.classList.add('active');
      menuHamburger.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      drawerOverlay?.classList.add('open');
      document.body.classList.add('no-scroll');

      const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(drawer.querySelectorAll(focusableSelectors));
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleKeydown = (event) => {
        if (event.key === 'Escape') {
          closeDrawer();
          return;
        }

        if (event.key !== 'Tab' || focusableElements.length === 0) return;

        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
          return;
        }

        if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      };

      if (!drawer.dataset.trapAttached) {
        drawer.dataset.trapAttached = 'true';
        drawer.dataset.trapHandlerId = 'drawerTrap';
      }

      drawer._trapHandler = handleKeydown;
      document.addEventListener('keydown', handleKeydown);
      firstFocusable?.focus();
    };

    const closeDrawer = () => {
      menuHamburger.classList.remove('active');
      menuHamburger.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      drawerOverlay?.classList.remove('open');
      document.body.classList.remove('no-scroll');

      if (drawer._trapHandler) {
        document.removeEventListener('keydown', drawer._trapHandler);
        drawer._trapHandler = null;
      }
    };

    menuHamburger.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
        return;
      }
      openDrawer();
    });

    if (drawerClose && drawerClose.dataset.bound !== 'true') {
      drawerClose.addEventListener('click', closeDrawer);
      drawerClose.dataset.bound = 'true';
    }

    if (drawerOverlay && drawerOverlay.dataset.bound !== 'true') {
      drawerOverlay.addEventListener('click', closeDrawer);
      drawerOverlay.dataset.bound = 'true';
    }

    menuHamburger.dataset.bound = 'true';

    const drawerActionItems = document.querySelectorAll('.drawer-action-item');
    drawerActionItems.forEach(item => {
      if (item.dataset.bound === 'true') return;
      item.addEventListener('click', () => {
        if (item.classList.contains('theme-toggle') || item.id === 'btnMinhaContaDrawer') return;
        closeDrawer();
        if (typeof showNotification === 'function') {
          showNotification('Funcionalidade em desenvolvimento!');
        }
      });
      item.dataset.bound = 'true';
    });
  };

  setupMenu();
  document.addEventListener('header-rendered', setupMenu);

  // ===== NAVEGAÇÃO =====
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('Esta seção em breve!');
    });
  });

  // ===== AÇÕES DO TOPO =====
  document.querySelectorAll('.action-item').forEach(item => {
    const isLogin = item.id === 'btnMinhaConta';
    const isThemeToggle = item.classList.contains('theme-toggle') || item.classList.contains('theme-toggle-left');
    
    if (!isLogin && !isThemeToggle) {
      item.addEventListener('click', () => {
        showNotification('Funcionalidade em desenvolvimento!');
      });
    }
  });

  console.log('✅ App inicializado com sucesso!');
});
