/**
 * MODAIS COMPARTILHADOS
 * 
 * HTML e lógica dos modais que aparecem em todas as páginas.
 */

// Função que retorna o HTML dos modais
function getModalsHTML() {
  return `
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

        <button class="btn-settings" id="btnOpenSettings">Configurações</button>
      </div>
    </div>

    <!-- Modal de Configurações -->
    <div class="modal-settings" id="modalSettings">
      <div class="modal-settings-content">
        <button class="modal-settings-close" id="btnCloseSettings" aria-label="Fechar">&times;</button>
        <h2 class="modal-settings-title">Configurações</h2>
        <p class="modal-settings-subtitle">Preferências salvas em cookies para futuras visitas.</p>

        <div class="settings-section">
          <h3>Preferências de cookies</h3>
          <p>Escolha como deseja salvar suas preferências no site:</p>
          <div class="settings-options" role="radiogroup" aria-label="Preferências de cookies">
            <label class="settings-option">
              <input type="radio" name="cookieConsent" value="necessary">
              <span>Apenas necessários</span>
            </label>
            <label class="settings-option">
              <input type="radio" name="cookieConsent" value="all">
              <span>Aceitar tudo</span>
            </label>
            <label class="settings-option">
              <input type="radio" name="cookieConsent" value="none">
              <span>Recusar tudo</span>
            </label>
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn-save-settings" id="btnSaveSettings">Salvar Preferências</button>
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
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnEntrar = document.getElementById('btnEntrar');
  const btnSair = document.getElementById('btnSair');
  const loginEmail = document.getElementById('loginEmail');
  const loginSenha = document.getElementById('loginSenha');

  const modalSettings = document.getElementById('modalSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

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

  if (btnOpenSettings) {
    btnOpenSettings.addEventListener('click', () => {
      openSettingsModal();
    });
  }

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', closeSettingsModal);
  }

  if (modalSettings) {
    modalSettings.addEventListener('click', (e) => {
      if (e.target === modalSettings) {
        closeSettingsModal();
      }
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const selected = document.querySelector('input[name="cookieConsent"]:checked');
      if (selected && typeof applyCookieConsent === 'function') {
        applyCookieConsent(selected.value);
      }
      closeSettingsModal();
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
      if (modalSettings && modalSettings.classList.contains('show')) {
        closeSettingsModal();
      }
    }
  });
}

function openSettingsModal() {
  const modalSettings = document.getElementById('modalSettings');
  if (!modalSettings) return;

  const consent = getCookie('cookieConsent') || localStorage.getItem('cookieConsent') || 'necessary';
  const options = modalSettings.querySelectorAll('input[name="cookieConsent"]');
  options.forEach(option => {
    option.checked = option.value === consent;
  });

  modalSettings.classList.add('show');
}

function closeSettingsModal() {
  const modalSettings = document.getElementById('modalSettings');
  if (modalSettings) modalSettings.classList.remove('show');
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
