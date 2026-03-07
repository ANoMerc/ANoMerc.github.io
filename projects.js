// ─── PROJECTS MODULE ────────────────────────────────────────────────────────
// Хранилище исторических проектов. Используется калькулятором для оценки сроков.

const PROJECTS_KEY = 'projectwb-projects-v1';

const DEFAULT_PROJECTS = [
  {
    id: 'p001',
    name: 'Запуск e-commerce MVP',
    methodology: 'scrum',
    pmoType: 'small',
    teamSize: 4,
    duration_days: 62,
    artifacts: ['backlog', 'dod', 'burndown', 'pm-plan'],
    outcome: 'success',
    source: 'Clutch.co 2023 SMB Report',
    notes: 'Интернет-магазин на готовой платформе. 2-недельные спринты.'
  },
  {
    id: 'p002',
    name: 'CRM-интеграция для B2B SaaS',
    methodology: 'scrum',
    pmoType: 'corporate',
    teamSize: 6,
    duration_days: 95,
    artifacts: ['backlog', 'dod', 'burndown', 'pm-plan', 'risk-register', 'comm-plan'],
    outcome: 'success',
    source: 'PMI Pulse of the Profession 2022',
    notes: 'Интеграция Salesforce + внутренняя CRM. Дополнительно 3 нед на UAT.'
  },
  {
    id: 'p003',
    name: 'Мобильное приложение для курьеров',
    methodology: 'scrum',
    pmoType: 'small',
    teamSize: 5,
    duration_days: 78,
    artifacts: ['backlog', 'dod', 'burndown', 'pm-plan', 'status-report'],
    outcome: 'success',
    source: 'State of Agile 2023',
    notes: 'iOS+Android. React Native. Два параллельных спринта.'
  },
  {
    id: 'p004',
    name: 'Миграция ERP-системы (SAP)',
    methodology: 'waterfall',
    pmoType: 'corporate',
    teamSize: 14,
    duration_days: 390,
    artifacts: ['charter', 'pm-plan', 'wbs', 'schedule', 'budget', 'risk-register', 'comm-plan', 'baseline', 'stage-gate', 'final-report', 'lessons-learned'],
    outcome: 'partial',
    source: 'Gartner ERP Implementation Report 2022',
    notes: 'Задержка 6 нед из-за проблем с миграцией данных. Бюджет превышен на 22%.'
  },
  {
    id: 'p005',
    name: 'DevOps pipeline и CI/CD',
    methodology: 'kanban',
    pmoType: 'small',
    teamSize: 3,
    duration_days: 42,
    artifacts: ['board', 'wip-limits', 'cumulative-flow'],
    outcome: 'success',
    source: 'DORA State of DevOps 2023',
    notes: 'GitLab CI + Kubernetes. Команда DevOps из 3 инженеров.'
  },
  {
    id: 'p006',
    name: 'Внутренний HR-портал',
    methodology: 'kanban',
    pmoType: 'corporate',
    teamSize: 4,
    duration_days: 55,
    artifacts: ['board', 'wip-limits', 'service-levels', 'status-report'],
    outcome: 'success',
    source: 'Nielsen Norman Group 2022',
    notes: 'React + Node.js. Постепенный rollout по отделам.'
  },
  {
    id: 'p007',
    name: 'Банковское мобильное приложение',
    methodology: 'hybrid',
    pmoType: 'corporate',
    teamSize: 12,
    duration_days: 210,
    artifacts: ['charter', 'pm-plan', 'backlog', 'dod', 'risk-register', 'comm-plan', 'stage-gate', 'quality-audit', 'final-report'],
    outcome: 'success',
    source: 'Fintech Global 2023',
    notes: 'Waterfall для compliance, Scrum для фич. Два параллельных трека.'
  },
  {
    id: 'p008',
    name: 'Data warehouse + BI-дашборды',
    methodology: 'scrum',
    pmoType: 'corporate',
    teamSize: 7,
    duration_days: 130,
    artifacts: ['backlog', 'dod', 'burndown', 'pm-plan', 'risk-register', 'status-report', 'performance'],
    outcome: 'success',
    source: 'Gartner Analytics Report 2023',
    notes: 'Snowflake + dbt + Tableau. 4 трека данных параллельно.'
  },
  {
    id: 'p009',
    name: 'API Gateway и микросервисная архитектура',
    methodology: 'scrumban',
    pmoType: 'corporate',
    teamSize: 8,
    duration_days: 145,
    artifacts: ['backlog', 'board', 'wip-limits', 'dod', 'risk-register', 'pm-plan'],
    outcome: 'success',
    source: 'ThoughtWorks Technology Radar 2023',
    notes: 'Переход с монолита. 5 микросервисов. Постепенная миграция.'
  },
  {
    id: 'p010',
    name: 'Redesign продукта + Design System',
    methodology: 'scrum',
    pmoType: 'small',
    teamSize: 5,
    duration_days: 90,
    artifacts: ['backlog', 'dod', 'burndown', 'pm-plan', 'stakeholder-engagement'],
    outcome: 'success',
    source: 'InVision Design Maturity Report 2022',
    notes: 'UX-аудит + компонентная библиотека. 6 спринтов по 2 нед.'
  },
  {
    id: 'p011',
    name: 'Платёжный сервис (PCI DSS)',
    methodology: 'waterfall',
    pmoType: 'corporate',
    teamSize: 10,
    duration_days: 240,
    artifacts: ['charter', 'pm-plan', 'wbs', 'budget', 'risk-register', 'quality-plan', 'quality-audit', 'baseline', 'final-report', 'handover'],
    outcome: 'success',
    source: 'PCI Security Standards Council 2023',
    notes: 'Строгая документация для аудита. 2 внешних пентеста.'
  },
  {
    id: 'p012',
    name: 'Автоматизация складского учёта',
    methodology: 'lean',
    pmoType: 'small',
    teamSize: 4,
    duration_days: 68,
    artifacts: ['value-stream-map', 'kaizen-board', 'wip-limits', 'pm-plan'],
    outcome: 'success',
    source: 'Industry benchmark (warehousing)',
    notes: 'WMS интеграция + RFID. Value stream mapping показал 40% waste reduction.'
  },
  {
    id: 'p013',
    name: 'Enterprise портал для клиентов (SAFe)',
    methodology: 'safe',
    pmoType: 'corporate',
    teamSize: 25,
    duration_days: 270,
    artifacts: ['pi-planning', 'program-backlog', 'system-demo', 'inspect-adapt', 'risk-register', 'stage-gate', 'status-report'],
    outcome: 'partial',
    source: 'Scaled Agile Inc. Case Studies 2023',
    notes: '3 Agile Release Trains. PI-планирование каждые 10 нед. Проблемы с зависимостями между командами.'
  },
  {
    id: 'p014',
    name: 'SaaS онбординг и автоматизация',
    methodology: 'scrum',
    pmoType: 'small',
    teamSize: 3,
    duration_days: 45,
    artifacts: ['backlog', 'dod', 'burndown'],
    outcome: 'success',
    source: 'ProductLed.com 2023',
    notes: 'Feature flags + in-app tours. Быстрый цикл: 1-недельные спринты.'
  },
  {
    id: 'p015',
    name: 'Корпоративный документооборот (PRINCE2)',
    methodology: 'prince2',
    pmoType: 'corporate',
    teamSize: 9,
    duration_days: 175,
    artifacts: ['business-case', 'pm-plan', 'baseline', 'stage-gate', 'risk-register', 'comm-plan', 'final-report', 'lessons-learned', 'handover'],
    outcome: 'success',
    source: 'AXELOS PRINCE2 Case Study Library',
    notes: 'Интеграция с SAP. Жёсткий stage-gate контроль на каждом этапе.'
  }
];

