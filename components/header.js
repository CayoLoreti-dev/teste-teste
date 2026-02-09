/**
 * HEADER COMPARTILHADO
 * 
 * Este arquivo contém o HTML e a lógica do header que aparece em todas as páginas.
 * Edite aqui uma vez e todas as páginas serão atualizadas automaticamente.
 */

// Função que retorna o HTML do header
function getHeaderHTML(pageTitle = 'Bem-Vinda(o)') {
  return `
    <header class="topo">
      <div class="pix">
        <p>Pagamento em pix 10% de desconto</p>
      </div>
      <hr>
      
      <div class="navbar">
        <button class="theme-toggle-left" type="button" aria-pressed="false">
          <span class="theme-icon" aria-hidden="true">🌙</span>
          <p class="theme-label">Modo escuro</p>
        </button>

        <div class="logo"></div>

        <div class="titulo">
          <p class="cursor typewriter-animation">${pageTitle}</p>
        </div>

        <div class="actions">
          <div class="action-item">
            <span><img src="./assets/icons/vector.webp" alt="Atendimento"></span>
            <p>Atendimento</p>
          </div>
          <div class="action-item" id="btnMinhaConta">
            <span><img src="./assets/icons/vector-1.webp" alt="Minha Conta"></span>
            <p id="labelMinhaConta">Minha Conta</p>
          </div>
          <div class="action-item">
            <span><img src="./assets/icons/vector-2.webp" alt="Meu Carrinho"></span>
            <p>Meu Carrinho</p>
          </div>
        </div>

        <!-- Menu Hamburguês para Mobile -->
        <button class="menu-hamburger" id="menuHamburger" aria-label="Abrir menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <hr>
    </header>

    <!-- Drawer/Sidebar para Mobile -->
    <div class="drawer" id="drawer">
      <div class="drawer-content">
        <button class="drawer-close" id="drawerClose">✕</button>
        <div class="drawer-actions">
          <div class="drawer-action-item">
            <span><img src="./assets/icons/vector.webp" alt="Atendimento"></span>
            <p>Atendimento</p>
          </div>
          <div class="drawer-action-item" id="btnMinhaContaDrawer">
            <span><img src="./assets/icons/vector-1.webp" alt="Minha Conta"></span>
            <p id="labelMinhaContaDrawer">Minha Conta</p>
          </div>
          <div class="drawer-action-item">
            <span><img src="./assets/icons/vector-2.webp" alt="Meu Carrinho"></span>
            <p>Meu Carrinho</p>
          </div>
          <button class="drawer-action-item theme-toggle" type="button" aria-pressed="false">
            <span class="theme-icon" aria-hidden="true">🌙</span>
            <p class="theme-label">Modo escuro</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para fechar drawer ao clicar -->
    <div class="drawer-overlay" id="drawerOverlay"></div>

    <nav>
      <div class="navegacao">
        <ul>
          <a href="./index.html"><span class="active">Inicio</span></a>
          <span class="nav-link">Catálogo</span>
          <span class="nav-link">Contato</span>
        </ul>
      </div>
      <hr>
    </nav>
  `;
}

// Função que retorna o HTML do header para páginas de catálogo (caminhos diferentes)
function getHeaderHTMLForCatalog(pageTitle = 'Catálogo') {
  return `
    <header class="topo">
      <div class="pix">
        <p>Pagamento em pix 10% de desconto</p>
      </div>
      <hr>
      
      <div class="navbar">
        <button class="theme-toggle-left" type="button" aria-pressed="false">
          <span class="theme-icon" aria-hidden="true">🌙</span>
          <p class="theme-label">Modo escuro</p>
        </button>

        <div class="logo"></div>

        <div class="titulo">
          <p class="cursor typewriter-animation">${pageTitle}</p>
        </div>

        <div class="actions">
          <div class="action-item">
            <span><img src="../../assets/icons/vector.webp" alt="Atendimento"></span>
            <p>Atendimento</p>
          </div>
          <div class="action-item" id="btnMinhaConta">
            <span><img src="../../assets/icons/vector-1.webp" alt="Minha Conta"></span>
            <p id="labelMinhaConta">Minha Conta</p>
          </div>
          <div class="action-item">
            <span><img src="../../assets/icons/vector-2.webp" alt="Meu Carrinho"></span>
            <p>Meu Carrinho</p>
          </div>
        </div>

        <!-- Menu Hamburguês para Mobile -->
        <button class="menu-hamburger" id="menuHamburger" aria-label="Abrir menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <hr>
    </header>

    <!-- Drawer/Sidebar para Mobile -->
    <div class="drawer" id="drawer">
      <div class="drawer-content">
        <button class="drawer-close" id="drawerClose">✕</button>
        <div class="drawer-actions">
          <div class="drawer-action-item">
            <span><img src="../../assets/icons/vector.webp" alt="Atendimento"></span>
            <p>Atendimento</p>
          </div>
          <div class="drawer-action-item" id="btnMinhaContaDrawer">
            <span><img src="../../assets/icons/vector-1.webp" alt="Minha Conta"></span>
            <p id="labelMinhaContaDrawer">Minha Conta</p>
          </div>
          <div class="drawer-action-item">
            <span><img src="../../assets/icons/vector-2.webp" alt="Meu Carrinho"></span>
            <p>Meu Carrinho</p>
          </div>
          <button class="drawer-action-item theme-toggle" type="button" aria-pressed="false">
            <span class="theme-icon" aria-hidden="true">🌙</span>
            <p class="theme-label">Modo escuro</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para fechar drawer ao clicar -->
    <div class="drawer-overlay" id="drawerOverlay"></div>

    <nav>
      <div class="navegacao">
        <ul>
          <a href="../../index.html"><span>Inicio</span></a>
          <span class="nav-link">Catálogo</span>
          <span class="nav-link">Contato</span>
        </ul>
      </div>
      <hr>
    </nav>
  `;
}

// Inicializa o header quando a página carrega
function initHeader(pageTitle, isCatalogPage = false) {
  // Injeta o HTML do header no elemento com id="header-placeholder"
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.innerHTML = isCatalogPage 
      ? getHeaderHTMLForCatalog(pageTitle)
      : getHeaderHTML(pageTitle);
    document.dispatchEvent(new CustomEvent('header-rendered'));
  }
}
