// ─── KNOWLEDGE BASE MODULE ────────────────────────────────────────────────────

const KB_STORAGE_KEY = 'projectwb-kb-v1';

const KB_DEFAULT = [
  {
    id: 'rice',
    title: 'RICE-приоритизация',
    category: 'frameworks',
    excerpt: 'Метод оценки задач по четырём критериям: охват, влияние, уверенность и трудозатраты.',
    content: `<h3>Что такое RICE?</h3><p>RICE — фреймворк приоритизации фич от команды Intercom. Помогает объективно сравнивать задачи с разными характеристиками.</p><h3>Формула</h3><p><strong>RICE Score = (Reach × Impact × Confidence) / Effort</strong></p><ul><li><strong>Reach</strong> — сколько пользователей затронет фича за период</li><li><strong>Impact</strong> — насколько сильно повлияет: 3 = огромное, 2 = высокое, 1 = среднее, 0.5 = низкое</li><li><strong>Confidence</strong> — уверенность: 100% высокая, 80% средняя, 50% низкая</li><li><strong>Effort</strong> — человеко-месяцы на реализацию</li></ul><h3>Когда применять</h3><p>При большом бэклоге, когда нужно объяснить стейкхолдерам логику приоритетов. Не подходит для срочных или регуляторных задач.</p>`,
    tags: ['приоритизация', 'бэклог', 'фреймворк'],
  },
  {
    id: 'nsm',
    title: 'North Star Metric',
    category: 'metrics',
    excerpt: 'Единственная ключевая метрика, отражающая ценность продукта для пользователей и связанная с бизнес-ростом.',
    content: `<h3>Определение</h3><p>NSM — это одна метрика, которая наилучшим образом отражает ценность, создаваемую продуктом. Стоит на пересечении пользы для клиента и дохода компании.</p><h3>Примеры NSM</h3><ul><li><strong>Airbnb</strong> — количество забронированных ночей</li><li><strong>Spotify</strong> — время прослушивания</li><li><strong>Slack</strong> — количество сообщений между командами</li></ul><h3>Как выбрать NSM</h3><p>Хорошая NSM отвечает трём критериям: отражает <strong>ценность для пользователя</strong>, коррелирует с <strong>монетизацией</strong>, и на неё влияет вся <strong>команда продукта</strong>.</p>`,
    tags: ['метрики', 'рост', 'стратегия'],
  },
  {
    id: 'jtbd',
    title: 'Jobs To Be Done',
    category: 'frameworks',
    excerpt: 'Теория, объясняющая, почему люди "нанимают" продукт для выполнения определённой работы в своей жизни.',
    content: `<h3>Суть теории</h3><p>JTBD — фреймворк Клейтона Кристенсена. Люди не покупают продукты — они нанимают их для выполнения «работы».</p><h3>Три типа работ</h3><ul><li><strong>Функциональные</strong> — практическая задача (добраться до офиса)</li><li><strong>Эмоциональные</strong> — нужное чувство (чувствовать себя организованным)</li><li><strong>Социальные</strong> — образ в глазах других (казаться успешным)</li></ul><h3>Job Story</h3><p><strong>Когда</strong> [ситуация], <strong>я хочу</strong> [мотивация], <strong>чтобы</strong> [результат]</p>`,
    tags: ['исследования', 'пользователи', 'фреймворк'],
  },
  {
    id: 'okr',
    title: 'OKR (Objectives & Key Results)',
    category: 'processes',
    excerpt: 'Система целеполагания, связывающая амбициозные задачи с измеримыми результатами на всех уровнях компании.',
    content: `<h3>Структура OKR</h3><p><strong>Objective</strong> — вдохновляющая, качественная цель. «Стать лучшим мобильным банком страны».</p><p><strong>Key Results</strong> — 3–5 измеримых результатов. Отвечают на вопрос: как мы поймём, что достигли цели?</p><h3>Правила хороших KR</h3><ul><li>Конкретные и измеримые (числа, проценты)</li><li>Амбициозные, но достижимые (60–70% выполнения — норма)</li><li>Описывают результат, не задачи</li></ul><h3>Каденция</h3><p>Квартальные OKR. Еженедельные чекины по прогрессу. Итоговая оценка от 0.0 до 1.0.</p>`,
    tags: ['цели', 'планирование', 'команда'],
  },
  {
    id: 'cjm',
    title: 'Customer Journey Map',
    category: 'processes',
    excerpt: 'Визуализация опыта пользователя: от первого контакта до достижения цели, включая боли и эмоции.',
    content: `<h3>Что такое CJM?</h3><p>Customer Journey Map описывает весь путь пользователя: точки контакта, действия, мысли, эмоции и барьеры на каждом этапе.</p><h3>Ключевые элементы</h3><ul><li><strong>Персонаж</strong> — пользователь с целью и контекстом</li><li><strong>Этапы</strong> — осознание → изучение → покупка → использование</li><li><strong>Pain points</strong> — проблемы и барьеры</li><li><strong>Возможности</strong> — идеи для улучшения</li></ul><h3>Когда использовать</h3><p>При запуске продукта, перед редизайном, для выявления узких мест в онбординге.</p>`,
    tags: ['UX', 'исследования', 'пользователи'],
  },
  {
    id: 'pmf',
    title: 'Product-Market Fit',
    category: 'terms',
    excerpt: 'Момент, когда продукт органично решает реальную потребность достаточно большого рынка.',
    content: `<h3>Определение</h3><p>PMF — состояние, при котором продукт нашёл свою аудиторию и решает её проблему настолько хорошо, что начинается органический рост. Термин ввёл Марк Андрессен.</p><h3>Как измерить</h3><ul><li><strong>Тест Шона Эллиса</strong>: если >40% отвечают «очень расстроен» при потере продукта — PMF достигнут</li><li><strong>NPS</strong> > 50 как косвенный индикатор</li><li><strong>Retention</strong> — пользователи возвращаются без напоминаний</li></ul><h3>До и после PMF</h3><p>До PMF — фокус на обучении и итерациях. После PMF — масштабирование. Скейлить без PMF = сжигать деньги.</p>`,
    tags: ['стратегия', 'рост', 'стартап'],
  },
  {
    id: 'ncom',
    title: 'Методология ProjectWB',
    category: 'frameworks',
    excerpt: 'Авторская модель управления проектами: «чёрный ящик» как система входов, процессов и выходов.',
    content: `<h3>Суть ProjectWB</h3><p>ProjectWB рассматривает проект как систему с тремя компонентами: <strong>входы</strong> (ресурсы, требования, контекст), <strong>процессы</strong> (трансформация) и <strong>выходы</strong> (результат, артефакты, ценность).</p><h3>Ключевые принципы</h3><ul><li>Системное мышление вместо списка задач</li><li>Явное моделирование неопределённости</li><li>Прозрачность метрик для всех стейкхолдеров</li><li>Итеративная коррекция на основе данных</li></ul><h3>Инструменты ProjectWB</h3><p>Конструктор проектов (WBS + RACI + Risk Matrix) и Экосистема ПМ (единая панель интеграций).</p>`,
    tags: ['ncom', 'методология', 'фреймворк'],
  },
  {
    id: 'agile',
    title: 'Agile / Scrum',
    category: 'processes',
    excerpt: 'Итеративный подход к разработке продукта с фиксированными спринтами, церемониями и ролями.',
    content: `<h3>Scrum в двух словах</h3><p>Работа делится на <strong>спринты</strong> (1–4 недели), каждый из которых заканчивается рабочим инкрементом.</p><h3>Роли</h3><ul><li><strong>Product Owner</strong> — отвечает за бэклог и ценность</li><li><strong>Scrum Master</strong> — помогает команде, убирает препятствия</li><li><strong>Dev Team</strong> — самоорганизующаяся команда</li></ul><h3>Церемонии</h3><ul><li><strong>Sprint Planning</strong> — планирование на спринт</li><li><strong>Daily Standup</strong> — 15-минутная синхронизация</li><li><strong>Sprint Review</strong> — демо стейкхолдерам</li><li><strong>Retrospective</strong> — улучшение процесса</li></ul>`,
    tags: ['agile', 'разработка', 'команда'],
  },
];

