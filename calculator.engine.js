/**
ProjectWB Calculator Engine v2.0
Оценка длительности проекта на основе базы исторических данных.
Логика:
1. Находим похожие проекты (методология + размер команды)
2. Нормализуем их длительность под текущую команду
3. Применяем модификаторы (PM grade, PMO, артефакты, резервы)
4. Строим оптимистичный / базовый / пессимистичный сценарий
*/

const CalculatorEngine = (() => {

  // Группировка методологий по семейству
  const METHOD_GROUPS = {
    waterfall: ['waterfall', 'prince2', 'pm2'],
    agile:     ['scrum', 'kanban', 'lean', 'scrumban'],
    scaled:    ['safe'],
    hybrid:    ['hybrid', 'scrumban'],
  };

  // Скорость команды по размеру (эффект Брукса: большая команда — коммуникационные потери)
  // Коэффициент эффективности команды от 1 до N человек
  const teamEfficiency = (n) => {
    if (n <= 3)  return 1.00;
    if (n <= 6)  return 0.92;
    if (n <= 10) return 0.82;
    if (n <= 20) return 0.70;
    return 0.58;
  };

  // Находим похожие проекты и рассчитываем их вес
  const findSimilar = (projects, inputs) => {
    const totalPeople = Math.max(1, inputs.teamRoles.reduce((s, r) => s + r.count, 0));
    const inputGroup  = Object.keys(METHOD_GROUPS).find(g => METHOD_GROUPS[g].includes(inputs.methodology)) || 'agile';

    return projects
      .map(p => {
        const pGroup = Object.keys(METHOD_GROUPS).find(g => METHOD_GROUPS[g].includes(p.methodology)) || 'agile';

        // Сходство по методологии
        let mScore = 0.15;
        if (p.methodology === inputs.methodology) mScore = 1.0;
        else if (pGroup === inputGroup)           mScore = 0.65;
        else if (Math.abs(Object.keys(METHOD_GROUPS).indexOf(pGroup) - Object.keys(METHOD_GROUPS).indexOf(inputGroup)) === 1) mScore = 0.35;

        // Сходство по типу PMO
        const pmoScore = (p.pmoType === inputs.pmoType) ? 1.0 : 0.7;

        // Сходство по размеру команды (ближе → вес выше)
        const pSize  = p.teamSize || 5;
        const ratio  = Math.min(totalPeople, pSize) / Math.max(totalPeople, pSize);
        const sScore = 0.4 + 0.6 * ratio; // min 0.4, max 1.0

        const score = mScore * 0.55 + pmoScore * 0.15 + sScore * 0.30;
        return { ...p, _score: score, _pSize: pSize };
      })
      .filter(p => p._score >= 0.42)
      .sort((a, b) => b._score - a._score)
      .slice(0, 7);
  };

  // Нормализуем длительность проекта под текущий размер команды
  // Идея: длительность ~ effort / (people * efficiency)
  // effort = duration * teamSize * efficiency(teamSize)
  const normalizeDuration = (proj, targetPeople) => {
    const pEff    = teamEfficiency(proj._pSize);
    const tEff    = teamEfficiency(targetPeople);
    const effort  = proj.duration_days * proj._pSize * pEff;
    return effort / (targetPeople * tEff);
  };

  // Взвешенное среднее нормализованных длительностей
  const weightedAvgDays = (similar, inputs) => {
    const totalPeople = Math.max(1, inputs.teamRoles.reduce((s, r) => s + r.count, 0));
    let sumW = 0, sumD = 0;
    similar.forEach(p => {
      const nd = normalizeDuration(p, totalPeople);
      sumD += nd * p._score;
      sumW += p._score;
    });
    return sumW > 0 ? sumD / sumW : 90;
  };

  // ── Основной расчёт ────────────────────────────────────────────────────────
  const calculate = (inputs) => {
    const allProjects = (typeof ProjectsData !== 'undefined') ? ProjectsData.getAll() : [];
    const similar     = findSimilar(allProjects, inputs);

    // Базовая оценка из исторических данных (без модификаторов)
    const baseDays = similar.length > 0
      ? weightedAvgDays(similar, inputs)
      : _fallbackDays(inputs); // если нет похожих проектов

    // Применяем модификаторы (только организационные/командные, не артефакты)
    let days = baseDays;
    days *= CONFIG.PM_GRADE_COEFFS[inputs.pmGrade] || 1;
    days *= CONFIG.PMO_COEFFS[inputs.pmoType]      || 1;
    if (inputs.competencyFramework && inputs.competencyFramework !== 'none') {
      days *= CONFIG.COMPETENCY_COEFFS[inputs.competencyFramework] || 1;
    }
    if (inputs.aiModels && inputs.aiModels.length) {
      inputs.aiModels.forEach(m => { days *= CONFIG.AI_COEFFS[m] || 1; });
    }
    if (inputs.standards && inputs.standards.length) {
      inputs.standards.forEach(s => { days *= CONFIG.STANDARD_COEFFS[s] || 1; });
    }

    // Коэффициент сложности команды (грейды)
    let gradeWeight = 0, totalPeople = 0;
    inputs.teamRoles.forEach(r => {
      gradeWeight += r.count * (CONFIG.PM_GRADE_COEFFS[r.grade] ?? 1.0);
      totalPeople += r.count;
    });
    if (totalPeople > 0) days *= gradeWeight / totalPeople;

    // Накладные расходы от артефактов (без них это чистая базовая оценка)
    const artifactOverhead = 1 + inputs.selectedArtifactCount * CONFIG.ARTIFACT_TIME_COEFF;
    const daysWithArtifacts = days * artifactOverhead;

    // Резервы
    const total = daysWithArtifacts * (1
      + inputs.knownRiskReserve  / 100
      + inputs.managementReserve / 100
      + inputs.edgeCaseBuffer    / 100);

    // Диапазоны: scatter зависит от количества похожих проектов
    const scatter = similar.length >= 5 ? 0.22 : similar.length >= 3 ? 0.27 : 0.35;
    const optimistic  = Math.max(1, Math.round(total * (1 - scatter) * 0.90));
    const pessimistic = Math.round(total * (1 + scatter) * 1.10);

    // Трудозатраты (примерные часы)
    const hoursPerDay  = (inputs.teamAvailability / 100) * 8;
    const effort       = Math.round(daysWithArtifacts * Math.max(1, totalPeople) * hoursPerDay);

    return {
      baseDaysRaw:    Math.round(baseDays),           // из истории, без модификаторов
      baseDays:       Math.round(days),               // с модификаторами, без артефактов
      duration:       Math.round(total),              // финальная оценка
      optimistic,
      base:           Math.round(total),
      pessimistic,
      effort,
      similarProjects: similar,
    };
  };

  // Фоллбэк если нет исторических данных (грубая эвристика)
  const _fallbackDays = (inputs) => {
    const totalPeople = Math.max(1, inputs.teamRoles.reduce((s, r) => s + r.count, 0));
    const base = 45 + totalPeople * 8;
    const mCoeff = CONFIG.METHODOLOGY_COEFFS[inputs.methodology] || 1;
    return base * mCoeff;
  };

  // ── Расчёт радара ─────────────────────────────────────────────────────────
  const calcRadarValues = (inputs) => {
    const mRisk = CONFIG.METHODOLOGY_RISK[inputs.methodology] || 20;
    const constraintRisk  = inputs.fixedConstraints.length * 5;
    const artifactFactor  = Math.min(10, inputs.selectedArtifactCount * 0.4);
    const uncertainty     = Math.min(80, 15 + mRisk * 0.4 + constraintRisk + artifactFactor);
    const scopeFixed      = inputs.fixedConstraints.includes('constraintScope') ? 20 : 0;
    const scope           = Math.min(75, 20 + Math.min(20, inputs.selectedArtifactCount * 0.8) + scopeFixed);
    const pmoCost         = inputs.pmoType === 'corporate' ? 10 : 3;
    const stdCost         = inputs.standards ? inputs.standards.length * 4 : 0;
    const costFixed       = inputs.fixedConstraints.includes('constraintCost') ? 15 : 0;
    const cost            = Math.min(75, 20 + pmoCost + stdCost + costFixed);
    const stdQuality      = inputs.standards && inputs.standards.includes('iso10006') ? 15 : (inputs.standards ? inputs.standards.length * 5 : 0);
    const qualityFixed    = inputs.fixedConstraints.includes('constraintQuality') ? 15 : 0;
    const quality         = Math.min(75, 25 + stdQuality + qualityFixed);
    const methodTime      = inputs.methodology === 'waterfall' ? 8 : inputs.methodology === 'scrum' ? -4 : 0;
    const timeFixed       = inputs.fixedConstraints.includes('constraintTime') ? 18 : 0;
    const time            = Math.min(75, Math.max(5, 22 + methodTime + timeFixed));
    return {
      uncertainty: Math.round(uncertainty),
      scope:       Math.round(scope),
      cost:        Math.round(cost),
      quality:     Math.round(quality),
      time:        Math.round(time),
    };
  };

  // ── Рендер радара (SVG) ───────────────────────────────────────────────────
  const renderRadar = (values) => {
    const svg = document.getElementById('radarChart');
    if (!svg) return;
    const AXES = [
      { id: 'uncertainty', label: 'Неопределённость', color: 'var(--accent5)', angle: -90 },
      { id: 'scope',       label: 'Содержание',       color: 'var(--accent)',  angle: -18 },
      { id: 'cost',        label: 'Стоимость',         color: 'var(--accent4)', angle:  54 },
      { id: 'quality',     label: 'Качество',          color: 'var(--accent2)', angle: 126 },
      { id: 'time',        label: 'Время',             color: 'var(--accent3)', angle: 198 },
    ];
    const polar = (cx, cy, r, deg) => {
      const rad = deg * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    const cx = 150, cy = 150, R = 90;
    let html = '';
    [0.25, 0.5, 0.75, 1].forEach(lvl => {
      const pts = AXES.map(a => { const p = polar(cx, cy, R * lvl, a.angle); return `${p.x},${p.y}`; }).join(' ');
      html += `<polygon points="${pts}" fill="none" stroke="var(--border-bright)" stroke-width="1" opacity="0.6"/>`;
    });
    AXES.forEach(a => {
      const end   = polar(cx, cy, R, a.angle);
      const label = polar(cx, cy, R + 26, a.angle);
      html += `<line x1="${cx}" y1="${cy}" x2="${end.x}" y2="${end.y}" stroke="var(--border-bright)" stroke-width="1"/>`;
      html += `<text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle" fill="${a.color}" font-family="Space Mono" font-size="8.5">${a.label}</text>`;
    });
    const dataPts = AXES.map(a => {
      const val = Math.min(100, Math.max(0, values[a.id] || 0));
      const p   = polar(cx, cy, R * (val / 100), a.angle);
      return `${p.x},${p.y}`;
    }).join(' ');
    html += `<polygon points="${dataPts}" fill="rgba(200,245,66,0.18)" stroke="var(--accent)" stroke-width="2"/>`;
    AXES.forEach(a => {
      const val = Math.min(100, Math.max(0, values[a.id] || 0));
      const p   = polar(cx, cy, R * (val / 100), a.angle);
      html += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${a.color}"/>`;
      const el = document.getElementById(`radar-${a.id}`);
      if (el) el.textContent = `${Math.round(val)}%`;
    });
    svg.innerHTML = html;
  };

  return { calculate, calcRadarValues, renderRadar, findSimilar };
})();

if (typeof module !== 'undefined' && module.exports) { module.exports = { CalculatorEngine }; }
