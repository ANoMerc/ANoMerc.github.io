/* ════════════════════════════════════════════════════════════════════════════
   ProjectWB — App JavaScript v2.0
   Основная логика: курсор, тема, навигация, анимации, доступность
   ════════════════════════════════════════════════════════════════════════════ */

function AppInit() {
  initCursor();
  initTheme();
  initNav();
  initAnimations();
  initCVPlaceholder();
  initAccessibility();
}

/* ── 1. КАСТОМНЫЙ КУРСОР ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  
  // Проверка: мышь + большой экран + не упрощённый режим
  const isMouseDevice = window.matchMedia('(pointer: fine)').matches;
  const isLargeScreen = window.matchMedia('(min-width: 601px)').matches;
  const accessibilitySettings = JSON.parse(localStorage.getItem('accessibility') || '{}');
  
  if (!cursor || !ring || !isMouseDevice || !isLargeScreen || accessibilitySettings.disableCustomCursor) {
    return;
  }
  
  document.body.classList.add('has-custom-cursor');
  
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });
  
  (function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
  
  // Делегирование событий для интерактивных элементов
  const clickableSelectors = [
    'a', 'button', '[role="button"]', '.selector-card', '.contact-block',
    '.btn-primary', '.btn-ghost', '.theme-toggle', 'input[type="submit"]', '.card'
  ];
  
  document.querySelectorAll(clickableSelectors.join(', ')).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });
}

/* ── 2. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ── */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  if (!html) return;
  
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  applyTheme(getInitialTheme());
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }
}

/* ── 3. НАВИГАЦИЯ (СКРОЛЛ-ЭФФЕКТ) ── */
function initNav() {
  const nav = document.getElementById('nav');
  
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
}

/* ── 4. АНИМАЦИИ (INTERSECTION OBSERVER) ── */
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4 * 0.08) + 's';
    observer.observe(el);
  });
}

/* ── 5. ЗАГЛУШКА CV ── */
function initCVPlaceholder() {
  document.querySelectorAll('a[href*="cv.pdf"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('⚠️ Резюме в разработке\n\nФайл CV будет доступен в ближайшее время. Пожалуйста, свяжитесь через Telegram или Email для получения актуальной версии.');
    });
  });
}

/* ── 6. НАСТРОЙКИ ДОСТУПНОСТИ ── */
function initAccessibility() {
  const settings = JSON.parse(localStorage.getItem('accessibility') || '{}');
  
  if (settings.simplifiedTheme) {
    document.body.classList.add('simplified-mode');
  }
}

/* ── ANALYTICS: [PLACEHOLDER] ── */
/* Вставьте скрипты Яндекс.Метрики и Google Analytics здесь после инициализации */
