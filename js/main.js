document.addEventListener('DOMContentLoaded', function () {
  const anos = document.querySelectorAll('[data-ano-atual]');
  anos.forEach(function (elemento) {
    elemento.textContent = new Date().getFullYear();
  });

  const botaoMenu = document.querySelector('.cabecalho__menu-toggle');
  const menu = document.querySelector('.cabecalho__nav');
  if (!botaoMenu || !menu) return;

  const fecharMenu = function () {
    menu.classList.remove('cabecalho__nav--aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
  };

  botaoMenu.addEventListener('click', function (evento) {
    evento.stopPropagation();
    const aberto = menu.classList.toggle('cabecalho__nav--aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  menu.addEventListener('click', function (evento) {
    if (evento.target.tagName === 'A') fecharMenu();
  });
  document.addEventListener('click', function (evento) {
    if (!menu.contains(evento.target) && !botaoMenu.contains(evento.target)) fecharMenu();
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharMenu();
      botaoMenu.focus();
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 860) fecharMenu();
  });
});
