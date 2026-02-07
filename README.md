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

## Convenções que ajudam a estudar e reutilizar

- **Nomes sem espaços**: use `kebab-case` (ex.: `meu-arquivo.png`).
- **Assets centralizados** em `assets/`.
- **CSS base reutilizável**: o `noiva.css` funciona como base visual.
- **Links relativos**: mantêm o site funcionando em qualquer hospedagem.

## Como adicionar uma nova página

1. Crie uma pasta em `catalogo-vestidos/`.
2. Copie uma página existente para manter o padrão.
3. Atualize os links de navegação e o título.
4. Se precisar de imagens/ícones, coloque tudo em `assets/`.

## Dica rápida para estudar depois

- Comece lendo `index.html` para entender a estrutura geral.
- Depois, veja `inicial-page/style.css` para o visual principal.
- Em seguida, compare `noiva.css` com `formatura/style.css` para entender como o tema é reaproveitado.

---

Se quiser, posso adicionar comentários no HTML/CSS ou preparar um checklist para novos projetos.
