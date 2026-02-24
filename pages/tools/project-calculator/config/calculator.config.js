/**
════════════════════════════════════════════════════════════════════════════
NCOM Calculator Configuration v1.0
════════════════════════════════════════════════════════════════════════════
Содержит:
- Коэффициенты методологий, PMO, грейдов
- ИИ-инструменты и стандарты
- Роли команды с доменами
- Артефакты по фазам PMBOK
- Рекомендации по методологиям
*/

const CONFIG = {
  // Коэффициенты усилий по методологии
  METHODOLOGY_COEFFS: {
    waterfall: 1.00, scrum: 0.85, kanban: 0.90, safe: 1.30,
    lean: 0.88, scrumban: 0.87, prince2: 1.20, pm2: 1.10, hybrid: 0.95
  },
  // Базовые риски методологии (0–35) — для радара
  METHODOLOGY_RISK: {
    waterfall: 25, scrum: 18, kanban: 15, safe: 30,
    lean: 18, scrumban: 18, prince2: 22, pm2: 20, hybrid: 22
  },
  PMO_COEFFS:        { small: 0.85, corporate: 1.25 },
  PM_GRADE_COEFFS:   { junior: 1.20, middle: 1.00, senior: 0.85 },
  COMPETENCY_COEFFS: { none: 1.00, icb: 0.95, pmcd: 0.93, ocb: 0.90, icm: 0.88 },
  AI_COEFFS:         { lstm: 0.90, cnn: 0.95, gru: 0.92, mlp: 0.88, rnn: 0.93 },
  STANDARD_COEFFS:   { iso21502: 1.15, iso21504: 1.20, iso10006: 1.10 },
  ARTIFACT_TIME_COEFF: 0.010,
  ROLE_COMPLEXITY: {
    frontend: 1.0, backend: 1.1, fullstack: 1.15, qa: 0.8, devops: 1.2,
    analyst: 0.9, designer: 0.8, pm: 1.0, architect: 1.3, security: 1.2,
    data: 1.1, mobile: 1.1
  },
  ROLE_LABELS: {
    frontend:  'Frontend Developer',
    backend:   'Backend Developer',
    fullstack: 'Fullstack Developer',
    qa:        'QA Engineer',
    devops:    'DevOps / Infra',
    analyst:   'Business Analyst',
    designer:  'UX/UI Designer',
    pm:        'Project Manager',
    architect: 'Software Architect',
    security:  'Security Engineer',
    data:      'Data Engineer',
    mobile:    'Mobile Developer'
  },
  // Сферы экспертности по типу роли
  ROLE_DOMAINS: {
    frontend:  ['Web', 'Mobile Web', 'Desktop (Electron)'],
    backend:   ['API / REST', 'Microservices', 'Monolith', 'GraphQL'],
    fullstack: ['Web', 'Mobile', 'SaaS'],
    qa:        ['Manual', 'Automation', 'Performance', 'Security'],
    devops:    ['CI/CD', 'Cloud (AWS/GCP/Azure)', 'On-premise', 'Kubernetes'],
    analyst:   ['Business', 'System', 'Data', 'Process'],
    designer:  ['Product Design', 'UX Research', 'UI/Visual'],
    pm:        ['IT Projects', 'Product', 'Enterprise', 'Agile Coaching'],
    architect: ['Solution', 'Enterprise', 'Data', 'Security'],
    security:  ['AppSec', 'Cloud Security', 'Compliance'],
    data:      ['Analytics', 'ML/AI', 'Data Engineering', 'BI'],
    mobile:    ['iOS', 'Android', 'Cross-platform (RN/Flutter)']
  },
  // Обязательные и рекомендуемые артефакты по методологии
  METHODOLOGY_ARTIFACTS: {
    waterfall:  { recommended: ['wbs', 'schedule', 'baseline', 'pm-plan', 'budget', 'risk-register', 'comm-plan'] },
    scrum:      { recommended: ['backlog', 'dod', 'pm-plan', 'burndown', 'performance'] },
    kanban:     { recommended: ['board', 'wip-limits', 'service-levels', 'cumulative-flow'] },
    safe:       { recommended: ['pi-planning', 'program-backlog', 'system-demo', 'inspect-adapt'] },
    lean:       { recommended: ['value-stream-map', 'kaizen-board', 'wip-limits'] },
    scrumban:   { recommended: ['board', 'backlog', 'wip-limits', 'burndown'] },
    prince2:    { recommended: ['business-case', 'pm-plan', 'baseline', 'stage-gate', 'risk-register'] },
    pm2:        { recommended: ['pm-plan', 'schedule', 'budget', 'risk-register', 'comm-plan'] },
    hybrid:     { recommended: ['backlog', 'dod', 'schedule', 'pm-plan', 'burndown'] }
  },
  // Артефакты по фазам PMBOK
  ARTIFACTS_BY_PHASE: {
    initiation: [
      { id: 'charter',               name: 'Устав проекта' },
      { id: 'stakeholders',          name: 'Реестр заинтересованных сторон' },
      { id: 'business-case',         name: 'Бизнес-кейс' },
      { id: 'feasibility',           name: 'Анализ осуществимости' },
      { id: 'governance',            name: 'Framework управления' },
      { id: 'competency-assessment', name: 'Competency Assessment' }
    ],
    planning: [
      { id: 'pm-plan',          name: 'План управления проектом' },
      { id: 'wbs',              name: 'WBS (структура работ)' },
      { id: 'schedule',         name: 'Календарный план' },
      { id: 'budget',           name: 'Бюджет проекта' },
      { id: 'risk-register',    name: 'Реестр рисков' },
      { id: 'comm-plan',        name: 'План коммуникаций' },
      { id: 'baseline',         name: 'Базовый план (Baseline)' },
      { id: 'backlog',          name: 'Product Backlog' },
      { id: 'dod',              name: 'Definition of Done' },
      { id: 'board',            name: 'Kanban Board' },
      { id: 'wip-limits',       name: 'WIP Limits' },
      { id: 'pi-planning',      name: 'PI Planning' },
      { id: 'program-backlog',  name: 'Program Backlog' },
      { id: 'value-stream-map', name: 'Value Stream Map' },
      { id: 'risk-mitigation',  name: 'Risk Mitigation Plan' },
      { id: 'service-levels',   name: 'Service Level Agreements' }
    ],
    execution: [
      { id: 'deliverables',    name: 'Продуктовые артефакты' },
      { id: 'change-log',      name: 'Журнал изменений' },
      { id: 'quality-audit',   name: 'Аудит качества' },
      { id: 'team-training',   name: 'План обучения команды' },
      { id: 'quality-plan',    name: 'Quality Management Plan' },
      { id: 'system-demo',     name: 'System Demo' },
      { id: 'kaizen-board',    name: 'Kaizen Board' }
    ],
    monitoring: [
      { id: 'status-report',         name: 'Отчёт о статусе' },
      { id: 'performance',           name: 'Метрики производительности' },
      { id: 'risk-monitoring',       name: 'Мониторинг рисков' },
      { id: 'stakeholder-engagement',name: 'Матрица вовлечённости' },
      { id: 'burndown',              name: 'Burndown Chart' },
      { id: 'stage-gate',            name: 'Stage Gate Reviews' },
      { id: 'cumulative-flow',       name: 'Cumulative Flow Diagram' },
      { id: 'inspect-adapt',         name: 'Inspect & Adapt' }
    ],
    closing: [
      { id: 'final-report',    name: 'Итоговый отчёт' },
      { id: 'lessons-learned', name: 'Уроки проекта' },
      { id: 'handover',        name: 'Акт передачи' },
      { id: 'archive',         name: 'Архив документации' }
    ]
  }
};

// Экспорт для совместимости
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG };
}