const ProjectsData = {

  // ── Data layer ────────────────────────────────────────────────────────────

  getAll() {
    try {
      const raw = localStorage.getItem(PROJECTS_KEY);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    }
  },

  save(projects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  // ── Admin tab ─────────────────────────────────────────────────────────────

  renderAdminTab() {
    const projects = this.getAll();
    return `
      <div class="admin-topbar">
        <span class="font-mono" style="font-size:11px;color:var(--muted)">
          Проектов: <strong style="color:var(--accent)" id="proj-count">${projects.length}</strong>
        </span>
        <button class="btn-primary" id="proj-new-btn" type="button" style="width:auto">+ Добавить проект</button>
      </div>
      <div class="admin-list" id="proj-list">
        ${this._rows(projects)}
      </div>

      <div id="proj-form-overlay" class="kb-overlay">
        <div class="kb-modal" style="max-width:680px">
          <button class="kb-modal-close" id="proj-form-close" type="button" aria-label="Закрыть">✕</button>
          <div id="proj-form-inner"></div>
        </div>
      </div>

      <div id="proj-del-overlay" class="kb-overlay">
        <div class="kb-modal" style="max-width:380px;padding:40px">
          <p style="font-size:16px;margin-bottom:24px">Удалить проект из базы данных?</p>
          <div style="display:flex;gap:12px">
            <button class="btn-ghost" id="proj-del-cancel" type="button">Отмена</button>
            <button class="btn-primary" id="proj-del-ok" type="button" style="width:auto;background:var(--accent3)">Удалить</button>
          </div>
        </div>
      </div>
    `;
  },

  _rows(projects) {
    if (!projects.length) return '<p style="padding:40px 48px;color:var(--muted)">Проектов нет</p>';
    return projects.map(p => {
      const methodLabel = {
        waterfall:'Waterfall', scrum:'Scrum', kanban:'Kanban', safe:'SAFe',
        lean:'Lean', scrumban:'Scrumban', prince2:'PRINCE2', pm2:'PM²', hybrid:'Hybrid'
      }[p.methodology] || p.methodology;
      return `
        <div class="admin-row reveal">
          <div class="admin-row-main">
            <span class="admin-row-cat font-mono" style="color:var(--accent)">${methodLabel}</span>
            <span class="admin-row-title">${p.name}</span>
            <div class="admin-row-tags">
              <span class="skill-tag">${p.duration_days} дн.</span>
              <span class="skill-tag">${p.teamSize} чел.</span>
              <span class="skill-tag">${p.pmoType === 'corporate' ? 'Corp' : 'Small'}</span>
              <span class="skill-tag" style="color:${p.outcome==='success'?'var(--accent2)':p.outcome==='partial'?'var(--accent4)':'var(--accent3)'}">${p.outcome==='success'?'✓':p.outcome==='partial'?'~':'✗'}</span>
            </div>
          </div>
          <div class="admin-row-actions">
            <button class="btn-ghost proj-edit-btn" data-id="${p.id}" type="button">Изменить</button>
            <button class="btn-ghost proj-del-btn" data-id="${p.id}" type="button"
                    style="border-color:var(--accent3);color:var(--accent3)">Удалить</button>
          </div>
        </div>`;
    }).join('');
  },

  _formHtml(proj = null) {
    const v = (f, d = '') => proj ? (proj[f] != null ? proj[f] : d) : d;
    const methodOpts = [
      ['waterfall','Waterfall'],['scrum','Scrum'],['kanban','Kanban'],['safe','SAFe'],
      ['lean','Lean'],['scrumban','Scrumban'],['prince2','PRINCE2'],['pm2','PM²'],['hybrid','Hybrid']
    ].map(([k,l]) => `<option value="${k}"${v('methodology')===k?' selected':''}>${l}</option>`).join('');
    const outcomeOpts = [
      ['success','Успех'],['partial','Частичный'],['fail','Провал']
    ].map(([k,l]) => `<option value="${k}"${v('outcome')===k?' selected':''}>${l}</option>`).join('');
    return `
      <h3 class="font-display" style="font-size:22px;margin-bottom:28px">${proj ? 'Редактировать проект' : 'Новый проект'}</h3>
      <div class="admin-form">
        <div class="admin-field">
          <label class="admin-label font-mono">Название проекта *</label>
          <input class="admin-input" id="pf-name" value="${v('name').replace(/"/g,'&quot;')}" placeholder="Например: Запуск e-commerce MVP">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="admin-field">
            <label class="admin-label font-mono">Методология *</label>
            <select class="admin-input" id="pf-method">${methodOpts}</select>
          </div>
          <div class="admin-field">
            <label class="admin-label font-mono">Тип PMO</label>
            <select class="admin-input" id="pf-pmo">
              <option value="small"${v('pmoType')==='small'?' selected':''}>Малая команда</option>
              <option value="corporate"${v('pmoType')==='corporate'?' selected':''}>Корпоративный PMO</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          <div class="admin-field">
            <label class="admin-label font-mono">Размер команды (чел.) *</label>
            <input class="admin-input" id="pf-team" type="number" min="1" max="200" value="${v('teamSize', 5)}">
          </div>
          <div class="admin-field">
            <label class="admin-label font-mono">Длительность (дней) *</label>
            <input class="admin-input" id="pf-duration" type="number" min="1" value="${v('duration_days', 90)}">
          </div>
          <div class="admin-field">
            <label class="admin-label font-mono">Результат</label>
            <select class="admin-input" id="pf-outcome">${outcomeOpts}</select>
          </div>
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Источник / Ссылка</label>
          <input class="admin-input" id="pf-source" value="${v('source').replace(/"/g,'&quot;')}" placeholder="URL или название источника">
        </div>
        <div class="admin-field">
          <label class="admin-label font-mono">Заметки</label>
          <textarea class="admin-input admin-textarea" id="pf-notes" style="min-height:60px">${v('notes')}</textarea>
        </div>
        <div style="display:flex;gap:12px;margin-top:12px">
          <button class="btn-ghost" id="pf-cancel" type="button">Отмена</button>
          <button class="btn-primary" id="pf-save" type="button" style="width:auto">
            ${proj ? 'Сохранить' : 'Добавить проект'}
          </button>
        </div>
      </div>`;
  },

  _openForm(projId = null) {
    const proj = projId ? this.getAll().find(p => p.id === projId) : null;
    document.getElementById('proj-form-inner').innerHTML = this._formHtml(proj);
    document.getElementById('proj-form-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('pf-cancel').addEventListener('click', () => {
      document.getElementById('proj-form-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    document.getElementById('pf-save').addEventListener('click', () => this._saveForm(projId));
  },

  _saveForm(editId = null) {
    const get = id => document.getElementById(id);
    const name = get('pf-name').value.trim();
    const duration = parseInt(get('pf-duration').value);
    const teamSize = parseInt(get('pf-team').value);
    if (!name || !duration || !teamSize) {
      this._toast('⚠ Заполните обязательные поля', true); return;
    }
    const payload = {
      name,
      methodology: get('pf-method').value,
      pmoType: get('pf-pmo').value,
      teamSize,
      duration_days: duration,
      outcome: get('pf-outcome').value,
      source: get('pf-source').value.trim(),
      notes: get('pf-notes').value.trim(),
      artifacts: [],
    };
    const projects = this.getAll();
    if (editId) {
      const idx = projects.findIndex(p => p.id === editId);
      if (idx !== -1) projects[idx] = { ...projects[idx], ...payload };
      this._toast('✓ Проект обновлён');
    } else {
      payload.id = 'proj_' + Date.now();
      projects.unshift(payload);
      this._toast('✓ Проект добавлен');
    }
    this.save(projects);
    document.getElementById('proj-form-overlay').classList.remove('active');
    document.body.style.overflow = '';
    this._refresh();
  },

  _refresh() {
    const projects = this.getAll();
    const list = document.getElementById('proj-list');
    if (list) { list.innerHTML = this._rows(projects); this._bindEvents(); }
    const cnt = document.getElementById('proj-count');
    if (cnt) cnt.textContent = projects.length;
    if (typeof Animations !== 'undefined') Animations.init();
  },

  _bindEvents() {
    document.querySelectorAll('.proj-edit-btn').forEach(btn =>
      btn.addEventListener('click', () => this._openForm(btn.dataset.id)));
    let delId = null;
    document.querySelectorAll('.proj-del-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        delId = btn.dataset.id;
        document.getElementById('proj-del-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      }));
    document.getElementById('proj-del-cancel')?.addEventListener('click', () => {
      document.getElementById('proj-del-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    document.getElementById('proj-del-ok')?.addEventListener('click', () => {
      if (delId) {
        this.save(this.getAll().filter(p => p.id !== delId));
        this._toast('✓ Проект удалён');
        delId = null;
      }
      document.getElementById('proj-del-overlay').classList.remove('active');
      document.body.style.overflow = '';
      this._refresh();
    });
  },

  initAdmin() {
    document.getElementById('proj-new-btn')?.addEventListener('click', () => this._openForm());
    document.getElementById('proj-form-close')?.addEventListener('click', () => {
      document.getElementById('proj-form-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
    this._bindEvents();
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
