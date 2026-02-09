/**
 * MODAIS COMPARTILHADOS
 * 
 * HTML e lógica dos modais que aparecem em todas as páginas.
 */

// Função que retorna o HTML dos modais
function getModalsHTML() {
  return `
    <!-- Barra de Cookies -->
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

    <!-- Modal para notificações -->
    <div class="modal-notificacao" id="modalNotificacao">
      <div class="modal-content-notif">
        <span class="modal-close-notif">&times;</span>
        <p id="mensagemNotificacao">Em breve!</p>
      </div>
    </div>

    <!-- Modal de Login/Cadastro -->
    <div class="modal-login" id="modalLogin">
      <div class="modal-login-content">
        <span class="modal-login-close">&times;</span>
        <h2 class="modal-login-titulo">Minha Conta</h2>
        
        <div class="login-form" id="loginForm">
          <div class="form-group">
            <label for="loginEmail">E-mail ou Usuário</label>
            <input type="text" id="loginEmail" placeholder="Digite seu e-mail ou usuário" required>
          </div>
          
          <div class="form-group">
            <label for="loginSenha">Senha</label>
            <input type="password" id="loginSenha" placeholder="Digite sua senha" required>
          </div>
          
          <button class="btn-login" id="btnEntrar">Entrar</button>
          
          <div class="login-footer">
            <p>Bem-vindo! Crie sua conta para aproveitar nossos serviços.</p>
          </div>
        </div>
        
        <div class="login-logado" id="loginLogado" style="display: none;">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <p class="user-welcome">Bem-vindo(a),</p>
            <p class="user-name" id="userName"></p>
          </div>
          <button class="btn-logout" id="btnSair">Sair</button>
        </div>
      </div>
    </div>
  `;
}

// Inicializa os modais
function initModals() {
  // Injeta o HTML dos modais no elemento com id="modals-placeholder"
  const placeholder = document.getElementById('modals-placeholder');
  if (placeholder) {
    placeholder.innerHTML = getModalsHTML();
  }

  // Configura os event listeners dos modais
  setupModalListeners();
}

// Configura os event listeners dos modais
function setupModalListeners() {
  // ===== COOKIES =====
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieNecessary = document.getElementById('cookieNecessary');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieRejectAll = document.getElementById('cookieRejectAll');

  // Verifica se o usuário já fez uma escolha sobre cookies
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent && cookieBanner) {
    // Mostra o banner após 1 segundo
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }

  // Aceitar apenas necessários
  if (cookieNecessary) {
    cookieNecessary.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'necessary');
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      localStorage.setItem('theme', currentTheme);
      localStorage.setItem('userHasChosenTheme', 'true');
      if (cookieBanner) cookieBanner.classList.remove('show');
      auth.persistMemoryUser();
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'necessary' } }));
      console.log('Cookies: Apenas necessários aceitos');
    });
  }

  // Aceitar tudo
  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'all');
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      localStorage.setItem('theme', currentTheme);
      localStorage.setItem('userHasChosenTheme', 'true');
      if (cookieBanner) cookieBanner.classList.remove('show');
      auth.persistMemoryUser();
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'all' } }));
      console.log('Cookies: Todos aceitos');
    });
  }

  // Recusar tudo
  if (cookieRejectAll) {
    cookieRejectAll.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'none');
      localStorage.removeItem('theme');
      localStorage.removeItem('userHasChosenTheme');
      auth.clearStoredUser();
      auth.updateAccountLabels();
      if (cookieBanner) cookieBanner.classList.remove('show');
      document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { consent: 'none' } }));
      console.log('Cookies: Todos recusados');
    });
  }

  // Modal de notificação
  const modalNotif = document.getElementById('modalNotificacao');
  const closeNotif = document.querySelector('.modal-close-notif');

  if (closeNotif) {
    closeNotif.addEventListener('click', () => {
      modalNotif.classList.remove('show');
    });
  }

  if (modalNotif) {
    modalNotif.addEventListener('click', (e) => {
      if (e.target === modalNotif) {
        modalNotif.classList.remove('show');
      }
    });
  }

  // Modal de login
  const modalLogin = document.getElementById('modalLogin');
  const closeLogin = document.querySelector('.modal-login-close');
  const btnEntrar = document.getElementById('btnEntrar');
  const btnSair = document.getElementById('btnSair');
  const loginEmail = document.getElementById('loginEmail');
  const loginSenha = document.getElementById('loginSenha');

  if (closeLogin) {
    closeLogin.addEventListener('click', closeLoginModal);
  }

  if (modalLogin) {
    modalLogin.addEventListener('click', (e) => {
      if (e.target === modalLogin) {
        closeLoginModal();
      }
    });
  }

  if (btnEntrar) {
    btnEntrar.addEventListener('click', handleLogin);
  }

  if (btnSair) {
    btnSair.addEventListener('click', handleLogout);
  }

  if (loginSenha) {
    loginSenha.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin(e);
      }
    });
  }

  // Fechar modais com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalNotif && modalNotif.classList.contains('show')) {
        modalNotif.classList.remove('show');
      }
      if (modalLogin && modalLogin.classList.contains('show')) {
        closeLoginModal();
      }
    }
  });
}

// Abre o modal de login
function openLoginModal() {
  const modalLogin = document.getElementById('modalLogin');
  const loginForm = document.getElementById('loginForm');
  const loginLogado = document.getElementById('loginLogado');
  const userName = document.getElementById('userName');

  if (!modalLogin) return;

  modalLogin.classList.add('show');

  if (auth.isLoggedIn()) {
    const user = auth.getUser();
    loginForm.style.display = 'none';
    loginLogado.style.display = 'flex';
    if (userName) userName.textContent = user.name;
  } else {
    loginForm.style.display = 'flex';
    loginLogado.style.display = 'none';
  }
}

// Fecha o modal de login
function closeLoginModal() {
  const modalLogin = document.getElementById('modalLogin');
  const loginEmail = document.getElementById('loginEmail');
  const loginSenha = document.getElementById('loginSenha');

  if (modalLogin) modalLogin.classList.remove('show');
  if (loginEmail) loginEmail.value = '';
  if (loginSenha) loginSenha.value = '';
}

// Manipula o login
function handleLogin(e) {
  e.preventDefault();

  const loginEmail = document.getElementById('loginEmail');
  const loginSenha = document.getElementById('loginSenha');
  const loginForm = document.getElementById('loginForm');
  const loginLogado = document.getElementById('loginLogado');
  const userName = document.getElementById('userName');

  const email = loginEmail.value.trim();
  const senha = loginSenha.value.trim();

  if (!email || !senha) {
    showNotification('Por favor, preencha todos os campos!');
    return;
  }

  // Faz login usando o AuthManager
  const user = auth.login(email, senha);

  // Atualiza os labels
  auth.updateAccountLabels();

  // Mostra tela de logado
  if (userName) userName.textContent = user.name;
  loginForm.style.display = 'none';
  loginLogado.style.display = 'flex';
}

// Manipula o logout
function handleLogout() {
  auth.logout();
  auth.updateAccountLabels();
  closeLoginModal();
}

// Mostra notificação
function showNotification(message) {
  const modal = document.getElementById('modalNotificacao');
  const messageEl = document.getElementById('mensagemNotificacao');

  if (modal && messageEl) {
    messageEl.textContent = message;
    modal.classList.add('show');
  }
}
