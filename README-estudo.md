# Catálogo SSISSI

Site estático com página inicial e catálogos de noivas, formaturas e madrinhas. Estruturado para ficar fácil de estudar, reaproveitar e publicar no Netlify.

## Estrutura do projeto

```
.
├─ index.html
├─ netlify.toml
├─ assets/
│  ├─ icons/
│  ├─ videos/
│  └─ images/
│     └─ noivas/
├─ inicial-page/
│  ├─ style.css
│  └─ script.js
└─ catalogo-vestidos/
   ├─ noiva/
   │  ├─ catalogo-noiva.html
   │  ├─ noiva.css
   │  └─ noiva.js
   ├─ formatura/
   │  ├─ catalogo-formatura.html
   │  └─ style.css
   └─ madrinha/
      ├─ catalogo-madrinha.html
      └─ style.css
```

### O que fica onde

- `index.html`: página inicial (entrada principal do site).
- `inicial-page/`: CSS e JS da página inicial.
- `catalogo-vestidos/`: páginas de catálogo e estilos específicos.
- `assets/`: **todos os arquivos estáticos** (ícones, imagens e vídeos).

## Como rodar localmente

- Abra o arquivo `index.html` no navegador.
- Para evitar problemas de caminho, **sempre comece pela raiz**.

## Como publicar no Netlify (via GitHub)

1. Conecte o repositório no Netlify.
2. Em **Build & deploy**:
   - **Build command:** vazio
   - **Publish directory:** `.`
3. Faça **Clear cache and deploy** se algo não carregar.

> O arquivo `netlify.toml` já está configurado para a raiz.

## Sistema de componentes compartilhados (IMPORTANTE)

O site usa **componentes JavaScript reutilizáveis** para evitar repetição de código:

**✅ TODAS AS PÁGINAS JÁ ESTÃO CONVERTIDAS** para este sistema:
- `index.html` ✓
- `catalogo-vestidos/noiva/catalogo-noiva.html` ✓
- `catalogo-vestidos/formatura/catalogo-formatura.html` ✓
- `catalogo-vestidos/madrinha/catalogo-madrinha.html` ✓

Isso significa que **editar o header, login ou modais em um lugar atualiza em todo o site**.

### Header compartilhado
- **Arquivo:** `components/header.js`
- **Como funciona:** edite o header **uma única vez** neste arquivo e ele atualiza em **todas as páginas automaticamente**.
- **Como usar:** cada página HTML carrega este script e injeta o header dinamicamente.

### Sistema de login global
- **Arquivo:** `components/auth.js`
- **Como funciona:** gerencia login/logout usando `localStorage`, acessível em **qualquer página**.
- **Informações salvas:** nome do usuário, email, data de login.
- **Atualização automática:** quando você faz login, o nome aparece no header de todas as páginas.

### Modais compartilhados
- **Arquivo:** `components/modals.js`
- **Contém:** modal de login e modal de notificações.
- **Vantagem:** edite os modais uma vez e eles aparecem iguais em todo o site.

### Funcionalidades comuns
- **Arquivo:** `components/app.js`
- **Contém:** modo escuro, menu hamburguês, navegação, e outras interações.

## Convenções que ajudam a estudar e reutilizar

- **Nomes sem espaços**: use `kebab-case` (ex.: `meu-arquivo.png`).
- **Assets centralizados** em `assets/`.
- **Componentes reutilizáveis** em `components/` (header, auth, modals).
- **CSS base reutilizável**: o `noiva.css` funciona como base visual.
- **Links relativos**: mantêm o site funcionando em qualquer hospedagem.

## Como adicionar uma nova página

1. Crie uma pasta em `catalogo-vestidos/`.
2. Copie uma página existente para manter o padrão.
3. No HTML, adicione:
   ```html
   <div id="header-placeholder"></div>
   <div id="modals-placeholder"></div>
   ```
4. No final do `<body>`, carregue os scripts:
   ```html
   <script src="../../components/header.js"></script>
   <script src="../../components/auth.js"></script>
   <script src="../../components/modals.js"></script>
   <script src="../../components/app.js"></script>
   <script>
     initHeader('Título da Página', true); // true = página de catálogo
     initModals();
   </script>
   ```
5. Se precisar de imagens/ícones, coloque tudo em `assets/`.

## Como editar o header (para aparecer em todas as páginas)

1. Abra `components/header.js`.
2. Edite o HTML dentro de `getHeaderHTML()` ou `getHeaderHTMLForCatalog()`.
3. Salve e recarregue qualquer página — **todas serão atualizadas automaticamente**.

## Dica rápida para estudar depois

- Comece lendo `index.html` para entender a estrutura geral.
- Depois, veja `inicial-page/style.css` para o visual principal.
- Em seguida, compare `noiva.css` com `formatura/style.css` para entender como o tema é reaproveitado.

---

Se quiser, posso adicionar comentários no HTML/CSS ou preparar um checklist para novos projetos.
