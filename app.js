const Router = {
  routes: {
    '': 'home',
    '#': 'home',
    '#home': 'home',
    '#tools': 'tools',
    '#cases': 'cases',
    '#resume': 'resume-selector',
    '#resume/hr': 'resume-hr',
    '#resume/manager': 'resume-manager',
    '#resume/pm': 'resume-pm',
    '#resume/dev': 'resume-dev',
    '#knowledge-base': 'knowledge-base',
    '#calculator': 'calculator',
    '#admin': 'admin'
  },

  getCurrentRoute() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#case-')) return 'case-detail';
    return this.routes[hash] || 'home';
  },

  navigate(hash) {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      this.render(this.getCurrentRoute(), this.parseParams());
    }
  },

  render(routeId, params = {}) {
    const main = document.getElementById('app');
    if (!main) return;
    main.style.opacity = '0';
    setTimeout(() => {
      const content = this.getContent(routeId, params);
      main.innerHTML = content;
      requestAnimationFrame(() => { main.style.opacity = '1'; });
      window.scrollTo(0, 0);
      if (routeId.startsWith('resume')) Resume.init();
      if (routeId === 'cases') Cases.init();
      if (routeId === 'knowledge-base') KnowledgeBase.initPage();
      if (routeId === 'admin') {
        Pages._bindAdminTabs();
        KnowledgeBase.initAdmin();
        Cases.initAdmin();
        ProjectsData.initAdmin();
      }
      if (routeId === 'calculator') initCalculator();
      const contactsContainer = document.getElementById('contacts-container');
      if (contactsContainer) Components.renderContacts();
      Animations.init();
      if (!Utils.isTouch()) Cursor.rebind();
    }, 150);
  },

  getContent(routeId, params) {
    switch (routeId) {
      case 'home': return Pages.renderHome();
      case 'tools': return Pages.renderTools();
      case 'cases': return Cases.renderList();
      case 'resume-selector': return Resume.renderSelector();
      case 'resume-hr': return Resume.renderContent('hr');
      case 'resume-manager': return Resume.renderContent('manager');
      case 'resume-pm': return Resume.renderContent('pm');
      case 'resume-dev': return Resume.renderContent('dev');
      case 'knowledge-base': return KnowledgeBase.renderPage();
      case 'calculator': return Pages.renderCalculator();
      case 'admin': return Pages.renderAdmin();
      default: return Pages.renderHome();
    }
  },

  parseParams() {
    const hash = window.location.hash || '';
    const params = {};
    if (hash.startsWith('#case-')) params.caseId = hash.replace('#case-', '');
    if (hash.includes('/')) params.subpage = hash.split('/')[1];
    return params;
  },

  init() {
    window.addEventListener('hashchange', () => {
      this.render(this.getCurrentRoute(), this.parseParams());
    });
    this.render(this.getCurrentRoute(), this.parseParams());
  }
};

