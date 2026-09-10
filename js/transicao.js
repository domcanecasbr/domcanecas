document.documentElement.classList.add('js');

const marca = document.querySelector('[data-reveal]');

if (marca) {
  requestAnimationFrame(() => {
    marca.classList.add('is-visible');
  });
}
