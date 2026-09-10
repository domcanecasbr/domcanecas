document.addEventListener('DOMContentLoaded', function () {
  const anos = document.querySelectorAll('[data-ano-atual]');
  anos.forEach(function (elemento) {
    elemento.textContent = new Date().getFullYear();
  });

  iniciarMedicao();
  iniciarConsentimento();

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

/* ==========================================================================
   Medição — envia os eventos para a camada de dados lida pelo Google Tag Manager.
   Cada elemento rastreado carrega os atributos data-gtm-* gerados por tools/gerar-site.mjs.
   ========================================================================== */

function enviarEvento(nome, parametros) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: nome }, parametros || {}));
}

function iniciarMedicao() {
  const atributos = {
    gtmLocal: 'local',
    gtmIntencao: 'intencao',
    gtmRede: 'rede',
    gtmEndereco: 'endereco',
    gtmCard: 'card',
    gtmDestino: 'destino'
  };

  // Uma visita gera no máximo um generate_lead, mesmo que a pessoa clique em vários botões.
  // Sem isso o Google Ads contaria o mesmo cliente duas vezes e otimizaria pela métrica errada.
  let leadRegistrado = false;
  const marcarLead = function () {
    if (leadRegistrado) return false;
    try {
      if (sessionStorage.getItem('dc_lead_enviado')) {
        leadRegistrado = true;
        return false;
      }
      sessionStorage.setItem('dc_lead_enviado', '1');
    } catch (erro) {
      // Navegador bloqueou o armazenamento; a marca em memória ainda evita duplicar na mesma página.
    }
    leadRegistrado = true;
    return true;
  };

  document.addEventListener('click', function (evento) {
    const alvo = evento.target && evento.target.closest ? evento.target.closest('[data-gtm-evento]') : null;
    if (!alvo) return;

    const nome = alvo.dataset.gtmEvento;
    const parametros = {};
    Object.keys(atributos).forEach(function (chave) {
      if (alvo.dataset[chave]) parametros[atributos[chave]] = alvo.dataset[chave];
    });

    enviarEvento(nome, parametros);
    if (nome === 'whatsapp_click' && marcarLead()) enviarEvento('generate_lead', parametros);
  }, true);

  // Quais dúvidas travam a venda: registra a pergunta do FAQ no momento em que ela é aberta.
  document.querySelectorAll('details.faq__item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      const titulo = item.querySelector('summary');
      enviarEvento('faq_open', { pergunta: titulo ? titulo.textContent.trim() : '(sem título)' });
    });
  });

  // Endereços que não existem mais — mostra se ainda chega gente pelas URLs antigas.
  if (document.body.dataset.gtmPaginaGrupo === 'erro_404') {
    enviarEvento('erro_404', {
      url_quebrada: window.location.pathname + window.location.search,
      origem_link: document.referrer || '(acesso direto)'
    });
  }
}

/* ==========================================================================
   Consentimento de cookies (LGPD) — o padrão vem negado no <head> de cada página;
   aqui a pessoa escolhe e a escolha é aplicada ao Google Consent Mode.
   ========================================================================== */

const CHAVE_CONSENTIMENTO = 'dc_consentimento';

function lerConsentimento() {
  try {
    return localStorage.getItem(CHAVE_CONSENTIMENTO);
  } catch (erro) {
    return null;
  }
}

function aplicarConsentimento(valor) {
  try {
    localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
  } catch (erro) {
    // Sem armazenamento a escolha vale apenas para esta navegação.
  }

  const permissao = valor === 'aceito' ? 'granted' : 'denied';
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: permissao,
      ad_user_data: permissao,
      ad_personalization: permissao,
      analytics_storage: permissao
    });
  }
  enviarEvento('consentimento_atualizado', { consentimento: valor });
}

function iniciarConsentimento() {
  // O site é publicado na raiz do domínio, então o caminho absoluto vale para todas as páginas,
  // inclusive a 404, que é servida a partir de qualquer endereço.
  const caminhoPrivacidade = '/privacidade/';

  const banner = document.createElement('div');
  banner.className = 'consentimento';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso sobre cookies');
  banner.hidden = true;
  banner.innerHTML =
    '<div class="consentimento__conteudo">' +
    '<p class="consentimento__texto">Usamos cookies opcionais para medir visitas e anúncios. Até você escolher, nada é medido. ' +
    '<a href="' + caminhoPrivacidade + '">Ler a política de privacidade</a>.</p>' +
    '<div class="consentimento__acoes">' +
    '<button type="button" class="botao botao--primario" data-consentimento="aceito">Aceitar</button>' +
    '<button type="button" class="botao botao--claro" data-consentimento="recusado">Recusar</button>' +
    '</div></div>';

  const mostrar = function () {
    banner.hidden = false;
    document.body.classList.add('com-consentimento');
  };
  const esconder = function () {
    banner.hidden = true;
    document.body.classList.remove('com-consentimento');
  };

  banner.addEventListener('click', function (evento) {
    const botao = evento.target.closest('[data-consentimento]');
    if (!botao) return;
    aplicarConsentimento(botao.dataset.consentimento);
    esconder();
  });

  document.body.appendChild(banner);
  if (!lerConsentimento()) mostrar();

  // Link no rodapé para rever a escolha a qualquer momento — exigência prática da LGPD.
  document.querySelectorAll('[data-abrir-consentimento]').forEach(function (gatilho) {
    gatilho.addEventListener('click', function () {
      mostrar();
      const primeiro = banner.querySelector('[data-consentimento]');
      if (primeiro) primeiro.focus();
    });
  });
}
