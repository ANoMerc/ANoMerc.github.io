/**
════════════════════════════════════════════════════════════════════════════
ProjectWB Recommendation Engine v1.3
════════════════════════════════════════════════════════════════════════════
Система рекомендаций артефактов на основе:
- Методологии проекта
- Типа PMO
- Стандартов (ISO/PMI)
- Риск-фреймворков
- Фреймворка компетенций
*/

const RecommendationEngine = (() => {
  // Построение рекомендаций по артефактам
  const buildArtifacts = (inputs) => {
    // Глубокая копия конфига
    const phases = JSON.parse(JSON.stringify(CONFIG.ARTIFACTS_BY_PHASE));
    const methodRec = (CONFIG.METHODOLOGY_ARTIFACTS[inputs.methodology]?.recommended) || [];

    // 1. Базовые рекомендации по методологии
    Object.keys(phases).forEach(phase => {
      phases[phase].forEach(a => {
        if (methodRec.includes(a.id)) {
          a.recommended = true;
          a.checked = true;
        } else {
          a.recommended = false;
          a.checked = false;
        }
      });
    });

    // 2. Корпоративный PMO — дополнительно рекомендует governance + stage-gate
    if (inputs.pmoType === 'corporate') {
      const g = phases.initiation.find(a => a.id === 'governance');
      if (g && !g.recommended) { g.recommended = true; g.checked = true; }
      const sg = phases.monitoring.find(a => a.id === 'stage-gate');
      if (sg && !sg.recommended) { sg.recommended = true; sg.checked = true; }
    }

    // 3. ISO 10006 → quality-plan
    if (inputs.standards && inputs.standards.includes('iso10006')) {
      const qp = phases.execution.find(a => a.id === 'quality-plan');
      if (qp && !qp.recommended) { qp.recommended = true; qp.checked = true; }
    }

    // 4. PRAMG → risk-mitigation
    if (inputs.riskFrameworks && inputs.riskFrameworks.includes('pramg')) {
      const rm = phases.planning.find(a => a.id === 'risk-mitigation');
      if (rm && !rm.recommended) { rm.recommended = true; rm.checked = true; }
    }

    // 5. Фреймворк компетенций → competency-assessment
    if (inputs.competencyFramework && inputs.competencyFramework !== 'none') {
      const ca = phases.initiation.find(a => a.id === 'competency-assessment');
      if (ca && !ca.recommended) { ca.recommended = true; ca.checked = true; }
    }

    return phases;
  };

  // Получение количества выбранных артефактов
  const getSelectedCount = () => {
    return document.querySelectorAll('.artifact-checkbox:checked').length;
  };

  return {
    buildArtifacts,
    getSelectedCount
  };
})();

// Экспорт для совместимости
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RecommendationEngine };
}