const KB_CATEGORIES = {
  all: 'Все',
  frameworks: 'Фреймворки',
  metrics: 'Метрики',
  processes: 'Процессы',
  tools: 'Инструменты',
  terms: 'Термины',
};

const KnowledgeBase = {
  // ── Data layer ────────────────────────────────────────────────────────────

  load() {
    try {
      const raw = localStorage.getItem(KB_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [...KB_DEFAULT];
    } catch { return [...KB_DEFAULT]; }
  },

  save(entries) {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(entries));
  },

  getAll() { return this.load(); },

  getById(id) { return this.load().find(e => e.id === id) || null; },

  create(entry) {
    const entries = this.load();
    entry.id = 'kb_' + Date.now();
    entry.createdAt = new Date().toISOString();
    entries.unshift(entry);
    this.save(entries);
    return entry;
  },

  update(id, patch) {
    const entries = this.load();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    entries[idx] = { ...entries[idx], ...patch, updatedAt: new Date().toISOString() };
    this.save(entries);
    return true;
  },

  delete(id) {
    const entries = this.load().filter(e => e.id !== id);
    this.save(entries);
  },

  // ── Public KB Page ────────────────────────────────────────────────────────

  renderPage() {
    const entries = this.getAll();
    const cats = Object.entries(KB_CATEGORIES);

    const catBtns = cats.map(([k, v]) => `
      <button class="filter-btn kb-cat-btn ${k === 'all' ? 'active' : ''}"
              data-kb-cat="${k}" type="button">${v}</button>
    `).join('');

    const cards = entries.map(e => this._renderCard(e)).join('');

    return `
      <section class="page-hero">
        <div class="section-tag">◆ База знаний</div>
        <h1 class="font-display reveal">Знания ПМ.<br>Всё в одном месте.</h1>
        <p class="hero-desc reveal">Фреймворки, метрики, процессы и термины — кликните на любую запись для подробного описания.</p>
      </section>

      <section class="cases-filters" aria-label="Фильтры базы знаний">
        <div class="kb-search-row">
          <div class="filter-group">${catBtns}</div>
          <div class="kb-search-wrap">
            <input class="kb-search-input font-mono" id="kb-search"
                   placeholder="Поиск..." autocomplete="off" type="search">
          </div>
        </div>
      </section>

      <section class="cases-grid kb-grid" id="kb-grid" aria-label="База знаний">
        ${cards || '<p style="padding:40px 48px;color:var(--muted)">Записей не найдено</p>'}
      </section>

      <!-- ── Modal overlay ── -->
      <div id="kb-overlay" class="kb-overlay" role="dialog" aria-modal="true" aria-label="Статья базы знаний">
        <div id="kb-modal" class="kb-modal">
          <button class="kb-modal-close" id="kb-modal-close" aria-label="Закрыть" type="button">✕</button>
          <div id="kb-modal-inner"></div>
        </div>
      </div>

      <div id="contacts-container"></div>
    `;
  },

  _renderCard(e) {
    const tagsHtml = (e.tags || []).slice(0, 3).map(t =>
      `<span class="tool-feature">${t}</span>`
    ).join('');
    return `
      <article class="case-card kb-entry-card reveal"
               data-kb-id="${e.id}" tabindex="0"
               role="button" aria-label="Открыть: ${e.title}">
        <div class="case-tag">${KB_CATEGORIES[e.category] || e.category}</div>
        <h3 class="case-title">${e.title}</h3>
        <p class="pain-desc">${e.excerpt}</p>
        <div class="tool-features" style="margin-top:auto;padding-top:16px">${tagsHtml}</div>
      </article>
    `;
  },

  _renderModalContent(e) {
    return `
      <div class="kb-modal-meta">
        <span class="section-tag" style="margin:0">${KB_CATEGORIES[e.category] || e.category}</span>
      </div>
      <h2 class="kb-modal-title font-display">${e.title}</h2>
      <p class="kb-modal-excerpt">${e.excerpt}</p>
      <div class="kb-modal-divider"></div>
      <div class="kb-modal-body">${e.content}</div>
      <div class="kb-modal-tags">
        ${(e.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>
    `;
  },

  openModal(id) {
    const e = this.getById(id);
    if (!e) return;
    const overlay = document.getElementById('kb-overlay');
    const inner = document.getElementById('kb-modal-inner');
    if (!overlay || !inner) return;
    inner.innerHTML = this._renderModalContent(e);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('kb-modal')?.focus();
  },

  closeModal() {
    const overlay = document.getElementById('kb-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  initPage() {
    // Card clicks
    document.querySelectorAll('.kb-entry-card').forEach(card => {
      card.addEventListener('click', () => this.openModal(card.dataset.kbId));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openModal(card.dataset.kbId); }
      });
    });

    // Close modal
    document.getElementById('kb-modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('kb-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'kb-overlay') this.closeModal();
    });

    // Category filters
    document.querySelectorAll('.kb-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.kb-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._filterGrid(btn.dataset.kbCat, document.getElementById('kb-search')?.value || '');
      });
    });

    // Search
    document.getElementById('kb-search')?.addEventListener('input', e => {
      const active = document.querySelector('.kb-cat-btn.active');
      this._filterGrid(active?.dataset.kbCat || 'all', e.target.value);
    });
  },

  _filterGrid(cat, query) {
    const q = query.toLowerCase().trim();
    const entries = this.getAll().filter(e => {
      const matchCat = cat === 'all' || e.category === cat;
      const matchQ = !q ||
        e.title.toLowerCase().includes(q) ||
        e.excerpt.toLowerCase().includes(q) ||
        (e.tags || []).some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
    const grid = document.getElementById('kb-grid');
    if (grid) {
      grid.innerHTML = entries.length
        ? entries.map(e => this._renderCard(e)).join('')
        : '<p style="padding:40px 48px;color:var(--muted)">Ничего не найдено</p>';
      grid.querySelectorAll('.kb-entry-card').forEach(card => {
        card.addEventListener('click', () => this.openModal(card.dataset.kbId));
        card.addEventListener('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.openModal(card.dataset.kbId); }
        });
      });
      Animations.init();
      if (!Utils.isTouch()) Cursor.rebind();
    }
  },

  // ── Admin Panel ───────────────────────────────────────────────────────────

  renderAdmin() {
    const entries = this.getAll();
    const rows = entries.map(e => `
      <div class="admin-row reveal" data-admin-id="${e.id}">
        <div class="admin-row-main">
          <span class="admin-row-cat font-mono">${KB_CATEGORIES[e.category] || e.category}</span>
          <span class="admin-row-title">${e.title}</span>
          <div class="admin-row-tags">
            ${(e.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="admin-row-actions">
          <button class="btn-ghost admin-edit-btn" data-id="${e.id}" type="button">Изменить</button>
          <button class="btn-ghost admin-del-btn" data-id="${e.id}" type="button" style="border-color:var(--accent3);color:var(--accent3)">Удалить</button>
        </div>
      </div>
    `).join('');

    return `
      <section class="cases-hero admin-hero">
        <div class="section-tag" style="color:var(--accent3)">◆ Панель администратора</div>
        <h1 class="font-display reveal">База знаний.<br>Управление.</h1>
        <p class="hero-desc reveal font-mono" style="font-size:11px">Доступ только по прямой ссылке · <a href="#knowledge-base" style="color:var(--accent)">← Открытая версия</a></p>
      </section>

      <section class="cases-filters">
        <div class="admin-topbar">
          <span class="font-mono" style="font-size:11px;color:var(--muted)">Записей: <strong style="color:var(--accent)">${entries.length}</strong></span>
          <button class="btn-primary" id="admin-new-btn" type="button">+ Добавить запись</button>
        </div>
      </section>

      <section style="max-width:1440px;margin:0 auto;padding:0">
        <div class="admin-list" id="admin-list">
          ${rows || '<p style="padding:40px 48px;color:var(--muted)">База пуста</p>'}
        </div>
      </section>

      <!-- ── Form modal ── -->
      <div id="admin-form-overlay" class="kb-overlay">
        <div class="kb-modal admin-form-modal" style="max-width:640px">
          <button class="kb-modal-close" id="admin-form-close" type="button">✕</button>
          <div id="admin-form-inner"></div>
        </div>
      </div>

      <!-- ── Confirm modal ── -->
      <div id="admin-confirm-overlay" class="kb-overlay">
        <div class="kb-modal" style="max-width:400px;padding:40px">
          <p style="font-size:16px;margin-bottom:24px">Удалить запись? Это действие необратимо.</p>
          <div style="display:flex;gap:12px">
            <button class="btn-ghost" id="admin-confirm-cancel" type="button">Отмена</button>
            <button class="btn-primary" id="admin-confirm-ok" type="button" style="background:var(--accent3)">Удалить</button>
          </div>
        </div>
      </div>
    `;
  },

  _formHtml(entry = null) {
    const v = (f, def = '') => entry ? (entry[f] || def) : def;
    const catOpts = Object.entries(KB_CATEGORIES).filter(([k]) => k !== 'all')
      .map(([k, l]) => `<option value="${k}" ${v('category') === k ? 'selected' : ''}>${l}</option>`)
      .join('');

    return `
      <h3 class="font-display" style="font-size:22px;margin-bottom:28px">${entry ? 'Редактировать запись' : 'Новая запись'}</h3>
      <div class="admin-form">
        <div class="admin-field">
          <label class="admin-label font-mono">Заголовок *</label>
          <input class="admin-input" id="af-title" value="${v('title')}" placeholder="Название">
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Раздел *</label>
          <select class="admin-input" id="af-cat">${catOpts}</select>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Краткое описание *</label>
          <input class="admin-input" id="af-excerpt" value="${v('excerpt')}" placeholder="1–2 предложения">
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Содержание * <span style="color:var(--muted);font-size:9px">(HTML или текст)</span></label>
          <textarea class="admin-input admin-textarea" id="af-content">${v('content')}</textarea>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Теги <span style="color:var(--muted);font-size:9px">(через запятую)</span></label>
          <input class="admin-input" id="af-tags" value="${v('tags', []).join(', ')}" placeholder="agile, приоритизация">
        </div>
        <div style="display:flex;gap:12px;margin-top:8px">
          <button class="btn-ghost" id="af-cancel" type="button">Отмена</button>
          <button class="btn-primary" id="af-save" data-edit-id="${entry ? entry.id : ''}" type="button">
            ${entry ? 'Сохранить изменения' : 'Добавить запись'}
          </button>
        </div>
      </div>
    `;
  },

  _openForm(entryId = null) {
    const entry = entryId ? this.getById(entryId) : null;
    const overlay = document.getElementById('admin-form-overlay');
    document.getElementById('admin-form-inner').innerHTML = this._formHtml(entry);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('af-cancel').addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    document.getElementById('af-save').addEventListener('click', () => this._handleSave(entry?.id));
  },

  _handleSave(editId = null) {
    const title = document.getElementById('af-title').value.trim();
    const category = document.getElementById('af-cat').value;
    const excerpt = document.getElementById('af-excerpt').value.trim();
    const content = document.getElementById('af-content').value.trim();
    const rawTags = document.getElementById('af-tags').value.trim();

    if (!title || !excerpt || !content) {
      this._toast('⚠ Заполните все обязательные поля', true);
      return;
    }

    const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const payload = { title, category, excerpt, content, tags };

    if (editId) {
      this.update(editId, payload);
      this._toast('✓ Запись обновлена');
    } else {
      this.create(payload);
      this._toast('✓ Запись добавлена');
    }

    document.getElementById('admin-form-overlay').classList.remove('active');
    document.body.style.overflow = '';
    this._refreshAdminList();
  },

  _refreshAdminList() {
    const entries = this.getAll();
    const list = document.getElementById('admin-list');
    if (!list) return;
    const rows = entries.map(e => `
      <div class="admin-row reveal" data-admin-id="${e.id}">
        <div class="admin-row-main">
          <span class="admin-row-cat font-mono">${KB_CATEGORIES[e.category] || e.category}</span>
          <span class="admin-row-title">${e.title}</span>
          <div class="admin-row-tags">
            ${(e.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="admin-row-actions">
          <button class="btn-ghost admin-edit-btn" data-id="${e.id}" type="button">Изменить</button>
          <button class="btn-ghost admin-del-btn" data-id="${e.id}" type="button" style="border-color:var(--accent3);color:var(--accent3)">Удалить</button>
        </div>
      </div>
    `).join('');
    list.innerHTML = rows || '<p style="padding:40px 48px;color:var(--muted)">База пуста</p>';
    list.querySelector('.font-mono strong') && (list.querySelector('.font-mono strong').textContent = entries.length);
    this._bindAdminEvents();
    Animations.init();
  },

  _toast(msg, error = false) {
    let t = document.getElementById('kb-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'kb-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'kb-toast' + (error ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  },

  _bindAdminEvents() {
    document.querySelectorAll('.admin-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => this._openForm(btn.dataset.id));
    });

    let pendingDeleteId = null;
    document.querySelectorAll('.admin-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDeleteId = btn.dataset.id;
        document.getElementById('admin-confirm-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    document.getElementById('admin-confirm-cancel')?.addEventListener('click', () => {
      document.getElementById('admin-confirm-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });

    document.getElementById('admin-confirm-ok')?.addEventListener('click', () => {
      if (pendingDeleteId) {
        this.delete(pendingDeleteId);
        this._toast('✓ Запись удалена');
        pendingDeleteId = null;
      }
      document.getElementById('admin-confirm-overlay').classList.remove('active');
      document.body.style.overflow = '';
      this._refreshAdminList();
    });
  },

  initAdmin() {
    document.getElementById('admin-new-btn')?.addEventListener('click', () => this._openForm());
    document.getElementById('admin-form-close')?.addEventListener('click', () => {
      document.getElementById('admin-form-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    this._bindAdminEvents();
  }
};
