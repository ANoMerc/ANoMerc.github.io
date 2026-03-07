const Components = {
  templates: {
    header: (rootPath = '') => `
      <nav id="nav" class="nav" role="navigation" aria-label="Основная навигация">
        <a href="${rootPath}index.html" class="nav-logo" aria-label="ProjectWB — на главную">Project<span>WB»</span></a>
        <ul class="nav-links" role="list">
          <li><a href="${rootPath}#tools">Инструменты</a></li>
          <li><a href="${rootPath}#cases">Задания</a></li>
          <li><a href="${rootPath}#knowledge-base">База знаний</a></li>
          <li><a href="${rootPath}#calculator">Калькулятор</a></li>
        </ul>
        <div id="theme-toggle-container"></div>
        <button class="nav-cta" id="contact-cta-btn" type="button">Связаться →</button>
      </nav>
    `,
    footer: (rootPath = '') => `
      <footer class="footer" role="contentinfo">
        <div class="footer-logo">Project<span>WB»</span></div>
        <div class="footer-meta font-mono">ProjectWB · v2.0 · 2026</div>
        <div class="footer-license font-mono">
          <a href="${rootPath}index.html">← Главная</a> · <span>MIT License</span>
        </div>
      </footer>
    `,
    contacts: () => `
      <section id="contacts" class="contacts-section" aria-label="Контакты">
        <div class="container">
          <div class="section-tag">◆ Контакты</div>
          <div class="contacts-grid">
            <a href="mailto:georgijmasnikov418@gmail.com" class="contact-block" aria-label="Написать письмо">
              <span class="contact-icon" aria-hidden="true">✉</span>
              <span class="contact-label">Email</span>
              <span class="contact-value">georgijmasnikov418@gmail.com</span>
            </a>
            <a href="https://t.me/a5dfo" class="contact-block" target="_blank" rel="noopener noreferrer" aria-label="Telegram (открывается в новой вкладке)">
              <span class="contact-icon" aria-hidden="true">✈</span>
              <span class="contact-label">Telegram</span>
              <span class="contact-value">@a5dfo</span>
            </a>
            <a href="https://www.linkedin.com/in/george-myasnikov-55520b388" class="contact-block" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (открывается в новой вкладке)">
              <span class="contact-icon" aria-hidden="true">in</span>
              <span class="contact-label">LinkedIn</span>
              <span class="contact-value">Profile</span>
            </a>
            <a href="https://github.com/ANoMerc" class="contact-block" target="_blank" rel="noopener noreferrer" aria-label="GitHub (открывается в новой вкладке)">
              <span class="contact-icon" aria-hidden="true">⌘</span>
              <span class="contact-label">GitHub</span>
              <span class="contact-value">ANoMerc</span>
            </a>
            <button class="contact-block" id="cv-download" aria-label="Скачать CV">
              <span class="contact-icon" aria-hidden="true">⬇</span>
              <span class="contact-label">CV</span>
              <span class="contact-value">PDF</span>
            </button>
          </div>
        </div>
      </section>
    `,
    cursor: `
      <div id="cursor" class="cursor" aria-hidden="true"></div>
      <div id="cursor-ring" class="cursor-ring" aria-hidden="true"></div>
    `,
    themeToggle: `
      <button id="theme-toggle" class="theme-toggle" aria-label="Переключить тему" type="button">
        <span class="theme-icon sun" aria-hidden="true">☀</span>
        <span class="theme-icon moon" aria-hidden="true">☾</span>
      </button>
    `
  },

  render(componentName, containerSelector, options = {}) {
    const template = this.templates[componentName];
    if (!template) {
      console.warn(`Component "${componentName}" not found`);
      return;
    }
    const html = typeof template === 'function'
      ? template(options.rootPath || '')
      : template;
    const container = document.querySelector(containerSelector);
    if (container) container.innerHTML = html;
  },

  renderAll(options = {}) {
    this.render('cursor', '#cursor-container');
    this.render('header', '#header-container', options);
    this.render('footer', '#footer-container', options);
    this.render('themeToggle', '#theme-toggle-container');
  },

  renderContacts() {
    const container = document.querySelector('#contacts-container');
    if (container) {
      const html = typeof this.templates.contacts === 'function'
        ? this.templates.contacts()
        : this.templates.contacts;
      container.innerHTML = html;
      const cvBtn = document.getElementById('cv-download');
      if (cvBtn) {
        cvBtn.addEventListener('click', () => {
          alert('CV доступен по запросу: ' + Content.contacts.email);
        });
      }
    }
  }
};
