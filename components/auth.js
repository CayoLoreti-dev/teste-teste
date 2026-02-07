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
  }

  // Verifica se o usuário está logado
  isLoggedIn() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  // Retorna dados do usuário logado
  getUser() {
    const userData = localStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
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

    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    return userData;
  }

  // Faz logout do usuário
  logout() {
    localStorage.removeItem(this.storageKey);
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
