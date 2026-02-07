// script.js - Página Inicial com Interatividade

document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. MODAL DE NOTIFICAÇÃO =====
    const modal = document.getElementById('modalNotificacao');
    const closeBtn = document.querySelector('.modal-close-notif');
    const navLinks = document.querySelectorAll('.nav-link');
    const navItems = document.querySelectorAll('.navegacao ul span');
    const cards = document.querySelectorAll('.card-categoria');
    const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-left');

    const closeModal = () => {
        modal.classList.remove('show');
    };

    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
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

    // ===== 1.1. MODO ESCURO =====
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

    // ===== 2. ABERTURA DO MODAL NOS LINKS DE NAVEGAÇÃO =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('mensagemNotificacao').textContent = 'Esta seção em breve!';
            modal.classList.add('show');
        });
    });

    // ===== 2.1. ESTADO ATIVO DO NAV =====
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Abrir catálogo de formatura e madrinha com modal
    const formacaoCard = cards[1];
    const madrinraCard = cards[2];

    formacaoCard?.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            e.preventDefault();
            document.getElementById('mensagemNotificacao').textContent = 'Catálogo em desenvolvimento!';
            modal.classList.add('show');
        }
    });

    madrinraCard?.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            e.preventDefault();
            document.getElementById('mensagemNotificacao').textContent = 'Catálogo em desenvolvimento!';
            modal.classList.add('show');
        }
    });

    // ===== 3. EFEITO RIPPLE NOS BOTÕES E LINKS =====
    function createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const radius = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = radius + 'px';
        ripple.style.left = (event.clientX - rect.left - radius / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - radius / 2) + 'px';
        ripple.className = 'ripple';
        
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(230, 190, 138, 0.6);
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('style[data-ripple]')) {
            rippleStyle.setAttribute('data-ripple', 'true');
            document.head.appendChild(rippleStyle);
        }
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Adicionar ripple ao clicar nos action-items
    document.querySelectorAll('.action-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('theme-toggle')) return;
            createRipple(item, e);
            document.getElementById('mensagemNotificacao').textContent = 'Funcionalidade em desenvolvimento!';
            modal.classList.add('show');
        });
    });

    // ===== 4. EFEITO DE SCROLL PARALLAX SUAVE =====
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Efeito subtle no background
        if (document.querySelector('.video-fundo')) {
            document.querySelector('.video-fundo').style.backgroundPosition = `0 ${scrollPosition * 0.05}px`;
        }
    });

    // ===== 5. SCROLL SMOOTH GLOBAL =====
    document.documentElement.style.scrollBehavior = 'smooth';

    // ===== 6. OBSERVADOR DE CARDS PARA ANIMAÇÃO =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideInImage 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.imagens-noiva div').forEach(img => {
        observer.observe(img);
    });

    // ===== 7. VERIFICAR VIDEO =====
    const video = document.querySelector('.video-fundo video');
    if (video && video.paused) {
        video.play().catch(err => console.log('Autoplay do vídeo bloqueado:', err));
    }

    // ===== 8. HOVER EFFECTS ADICIONAIS =====
    document.querySelectorAll('.imagens-noiva img').forEach(img => {
        img.addEventListener('click', () => {
            // Adicionar zoom animation
            img.style.animation = 'none';
            setTimeout(() => {
                img.style.animation = 'slideInImage 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)';
            }, 10);
        });
    });

    // ===== 9. MENU HAMBURGUÊS =====
    const menuHamburger = document.getElementById('menuHamburger');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerActionItems = document.querySelectorAll('.drawer-action-item');

    // Abrir/fechar drawer ao clicar no menu hamburguês
    if (menuHamburger) {
        menuHamburger.addEventListener('click', () => {
            menuHamburger.classList.toggle('active');
            drawer.classList.toggle('open');
            drawerOverlay.classList.toggle('open');
        });
    }

    // Fechar drawer ao clicar no botão de fechar
    if (drawerClose) {
        drawerClose.addEventListener('click', () => {
            menuHamburger.classList.remove('active');
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('open');
        });
    }

    // Fechar drawer ao clicar no overlay
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => {
            menuHamburger.classList.remove('active');
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('open');
        });
    }

    // Fechar drawer ao clicar em um item
    drawerActionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('theme-toggle')) return;
            menuHamburger.classList.remove('active');
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('open');

            // Mostrar o mesmo modal de "em construção" do desktop
            document.getElementById('mensagemNotificacao').textContent = 'Funcionalidade em desenvolvimento!';
            modal.classList.add('show');
        });
    });

    console.log('Página inicial carregada com sucesso! 🎉');
});
