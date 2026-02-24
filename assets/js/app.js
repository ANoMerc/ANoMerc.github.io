/* ════════════════════════════════════════════════════════════════════════════
   ProjectWB — App JavaScript v3.1
   Исправления: синтаксис &&, =>, загрузка контента
   ════════════════════════════════════════════════════════════════════════════ */

function AppInit() {
  initCursor();
  initTheme();
  initNav();
  initAnimations();
  loadContent(); // ← Загрузка данных из JSON
}

/* ── 1. КУРСОР ────────────────────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  
  const isMouseDevice = window.matchMedia('(pointer: fine)').matches;
  const isLargeScreen = window.matchMedia('(min-width: 601px)').matches;
  const isInIframe = (window.location !== window.parent.location);
  
  if (!cursor || !ring || !isMouseDevice || !isLargeScreen || isInIframe) {
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

/* ── 2. ТЕМА ──────────────────────────────────────────────────────────────── */
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
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

/* ── 3. НАВИГАЦИЯ ─────────────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
}

/* ── 4. АНИМАЦИИ ──────────────────────────────────────────────────────────── */
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

/* ── 5. ЗАГРУЗКА КОНТЕНТА (FIX: BUG-001, BUG-005) ────────────────────────── */
async function loadContent() {
  try {
    let jsonPath = 'data/content.json';
    if (window.location.pathname.includes('/pages/')) {
      jsonPath = '../../data/content.json';
    } else if (window.location.pathname.includes('/tools/')) {
      jsonPath = '../../../data/content.json';
    }
    
    const response = await fetch(jsonPath);
    const data = await response.json();
    
    // Рендеринг карточек аудитории
    const selectorGrid = document.getElementById('audienceSelector');
    if (selectorGrid && data.audiences) {
      selectorGrid.innerHTML = data.audiences.map(audience => `
        <a href="${audience.link}" class="selector-card" data-mode="${audience.id}">
          <div class="card-number">${audience.number} // ${audience.title}</div>
          <div class="card-content">
            <div class="card-title">${audience.cardTitle}</div>
            <div class="card-meta">
              <span>${audience.time}</span>
              <span>${audience.focus}</span>
            </div>
          </div>
          <div class="card-arrow">→</div>
        </a>
      `).join('');
    }
    
    // Рендеринг контактов
    const contactsGrid = document.getElementById('contactsGrid');
    if (contactsGrid && data.contacts) {
      contactsGrid.innerHTML = data.contacts.map(contact => {
        const isCV = contact.type === 'cv';
        const clickHandler = isCV ? 'onclick="event.preventDefault(); alert(\'⚠️ Резюме в разработке\');"' : '';
        return `
          <a href="${contact.link}" class="contact-block" ${isCV ? clickHandler : ''} target="${isCV ? '_self' : '_blank'}" rel="noopener noreferrer">
            <span class="contact-icon">${contact.icon}</span>
            <span class="contact-label">${contact.label}</span>
            <span class="contact-value">${contact.value}</span>
          </a>
        `;
      }).join('');
    }
    
    // Обновление версии
    const versionEl = document.getElementById('version');
    if (versionEl) versionEl.textContent = data.version;
    
  } catch (error) {
    console.error('Ошибка загрузки content.json:', error);
  }
}

/* ── ANALYTICS: [PLACEHOLDER] ── */
/* Вставьте скрипты Яндекс.Метрики и Google Analytics здесь после инициализации */
