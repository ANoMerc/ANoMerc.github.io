/**
════════════════════════════════════════════════════════════════════════════
NCOM Calculator App v1.0
════════════════════════════════════════════════════════════════════════════
Точка входа приложения. Инициализирует все модули в правильном порядке.

Порядок загрузки (через HTML):
1. config/calculator.config.js
2. engine/recommendation.engine.js
3. engine/calculator.engine.js
4. app/ui.module.js
5. app/form.module.js
6. app/calculator.app.js (этот файл)
*/

// ─── МОДУЛЬ АРТЕФАКТОВ (локальный, зависит от RecommendationEngine) ───────
const ArtifactModule = (() => {
  let currentPhase    = 'initiation';
  let artifactsByPhase = {};

  const init = () => {
    // Делегирование на контейнер табов
    const tabsContainer = document.getElementById('phaseTabs');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', e => {
        const tab = e.target.closest('.phase-tab');
        if (tab && tab.dataset.phase) switchPhase(tab.dataset.phase);
      });
    }

    // Кнопки "Выбрать все" / "Снять все"
    document.getElementById('selectAllArtifacts')?.addEventListener('click', () => {
      toggleAll(true);
    });
    document.getElementById('deselectAllArtifacts')?.addEventListener('click', () => {
      toggleAll(false);
    });
  };

  const switchPhase = (phase) => {
    currentPhase = phase;
    document.querySelectorAll('.phase-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.phase === phase)
    );
    document.querySelectorAll('.phase-content').forEach(c =>
      c.classList.toggle('active', c.id === `phase-${phase}`)
    );
  };

  const render = (artifacts) => {
    artifactsByPhase = JSON.parse(JSON.stringify(artifacts));
    Object.keys(artifactsByPhase).forEach(phase => {
      const listEl = document.getElementById(`artifacts-${phase}`);
      const countEl = document.getElementById(`count-${phase}`);
      if (!listEl) return;

      const items = artifactsByPhase[phase];
      if (countEl) countEl.textContent = items.length;

      listEl.innerHTML = items.map(a => {
        const isRec = !!a.recommended;
        const isChecked = !!a.checked;
        return `<label class="artifact-item${isRec ? ' recommended' : ''}${isChecked ? ' selected' : ''}">
          <input type="checkbox" class="artifact-checkbox" value="${a.id}"${isChecked ? ' checked' : ''}>
          <span class="artifact-name">${a.name}</span>
          ${isRec ? '<span class="artifact-rec-badge">рек.</span>' : ''}
        </label>`;
      }).join('');

      listEl.addEventListener('change', handleArtifactChange);
    });

    updateSummary();
  };

  const handleArtifactChange = (e) => {
    const cb   = e.target;
    if (!cb.classList.contains('artifact-checkbox')) return;
    const item = cb.closest('.artifact-item');
    if (item) item.classList.toggle('selected', cb.checked);
    updateSummary();
  };

  const toggleAll = (checked) => {
    document.querySelectorAll('.artifact-checkbox').forEach(cb => {
      cb.checked = checked;
      const item = cb.closest('.artifact-item');
      if (item) item.classList.toggle('selected', checked);
    });
    updateSummary();
  };

  const updateSummary = () => {
    const all      = document.querySelectorAll('.artifact-checkbox');
    const selected = document.querySelectorAll('.artifact-checkbox:checked');
    const selEl = document.getElementById('selectedCount');
    const totEl = document.getElementById('totalCount');
    if (selEl) selEl.textContent = selected.length;
    if (totEl) totEl.textContent = all.length;
    return selected.length;
  };

  return { init, render };
})();

// ─── ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация UI (курсор, скролл, анимации)
  UIModule.init();
  
  // 2. Инициализация артефактов (табы, чекбоксы)
  ArtifactModule.init();
  
  // 3. Инициализация форм (валидация, кнопки, роли)
  FormModule.init();
  
  // 4. Первоначальный рендер артефактов по умолчанию (waterfall + corporate)
  const defaultArtifacts = RecommendationEngine.buildArtifacts({
    methodology: 'waterfall',
    pmoType: 'corporate',
    standards: [],
    riskFrameworks: [],
    competencyFramework: 'none'
  });
  ArtifactModule.render(defaultArtifacts);
  
  // 5. Логирование для отладки
  console.log('[NCOM Calculator v5.1] Инициализация завершена');
  console.log('[NCOM Calculator v5.1] Модули:', {
    config: typeof CONFIG !== 'undefined',
    recommendation: typeof RecommendationEngine !== 'undefined',
    calculator: typeof CalculatorEngine !== 'undefined',
    ui: typeof UIModule !== 'undefined',
    form: typeof FormModule !== 'undefined'
  });
});
