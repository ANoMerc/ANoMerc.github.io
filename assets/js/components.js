/* ════════════════════════════════════════════════════════════════════════════
   ProjectWB — Component Loader v2.0
   Динамическая загрузка HTML-компонентов (header, footer, cursor, theme-toggle)
   ════════════════════════════════════════════════════════════════════════════ */

const ComponentLoader = {
  // Базовый путь к компонентам
  basePath: 'components/',
  
  // Кэш загруженных компонентов
  cache: new Map(),
  
  /**
   * Определяет базовый путь на основе текущей страницы
   */
  detectBasePath() {
    const path = window.location.pathname;
    
    // Определяем глубину вложенности для относительных путей
    if (path.includes('/pages/resume-pages/') || 
        path.includes('/pages/cases/') || 
        path.includes('/pages/knowledge-base/') ||
        path.includes('/pages/community/') ||
        path.includes('/pages/tools/')) {
      this.basePath = '../../components/';
    } else if (path.includes('/pages/')) {
      this.basePath = '../components/';
    } else {
      this.basePath = 'components/';
    }
  },
  
  /**
   * Загружает компонент и вставляет в указанный селектор
   * @param {string} selector - CSS селектор контейнера
   * @param {string} componentName - Имя файла компонента
   * @param {boolean} replacePaths - Заменять {{ROOT}} на правильный путь
   */
  async load(selector, componentName, replacePaths = true) {
    try {
      // Проверка кэша
      if (this.cache.has(componentName)) {
        document.querySelector(selector).innerHTML = this.cache.get(componentName);
        return;
      }
      
      const url = this.basePath + componentName;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      let html = await response.text();
      
      // Замена {{ROOT}} на правильный относительный путь
      if (replacePaths) {
        const rootPath = this.basePath.replace('components/', '');
        html = html.replace(/{{ROOT}}/g, rootPath);
      }
      
      this.cache.set(componentName, html);
      document.querySelector(selector).innerHTML = html;
    } catch (error) {
      console.error(`✗ Failed to load ${componentName}:`, error);
      
      // Fallback: показать ошибку в контейнере
      const container = document.querySelector(selector);
      if (container) {
        container.innerHTML = `<div class="component-error">Failed to load: ${componentName}</div>`;
      }
    }
  },
  
  /**
   * Загружает все стандартные компоненты
   */
  async loadAll() {
    this.detectBasePath();
    
    await Promise.all([
      this.load('#cursor-container', 'cursor.html'),
      this.load('#header-container', 'header.html'),
      this.load('#footer-container', 'footer.html'),
      this.load('#theme-toggle-container', 'theme-toggle.html')
    ]);
    
    // После загрузки компонентов — инициализировать app.js
    if (typeof AppInit === 'function') {
      AppInit();
    }
  },
  
  /**
   * Загружает компоненты для страниц резюме (с контактами)
   */
  async loadForResume() {
    this.detectBasePath();
    
    await Promise.all([
      this.load('#cursor-container', 'cursor.html'),
      this.load('#header-container', 'header.html'),
      this.load('#footer-container', 'footer.html'),
      this.load('#theme-toggle-container', 'theme-toggle.html'),
      this.load('#contacts-container', 'contacts.html')
    ]);
    
    if (typeof AppInit === 'function') {
      AppInit();
    }
  },
  
  /**
   * Очищает кэш (для разработки)
   */
  clearCache() {
    this.cache.clear();
  }
};

/* ── АВТОЗАГРУЗКА ── */
document.addEventListener('DOMContentLoaded', () => {
  const isResumePage = window.location.pathname.includes('/resume-pages/');
  
  if (isResumePage) {
    ComponentLoader.loadForResume();
  } else {
    ComponentLoader.loadAll();
  }
});
