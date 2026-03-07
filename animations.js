const Animations = {
  observer: null,

  config: {
    threshold: 0.08,
    delayStep: 0.08
  },

  init() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: this.config.threshold });

    this.observeAll();
  },

  observeAll() {
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 5 * this.config.delayStep) + 's';
      this.observer.observe(el);
    });
  },

  fadeIn(el, duration = 300) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    });
  },

  slideUp(el, duration = 400) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }
};
