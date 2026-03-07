const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
  },

  uid(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
