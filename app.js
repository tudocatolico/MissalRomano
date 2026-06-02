// ═══════════════════════════════════════════════════════════
// MISSAL ROMANO — App JavaScript
// ═══════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Service Worker ──────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js');
    });
  }

  // ── Botão Voltar ao Topo ────────────────────────────────
  var btnTopo = document.getElementById('btnTopo');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btnTopo.classList.add('visivel');
    } else {
      btnTopo.classList.remove('visivel');
    }
  }, { passive: true });

  btnTopo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Navegação ativa conforme scroll ─────────────────────
  var sections = document.querySelectorAll('.section');
  var navLinks = document.querySelectorAll('.nav-link');

  function atualizarNavAtiva() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', atualizarNavAtiva, { passive: true });
  atualizarNavAtiva();

  // ── Modo Escuro ─────────────────────────────────────────
  var btnTema = document.getElementById('btnTema');
  var htmlEl = document.documentElement;

  function aplicarTema(tema) {
    htmlEl.setAttribute('data-theme', tema);
    btnTema.innerHTML = tema === 'dark' ? '&#9788;' : '&#9790;';
    btnTema.title = tema === 'dark' ? 'Modo claro' : 'Modo escuro';
    try { localStorage.setItem('missal-tema', tema); } catch (e) {}
  }

  // Inicializar tema
  var temaSalvo = null;
  try { temaSalvo = localStorage.getItem('missal-tema'); } catch (e) {}

  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  } else {
    aplicarTema('light');
  }

  btnTema.addEventListener('click', function () {
    var atual = htmlEl.getAttribute('data-theme');
    aplicarTema(atual === 'dark' ? 'light' : 'dark');
  });

  // Ouvir mudança de preferência do sistema
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var temaSalvo2 = null;
      try { temaSalvo2 = localStorage.getItem('missal-tema'); } catch (err) {}
      if (!temaSalvo2) {
        aplicarTema(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ── Modal Apoiar (PIX) ──────────────────────────────────
  var btnApoiar = document.getElementById('btnApoiar');
  var modalPix = document.getElementById('modalPix');
  var modalFechar = document.getElementById('modalFechar');
  var btnCopiar = document.getElementById('btnCopiar');
  var pixCodigo = document.getElementById('pixCodigo');

  function abrirModal() {
    modalPix.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
    modalPix.classList.remove('ativo');
    document.body.style.overflow = '';
    // Reset botão copiar
    btnCopiar.textContent = 'Copiar';
    btnCopiar.classList.remove('copiado');
  }

  btnApoiar.addEventListener('click', abrirModal);
  modalFechar.addEventListener('click', fecharModal);

  // Fechar ao clicar fora do modal
  modalPix.addEventListener('click', function (e) {
    if (e.target === modalPix) {
      fecharModal();
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalPix.classList.contains('ativo')) {
      fecharModal();
    }
  });

  // Copiar código PIX
  btnCopiar.addEventListener('click', function () {
    var codigo = pixCodigo.value;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codigo).then(function () {
        mostrarCopiado();
      }).catch(function () {
        copiarFallback(codigo);
      });
    } else {
      copiarFallback(codigo);
    }
  });

  function copiarFallback(texto) {
    pixCodigo.select();
    pixCodigo.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      mostrarCopiado();
    } catch (e) {
      // Silencioso
    }
  }

  function mostrarCopiado() {
    btnCopiar.textContent = 'Copiado!';
    btnCopiar.classList.add('copiado');
    setTimeout(function () {
      btnCopiar.textContent = 'Copiar';
      btnCopiar.classList.remove('copiado');
    }, 2500);
  }
})();
