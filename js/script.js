document.addEventListener('DOMContentLoaded', function() {
  var SECTIONS = ['home', 'projetos', 'about'];
  var htmlEl = document.documentElement;

  // THEME
  var tp = document.getElementById('tp');
  var tpOpen = document.getElementById('tp-toggle');
  var tpClose = document.getElementById('tp-close');

  function applyTheme(t, save) {
    htmlEl.setAttribute('data-theme', t);
    if (save) localStorage.setItem('theme', t);
    document.querySelectorAll('.tp-item').forEach(function(it) {
      var b = it.querySelector('[data-theme]');
      it.classList.toggle('is-active', !!b && b.getAttribute('data-theme') === t);
    });
  }

  tpOpen.addEventListener('click', function() {
    tp.classList.toggle('is-open');
  });

  tpClose.addEventListener('click', function() {
    tp.classList.remove('is-open');
  });

  document.querySelectorAll('.tp-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      applyTheme(b.getAttribute('data-theme'), true);
    });
  });

  applyTheme(localStorage.getItem('theme') || 'default', false);

  // NAVIGATION
  function showSection(id) {
    SECTIONS.forEach(function(s) {
      var el = document.getElementById(s);
      if (!el) return;
      if (s === id) {
        el.removeAttribute('hidden');
        el.classList.add('fade-in');
        el.addEventListener('animationend', function() {
          el.classList.remove('fade-in');
        }, { once: true });
      } else {
        el.setAttribute('hidden', '');
      }
      var ni = document.getElementById('ni-' + s);
      if (ni) ni.classList.toggle('active', s === id);
    });
  }

  function navigate(id) {
    if (!SECTIONS.includes(id)) id = 'home';
    resetProjects();
    showSection(id);
    history.pushState({ section: id }, '', '#' + id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeNav();
  }

  // PROJECTS
  function resetProjects() {
    var list = document.getElementById('proj-list');
    if (list) list.removeAttribute('hidden');
    ['portal', 'studybuddy'].forEach(function(id) {
      var el = document.getElementById('det-' + id);
      if (el) el.setAttribute('hidden', '');
    });
  }

  function openProject(id) {
    var list = document.getElementById('proj-list');
    if (list) list.setAttribute('hidden', '');
    var det = document.getElementById('det-' + id);
    if (!det) return;
    det.removeAttribute('hidden');
    det.classList.add('fade-in');
    det.addEventListener('animationend', function() {
      det.classList.remove('fade-in');
    }, { once: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // LIGHTBOX
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');

  function openLb(src, alt) {
    lbImg.src = src;
    lbCap.textContent = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLb();
  });

  // MOBILE NAV
  var navEl = document.getElementById('main-nav');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function openNav() {
    navEl.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
    navMenu.classList.add('open');
  }

  function closeNav() {
    navEl.classList.remove('nav-open');
    document.body.style.overflow = '';
    navMenu.classList.remove('open');
  }

  navToggle.addEventListener('click', function() {
    navEl.classList.contains('nav-open') ? closeNav() : openNav();
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth >= 940) closeNav();
  });

  // EVENT DELEGATION
  document.addEventListener('click', function(e) {
    var lbTrigger = e.target.closest('[data-action="lb"]');
    if (lbTrigger) {
      openLb(lbTrigger.src, lbTrigger.alt);
      return;
    }

    var projEl = e.target.closest('[data-action="proj"]');
    if (projEl) {
      e.preventDefault();
      var projId = projEl.getAttribute('data-proj');
      if (document.getElementById('projetos').hasAttribute('hidden')) {
        showSection('projetos');
        history.pushState({ section: 'projetos' }, '', '#projetos');
      }
      openProject(projId);
      return;
    }

    if (e.target.closest('[data-action="back"]')) {
      resetProjects();
      window.scrollTo({ top: 0 });
      return;
    }

    var navEl2 = e.target.closest('[data-section]');
    if (navEl2) {
      e.preventDefault();
      navigate(navEl2.getAttribute('data-section'));
    }
  });

  // KEYBOARD
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    if (lb.classList.contains('open')) {
      closeLb();
      return;
    }
    if (tp.classList.contains('is-open')) {
      tp.classList.remove('is-open');
      return;
    }
    if (navEl.classList.contains('nav-open')) closeNav();
  });

  // POPSTATE
  window.addEventListener('popstate', function(e) {
    navigate(e.state && e.state.section ? e.state.section : 'home');
  });

  // INIT
  var hash = location.hash.replace('#', '');
  navigate(SECTIONS.includes(hash) ? hash : 'home');
});