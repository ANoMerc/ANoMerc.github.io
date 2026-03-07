const Cursor = {
  mx: 0, my: 0, rx: 0, ry: 0,
  cursor: null, ring: null,

  init() {
    if (Utils.isTouch()) return;

    this.cursor = document.getElementById('cursor');
    this.ring = document.getElementById('cursor-ring');
    if (!this.cursor || !this.ring) return;

    document.addEventListener('mousemove', e => {
      this.mx = e.clientX;
      this.my = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      if (this.cursor) this.cursor.style.opacity = '0';
      if (this.ring) this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (this.cursor) this.cursor.style.opacity = '1';
      if (this.ring) this.ring.style.opacity = '1';
    });

    this.animate();
    this.bindHoverEffects();
  },

  animate() {
    if (this.cursor) {
      this.cursor.style.left = this.mx + 'px';
      this.cursor.style.top = this.my + 'px';
    }
    if (this.ring) {
      this.rx += (this.mx - this.rx) * 0.13;
      this.ry += (this.my - this.ry) * 0.13;
      this.ring.style.left = this.rx + 'px';
      this.ring.style.top = this.ry + 'px';
    }
    requestAnimationFrame(() => this.animate());
  },

  bindHoverEffects() {
    const sel = 'a, button, .card, .contact-block, .selector-card, .nav-links a, .case-card, .tool-card, .filter-btn, .pain-card, .metric-card, .principle-card, .arch-layer, .risk-item';
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor?.classList.add('hovered');
        this.ring?.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor?.classList.remove('hovered');
        this.ring?.classList.remove('hovered');
      });
    });
  },

  rebind() {
    this.bindHoverEffects();
  }
};

const Theme = {
  init() {
    const html = document.documentElement;
    if (!html) return;

    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (systemDark ? 'dark' : 'light');
    this.apply(initial);

    document.addEventListener('click', e => {
      if (e.target.closest('#theme-toggle')) {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.apply(next);
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.classList.toggle('active', theme === 'light');
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
    }
  }
};

const Nav = {
  init() {
    const onScroll = Utils.throttle(() => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    }, 16);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
};
