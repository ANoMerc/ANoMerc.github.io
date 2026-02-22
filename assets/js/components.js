const ComponentLoader = {
  basePath: '',
  cache: new Map(),
  
  detectBasePath() {
    const path = window.location.pathname;
    if (path.includes('/resume/pages/')) {
      this.basePath = '../../components/';
    } else if (path.includes('/resume/')) {
      this.basePath = '../components/';
    } else {
      this.basePath = 'components/';
    }
  },
  
  async load(selector, componentName, replacePaths = true) {
    try {
      if (this.cache.has(componentName)) {
        document.querySelector(selector).innerHTML = this.cache.get(componentName);
        return;
      }
      const url = this.basePath + componentName;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let html = await response.text();
      if (replacePaths) {
        const rootPath = this.basePath.replace('components/', '');
        html = html.replace(/{{ROOT}}/g, rootPath);
      }
      
      this.cache.set(componentName, html);
      document.querySelector(selector).innerHTML = html;
    } catch (error) {
      console.error(`Failed to load ${componentName}:`, error);
    }
  },
  
  async loadAll() {
    this.detectBasePath();
    await Promise.all([
      this.load('#cursor-container', 'cursor.html'),
      this.load('#header-container', 'header.html'),
      this.load('#footer-container', 'footer.html'),
      this.load('#theme-toggle-container', 'theme-toggle.html')
    ]);
    if (typeof AppInit === 'function') AppInit();
  },
  
  async loadForResume() {
    this.detectBasePath();
    await Promise.all([
      this.load('#cursor-container', 'cursor.html'),
      this.load('#header-container', 'header.html'),
      this.load('#footer-container', 'footer.html'),
      this.load('#theme-toggle-container', 'theme-toggle.html'),
      this.load('#contacts-container', 'contacts.html')
    ]);
    if (typeof AppInit === 'function') AppInit();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const isResumePage = window.location.pathname.includes('/resume/');
  if (isResumePage) {
    ComponentLoader.loadForResume();
  } else {
    ComponentLoader.loadAll();
  }
});
