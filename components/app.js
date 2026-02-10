/**
 * APP.JS - FUNCIONALIDADES COMUNS
 * 
 * Script principal que inicializa funcionalidades compartilhadas entre todas as páginas.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o sistema de autenticação
  initAuth();

  // ===== ATENDIMENTO =====
  const atendimentoWidget = document.getElementById('atendimentoWidget');
  const atendimentoClose = document.getElementById('btnCloseAtendimento');
  const atendimentoRestart = document.getElementById('btnAtendimentoRestart');
  const atendimentoClear = document.getElementById('btnAtendimentoClear');
  const atendimentoMensagem = document.getElementById('atendimentoMensagem');
  const atendimentoOptions = document.getElementById('atendimentoOptions');
  const atendimentoChat = document.getElementById('atendimentoChat');
  const atendimentoBody = atendimentoWidget?.querySelector('.atendimento-body');
  let atendimentoTypingInterval = null;
  const atendimentoState = {
    unidade: null,
    data: null,
    horario: null,
  };
  const atendimentoMenuInicial = [
    { label: 'Agendar prova', value: 'agendar' },
    { label: 'Tirar dúvidas rápidas', value: 'duvidas' },
    { label: 'Guia de medidas', value: 'medidas' },
    { label: 'Prazo e retirada', value: 'entrega' },
    { label: 'Falar com consultora', value: 'consultora' },
  ];
  let atendimentoLastOptions = atendimentoMenuInicial.map((option) => ({ ...option }));

  const getCookieConsent = () => getCookie('cookieConsent') || localStorage.getItem('cookieConsent');

  const atendimentoStorageKeys = {
    messages: 'atendimentoConversation',
    options: 'atendimentoOptions',
    state: 'atendimentoState',
  };

  let isRestoringAtendimento = false;

  const getAtendimentoStorage = () => {
    const consent = getCookieConsent();
    if (consent === 'none') return 'none';
    if (consent === null) return 'session';
    return 'local';
  };

  const setAtendimentoValue = (key, value) => {
    const storage = getAtendimentoStorage();
    if (storage === 'local') localStorage.setItem(key, value);
    if (storage === 'session') sessionStorage.setItem(key, value);
  };

  const getAtendimentoValue = (key) => {
    const storage = getAtendimentoStorage();
    if (storage === 'none') return null;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  const removeAtendimentoValue = (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  };

  const clearAtendimentoCache = () => {
    removeAtendimentoValue(atendimentoStorageKeys.messages);
    removeAtendimentoValue(atendimentoStorageKeys.options);
    removeAtendimentoValue(atendimentoStorageKeys.state);
  };

  const resetAtendimentoFlow = (options = {}) => {
    atendimentoMensagem?.classList.remove('show');
    atendimentoOptions?.classList.remove('show');
    if (atendimentoTypingInterval) {
      clearInterval(atendimentoTypingInterval);
      atendimentoTypingInterval = null;
    }
    if (atendimentoMensagem) {
      atendimentoMensagem.textContent = '';
    }
    if (atendimentoChat) {
      const bubbles = atendimentoChat.querySelectorAll('.atendimento-bubble.dynamic');
      bubbles.forEach((bubble) => bubble.remove());
    }
    atendimentoState.unidade = null;
    atendimentoState.data = null;
    atendimentoState.horario = null;
    if (options.clearCache) {
      clearAtendimentoCache();
    }
  };

  const scrollAtendimentoToBottom = (behavior = 'smooth', delay = 0) => {
    if (!atendimentoBody) return;
    const doScroll = () => {
      atendimentoBody.scrollTo({
        top: atendimentoBody.scrollHeight,
        behavior,
      });
    };
    if (delay > 0) {
      setTimeout(() => requestAnimationFrame(doScroll), delay);
      return;
    }
    requestAnimationFrame(doScroll);
  };

  const ensureAtendimentoOptionsVisible = () => {
    if (!atendimentoOptions) return;
    const hasOptions = atendimentoOptions.querySelectorAll('.atendimento-option').length > 0;
    if (!hasOptions && atendimentoLastOptions.length) {
      setAtendimentoOptions(atendimentoLastOptions);
    }
  };

  const collectAtendimentoMessages = () => {
    const messages = [];
    const initialText = atendimentoMensagem?.textContent?.trim();
    if (initialText) {
      messages.push({ text: initialText, type: 'bot' });
    }
    if (atendimentoChat) {
      const bubbles = atendimentoChat.querySelectorAll('.atendimento-bubble.dynamic');
      bubbles.forEach((bubble) => {
        messages.push({
          text: bubble.textContent || '',
          type: bubble.classList.contains('user') ? 'user' : 'bot',
        });
      });
    }
    return messages;
  };

  const collectAtendimentoOptions = () => {
    if (!atendimentoOptions) return [];
    const options = [];
    atendimentoOptions.querySelectorAll('.atendimento-option').forEach((button) => {
      options.push({
        label: button.textContent?.trim() || '',
        value: button.dataset.atendimento || '',
      });
    });
    return options;
  };

  const persistAtendimentoCache = () => {
    if (isRestoringAtendimento) return;
    if (getAtendimentoStorage() === 'none') return;

    const messages = collectAtendimentoMessages();
    if (messages.length) {
      setAtendimentoValue(atendimentoStorageKeys.messages, JSON.stringify(messages));
    } else {
      removeAtendimentoValue(atendimentoStorageKeys.messages);
    }

    const options = collectAtendimentoOptions();
    if (options.length) {
      setAtendimentoValue(atendimentoStorageKeys.options, JSON.stringify(options));
    } else {
      removeAtendimentoValue(atendimentoStorageKeys.options);
    }

    setAtendimentoValue(atendimentoStorageKeys.state, JSON.stringify(atendimentoState));
  };

  const restoreAtendimentoFromCache = () => {
    if (getAtendimentoStorage() === 'none') return false;

    const rawMessages = getAtendimentoValue(atendimentoStorageKeys.messages);
    if (!rawMessages) return false;

    let messages = [];
    try {
      messages = JSON.parse(rawMessages) || [];
    } catch (error) {
      return false;
    }

    if (!Array.isArray(messages) || messages.length === 0) return false;

    isRestoringAtendimento = true;

    atendimentoMensagem?.classList.remove('show');
    atendimentoOptions?.classList.remove('show');
    if (atendimentoTypingInterval) {
      clearInterval(atendimentoTypingInterval);
      atendimentoTypingInterval = null;
    }
    if (atendimentoChat) {
      const bubbles = atendimentoChat.querySelectorAll('.atendimento-bubble.dynamic');
      bubbles.forEach((bubble) => bubble.remove());
    }

    if (atendimentoMensagem) {
      atendimentoMensagem.textContent = messages[0]?.text || '';
      if (atendimentoMensagem.textContent) {
        atendimentoMensagem.classList.add('show');
      }
    }

    messages.slice(1).forEach((message) => {
      addChatBubble(message.text || '', message.type === 'user' ? 'user' : 'bot');
    });

    const rawOptions = getAtendimentoValue(atendimentoStorageKeys.options);
    if (rawOptions) {
      try {
        const options = JSON.parse(rawOptions);
        if (Array.isArray(options) && options.length) {
          setAtendimentoOptions(options);
        } else {
          setAtendimentoOptions(atendimentoMenuInicial);
        }
      } catch (error) {
        setAtendimentoOptions(atendimentoMenuInicial);
      }
    } else {
      setAtendimentoOptions(atendimentoMenuInicial);
    }

    const rawState = getAtendimentoValue(atendimentoStorageKeys.state);
    if (rawState) {
      try {
        const parsedState = JSON.parse(rawState);
        atendimentoState.unidade = parsedState?.unidade || null;
        atendimentoState.data = parsedState?.data || null;
        atendimentoState.horario = parsedState?.horario || null;
      } catch (error) {
        atendimentoState.unidade = null;
        atendimentoState.data = null;
        atendimentoState.horario = null;
      }
    }

    isRestoringAtendimento = false;
    persistAtendimentoCache();
    scrollAtendimentoToBottom('auto');
    return true;
  };

  const addChatBubble = (text, type = 'bot') => {
    if (!atendimentoChat) return null;
    const bubble = document.createElement('div');
    bubble.className = `atendimento-bubble dynamic${type === 'user' ? ' user' : ''}`;
    bubble.textContent = text;
    atendimentoChat.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add('show'));
    persistAtendimentoCache();
    scrollAtendimentoToBottom('smooth', 60);
    return bubble;
  };

  const setAtendimentoOptions = (options) => {
    if (!atendimentoOptions) return;
    atendimentoOptions.classList.remove('show');
    atendimentoOptions.innerHTML = '';
    atendimentoOptions.scrollTop = 0;
    atendimentoLastOptions = (Array.isArray(options) ? options : []).map((option) => ({ ...option }));
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'atendimento-option';
      button.textContent = option.label;
      button.dataset.atendimento = option.value;
      atendimentoOptions.appendChild(button);
      setTimeout(() => button.classList.add('show'), 120 * index);
    });
    setTimeout(() => {
      atendimentoOptions.classList.add('show');
    }, 180);
    persistAtendimentoCache();
    scrollAtendimentoToBottom('smooth', 240);
  };

  const typeAtendimentoMessage = (text, onDone) => {
    if (!atendimentoMensagem) return;
    let index = 0;
    atendimentoMensagem.textContent = '';
    atendimentoMensagem.classList.add('show');
    scrollAtendimentoToBottom('auto', 20);
    atendimentoTypingInterval = setInterval(() => {
      atendimentoMensagem.textContent += text.charAt(index);
      index += 1;
      if (index >= text.length) {
        clearInterval(atendimentoTypingInterval);
        atendimentoTypingInterval = null;
        persistAtendimentoCache();
        scrollAtendimentoToBottom('auto', 40);
        onDone?.();
      }
    }, 22);
  };

  const startAtendimentoFlow = () => {
    resetAtendimentoFlow({ clearCache: true });
    const fullText = atendimentoMensagem?.dataset.fullText || '';

    setTimeout(() => {
      typeAtendimentoMessage(fullText, () => {
        setTimeout(() => {
          setAtendimentoOptions(atendimentoMenuInicial);
        }, 220);
      });
    }, 180);
  };

  const handleAtendimentoOption = (optionValue, label) => {
    if (optionValue === 'agendar') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Perfeito! Vamos agendar sua prova. Por onde começamos?', 'bot');
        setAtendimentoOptions([
          { label: 'Selecionar unidade', value: 'agendar-unidade' },
          { label: 'Escolher data', value: 'agendar-data' },
          { label: 'Escolher horário', value: 'agendar-horario' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 220);
      return;
    }

    if (optionValue === 'duvidas') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Pode escolher o tema da sua dúvida rapidinha 👇', 'bot');
        setAtendimentoOptions([
          { label: 'Prazo e retirada', value: 'duvidas-prazo' },
          { label: 'Trocas e ajustes', value: 'duvidas-troca' },
          { label: 'Guia de medidas', value: 'duvidas-medidas' },
          { label: 'Atendimento online', value: 'duvidas-online' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'duvidas-prazo') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('O prazo padrão é de 5 a 7 dias úteis após confirmação. Para retirada na loja, avisamos assim que estiver pronto ✨', 'bot');
        setAtendimentoOptions([
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'duvidas-troca') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Ajustes simples são feitos conforme disponibilidade. Para trocas, orientamos dentro de 7 dias com etiqueta e sem uso.', 'bot');
        setAtendimentoOptions([
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'duvidas-medidas') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Você pode conferir o guia de medidas na página do vestido. Se quiser, posso te ajudar a medir direitinho 💌', 'bot');
        setAtendimentoOptions([
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'duvidas-online') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Temos atendimento online em horário comercial. Quer que eu te conecte com a consultora agora?', 'bot');
        setAtendimentoOptions([
          { label: 'Falar com consultora', value: 'consultora' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'agendar-unidade') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Ótimo! Qual unidade você prefere?', 'bot');
        setAtendimentoOptions([
          { label: 'Unidade Centro', value: 'unidade-centro' },
          { label: 'Unidade Jardins', value: 'unidade-jardins' },
          { label: 'Unidade Moema', value: 'unidade-moema' },
          { label: 'Atendimento online', value: 'unidade-online' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue?.startsWith('unidade-')) {
      atendimentoState.unidade = label;
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Perfeito! Agora escolha a data.', 'bot');
        setAtendimentoOptions([
          { label: 'Hoje', value: 'data-hoje' },
          { label: 'Amanhã', value: 'data-amanha' },
          { label: 'Escolher outra data', value: 'data-outra' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'agendar-data') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Legal! Qual data você prefere?', 'bot');
        setAtendimentoOptions([
          { label: 'Hoje', value: 'data-hoje' },
          { label: 'Amanhã', value: 'data-amanha' },
          { label: 'Escolher outra data', value: 'data-outra' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue?.startsWith('data-')) {
      atendimentoState.data = label;
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Show! Agora escolha o horário.', 'bot');
        setAtendimentoOptions([
          { label: 'Manhã (09h–12h)', value: 'horario-manha' },
          { label: 'Tarde (13h–17h)', value: 'horario-tarde' },
          { label: 'Noite (18h–20h)', value: 'horario-noite' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue === 'agendar-horario') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Certo! Qual horário fica melhor pra você?', 'bot');
        setAtendimentoOptions([
          { label: 'Manhã (09h–12h)', value: 'horario-manha' },
          { label: 'Tarde (13h–17h)', value: 'horario-tarde' },
          { label: 'Noite (18h–20h)', value: 'horario-noite' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 200);
      return;
    }

    if (optionValue?.startsWith('horario-')) {
      atendimentoState.horario = label;
      addChatBubble(label, 'user');
      setTimeout(() => {
        const resumo = `Perfeito! Vou registrar sua preferência:\n• ${atendimentoState.unidade || 'Unidade não definida'}\n• ${atendimentoState.data || 'Data não definida'}\n• ${atendimentoState.horario || 'Horário não definido'}`;
        addChatBubble(resumo, 'bot');
        setAtendimentoOptions([
          { label: 'Confirmar agendamento', value: 'agendar-confirmar' },
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 220);
      return;
    }

    if (optionValue === 'agendar-confirmar') {
      addChatBubble(label, 'user');
      setTimeout(() => {
        addChatBubble('Agendamento recebido! Nossa consultora vai te chamar em instantes para confirmar 🙌', 'bot');
        setAtendimentoOptions([
          { label: 'Voltar ao menu', value: 'voltar-menu' },
        ]);
      }, 220);
      return;
    }

    if (optionValue === 'voltar-menu') {
      addChatBubble('Voltar ao menu', 'user');
      setTimeout(() => {
        addChatBubble('Claro! O que você gostaria de fazer agora?', 'bot');
        setAtendimentoOptions(atendimentoMenuInicial);
      }, 200);
      return;
    }

    addChatBubble(label, 'user');
    setTimeout(() => {
      if (typeof showNotification === 'function') {
        showNotification('Nossa equipe vai te atender já já ✨');
      }
    }, 150);
  };

  const openAtendimentoWidget = () => {
    if (!atendimentoWidget) return;
    atendimentoWidget.classList.add('open');
    if (!restoreAtendimentoFromCache()) {
      startAtendimentoFlow();
    }
  };

  const startNewAtendimentoConversation = () => {
    resetAtendimentoFlow({ clearCache: true });
    startAtendimentoFlow();
  };

  const clearAtendimentoConversation = () => {
    resetAtendimentoFlow({ clearCache: true });
    const fullText = atendimentoMensagem?.dataset.fullText || '';
    if (atendimentoMensagem) {
      atendimentoMensagem.textContent = fullText;
      if (fullText) {
        atendimentoMensagem.classList.add('show');
      }
    }
    setAtendimentoOptions(atendimentoMenuInicial);
    persistAtendimentoCache();
    scrollAtendimentoToBottom('auto', 60);
  };

  const closeAtendimentoWidget = () => {
    if (!atendimentoWidget) return;
    atendimentoWidget.classList.remove('open');
    if (atendimentoTypingInterval) {
      clearInterval(atendimentoTypingInterval);
      atendimentoTypingInterval = null;
    }
    persistAtendimentoCache();
  };

  if (atendimentoClose) {
    atendimentoClose.addEventListener('click', closeAtendimentoWidget);
  }

  if (atendimentoRestart) {
    atendimentoRestart.addEventListener('click', startNewAtendimentoConversation);
  }

  if (atendimentoClear) {
    atendimentoClear.addEventListener('click', clearAtendimentoConversation);
  }

  document.addEventListener('click', (event) => {
    const option = event.target.closest('.atendimento-option');
    if (!option) return;
    if (atendimentoOptions) {
      atendimentoOptions.querySelectorAll('.atendimento-option').forEach((button) => {
        button.classList.remove('is-selected');
      });
    }
    option.classList.add('is-selected');
    const optionValue = option.dataset.atendimento;
    const label = option.textContent.trim();
    handleAtendimentoOption(optionValue, label);
    setTimeout(ensureAtendimentoOptionsVisible, 450);
  });

  const getThemeStorage = () => {
    const consent = getCookieConsent();
    if (consent === 'necessary' || consent === 'all') return 'cookie';
    if (consent === null) return 'session';
    return 'none';
  };
  const setThemeValue = (key, value) => {
    const storage = getThemeStorage();
    if (storage === 'cookie') setCookie(key, value, 30);
    if (storage === 'session') sessionStorage.setItem(key, value);
  };
  const getThemeValue = (key) => {
    const storage = getThemeStorage();
    if (storage === 'cookie') return getCookie(key);
    if (storage === 'session') return sessionStorage.getItem(key);
    return null;
  };
  const clearThemeStorage = () => {
    removeCookie('theme');
    removeCookie('userHasChosenTheme');
    sessionStorage.removeItem('theme');
    sessionStorage.removeItem('userHasChosenTheme');
    localStorage.removeItem('theme');
    localStorage.removeItem('userHasChosenTheme');
  };

  const legacyTheme = localStorage.getItem('theme');
  const legacyChosen = localStorage.getItem('userHasChosenTheme');
  if (legacyTheme && !getCookie('theme')) {
    setCookie('theme', legacyTheme, 30);
  }
  if (legacyChosen && !getCookie('userHasChosenTheme')) {
    setCookie('userHasChosenTheme', legacyChosen, 30);
  }
  if (localStorage.getItem('cookieConsent') && !getCookie('cookieConsent')) {
    setCookie('cookieConsent', localStorage.getItem('cookieConsent'), 30);
  }

  if (getCookieConsent() === 'none') {
    clearThemeStorage();
  }

  // ===== MODO ESCURO =====
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-left');
  
  // Função para obter o tema inicial (sistema ou localStorage)
  const getInitialTheme = () => {
    // Se o usuário nunca escolheu manualmente, usar a preferência do sistema
    const storedTheme = getThemeValue('theme');
    const userHasChosenTheme = getThemeValue('userHasChosenTheme');
    
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

  document.addEventListener('cookie-consent-changed', (event) => {
    const consent = event?.detail?.consent;
    if (consent === 'none') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      clearThemeStorage();
      clearAtendimentoCache();
      updateThemeToggles();
      return;
    }

    if (consent === 'necessary' || consent === 'all') {
      const sessionTheme = sessionStorage.getItem('theme');
      const sessionChosen = sessionStorage.getItem('userHasChosenTheme');
      if (sessionTheme) {
        setCookie('theme', sessionTheme, 30);
      }
      if (sessionChosen) {
        setCookie('userHasChosenTheme', sessionChosen, 30);
      }
      sessionStorage.removeItem('theme');
      sessionStorage.removeItem('userHasChosenTheme');

       const sessionMessages = sessionStorage.getItem(atendimentoStorageKeys.messages);
       const sessionOptions = sessionStorage.getItem(atendimentoStorageKeys.options);
       const sessionState = sessionStorage.getItem(atendimentoStorageKeys.state);
       if (sessionMessages && !localStorage.getItem(atendimentoStorageKeys.messages)) {
         localStorage.setItem(atendimentoStorageKeys.messages, sessionMessages);
       }
       if (sessionOptions && !localStorage.getItem(atendimentoStorageKeys.options)) {
         localStorage.setItem(atendimentoStorageKeys.options, sessionOptions);
       }
       if (sessionState && !localStorage.getItem(atendimentoStorageKeys.state)) {
         localStorage.setItem(atendimentoStorageKeys.state, sessionState);
       }
       sessionStorage.removeItem(atendimentoStorageKeys.messages);
       sessionStorage.removeItem(atendimentoStorageKeys.options);
       sessionStorage.removeItem(atendimentoStorageKeys.state);

      const storedTheme = getCookie('theme');
      if (storedTheme) {
        document.body.setAttribute('data-theme', storedTheme);
      }
      updateThemeToggles();
    }
  });

  // Event listener para os botões de tema
  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.body.setAttribute('data-theme', nextTheme);
      setThemeValue('theme', nextTheme);
      setThemeValue('userHasChosenTheme', 'true');
      updateThemeToggles();
    });
  });

  // Observa mudanças na preferência de tema do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Só atualiza automaticamente se o usuário não tiver escolhido manualmente
    const userHasChosenTheme = getThemeValue('userHasChosenTheme');
    if (!userHasChosenTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      updateThemeToggles();
    }
  });

  updateThemeToggles();

  // ===== MENU HAMBURGUÊS =====
  const setupMenu = () => {
    const menuHamburger = document.getElementById('menuHamburger');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.querySelector('.drawer-overlay');

    if (!menuHamburger || !drawer) return;
    if (menuHamburger.dataset.bound === 'true') return;

    const openDrawer = () => {
      menuHamburger.classList.add('active');
      menuHamburger.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      drawerOverlay?.classList.add('open');
      document.body.classList.add('no-scroll');

      const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(drawer.querySelectorAll(focusableSelectors));
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleKeydown = (event) => {
        if (event.key === 'Escape') {
          closeDrawer();
          return;
        }

        if (event.key !== 'Tab' || focusableElements.length === 0) return;

        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
          return;
        }

        if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      };

      if (!drawer.dataset.trapAttached) {
        drawer.dataset.trapAttached = 'true';
        drawer.dataset.trapHandlerId = 'drawerTrap';
      }

      drawer._trapHandler = handleKeydown;
      document.addEventListener('keydown', handleKeydown);
      firstFocusable?.focus();
    };

    const closeDrawer = () => {
      menuHamburger.classList.remove('active');
      menuHamburger.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      drawerOverlay?.classList.remove('open');
      document.body.classList.remove('no-scroll');

      if (drawer._trapHandler) {
        document.removeEventListener('keydown', drawer._trapHandler);
        drawer._trapHandler = null;
      }
    };

    menuHamburger.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
        return;
      }
      openDrawer();
    });

    if (drawerClose && drawerClose.dataset.bound !== 'true') {
      drawerClose.addEventListener('click', closeDrawer);
      drawerClose.dataset.bound = 'true';
    }

    if (drawerOverlay && drawerOverlay.dataset.bound !== 'true') {
      drawerOverlay.addEventListener('click', closeDrawer);
      drawerOverlay.dataset.bound = 'true';
    }

    menuHamburger.dataset.bound = 'true';

    const drawerActionItems = document.querySelectorAll('.drawer-action-item');
    drawerActionItems.forEach(item => {
      if (item.dataset.bound === 'true') return;
      item.addEventListener('click', () => {
        if (item.classList.contains('theme-toggle') || item.id === 'btnMinhaContaDrawer') return;
        if (item.id === 'btnAtendimentoDrawer') {
          closeDrawer();
          openAtendimentoWidget();
          return;
        }
        closeDrawer();
        if (typeof showNotification === 'function') {
          showNotification('Funcionalidade em desenvolvimento!');
        }
      });
      item.dataset.bound = 'true';
    });
  };

  setupMenu();
  document.addEventListener('header-rendered', setupMenu);

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
    const isAtendimento = item.id === 'btnAtendimento';
    
    if (isAtendimento) {
      item.addEventListener('click', () => {
        openAtendimentoWidget();
      });
    } else if (!isLogin && !isThemeToggle) {
      item.addEventListener('click', () => {
        showNotification('Funcionalidade em desenvolvimento!');
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && atendimentoWidget?.classList.contains('open')) {
      closeAtendimentoWidget();
    }
  });

});
