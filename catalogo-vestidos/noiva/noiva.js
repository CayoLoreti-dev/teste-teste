// noiva.js
// Define delays dinâmicos para as imagens dentro de .vestidos e inicia a animação

document.addEventListener('DOMContentLoaded', () => {
  // ===== 0. MODAL DE NOTIFICAÇÃO =====
  const notifyModal = document.getElementById('modalNotificacao');
  const notifyCloseBtn = document.querySelector('.modal-close-notif');
  const notifyMessage = document.getElementById('mensagemNotificacao');
  const navLinks = document.querySelectorAll('.nav-link');
  const navItems = document.querySelectorAll('.navegacao ul span');

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

  // Abrir modal ao clicar nas imagens principais
  if (vestidosContainer) {
    vestidosContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', (e) => {
        modal.classList.add('show');
        modalImg.src = e.target.src;
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // Abrir modal ao clicar nas imagens do carrossel
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
  const scrollAmount = isMobile ? 200 : 340;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  // 3.3: Navegação com Botões
  btnPrev?.addEventListener('click', () => {
    carrossel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  btnNext?.addEventListener('click', () => {
    carrossel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

  // 3.4: Navegação com Mouse Wheel (Scroll do Mouse)
  carrossel.addEventListener('wheel', (e) => {
    e.preventDefault();
    carrossel.scrollBy({
      left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
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
  });

  carrossel.addEventListener('touchend', () => {
    isTouching = false;
    carrossel.style.scrollBehavior = 'smooth';
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
      menuHamburger.classList.remove('active');
      drawer.classList.remove('open');

      showNotifyModal('Funcionalidade em desenvolvimento!');
    });
  });

  console.log('Página de noivas carregada com sucesso! 👰✨');
});


