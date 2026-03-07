// ─── TASKS MODULE (replaces Cases) ──────────────────────────────────────────
// Все упоминания "кейсов" заменены на "задания". ProjectWB v2.0.

const TASKS_STORAGE_KEY = 'projectwb-tasks-v1';

const TASK_LEVELS = {
  junior: { label: 'Junior', color: 'var(--accent2)' },
  middle: { label: 'Middle', color: 'var(--accent)' },
  senior: { label: 'Senior', color: '#f5a442' },
};

const TASK_CATEGORIES = {
  planning:      'Планирование',
  communication: 'Коммуникации',
  risk:          'Риски',
  team:          'Команда',
  metrics:       'Метрики',
  stakeholders:  'Стейкхолдеры',
  agile:         'Agile',
  strategy:      'Стратегия',
};

const DEFAULT_TASKS = [
  {
    id: 'pwb-t001', level: 'junior', category: 'planning',
    title: 'Составь WBS для мобильного приложения',
    description: 'Тебе поручено запустить мобильное приложение для курьерской службы. Команда: 3 разработчика, 1 дизайнер, 1 QA. Срок — 3 месяца.',
    task: 'Составь WBS второго уровня. Определи не менее 5 рабочих пакетов, для каждого укажи ответственного и примерную длительность.',
    hints: ['Начни с фаз PMBOK: инициация → планирование → исполнение → мониторинг → завершение', 'Рабочий пакет должен быть измеримым — избегай «сделать дизайн»', 'Каждый пакет — одна ответственная роль'],
    expected: 'Таблица или дерево: пакеты, ответственные, сроки. Минимум 5 пакетов второго уровня.',
  },
  {
    id: 'pwb-t002', level: 'junior', category: 'communication',
    title: 'Напиши статус-отчёт по застрявшему проекту',
    description: 'Интеграция CRM — 3-я неделя из 8. Выполнено 4 из 12 задач. Ключевой разработчик заболел, дедлайн под угрозой.',
    task: 'Напиши статус-отчёт для директора по IT. До 1 страницы. Структура: статус, прогресс, риски, следующие шаги.',
    hints: ['Используй светофор: 🟡 жёлтый статус', 'Не пиши «всё плохо» — предложи решение', 'Цифры важнее слов: 4/12 = 33% против плана 50%'],
    expected: 'Структурированный отчёт до 300 слов. Чёткий статус, честные цифры, конкретные следующие шаги.',
  },
  {
    id: 'pwb-t003', level: 'junior', category: 'agile',
    title: 'Расставь приоритеты бэклога по MoSCoW',
    description: 'Стартап, 2-недельный спринт. Бэклог: 15 задач, но команда (4 человека) вывезет максимум 8.',
    task: 'Распредели 10 задач по MoSCoW (Must / Should / Could / Won\'t). Обоснуй каждую категорию одним предложением.',
    hints: ['Must = без этого продукт не работает', 'Should = важно, но есть обходной путь', 'Could = было бы здорово', 'Won\'t = явно не в этом спринте'],
    expected: 'Таблица 10 задач × 4 категории + обоснование. Must ≤ 40% от capacity.',
    taskList: ['Авторизация через email', 'Авторизация через Google', 'Профиль пользователя', 'Push-уведомления', 'Тёмная тема', 'Онбординг (3 экрана)', 'Поиск по продуктам', 'Фильтры поиска', 'История заказов', 'Реферальная программа'],
  },
  {
    id: 'pwb-t004', level: 'middle', category: 'risk',
    title: 'Построй матрицу рисков enterprise-проекта',
    description: 'PM в корпоративном проекте: замена ERP на 300 пользователей. Бюджет 15 млн, срок 9 месяцев. Команда: 8 разработчиков, 2 аналитика, 1 архитектор.',
    task: 'Определи 8 ключевых рисков. Для каждого: вероятность (1-5), влияние (1-5), risk score (P×I), стратегия митигации.',
    hints: ['Enterprise-специфика: legacy, change management, политика', 'Risk score > 12 — красная зона, нужен plan B', 'Не забудь vendor risk и key person risk'],
    expected: 'Матрица 8 рисков: P / I / Score / стратегия / владелец. Минимум 2 в красной зоне.',
  },
  {
    id: 'pwb-t005', level: 'middle', category: 'team',
    title: 'Проведи post-mortem провалившегося спринта',
    description: 'Спринт 3 недели. Plan: 42 SP → Done: 18 SP (43%). Причины: 2 разработчика ушли в отпуск без предупреждения, срочный баг в проде, требования изменились в середине.',
    task: 'Структурируй ретроспективу: «Что пошло не так / Почему / Что изменим». Для каждой проблемы — конкретное системное решение.',
    hints: ['Ищи системные причины, не виноватых', 'Каждое решение — действие с дедлайном и ответственным', 'Проблема повторилась дважды = системная'],
    expected: '3-5 проблем, root-cause и action items. Формат: проблема → причина → решение → ответственный → срок.',
  },
  {
    id: 'pwb-t006', level: 'middle', category: 'stakeholders',
    title: 'Разреши конфликт требований стейкхолдеров',
    description: 'HR-портал. Директор HR хочет подробную аналитику. CTO требует < 2 сек на запрос. Разработчик: «нельзя совместить за 2 недели без кэширования».',
    task: 'Предложи стратегию разрешения конфликта. Как проведёшь переговоры, какие компромиссы возможны, как задокументируешь решение?',
    hints: ['Интересы, не позиции: что на самом деле нужно HR-директору?', 'Поэтапная реализация — классический компромисс', 'Задокументируй в Change Request — все должны подписаться'],
    expected: '3-4 шага: подготовка → встреча → компромисс → документирование. Конкретные вопросы для каждого стейкхолдера.',
  },
  {
    id: 'pwb-t007', level: 'senior', category: 'strategy',
    title: 'Спроектируй план первых 90 дней в роли Head of PMO',
    description: 'Ты принят Head of PMO в fintech (~200 человек). Процессы хаотичны: нет единой методологии, 5 разных инструментов, команды работают изолированно.',
    task: 'Составь план первых 90 дней. 3 периода × 30 дней. Для каждого: цели, активности, ожидаемые результаты, риски.',
    hints: ['Дни 1-30: слушать и наблюдать, не менять', 'Дни 31-60: quick wins без сопротивления', 'Дни 61-90: системные изменения с обоснованием из аудита'],
    expected: 'Три 30-дневных блока. Финальный deliverable — дорожная карта трансформации PMO.',
  },
  {
    id: 'pwb-t008', level: 'senior', category: 'metrics',
    title: 'Выбери North Star Metric и построй дерево метрик',
    description: 'B2B SaaS для управления складом. 500 корпоративных клиентов. Текущие метрики: DAU, MRR, NPS, тикеты, время ответа поддержки, использование фич.',
    task: 'Предложи NSM, обоснуй выбор. Построй дерево: NSM → 3-4 input-метрики → leading indicators. Объясни, какие из текущих — vanity metrics.',
    hints: ['NSM: отражает ценность клиента + коррелирует с MRR + зависит от действий команды', 'Input-метрики двигают NSM', 'Vanity metrics растут, но не говорят о ценности'],
    expected: 'NSM с обоснованием + дерево (3 уровня) + анализ текущих метрик: оставить / убрать / почему.',
  },
  {
    id: 'pwb-t009', level: 'senior', category: 'planning',
    title: 'Защити роадмап перед советом директоров',
    description: 'Квартальный роадмап: 3 крупные фичи, команда 12 человек, Q3 бюджет 8 млн. Совет: «почему не 5 фич, можно ли быстрее, как измеряем ROI?»',
    task: 'Подготовь аргументацию защиты роадмапа. Как отвечаешь на hard questions? Как обосновываешь приоритеты? Как презентуешь ROI без точных цифр?',
    hints: ['Opportunity Cost: «если добавим X, придётся убрать Y»', 'ROI: user stories + сравнение конкурентов + customer feedback', 'Показывай загрузку команды, не объём задач'],
    expected: 'Структура презентации 7-10 слайдов + ответы на 3 hard question от совета.',
  },
];

