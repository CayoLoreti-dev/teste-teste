// noiva.js
// Define delays dinâmicos para as imagens dentro de .vestidos e inicia a animação

document.addEventListener('DOMContentLoaded', () => {
  // ===== 0. MODAL DE NOTIFICAÇÃO =====
  const notifyModal = document.getElementById('modalNotificacao');
  const notifyCloseBtn = document.querySelector('.modal-close-notif');
  const notifyMessage = document.getElementById('mensagemNotificacao');
  const navLinks = document.querySelectorAll('.nav-link');
  const navItems = document.querySelectorAll('.navegacao ul span');
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-left');

  const closeNotifyModal = () => {
    notifyModal?.classList.remove('show');
  };

  const showNotifyModal = (message) => {
    if (!notifyModal || !notifyMessage) return;
    notifyMessage.textContent = message;
    notifyModal.classList.add('show');
  };

  notifyCloseBtn?.addEventListener('click', closeNotifyModal);

  notifyModal?.addEventListener('click', (e) => {
    if (e.target === notifyModal) {
      closeNotifyModal();
    }
  });

  // Fechar modal de notificação com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNotifyModal();
    }
  });

  // ===== 0.1. MODO ESCURO =====
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.body.setAttribute('data-theme', initialTheme);

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

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      updateThemeToggles();
    });
  });

  updateThemeToggles();

  // ===== 0.2. MODAL DE LOGIN/CADASTRO =====
  const modalLogin = document.getElementById('modalLogin');
  const btnMinhaConta = document.getElementById('btnMinhaConta');
  const btnMinhaContaDrawer = document.getElementById('btnMinhaContaDrawer');
  const labelMinhaConta = document.getElementById('labelMinhaConta');
  const labelMinhaContaDrawer = document.getElementById('labelMinhaContaDrawer');
  const modalLoginClose = document.querySelector('.modal-login-close');
  const loginForm = document.getElementById('loginForm');
  const loginLogado = document.getElementById('loginLogado');
  const btnEntrar = document.getElementById('btnEntrar');
  const btnSair = document.getElementById('btnSair');
  const loginEmail = document.getElementById('loginEmail');
  const loginSenha = document.getElementById('loginSenha');
  const userName = document.getElementById('userName');

  // Verificar se já está logado
  const checkLogin = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      labelMinhaConta.textContent = user.name;
      if (labelMinhaContaDrawer) labelMinhaContaDrawer.textContent = user.name;
      return true;
    }
    return false;
  };

  // Abrir modal de login
  const openLoginModal = () => {
    modalLogin.classList.add('show');
    const isLoggedIn = checkLogin();
    
    // Fechar drawer se estiver aberto
    const drawer = document.getElementById('drawer');
    const menuHamburger = document.getElementById('menuHamburger');
    if (drawer && drawer.classList.contains('open')) {
      menuHamburger?.classList.remove('active');
      drawer.classList.remove('open');
    }
    
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('userData'));
      loginForm.style.display = 'none';
      loginLogado.style.display = 'flex';
      userName.textContent = user.name;
    } else {
      loginForm.style.display = 'flex';
      loginLogado.style.display = 'none';
    }
  };

  // Fechar modal de login
  const closeLoginModal = () => {
    modalLogin.classList.remove('show');
    loginEmail.value = '';
    loginSenha.value = '';
  };

  // Fazer login
  const handleLogin = (e) => {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const senha = loginSenha.value.trim();
    
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    // Extrair nome do email ou usar como nome de usuário
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Salvar dados do usuário
    const userData = {
      email: email,
      name: name
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Atualizar interface
    labelMinhaConta.textContent = name;
    if (labelMinhaContaDrawer) labelMinhaContaDrawer.textContent = name;
    userName.textContent = name;
    
    // Mostrar tela de logado
    loginForm.style.display = 'none';
    loginLogado.style.display = 'flex';
  };

  // Fazer logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    labelMinhaConta.textContent = 'Minha Conta';
    if (labelMinhaContaDrawer) labelMinhaContaDrawer.textContent = 'Minha Conta';
    closeLoginModal();
  };

  // Event listeners
  btnMinhaConta?.addEventListener('click', openLoginModal);
  btnMinhaContaDrawer?.addEventListener('click', openLoginModal);
  modalLoginClose?.addEventListener('click', closeLoginModal);
  btnEntrar?.addEventListener('click', handleLogin);
  btnSair?.addEventListener('click', handleLogout);

  // Fechar modal clicando fora
  modalLogin?.addEventListener('click', (e) => {
    if (e.target === modalLogin) {
      closeLoginModal();
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalLogin.classList.contains('show')) {
      closeLoginModal();
    }
  });

  // Enter para fazer login
  loginSenha?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  });

  // Verificar login ao carregar
  checkLogin();

  // Abrir modal nos links de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showNotifyModal('Esta seção em breve!');
    });
  });

  // Estado ativo do nav
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Ações do topo (Atendimento, Conta, Carrinho)
  document.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('theme-toggle') || item.classList.contains('theme-toggle-left') || item.id === 'btnMinhaConta') return;
      showNotifyModal('Funcionalidade em desenvolvimento!');
    });
  });

  // ===== PARTE 1: ANIMAÇÃO DAS IMAGENS PRINCIPAIS =====
  const vestidosContainer = document.querySelector('.vestidos');
  if (vestidosContainer) {
    const imgs = Array.from(vestidosContainer.querySelectorAll('img'));
    const step = 0.14;

    imgs.forEach((img, i) => {
      const delay = (i * step).toFixed(2) + 's';
      img.style.setProperty('--delay', delay);
    });

    requestAnimationFrame(() => {
      vestidosContainer.classList.add('play');
    });
  }

  // ===== PARTE 2: MODAL DE IMAGENS =====
  const modal = document.getElementById('imagemModal');
  const modalImg = document.getElementById('imagemModal-img');
  const closeBtn = document.querySelector('.modal-close');

  // ===== PARTE 2.5: MODAL DE HISTÓRIA DO VESTIDO =====
  const modalHistoria = document.getElementById('modalHistoria');
  const modalHistoriaOverlay = document.querySelector('.modal-historia-overlay');
  const modalHistoriaClose = document.querySelector('.modal-historia-close');
  const historiaVestidoImg = document.getElementById('historiaVestidoImg');
  const historiaVestidoTitulo = document.getElementById('historiaVestidoTitulo');
  const historiaVestidoDescricao = document.getElementById('historiaVestidoDescricao');

  // Dados dos vestidos com suas histórias
  const vestidosHistorias = {
    1: {
      titulo: 'Aurora Clássica',
      descricao: `
        <p>O <strong>Aurora Clássica</strong> nasceu da inspiração em manhãs de primavera, quando a luz dourada do sol 
        toca delicadamente os jardins floridos. Criado pela renomada estilista Maria Valentina, este vestido representa 
        a perfeição da elegância atemporal.</p>
        
        <p>Cada detalhe foi meticulosamente pensado: o corpete em renda francesa importada é adornado com bordados 
        em pérolas e cristais Swarovski, aplicados à mão por artesãs experientes durante mais de 80 horas de trabalho. 
        A saia ampla em tule de seda cria um movimento suave e etéreo a cada passo.</p>
        
        <p><strong>Ideal para:</strong> Cerimônias em igrejas tradicionais, capelas históricas, fazendas clássicas 
        e jardins românticos ao ar livre. Este vestido brilha especialmente em casamentos diurnos e ao entardecer, 
        onde a luz natural realça seus detalhes delicados.</p>
        
        <p><strong>Recomendado para:</strong> Noivas que buscam sofisticação e tradição, apreciam a beleza dos 
        detalhes artesanais e desejam uma silhueta princesa atemporal que ficará linda em fotos para sempre.</p>
      `
    },
    2: {
      titulo: 'Serenidade Moderna',
      descricao: `
        <p>O <strong>Serenidade Moderna</strong> foi desenhado para a noiva contemporânea que valoriza minimalismo 
        e elegância. Criado pelo atelier Martha Medeiros, este modelo une linhas limpas com tecidos nobres em uma 
        harmonia perfeita entre simplicidade e luxo.</p>
        
        <p>Sua silhueta reta e alongada é confeccionada em cetim duquesa italiano, com um caimento impecável que 
        valoriza naturalmente a forma do corpo. Os detalhes em renda delicada nas mangas e decote trazem um toque 
        romântico sem excessos, provando que menos pode ser infinitamente mais.</p>
        
        <p><strong>Ideal para:</strong> Casamentos em ambientes urbanos sofisticados como museus, galerias de arte, 
        rooftops com vista panorâmica, casas de eventos modernas e cerimônias intimistas em restaurantes elegantes.</p>
        
        <p><strong>Recomendado para:</strong> Noivas modernas que apreciam design clean, buscam conforto sem abrir 
        mão da elegância, e desejam um visual contemporâneo que destaque sua beleza natural e personalidade marcante.</p>
      `
    },
    3: {
      titulo: 'Encanto Romântico',
      descricao: `
        <p>O <strong>Encanto Romântico</strong> é uma verdadeira obra de arte criada para celebrar o amor em sua 
        forma mais pura e delicada. Desenvolvido pelo atelier Luna Novias, este vestido captura a essência dos 
        contos de fadas e transforma sonhos em realidade.</p>
        
        <p>Seu corpete intricado apresenta bordados florais tridimensionais feitos com linha de seda e aplicações 
        de organza, criando um efeito de jardim encantado. A saia em camadas de tule macio e fluido proporciona 
        leveza e movimento, enquanto os delicados detalhes em renda Chantilly completam o visual romântico.</p>
        
        <p><strong>Ideal para:</strong> Casamentos em jardins floridos, vinícolas românticas, castelos e palacetes 
        históricos, praias ao pôr do sol e cerimônias em meio à natureza. Perfeito para celebrações onde o romantismo 
        e a magia são protagonistas.</p>
        
        <p><strong>Recomendado para:</strong> Noivas românticas e sonhadoras que desejam um visual de princesa, 
        apreciam volumes e texturas delicadas, e querem criar uma atmosfera mágica e inesquecível em seu grande dia.</p>
      `
    },
    4: {
      titulo: 'Majestade Real',
      descricao: `
        <p>O <strong>Majestade Real</strong> é a personificação do luxo e da sofisticação máxima. Este vestido 
        premium foi criado para noivas que desejam fazer uma entrada triunfal e memorável, sendo notado por cada 
        detalhe de sua magnificência.</p>
        
        <p>Confeccionado com os mais nobres tecidos - renda francesa rebordada, tule pontilhado importado e cetim 
        com acabamento acetinado - este modelo apresenta uma riqueza visual incomparável. O corpete estruturado 
        é coberto por aplicações de cristais austríacos e pérolas naturais dispostos em padrões geométricos que 
        capturam e refletem a luz magnificamente.</p>
        
        <p><strong>Ideal para:</strong> Grandes celebrações em salões de festas luxuosos, palácios, mansões históricas, 
        hotéis cinco estrelas e catedrais imponentes. Este vestido foi feito para espaços grandiosos que complementam 
        sua presença majestosa.</p>
        
        <p><strong>Recomendado para:</strong> Noivas que sonham com uma cerimônia grandiosa, não temem ser o centro 
        das atenções, apreciam o máximo em luxo e detalhamento, e desejam criar um momento cinematográfico que será 
        lembrado por gerações.</p>
      `
    }
  };

  // Abrir modal de história ao clicar nas imagens principais
  if (vestidosContainer) {
    vestidosContainer.querySelectorAll('[data-vestido]').forEach(vestidoEl => {
      vestidoEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const vestidoId = vestidoEl.getAttribute('data-vestido');
        const vestidoData = vestidosHistorias[vestidoId];
        const imgSrc = vestidoEl.querySelector('img').src;

        if (vestidoData) {
          historiaVestidoImg.src = imgSrc;
          historiaVestidoTitulo.textContent = vestidoData.titulo;
          historiaVestidoDescricao.innerHTML = vestidoData.descricao;
          
          modalHistoria.classList.add('show');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Fechar modal de história
  const closeModalHistoria = () => {
    modalHistoria.classList.remove('show');
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 600);
  };

  modalHistoriaClose?.addEventListener('click', closeModalHistoria);
  modalHistoriaOverlay?.addEventListener('click', closeModalHistoria);

  // Fechar modal de história com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalHistoria.classList.contains('show')) {
      closeModalHistoria();
    }
  });

  // Abrir modal fullscreen ao clicar nas imagens do carrossel (comportamento original mantido)
  document.querySelectorAll('.carrossel img').forEach(img => {
    img.addEventListener('click', (e) => {
      modal.classList.add('show');
      modalImg.src = e.target.src;
      document.body.style.overflow = 'hidden';
    });
  });

  // Fechar modal
  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  };

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Fechar modal com swipe em mobile (touch)
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (Math.abs(touchEndX - touchStartX) > 100) {
      closeModal();
    }
  });

  // ===== PARTE 3: CARROSSEL DINÂMICO =====
  const carrosselWrapper = document.querySelector('.carrossel-wrapper');
  const carrosselContainer = document.querySelector('.carrossel-container');
  const carrossel = document.querySelector('.carrossel');
  const btnPrev = document.querySelector('.carrossel-btn-prev');
  const btnNext = document.querySelector('.carrossel-btn-next');

  if (!carrossel) return;

  // 3.1: Observador de Intersecção - Anima o carrossel quando entra na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        carrosselContainer.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(carrosselContainer);

  // 3.2: Variáveis de controle
  const isMobile = window.innerWidth <= 768;
  let scrollAmount = isMobile ? 200 : 340;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let autoScrollTimer = null;
  let autoScrollResumeTimer = null;
  const autoScrollDelay = 2600;
  const autoScrollResumeDelay = 1800;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startAutoScroll = () => {
    if (prefersReducedMotion || autoScrollTimer) return;
    autoScrollTimer = setInterval(() => {
      if (isDragging || isTouching) return;
      const maxScrollLeft = carrossel.scrollWidth - carrossel.clientWidth;
      if (carrossel.scrollLeft >= maxScrollLeft - 5) {
        carrossel.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      carrossel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }, autoScrollDelay);
  };

  const stopAutoScroll = () => {
    if (!autoScrollTimer) return;
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  };

  const pauseAutoScroll = () => {
    stopAutoScroll();
    if (autoScrollResumeTimer) clearTimeout(autoScrollResumeTimer);
    autoScrollResumeTimer = setTimeout(startAutoScroll, autoScrollResumeDelay);
  };

  // 3.3: Navegação com Botões
  btnPrev?.addEventListener('click', () => {
    carrossel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    pauseAutoScroll();
  });

  btnNext?.addEventListener('click', () => {
    carrossel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    pauseAutoScroll();
  });

  // 3.4: Navegação com Mouse Wheel (Scroll do Mouse)
  carrossel.addEventListener('wheel', (e) => {
    e.preventDefault();
    carrossel.scrollBy({
      left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
    pauseAutoScroll();
  });

  // 3.5: Drag ao selecionar (compatibilidade com mouse)
  carrossel.addEventListener('mousedown', (e) => {
    // Não permitir drag em clicks do botão
    if (e.target.closest('.carrossel-btn')) return;
    
    isDragging = true;
    startX = e.pageX - carrossel.offsetLeft;
    scrollLeft = carrossel.scrollLeft;
    carrossel.style.scrollBehavior = 'auto';
    carrossel.style.cursor = 'grabbing';
    pauseAutoScroll();
  });

  carrossel.addEventListener('mouseleave', () => {
    isDragging = false;
    carrossel.style.scrollBehavior = 'smooth';
    carrossel.style.cursor = 'grab';
  });

  carrossel.addEventListener('mouseup', () => {
    isDragging = false;
    carrossel.style.scrollBehavior = 'smooth';
    carrossel.style.cursor = 'grab';
    pauseAutoScroll();
  });

  carrossel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carrossel.offsetLeft;
    const walk = (x - startX) * 2;
    carrossel.scrollLeft = scrollLeft - walk;
  });

  // 3.6: Touch support (para dispositivos móveis)
  let isTouching = false;
  let touchStartXCarrossel = 0;
  let touchScrollLeft = 0;

  carrossel.addEventListener('touchstart', (e) => {
    isTouching = true;
    touchStartXCarrossel = e.touches[0].pageX - carrossel.offsetLeft;
    touchScrollLeft = carrossel.scrollLeft;
    carrossel.style.scrollBehavior = 'auto';
    pauseAutoScroll();
  });

  carrossel.addEventListener('touchend', () => {
    isTouching = false;
    carrossel.style.scrollBehavior = 'smooth';
    pauseAutoScroll();
  });

  carrossel.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const x = e.touches[0].pageX - carrossel.offsetLeft;
    const walk = (x - touchStartXCarrossel) * 1.5;
    carrossel.scrollLeft = touchScrollLeft - walk;
  });

  // ===== PARTE 4: EFEITOS ADICIONAIS =====
  
  // 4.1: Cursor inicial
  carrossel.style.cursor = 'grab';
  // 4.1.1: Auto-scroll suave quando não há interação
  carrosselWrapper?.addEventListener('mouseenter', pauseAutoScroll);
  carrosselWrapper?.addEventListener('mouseleave', startAutoScroll);
  carrosselWrapper?.addEventListener('touchstart', pauseAutoScroll, { passive: true });

  startAutoScroll();

  // 4.2: Efeito de parallax suave no scroll da página
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Efeito no background do carrossel
    if (carrosselContainer && scrollPosition > 100) {
      const parallaxAmount = scrollPosition * 0.05;
      carrosselContainer.style.backgroundPosition = `0 ${parallaxAmount}px`;
    }
  });

  // 4.3: Ripple effect nos botões
  document.querySelectorAll('.carrossel-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const radius = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = radius + 'px';
      ripple.style.left = (e.clientX - rect.left - radius / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - radius / 2) + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== PARTE 5: SCROLL SMOOTH GLOBAL =====
  document.documentElement.style.scrollBehavior = 'smooth';

  // ===== PARTE 6: AJUSTAR SCROLL AMOUNT NO RESIZE =====
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      scrollAmount = newIsMobile ? 200 : 340;
    }
  });

  // ===== PARTE 7: SUPORTE A TECLADO =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      btnPrev?.click();
    } else if (e.key === 'ArrowRight') {
      btnNext?.click();
    }
  });

  // ===== PARTE 8: MENU HAMBURGUÊS =====
  const menuHamburger = document.getElementById('menuHamburger');
  const drawer = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerActionItems = document.querySelectorAll('.drawer-action-item');

  // Abrir/fechar drawer ao clicar no menu hamburguês
  if (menuHamburger) {
    menuHamburger.addEventListener('click', () => {
      menuHamburger.classList.toggle('active');
      drawer.classList.toggle('open');
    });
  }

  // Fechar drawer ao clicar no botão de fechar
  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');
    });
  }

  // Fechar drawer ao clicar no overlay
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');
    });
  }

  // Fechar drawer ao clicar em um item
  drawerActionItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('theme-toggle') || item.id === 'btnMinhaContaDrawer') return;
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');

      showNotifyModal('Funcionalidade em desenvolvimento!');
    });
  });

  console.log('Página de noivas carregada com sucesso! 👰✨');
});


