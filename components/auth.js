/**
 * SISTEMA DE AUTENTICAÇÃO GLOBAL
 * 
 * Gerencia login/logout em todas as páginas do site.
 * As informações de login são salvas no localStorage e acessíveis em qualquer página.
 */

// Classe que gerencia autenticação
class AuthManager {
  constructor() {
    this.storageKey = 'userData';
    this.memoryUser = null;
  }

  getConsent() {
    return getCookie('cookieConsent') || localStorage.getItem('cookieConsent');
  }

  canStorePersonalData() {
    const consent = this.getConsent();
    return consent === 'necessary' || consent === 'all';
  }

  // Verifica se o usuário está logado
  isLoggedIn() {
    if (this.memoryUser) return true;
    if (!this.canStorePersonalData()) return false;
    return getCookie(this.storageKey) !== null;
  }

  // Retorna dados do usuário logado
  getUser() {
    if (this.memoryUser) return this.memoryUser;
    if (!this.canStorePersonalData()) return null;
    return getCookieJSON(this.storageKey);
  }

  // Faz login do usuário
  login(email, senha) {
    // Extrair nome do email ou usar como nome de usuário
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const userData = {
      email: email,
      name: name,
      loggedAt: new Date().toISOString()
    };

    if (this.canStorePersonalData()) {
      setCookieJSON(this.storageKey, userData, 30);
    } else {
      this.memoryUser = userData;
    }
    return userData;
  }

  // Faz logout do usuário
  logout() {
    this.memoryUser = null;
    if (this.canStorePersonalData()) {
      removeCookie(this.storageKey);
    }
  }

  clearStoredUser() {
    this.memoryUser = null;
    removeCookie(this.storageKey);
    localStorage.removeItem(this.storageKey);
  }

  persistMemoryUser() {
    if (this.memoryUser && this.canStorePersonalData()) {
      setCookieJSON(this.storageKey, this.memoryUser, 30);
    }
  }

  // Atualiza os labels de "Minha Conta" com o nome do usuário
  updateAccountLabels() {
    const user = this.getUser();
    const labelMinhaConta = document.getElementById('labelMinhaConta');
    const labelMinhaContaDrawer = document.getElementById('labelMinhaContaDrawer');

    if (user) {
      if (labelMinhaConta) labelMinhaConta.textContent = user.name;
      if (labelMinhaContaDrawer) labelMinhaContaDrawer.textContent = user.name;
    } else {
      if (labelMinhaConta) labelMinhaConta.textContent = 'Minha Conta';
      if (labelMinhaContaDrawer) labelMinhaContaDrawer.textContent = 'Minha Conta';
    }
  }
}

// Instância global do gerenciador de autenticação
const auth = new AuthManager();

// Inicializa o sistema de autenticação quando a página carrega
function initAuth() {
  const consent = auth.getConsent();
  const legacyUserData = localStorage.getItem('userData');
  if ((consent === 'necessary' || consent === 'all') && legacyUserData && !getCookie('userData')) {
    try {
      setCookieJSON('userData', JSON.parse(legacyUserData), 30);
    } catch {
      // Ignora erros de parse
    }
    localStorage.removeItem('userData');
  }

  if (auth.getConsent() === 'none') {
    auth.clearStoredUser();
  }

  // Atualiza os labels ao carregar
  auth.updateAccountLabels();

  // Configura os botões de login
  const btnMinhaConta = document.getElementById('btnMinhaConta');
  const btnMinhaContaDrawer = document.getElementById('btnMinhaContaDrawer');

  if (btnMinhaConta) {
    btnMinhaConta.addEventListener('click', () => openLoginModal());
  }

  if (btnMinhaContaDrawer) {
    btnMinhaContaDrawer.addEventListener('click', () => {
      openLoginModal();
      closeDrawer();
    });
  }
}

// Função auxiliar para fechar o drawer
function closeDrawer() {
  const drawer = document.getElementById('drawer');
  const menuHamburger = document.getElementById('menuHamburger');
  if (drawer) drawer.classList.remove('open');
  if (menuHamburger) menuHamburger.classList.remove('active');
}
