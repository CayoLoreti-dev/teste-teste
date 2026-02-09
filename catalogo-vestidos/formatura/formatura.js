document.addEventListener('DOMContentLoaded', () => {
  const vestidosContainer = document.querySelector('.vestidos');
  if (!vestidosContainer) return;

  const imgs = Array.from(vestidosContainer.querySelectorAll('img'));
  const step = 0.06;

  imgs.forEach((img, i) => {
    const delay = (i * step).toFixed(2) + 's';
    img.style.setProperty('--delay', delay);
  });

  requestAnimationFrame(() => {
    vestidosContainer.classList.add('play');
  });
});
