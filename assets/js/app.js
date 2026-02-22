function AppInit() {
  initCursor();
  initTheme();
  initNav();
}

function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  
  // Проверяем поддержку мыши (не мобильное устройство)
  const isMouseDevice = window.matchMedia('(pointer: fine)').matches;
  const isLargeScreen = window.matchMedia('(min-width: 601px)').matches;
  
  if (!cursor || !ring || !isMouseDevice || !isLargeScreen) {
    // Не активируем кастомный курсор на мобильных
    return;
  }
  
  // Добавляем класс для скрытия стандартного курсора
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

  // Определяем все кликабельные элементы
  const clickableSelectors = [
    'a',
    'button',
    '[role="button"]',
    '.selector-card',
    '.contact-block',
    '.btn-primary',
    '.btn-ghost',
    '.theme-toggle',
    'input[type="submit"]',
    '.card'
  ];

  const clickableElements = document.querySelectorAll(clickableSelectors.join(', '));

  clickableElements.forEach(el => {
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

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!html) return;
  
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  const saved = localStorage.getItem('theme');
  const initial = (saved === 'light' || saved === 'dark') ? saved : 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
}
