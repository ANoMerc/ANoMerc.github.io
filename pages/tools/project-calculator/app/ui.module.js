/**
════════════════════════════════════════════════════════════════════════════
NCOM UI Module v1.0
════════════════════════════════════════════════════════════════════════════
UI компоненты:
- Кастомный курсор
- Скролл-эффекты навигации
- Анимации reveal
*/

const UIModule = (() => {
  
  const init = () => {
    initCursor();
    initScroll();
    initReveal();
  };

  // Кастомный курсор
  const initCursor = () => {
    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const loop = () => {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    };
    loop();

    const grow   = () => { dot.style.width = '14px'; dot.style.height = '14px'; ring.style.width = '48px'; ring.style.height = '48px'; };
    const shrink = () => { dot.style.width =  '8px'; dot.style.height =  '8px'; ring.style.width = '32px'; ring.style.height = '32px'; };

    const attachHover = () => {
      document.querySelectorAll('a, button, select, input, .accordion-header, .checkbox-item, .artifact-item, .team-role-item').forEach(el => {
        if (el._hoverBound) return;
        el._hoverBound = true;
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    };

    attachHover();
    new MutationObserver(attachHover).observe(document.body, { childList: true, subtree: true });
  };

  // Скролл-эффекты навигации
  const initScroll = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
  };

  // Анимации reveal
  const initReveal = () => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 4 * 0.08) + 's';
      obs.observe(el);
    });
  };

  return { init };
})();

// Экспорт для совместимости
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIModule };
}