const Pages = {

  // ── NEW HOME — Portfolio ─────────────────────────────────────────────────
  renderHome() {
    return `
      <!-- HERO -->
      <section class="ph-hero container">
        <div class="ph-hero-eyebrow section-tag">◆ Project Manager · Системный подход к управлению</div>
        <h1 class="ph-hero-name font-display reveal">Георгий<br>Мясников</h1>
        <p class="ph-hero-sub reveal">Превращаю хаос в предсказуемый результат.<br>Опыт в продуктовых командах: Яндекс, МТС, Сбер.</p>

        <div class="ph-stats reveal">
          <div class="ph-stat"><span class="ph-stat-val">73%</span><span class="ph-stat-label font-mono">проектов срывают дедлайны</span></div>
          <div class="ph-stat"><span class="ph-stat-val">×2.7</span><span class="ph-stat-label font-mono">ускорение запуска MVP</span></div>
          <div class="ph-stat"><span class="ph-stat-val">-78%</span><span class="ph-stat-label font-mono">задержки спринта</span></div>
          <div class="ph-stat"><span class="ph-stat-val">5 мин</span><span class="ph-stat-label font-mono">на модель проекта</span></div>
        </div>
      </section>

      <!-- ABOUT -->
      <section class="ph-resume-section section container" aria-labelledby="about-heading">
        <div class="section-tag" id="about-heading">◆ Обо мне</div>
        <div class="ph-resume-grid">
          <div class="ph-resume-left">
            <h2 class="reveal">Управление проектами —<br>это <span style="color:var(--accent)">системная работа</span></h2>
            <p class="ph-resume-text reveal">Специализируюсь на построении процессов управления с нуля, внедрении гибких методологий и создании прозрачности для всех стейкхолдеров.</p>
            <p class="ph-resume-text reveal">Автор методологии ProjectWB — системного подхода к управлению через модель «входы → система → выходы». Открытый инструментарий для PM-практиков.</p>
            <div class="ph-resume-actions reveal">
              <a href="#tools" class="btn-primary">Инструменты →</a>
              <a href="#cases" class="btn-ghost">Задания PM →</a>
            </div>
          </div>
          <div class="ph-resume-right">
            <div class="ph-competencies">
              <div class="ph-competency reveal">
                <span class="ph-competency-icon">📋</span>
                <div>
                  <div class="ph-competency-title">Project Management</div>
                  <div class="ph-competency-desc font-mono">Agile · Scrum · Kanban · Waterfall</div>
                </div>
              </div>
              <div class="ph-competency reveal">
                <span class="ph-competency-icon">👥</span>
                <div>
                  <div class="ph-competency-title">Team Leadership</div>
                  <div class="ph-competency-desc font-mono">Формирование · Мотивация · KPI</div>
                </div>
              </div>
              <div class="ph-competency reveal">
                <span class="ph-competency-icon">🤖</span>
                <div>
                  <div class="ph-competency-title">AI Integration</div>
                  <div class="ph-competency-desc font-mono">LLM · Автоматизация процессов</div>
                </div>
              </div>
              <div class="ph-competency reveal">
                <span class="ph-competency-icon">🌍</span>
                <div>
                  <div class="ph-competency-title">Remote First</div>
                  <div class="ph-competency-desc font-mono">Распределённые команды · Async</div>
                </div>
              </div>
              <div class="ph-competency reveal">
                <span class="ph-competency-icon">📈</span>
                <div>
                  <div class="ph-competency-title">Data-Driven</div>
                  <div class="ph-competency-desc font-mono">Метрики · Аналитика · Отчётность</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── MY SYSTEM ── -->
      <section class="ph-system-section" aria-labelledby="system-heading">
        <div class="container">
          <div class="section-tag" id="system-heading">◆ Моя система</div>
          <div class="ph-system-grid">
            <div class="ph-system-card reveal">
              <span class="ph-system-num font-mono">01</span>
              <h3>Анализ проекта</h3>
              <p>Аудит входов, команды, рисков и контекста проекта.</p>
              <a href="#cases" class="btn-ghost" style="margin-top:auto">Задания PM →</a>
            </div>
            <div class="ph-system-card reveal">
              <span class="ph-system-num font-mono">02</span>
              <h3>Планирование</h3>
              <p>WBS, RACI, роадмап, риск-матрица и коммуникации. Прозрачный план для всех.</p>
              <a href="#tools" class="btn-ghost" style="margin-top:auto">Инструменты →</a>
            </div>
            <div class="ph-system-card reveal">
              <span class="ph-system-num font-mono">03</span>
              <h3>Управление командой</h3>
              <p>Daily, ретроспективы, 1-on-1. Метрики производительности и velocity.</p>
              <a href="#knowledge-base" class="btn-ghost" style="margin-top:auto">База знаний →</a>
            </div>
            <div class="ph-system-card reveal">
              <span class="ph-system-num font-mono">04</span>
              <h3>Контроль результатов</h3>
              <p>Дашборд, автоотчёты, прогноз рисков и прозрачность для стейкхолдеров.</p>
              <a href="#cases" class="btn-ghost" style="margin-top:auto">Задания PM →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── PROJECT RESULTS ── -->
      <section class="ph-results-section section container" aria-labelledby="results-heading">
        <div class="section-tag" id="results-heading">◆ Project Results</div>
        <h2 class="reveal">Цифры, которые<br>можно проверить</h2>
        <div class="ph-results-grid">
          <div class="ph-result-card reveal">
            <div class="ph-result-delta">-78%</div>
            <div class="ph-result-metric">Задержки спринта</div>
            <div class="ph-result-ctx font-mono">B2B SaaS · 12 чел. · 4 мес.</div>
          </div>
          <div class="ph-result-card reveal">
            <div class="ph-result-delta">-62%</div>
            <div class="ph-result-metric">Время до запуска</div>
            <div class="ph-result-ctx font-mono">Startup · MVP за 6 нед.</div>
          </div>
          <div class="ph-result-card reveal">
            <div class="ph-result-delta">×2.7</div>
            <div class="ph-result-metric">Скорость до рынка</div>
            <div class="ph-result-ctx font-mono">Mobile · 5 чел. · 6 нед.</div>
          </div>
          <div class="ph-result-card reveal">
            <div class="ph-result-delta">-75%</div>
            <div class="ph-result-metric">Время на встречи</div>
            <div class="ph-result-ctx font-mono">Enterprise · 30+ чел.</div>
          </div>
        </div>
        <div class="reveal" style="margin-top:40px">
          <a href="#cases" class="btn-ghost">Задания PM →</a>
        </div>
      </section>
      <div id="contacts-container"></div>
    `;
  },

  // ── TOOLS (old home content) ─────────────────────────────────────────────
  renderTools() {
    const { pain } = Content.pages.home;

    const painCardsHtml = pain.cards.map(card => `
      <div class="pain-card reveal">
        <span class="pain-num font-mono">${card.num}</span>
        <div class="pain-title">${card.title}</div>
        <p class="pain-desc">${card.desc}</p>
      </div>
    `).join('');

    return `
      <section class="page-hero">
        <div class="section-tag">◆ Инструменты</div>
        <h1 class="font-display reveal">PM Toolkit.<br>Всё, что нужно.</h1>
        <p class="hero-desc reveal">Калькулятор сроков, база знаний, задания — в одном месте.</p>
      </section>

      <section id="pain" class="pain-section container section" aria-labelledby="pain-heading">
        <div class="section-tag">◆ Проблема</div>
        <h2 id="pain-heading" class="reveal">${pain.title}</h2>
        <div class="pain-grid" style="margin-top:48px">${painCardsHtml}</div>
      </section>

      <section class="tools-section section" aria-labelledby="tools-heading">
        <div class="container">
          <div class="section-tag">◆ Решение</div>
          <h2 id="tools-heading" class="reveal">Инструменты ProjectWB</h2>
          <div class="tools-grid">
            <div class="tool-card reveal">
              <h3 class="tool-card-title">ProjectWB Конструктор</h3>
              <p class="tool-card-desc">Модель «входы→система→выходы» за 5 минут. Оценка сроков, трудозатрат и артефактов по методологии.</p>
              <div class="tool-features">
                <span class="tool-feature">WBS</span><span class="tool-feature">RACI</span>
                <span class="tool-feature">Risk Matrix</span><span class="tool-feature">Export JSON</span>
              </div>
              <a href="#calculator" class="btn-ghost">Открыть Калькулятор →</a>
            </div>
            <div class="tool-card reveal">
              <h3 class="tool-card-title">Задания PM</h3>
              <p class="tool-card-desc">Практические задачи для Junior, Middle и Senior PM. Реальные сценарии с подсказками и критериями оценки.</p>
              <div class="tool-features">
                <span class="tool-feature">Junior</span><span class="tool-feature">Middle</span>
                <span class="tool-feature">Senior</span><span class="tool-feature">9 заданий</span>
              </div>
              <a href="#cases" class="btn-ghost">Задания PM →</a>
            </div>
            <div class="tool-card reveal tool-card--wip">
              <div class="wip-badge font-mono">// в разработке</div>
              <h3 class="tool-card-title">Project DOJO</h3>
              <p class="tool-card-desc">Интерактивный тренажёр: симуляции проектов с ветвящимися сценариями. Учись на провалах без реальных последствий.</p>
              <div class="tool-features">
                <span class="tool-feature">Симуляции</span><span class="tool-feature">Сценарии</span>
                <span class="tool-feature">Дебриф</span><span class="tool-feature">Рейтинг</span>
              </div>
              <span class="btn-ghost btn-ghost--disabled">Скоро →</span>
            </div>
            <div class="tool-card reveal tool-card--wip">
              <div class="wip-badge font-mono">// в разработке</div>
              <h3 class="tool-card-title">Project Assistant</h3>
              <p class="tool-card-desc">AI-ассистент PM: генерация артефактов, шаблоны документов, ответы на вопросы по методологии в контексте проекта.</p>
              <div class="tool-features">
                <span class="tool-feature">AI</span><span class="tool-feature">Шаблоны</span>
                <span class="tool-feature">Артефакты</span><span class="tool-feature">Q&A</span>
              </div>
              <span class="btn-ghost btn-ghost--disabled">Скоро →</span>
            </div>
          </div>
        </div>
      </section>

      <div id="contacts-container"></div>
    `;
  },

  // ── CALCULATOR ───────────────────────────────────────────────────────────
  renderCalculator() {
    return `
      <section class="page-hero">
        <div class="section-tag">◆ ProjectWB · Конструктор проектов</div>
        <h1 class="font-display reveal">Конструктор<br>проектов</h1>
        <p class="hero-desc reveal">Оценка сроков, трудозатрат и артефактов за 5 минут. PMBOK-фазы, радар ограничений, экспорт.</p>
      </section>

      <section id="calculator" class="calc-section">
        <p class="section-eyebrow">// инструменты · v5.1</p>

        <div class="artifact-actions reveal">
          <button id="expertModeToggle" class="btn-toggle">⚙ Режим эксперта: ВЫКЛ</button>
          <span class="form-hint">— ISO-стандарты, риск-фреймворки, компетенции</span>
        </div>

        <div class="calc-grid reveal">
          <!-- Левая панель -->
          <div class="calc-panel">
            <span class="panel-label">// config.base</span>

            <div class="form-group">
              <label class="form-label"><span>Методология / Фреймворк</span></label>
              <select id="methodology">
                <option value="waterfall">Waterfall (Классическая)</option>
                <option value="scrum" selected>Scrum / Agile</option>
                <option value="kanban">Kanban (Flow)</option>
                <option value="safe">SAFe (Enterprise Agile)</option>
                <option value="lean">Lean (Оптимизация)</option>
                <option value="scrumban">Scrumban (Гибрид)</option>
                <option value="prince2">PRINCE2 (Корпоративный)</option>
                <option value="pm2">PM² (EU Standard)</option>
                <option value="hybrid">Hybrid (Scrumfall)</option>
              </select>
              <span class="form-hint">Влияет на набор артефактов и коэффициент усилий</span>
            </div>

            <div class="form-group">
              <label class="form-label"><span>Тип PMO / Команды</span></label>
              <select id="pmoType">
                <option value="small">Малая команда (до 20 чел.)</option>
                <option value="corporate" selected>Корпоративный PMO (20+ чел.)</option>
              </select>
              <span class="form-hint">Влияет на накладные расходы</span>
            </div>

            <div class="form-group">
              <label class="form-label"><span>Квалификация Project Manager</span></label>
              <select id="pmGrade">
                <option value="junior">Junior PM (×1.2)</option>
                <option value="middle" selected>Middle PM (×1.0)</option>
                <option value="senior">Senior PM (×0.85)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>Состав команды</span>
                <button id="addRoleBtn" class="btn-secondary" style="width:auto;padding:6px 12px;font-size:10px;">+ Добавить роль</button>
              </label>
              <div id="teamRolesContainer" class="team-roles-container"></div>
              <span class="form-hint">Укажите роль, грейд и количество человек</span>
            </div>

            <div class="form-group">
              <label class="form-label"><span>Фиксированные ограничения</span></label>
              <div class="checkbox-group">
                <label class="checkbox-item"><input type="checkbox" id="constraintScope" value="constraintScope"><span><span class="checkbox-label">Содержание (Fixed)</span></span></label>
                <label class="checkbox-item"><input type="checkbox" id="constraintTime" value="constraintTime"><span><span class="checkbox-label">Время (Fixed)</span></span></label>
                <label class="checkbox-item"><input type="checkbox" id="constraintCost" value="constraintCost"><span><span class="checkbox-label">Стоимость (Fixed)</span></span></label>
                <label class="checkbox-item"><input type="checkbox" id="constraintQuality" value="constraintQuality"><span><span class="checkbox-label">Качество (Fixed)</span></span></label>
              </div>
              <span class="form-hint">Влияет на профиль радара ограничений</span>
            </div>

            <div class="expert-field" style="display:none">
              <div class="form-group">
                <label class="form-label"><span>Фреймворк компетенций PM</span></label>
                <select id="competencyFramework">
                  <option value="none">— Не выбрано —</option>
                  <option value="icb">ICB (IPMA)</option>
                  <option value="pmcd">PMCD</option>
                  <option value="ocb">OCB</option>
                  <option value="icm">ICM PMO</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label"><span>ИИ-инструменты для PM</span></label>
                <div class="checkbox-group">
                  <label class="checkbox-item"><input type="checkbox" id="aiLSTM" value="lstm"><span><span class="checkbox-label">LSTM</span><span class="checkbox-hint">Прогнозы сроков (−10%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="aiCNN" value="cnn"><span><span class="checkbox-label">CNN</span><span class="checkbox-hint">Паттерны данных (−5%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="aiGRU" value="gru"><span><span class="checkbox-label">GRU</span><span class="checkbox-hint">Оптимизация (−8%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="aiMLP" value="mlp"><span><span class="checkbox-label">MLP</span><span class="checkbox-hint">Автоматизация (−12%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="aiRNN" value="rnn"><span><span class="checkbox-label">RNN</span><span class="checkbox-hint">Планирование (−7%)</span></span></label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label"><span>Стандарты ISO / PMI</span></label>
                <div class="checkbox-group">
                  <label class="checkbox-item"><input type="checkbox" id="std21502" value="iso21502"><span><span class="checkbox-label">ISO 21502</span><span class="checkbox-hint">Проекты (+15%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="std21504" value="iso21504"><span><span class="checkbox-label">ISO 21504</span><span class="checkbox-hint">Портфели (+20%)</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="std10006" value="iso10006"><span><span class="checkbox-label">ISO 10006</span><span class="checkbox-hint">Качество (+10%)</span></span></label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label"><span>Риск-фреймворки</span></label>
                <div class="checkbox-group">
                  <label class="checkbox-item"><input type="checkbox" id="riskPRAMG" value="pramg"><span><span class="checkbox-label">PRAMG</span><span class="checkbox-hint">Проектные риски</span></span></label>
                  <label class="checkbox-item"><input type="checkbox" id="riskSRMPPP" value="srmppp"><span><span class="checkbox-label">SRMPPP</span><span class="checkbox-hint">Корпоративные риски</span></span></label>
                </div>
              </div>
            </div>

            <div class="accordion reveal">
              <div class="accordion-header">
                <span>Артефакты проекта по фазам (PMBOK)</span>
                <span class="accordion-arrow">+</span>
              </div>
              <div class="accordion-content">
                <div class="phase-tabs" id="phaseTabs">
                  <button class="phase-tab active" data-phase="initiation">Инициация<span class="phase-count" id="count-initiation">0</span></button>
                  <button class="phase-tab" data-phase="planning">Планирование<span class="phase-count" id="count-planning">0</span></button>
                  <button class="phase-tab" data-phase="execution">Исполнение<span class="phase-count" id="count-execution">0</span></button>
                  <button class="phase-tab" data-phase="monitoring">Мониторинг<span class="phase-count" id="count-monitoring">0</span></button>
                  <button class="phase-tab" data-phase="closing">Завершение<span class="phase-count" id="count-closing">0</span></button>
                </div>
                <div id="phase-initiation" class="phase-content active"><div class="artifact-list" id="artifacts-initiation"></div></div>
                <div id="phase-planning" class="phase-content"><div class="artifact-list" id="artifacts-planning"></div></div>
                <div id="phase-execution" class="phase-content"><div class="artifact-list" id="artifacts-execution"></div></div>
                <div id="phase-monitoring" class="phase-content"><div class="artifact-list" id="artifacts-monitoring"></div></div>
                <div id="phase-closing" class="phase-content"><div class="artifact-list" id="artifacts-closing"></div></div>
                <div class="artifact-actions">
                  <button id="selectAllArtifacts" class="btn-secondary" style="width:auto;padding:8px 14px;font-size:10px;">Выбрать все</button>
                  <button id="deselectAllArtifacts" class="btn-secondary" style="width:auto;padding:8px 14px;font-size:10px;">Снять все</button>
                </div>
                <div class="artifact-summary">Выбрано: <span id="selectedCount">0</span> из <span id="totalCount">0</span> артефактов<br><span style="color:var(--accent)">■</span> рекомендуемые</div>
              </div>
            </div>

            <div class="accordion reveal">
              <div class="accordion-header">
                <span>⚙ Параметры расчёта</span>
                <span class="accordion-arrow">+</span>
              </div>
              <div class="accordion-content">
                <div class="form-group">
                  <label class="form-label"><span>Рабочих дней в неделе</span></label>
                  <input type="number" id="workDaysWeek" value="5" min="1" max="7">
                </div>
                <div class="form-group">
                  <label class="form-label"><span>Доступность команды (%)</span><span class="form-value">62.5%</span></label>
                  <input type="number" id="teamAvailability" value="62.5" min="10" max="100" step="0.5">
                  <span class="form-hint">4–5 часов из 8 = 50–62.5%</span>
                </div>
                <div class="form-group">
                  <label class="form-label"><span>Резерв на известные риски (%)</span></label>
                  <input type="number" id="knownRiskReserve" value="10" min="0" max="50">
                </div>
                <div class="form-group">
                  <label class="form-label"><span>Управленческий резерв (%)</span></label>
                  <input type="number" id="managementReserve" value="5" min="0" max="50">
                </div>
                <div class="form-group">
                  <label class="form-label"><span>Буфер на форс-мажор (%)</span></label>
                  <input type="number" id="edgeCaseBuffer" value="15" min="0" max="50">
                </div>
              </div>
            </div>

            <button id="calcBtn" class="btn-primary">РАССЧИТАТЬ ПРОЕКТ →</button>
            <button id="calibrateBtn" class="btn-secondary" style="width:100%;margin-top:12px;">Откалибровать по историческому проекту</button>
          </div>

          <!-- Правая панель -->
          <div class="calc-panel">
            <span class="panel-label">// output.result</span>
            <div id="resultContainer" class="result-container" style="display:none">
              <div class="result-value" id="durationRange">-- — -- дней</div>
              <div class="result-sub" id="effortRange">~ -- часов трудозатрат</div>

              <div class="accordion" style="margin-top:20px">
                <div class="accordion-header">
                  <span>Похожие проекты из базы данных</span>
                  <span class="accordion-arrow">+</span>
                </div>
                <div class="accordion-content active">
                  <div id="similarProjectsList" class="similar-projects-list">
                    <p class="form-hint">Выполните расчёт для отображения похожих проектов.</p>
                  </div>
                </div>
              </div>

              <div class="user-journey" style="margin-top:20px">
                <div class="journey-card optimistic"><h4>Оптимистичный</h4><div class="journey-value" id="journeyOptimistic">-- дней</div><span class="form-hint">Без рисков</span></div>
                <div class="journey-card base"><h4>Базовый</h4><div class="journey-value" id="journeyBase">-- дней</div><span class="form-hint">Стандартные условия</span></div>
                <div class="journey-card pessimistic"><h4>Пессимистичный</h4><div class="journey-value" id="journeyPessimistic">-- дней</div><span class="form-hint">Крайние риски</span></div>
              </div>
              <div class="accordion" style="margin-top:24px">
                <div class="accordion-header"><span>Загрузка по ролям команды</span><span class="accordion-arrow">+</span></div>
                <div class="accordion-content"><div id="roleLoadingBars" class="role-loading-bars"></div></div>
              </div>
              <div class="radar-container">
                <div class="radar-title">// профиль ограничений проекта</div>
                <svg id="radarChart" class="radar-svg" viewBox="0 0 300 300"></svg>
                <div class="radar-legend">
                  <div class="radar-legend-item">Неопределённость<br><span id="radar-uncertainty">--%</span></div>
                  <div class="radar-legend-item">Содержание<br><span id="radar-scope">--%</span></div>
                  <div class="radar-legend-item">Стоимость<br><span id="radar-cost">--%</span></div>
                  <div class="radar-legend-item">Качество<br><span id="radar-quality">--%</span></div>
                  <div class="radar-legend-item">Время<br><span id="radar-time">--%</span></div>
                </div>
              </div>
              <div class="artifact-actions" style="margin-top:20px">
                <button id="exportJSON" class="btn-export">↓ Экспорт JSON</button>
                <button id="exportCSV" class="btn-export">↓ Экспорт CSV</button>
              </div>
            </div>
            <div class="compatibility-warning" id="compatibilityWarning">
              ⚠ ПОГРЕШНОСТЬ: ±30% на ранних этапах. Коэффициенты требуют калибровки по данным вашей организации.
            </div>
          </div>
        </div>
      </section>

      <div id="contacts-container"></div>
    `;
  }
  ,

  // ── ADMIN (two tabs: KB entries + Tasks) ─────────────────────────────────
  renderAdmin() {
    return `
      <section class="page-hero">
        <div class="section-tag" style="color:var(--accent3)">◆ Панель администратора</div>
        <h1 class="font-display reveal">Управление<br>контентом</h1>
        <p class="hero-desc reveal font-mono" style="font-size:11px">Прямая ссылка: <code style="color:var(--accent)">#admin</code> · <a href="#home" style="color:var(--muted)">← На главную</a></p>
      </section>

      <div class="admin-tab-bar">
        <button class="admin-tab active" data-tab="kb" type="button">◆ База знаний</button>
        <button class="admin-tab" data-tab="tasks" type="button">◆ Задания</button>
        <button class="admin-tab" data-tab="projects" type="button">◆ Проекты</button>
      </div>

      <div id="admin-panel-kb" class="admin-tab-panel">
        ${KnowledgeBase.renderAdmin()}
      </div>
      <div id="admin-panel-tasks" class="admin-tab-panel" style="display:none">
        ${Cases.renderAdminTab()}
      </div>
      <div id="admin-panel-projects" class="admin-tab-panel" style="display:none">
        ${ProjectsData.renderAdminTab()}
      </div>

      <div id="contacts-container"></div>
    `;
  },

  _bindAdminTabs() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
          btn.classList.add('active');
          const panel = document.getElementById('admin-panel-' + btn.dataset.tab);
          if (panel) panel.style.display = '';
        });
      });
    });
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Components.renderAll({ rootPath: '' });

  Theme.init();
  Nav.init();
  Cursor.init();

  // "Связаться" — переходим на главную и скроллим к contacts
  document.addEventListener('click', e => {
    if (e.target.closest('#contact-cta-btn')) {
      e.preventDefault();
      const goAndScroll = () => {
        setTimeout(() => {
          const el = document.getElementById('contacts');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      };
      const hash = window.location.hash;
      if (!hash || hash === '#' || hash === '#home') {
        goAndScroll();
      } else {
        Router.navigate('#home');
        goAndScroll();
      }
    }
  });

  Router.init();

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const hash = window.location.hash;
      if (hash && hash !== '#home') {
        if (hash.startsWith('#case-')) {
          Router.navigate('#cases');
        } else {
          Router.navigate('#home');
        }
      }
    }
  });

  console.log(`ProjectWB v${Content.meta.version} loaded · ${Content.meta.year}`);
});

window.ProjectWB = { Content, Router, Cases, Resume, Utils, Theme };
