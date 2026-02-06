// script.js - Página Inicial com Interatividade

document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. MODAL DE NOTIFICAÇÃO =====
    const modal = document.getElementById('modalNotificacao');
    const closeBtn = document.querySelector('.modal-close-notif');
    const navLinks = document.querySelectorAll('.nav-link');
    const cards = document.querySelectorAll('.card-categoria');

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

    // ===== 2. ABERTURA DO MODAL NOS LINKS DE NAVEGAÇÃO =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('mensagemNotificacao').textContent = 'Esta seção em breve!';
            modal.classList.add('show');
            
            // Ripple effect
            createRipple(link, e);
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

    console.log('Página inicial carregada com sucesso! 🎉');
});
