/**
 * APP.JS - FUNCIONALIDADES COMUNS
 * 
 * Script principal que inicializa funcionalidades compartilhadas entre todas as páginas.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o sistema de autenticação
  initAuth();

  // ===== MODO ESCURO =====
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-left');
  
  // Função para obter o tema inicial (sistema ou localStorage)
  const getInitialTheme = () => {
    // Se o usuário nunca escolheu manualmente, usar a preferência do sistema
    const storedTheme = localStorage.getItem('theme');
    const userHasChosenTheme = localStorage.getItem('userHasChosenTheme');
    
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

  // Event listener para os botões de tema
  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      localStorage.setItem('userHasChosenTheme', 'true');
      updateThemeToggles();
    });
  });

  // Observa mudanças na preferência de tema do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Só atualiza automaticamente se o usuário não tiver escolhido manualmente
    const userHasChosenTheme = localStorage.getItem('userHasChosenTheme');
    if (!userHasChosenTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      updateThemeToggles();
    }
  });

  updateThemeToggles();

  // ===== MENU HAMBURGUÊS =====
  const menuHamburger = document.getElementById('menuHamburger');
  const drawer = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerActionItems = document.querySelectorAll('.drawer-action-item');

  if (menuHamburger) {
    menuHamburger.addEventListener('click', () => {
      menuHamburger.classList.toggle('active');
      drawer.classList.toggle('open');
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');
    });
  }

  drawerActionItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('theme-toggle') || item.id === 'btnMinhaContaDrawer') return;
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');
      showNotification('Funcionalidade em desenvolvimento!');
    });
  });

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