const Cases = {
  // ── Data ──────────────────────────────────────────────────────────────────
  _load() {
    try { const r = localStorage.getItem(TASKS_STORAGE_KEY); return r ? JSON.parse(r) : JSON.parse(JSON.stringify(DEFAULT_TASKS)); }
    catch { return JSON.parse(JSON.stringify(DEFAULT_TASKS)); }
  },
  _save(tasks) { localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)); },

  currentLevel: 'all',

  // ── Public page ───────────────────────────────────────────────────────────
  init() {
    this._bindFilters();
    this._bindCards();
    this._bindModal();
  },

  renderList() {
    const tasks = this._load();
    const counts = { all: tasks.length };
    Object.keys(TASK_LEVELS).forEach(l => { counts[l] = tasks.filter(t => t.level === l).length; });

    const filterBtns = [{ key: 'all', label: `Все (${counts.all})` }]
      .concat(Object.entries(TASK_LEVELS).map(([k, v]) => ({ key: k, label: `${v.label} (${counts[k]})` })))
      .map(b => `<button class="filter-btn ${b.key === this.currentLevel ? 'active' : ''}" data-level="${b.key}" type="button">${b.label}</button>`)
      .join('');

    const filtered = this.currentLevel === 'all' ? tasks : tasks.filter(t => t.level === this.currentLevel);

    return `
      <section class="page-hero">
        <div class="section-tag">◆ Задания</div>
        <h1 class="font-display reveal">Прокачай навыки PM.<br>Практические задачи.</h1>
        <p class="hero-desc reveal">Выбери уровень — Junior, Middle или Senior — и реши реальный PM-кейс с подсказками.</p>
      </section>

      <section class="cases-filters">
        <div class="filter-group" role="group" aria-label="Фильтр по уровню">
          ${filterBtns}
        </div>
      </section>

      <section class="cases-grid tasks-grid" id="tasks-grid">
        ${filtered.map(t => this._card(t)).join('') || '<p style="padding:40px 48px;color:var(--muted)">Заданий не найдено</p>'}
      </section>

      <div id="task-overlay" class="kb-overlay" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div id="task-modal" class="kb-modal task-modal">
          <button class="kb-modal-close" id="task-modal-close" type="button" aria-label="Закрыть">✕</button>
          <div id="task-modal-inner"></div>
        </div>
      </div>

      <div id="contacts-container"></div>
    `;
  },

  _card(t) {
    const lvl = TASK_LEVELS[t.level];
    const cat = TASK_CATEGORIES[t.category] || t.category;
    return `
      <article class="case-card task-card reveal"
               data-task-id="${t.id}" tabindex="0"
               role="button" aria-label="Открыть задание: ${t.title}">
        <div class="task-level-badge font-mono" style="color:${lvl.color};border-color:${lvl.color}">${lvl.label}</div>
        <div class="case-tag">${cat}</div>
        <h3 class="case-title">${t.title}</h3>
        <p class="pain-desc" style="font-size:13px;margin-top:8px">${t.description.slice(0, 110)}…</p>
        <div class="task-card-footer">
          <span class="font-mono" style="font-size:10px;color:var(--muted)">${(t.hints || []).length} подсказок</span>
          <span class="task-card-cta font-mono">Открыть →</span>
        </div>
      </article>
    `;
  },

  _modalContent(t) {
    const lvl = TASK_LEVELS[t.level];
    const cat = TASK_CATEGORIES[t.category] || t.category;
    const hints = (t.hints || []).map((h, i) => '<div class="task-hint"><span class="task-hint-num font-mono">' + String(i+1).padStart(2,'0') + '</span><span>' + h + '</span></div>').join('');
    const items = t.taskList ? t.taskList.map(i => `<li>${i}</li>`).join('') : '';
    const listHtml = t.taskList ? `<div class="task-section-label font-mono" style="margin-top:24px">// Список для работы</div><ul class="task-items-list">${items}</ul>` : '';
    return `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
        <span class="outcome-badge" style="color:${lvl.color};border-color:${lvl.color}">${lvl.label}</span>
        <span class="case-tag">${cat}</span>
      </div>
      <h2 id="task-modal-title" class="kb-modal-title font-display">${t.title}</h2>
      <div class="kb-modal-divider"></div>
      <div class="task-section-label font-mono">// Контекст</div>
      <p class="kb-modal-excerpt">${t.description}</p>
      <div class="task-section-label font-mono" style="margin-top:24px">// Задание</div>
      <div class="task-body">${t.task}</div>
      ${listHtml}
      <div class="task-section-label font-mono" style="margin-top:24px">// Подсказки</div>
      <div class="task-hints">${hints}</div>
      <div class="task-section-label font-mono" style="margin-top:24px">// Ожидаемый результат</div>
      <div class="task-expected">${t.expected}</div>
    `;
  },

  _open(id) {
    const t = this._load().find(x => x.id === id);
    if (!t) return;
    document.getElementById('task-modal-inner').innerHTML = this._modalContent(t);
    document.getElementById('task-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  _close() {
    document.getElementById('task-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  _bindFilters() {
    document.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLevel = btn.dataset.level;
        const tasks = this._load();
        const filtered = this.currentLevel === 'all' ? tasks : tasks.filter(t => t.level === this.currentLevel);
        const grid = document.getElementById('tasks-grid');
        if (grid) {
          grid.innerHTML = filtered.map(t => this._card(t)).join('') || '<p style="padding:40px 48px;color:var(--muted)">Заданий нет</p>';
          this._bindCards();
          if (typeof Animations !== 'undefined') Animations.init();
          if (typeof Cursor !== 'undefined' && !Utils.isTouch()) Cursor.rebind();
        }
      });
    });
  },

  _bindCards() {
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', () => this._open(card.dataset.taskId));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._open(card.dataset.taskId); }
      });
    });
  },

  _bindModal() {
    document.getElementById('task-modal-close')?.addEventListener('click', () => this._close());
    document.getElementById('task-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'task-overlay') this._close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this._close(); });
  },

  currentLevel: 'all',

  // ── Public page ───────────────────────────────────────────────────────────
  init() {
    this._bindFilters();
    this._bindCards();
    this._bindModal();
  },

  renderList() {
    const tasks = this._load();
    const counts = { all: tasks.length };
    Object.keys(TASK_LEVELS).forEach(l => { counts[l] = tasks.filter(t => t.level === l).length; });

    const filterBtns = [{ key: 'all', label: `Все (${counts.all})` }]
      .concat(Object.entries(TASK_LEVELS).map(([k, v]) => ({ key: k, label: `${v.label} (${counts[k]})` })))
      .map(b => `<button class="filter-btn ${b.key === this.currentLevel ? 'active' : ''}" data-level="${b.key}" type="button">${b.label}</button>`)
      .join('');

    const filtered = this.currentLevel === 'all' ? tasks : tasks.filter(t => t.level === this.currentLevel);

    return `
      <section class="page-hero">
        <div class="section-tag">◆ Задания</div>
        <h1 class="font-display reveal">Прокачай навыки PM.<br>Практические задачи.</h1>
        <p class="hero-desc reveal">Выбери уровень — Junior, Middle или Senior — и реши реальный PM-кейс с подсказками.</p>
      </section>

      <section class="cases-filters">
        <div class="filter-group" role="group" aria-label="Фильтр по уровню">
          ${filterBtns}
        </div>
      </section>

      <section class="cases-grid tasks-grid" id="tasks-grid">
        ${filtered.map(t => this._card(t)).join('') || '<p style="padding:40px 48px;color:var(--muted)">Заданий не найдено</p>'}
      </section>

      <div id="task-overlay" class="kb-overlay" role="dialog" aria-modal="true">
        <div id="task-modal" class="kb-modal task-modal">
          <button class="kb-modal-close" id="task-modal-close" type="button">✕</button>
          <div id="task-modal-inner"></div>
        </div>
      </div>

      <div id="contacts-container"></div>
    `;
  },

  _card(t) {
    const lvl = TASK_LEVELS[t.level];
    const cat = TASK_CATEGORIES[t.category] || t.category;
    return `
      <article class="case-card task-card reveal"
               data-task-id="${t.id}" tabindex="0"
               role="button" aria-label="Открыть: ${t.title}">
        <div class="task-level-badge font-mono" style="color:${lvl.color};border-color:${lvl.color}">${lvl.label}</div>
        <div class="case-tag">${cat}</div>
        <h3 class="case-title">${t.title}</h3>
        <p class="pain-desc" style="font-size:13px;margin-top:8px">${t.description.slice(0, 110)}…</p>
        <div class="task-card-footer">
          <span class="font-mono" style="font-size:10px;color:var(--muted)">${(t.hints || []).length} подсказок</span>
          <span class="task-card-cta font-mono">Открыть →</span>
        </div>
      </article>
    `;
  },

  _modalContent(t) {
    const lvl = TASK_LEVELS[t.level];
    const cat = TASK_CATEGORIES[t.category] || t.category;
    const hints = (t.hints || []).map((h, i) => `
      <div class="task-hint">
        <span class="task-hint-num font-mono">${String(i + 1).padStart(2, '0')}</span>
        <span>${h}</span>
      </div>`).join('');
    const items = t.taskList ? t.taskList.map(i => `<li>${i}</li>`).join('') : '';
    const listHtml = t.taskList
      ? `<div class="task-section-label font-mono" style="margin-top:24px">// Список для работы</div><ul class="task-items-list">${items}</ul>`
      : '';
    return `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
        <span class="outcome-badge" style="color:${lvl.color};border-color:${lvl.color}">${lvl.label}</span>
        <span class="case-tag">${cat}</span>
      </div>
      <h2 class="kb-modal-title font-display">${t.title}</h2>
      <div class="kb-modal-divider"></div>
      <div class="task-section-label font-mono">// Контекст</div>
      <p class="kb-modal-excerpt">${t.description}</p>
      <div class="task-section-label font-mono" style="margin-top:24px">// Задание</div>
      <div class="task-body">${t.task}</div>
      ${listHtml}
      <div class="task-section-label font-mono" style="margin-top:24px">// Подсказки</div>
      <div class="task-hints">${hints}</div>
      <div class="task-section-label font-mono" style="margin-top:24px">// Ожидаемый результат</div>
      <div class="task-expected">${t.expected}</div>
    `;
  },

  _open(id) {
    const t = this._load().find(x => x.id === id);
    if (!t) return;
    document.getElementById('task-modal-inner').innerHTML = this._modalContent(t);
    document.getElementById('task-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  _close() {
    document.getElementById('task-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  _bindFilters() {
    document.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLevel = btn.dataset.level;
        const tasks = this._load();
        const filtered = this.currentLevel === 'all' ? tasks : tasks.filter(t => t.level === this.currentLevel);
        const grid = document.getElementById('tasks-grid');
        if (grid) {
          grid.innerHTML = filtered.map(t => this._card(t)).join('') || '<p style="padding:40px 48px;color:var(--muted)">Заданий нет</p>';
          this._bindCards();
          if (typeof Animations !== 'undefined') Animations.init();
          if (typeof Cursor !== 'undefined' && !Utils.isTouch()) Cursor.rebind();
        }
      });
    });
  },

  _bindCards() {
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', () => this._open(card.dataset.taskId));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._open(card.dataset.taskId); }
      });
    });
  },

  _bindModal() {
    document.getElementById('task-modal-close')?.addEventListener('click', () => this._close());
    document.getElementById('task-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'task-overlay') this._close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this._close(); });
  },

  // ── Admin tab ─────────────────────────────────────────────────────────────
  renderAdminTab() {
    const tasks = this._load();
    return `
      <div class="admin-topbar">
        <span class="font-mono" style="font-size:11px;color:var(--muted)">
          Всего заданий: <strong style="color:var(--accent)" id="tasks-admin-count">${tasks.length}</strong>
        </span>
        <button class="btn-primary" id="task-new-btn" type="button" style="width:auto">+ Новое задание</button>
      </div>
      <div class="admin-list" id="tasks-admin-list">
        ${this._adminRows(tasks)}
      </div>

      <!-- Task form modal -->
      <div id="task-form-overlay" class="kb-overlay">
        <div class="kb-modal" style="max-width:680px">
          <button class="kb-modal-close" id="task-form-close" type="button" aria-label="Закрыть">✕</button>
          <div id="task-form-inner"></div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div id="task-del-overlay" class="kb-overlay">
        <div class="kb-modal" style="max-width:380px;padding:40px">
          <p style="font-size:16px;margin-bottom:24px">Удалить это задание?</p>
          <div style="display:flex;gap:12px">
            <button class="btn-ghost" id="task-del-cancel" type="button">Отмена</button>
            <button class="btn-primary" id="task-del-ok" type="button" style="width:auto;background:var(--accent3)">Удалить</button>
          </div>
        </div>
      </div>
    `;
  },

  _adminRows(tasks) {
    if (!tasks.length) return '<p style="padding:40px 48px;color:var(--muted)">Нет заданий</p>';
    return tasks.map(t => {
      const lvl = TASK_LEVELS[t.level];
      const cat = TASK_CATEGORIES[t.category] || t.category;
      return `
        <div class="admin-row reveal">
          <div class="admin-row-main">
            <span class="admin-row-cat font-mono" style="color:${lvl.color}">${lvl.label}</span>
            <span class="admin-row-title">${t.title}</span>
            <div class="admin-row-tags"><span class="skill-tag">${cat}</span></div>
          </div>
          <div class="admin-row-actions">
            <button class="btn-ghost task-edit-btn" data-id="${t.id}" type="button">Изменить</button>
            <button class="btn-ghost task-del-btn" data-id="${t.id}" type="button"
                    style="border-color:var(--accent3);color:var(--accent3)">Удалить</button>
          </div>
        </div>`;
    }).join('');
  },

  _formHtml(task = null) {
    const v = (f, d = '') => task ? (task[f] != null ? task[f] : d) : d;
    const lvlOpts = Object.entries(TASK_LEVELS).map(([k, lv]) =>
      `<option value="${k}"${v('level') === k ? ' selected' : ''}>${lv.label}</option>`).join('');
    const catOpts = Object.entries(TASK_CATEGORIES).map(([k, l]) =>
      `<option value="${k}"${v('category') === k ? ' selected' : ''}>${l}</option>`).join('');
    return `
      <h3 class="font-display" style="font-size:22px;margin-bottom:28px">${task ? 'Редактировать задание' : 'Новое задание'}</h3>
      <div class="admin-form">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div class="admin-field">
            <label class="admin-label font-mono">Уровень *</label>
            <select class="admin-input" id="tf-level">${lvlOpts}</select>
          </div>
          <div class="admin-field">
            <label class="admin-label font-mono">Категория *</label>
            <select class="admin-input" id="tf-cat">${catOpts}</select>
          </div>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Заголовок *</label>
          <input class="admin-input" id="tf-title" value="${v('title').replace(/"/g, '&quot;')}" placeholder="Название задания">
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Контекст (описание ситуации) *</label>
          <textarea class="admin-input admin-textarea" id="tf-desc" style="min-height:80px">${v('description')}</textarea>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Задание (что нужно сделать) *</label>
          <textarea class="admin-input admin-textarea" id="tf-task" style="min-height:80px">${v('task')}</textarea>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Ожидаемый результат *</label>
          <textarea class="admin-input admin-textarea" id="tf-expected" style="min-height:60px">${v('expected')}</textarea>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Подсказки <span style="color:var(--muted);font-size:9px">(каждая с новой строки)</span></label>
          <textarea class="admin-input admin-textarea" id="tf-hints" style="min-height:80px">${v('hints', []).join('\n')}</textarea>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Список для работы <span style="color:var(--muted);font-size:9px">(опц., каждый пункт с новой строки)</span></label>
          <textarea class="admin-input admin-textarea" id="tf-list" style="min-height:60px">${v('taskList', []).join('\n')}</textarea>
        </div>
        <div style="display:flex;gap:12px;margin-top:12px">
          <button class="btn-ghost" id="tf-cancel" type="button">Отмена</button>
          <button class="btn-primary" id="tf-save" type="button" style="width:auto">
            ${task ? 'Сохранить изменения' : 'Добавить задание'}
          </button>
        </div>
      </div>`;
  },

  _openForm(taskId = null) {
    const task = taskId ? this._load().find(t => t.id === taskId) : null;
    document.getElementById('task-form-inner').innerHTML = this._formHtml(task);
    document.getElementById('task-form-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('tf-cancel').addEventListener('click', () => {
      document.getElementById('task-form-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    document.getElementById('tf-save').addEventListener('click', () => this._save_form(taskId));
  },

  _save_form(editId = null) {
    const get = id => document.getElementById(id);
    const title = get('tf-title').value.trim();
    const desc  = get('tf-desc').value.trim();
    const task  = get('tf-task').value.trim();
    const exp   = get('tf-expected').value.trim();
    if (!title || !desc || !task || !exp) {
      this._toast('⚠ Заполните все обязательные поля', true); return;
    }
    const hints    = get('tf-hints').value.trim().split('\n').map(h => h.trim()).filter(Boolean);
    const taskList = get('tf-list').value.trim().split('\n').map(h => h.trim()).filter(Boolean);
    const payload  = {
      level: get('tf-level').value, category: get('tf-cat').value,
      title, description: desc, task, expected: exp, hints,
      ...(taskList.length ? { taskList } : {}),
    };
    const tasks = this._load();
    if (editId) {
      const idx = tasks.findIndex(t => t.id === editId);
      if (idx !== -1) tasks[idx] = { ...tasks[idx], ...payload };
      this._toast('✓ Задание обновлено');
    } else {
      payload.id = 'pwb_' + Date.now();
      tasks.unshift(payload);
      this._toast('✓ Задание добавлено');
    }
    this._save(tasks);
    document.getElementById('task-form-overlay').classList.remove('active');
    document.body.style.overflow = '';
    this._refreshAdminList();
  },

  _refreshAdminList() {
    const tasks = this._load();
    const list = document.getElementById('tasks-admin-list');
    if (list) { list.innerHTML = this._adminRows(tasks); this._bindAdminEvents(); }
    const cnt = document.getElementById('tasks-admin-count');
    if (cnt) cnt.textContent = tasks.length;
    if (typeof Animations !== 'undefined') Animations.init();
  },

  _bindAdminEvents() {
    document.querySelectorAll('.task-edit-btn').forEach(btn =>
      btn.addEventListener('click', () => this._openForm(btn.dataset.id)));
    let delId = null;
    document.querySelectorAll('.task-del-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        delId = btn.dataset.id;
        document.getElementById('task-del-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      }));
    document.getElementById('task-del-cancel')?.addEventListener('click', () => {
      document.getElementById('task-del-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    document.getElementById('task-del-ok')?.addEventListener('click', () => {
      if (delId) { this._save(this._load().filter(t => t.id !== delId)); this._toast('✓ Удалено'); delId = null; }
      document.getElementById('task-del-overlay').classList.remove('active');
      document.body.style.overflow = '';
      this._refreshAdminList();
    });
  },

  initAdmin() {
    document.getElementById('task-new-btn')?.addEventListener('click', () => this._openForm());
    document.getElementById('task-form-close')?.addEventListener('click', () => {
      document.getElementById('task-form-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    this._bindAdminEvents();
  },

  _toast(msg, err = false) {
    let el = document.getElementById('kb-toast');
    if (!el) { el = document.createElement('div'); el.id = 'kb-toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.className = 'kb-toast' + (err ? ' error' : '');
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  },
};
