/**
════════════════════════════════════════════════════════════════════════════
ProjectWB Calculator Engine v1.3
════════════════════════════════════════════════════════════════════════════
Калькулятор характеристик проекта:
- Трудозатраты (effort)
- Длительность (duration)
- Профиль ограничений (radar)
*/

const CalculatorEngine = (() => {
  // Расчёт трудозатрат и длительности
  const calculate = (inputs) => {
    let effort = inputs.baseEffort;

    // Применяем коэффициенты
    effort *= CONFIG.METHODOLOGY_COEFFS[inputs.methodology] || 1;
    effort *= CONFIG.PMO_COEFFS[inputs.pmoType] || 1;
    effort *= CONFIG.PM_GRADE_COEFFS[inputs.pmGrade] || 1;
    effort *= CONFIG.COMPETENCY_COEFFS[inputs.competencyFramework] || 1;

    // ИИ-инструменты
    if (inputs.aiModels) {
      inputs.aiModels.forEach(m => { effort *= CONFIG.AI_COEFFS[m] || 1; });
    }

    // Стандарты
    if (inputs.standards) {
      inputs.standards.forEach(s => { effort *= CONFIG.STANDARD_COEFFS[s] || 1; });
    }

    // Коэффициент команды
    let teamWeight = 0, totalPeople = 0;
    inputs.teamRoles.forEach(r => {
      const grade = CONFIG.PM_GRADE_COEFFS[r.grade] ?? 1.0;
      const complexity = CONFIG.ROLE_COMPLEXITY[r.type] ?? 1.0;
      teamWeight += r.count * grade * complexity;
      totalPeople += r.count;
    });
    if (totalPeople > 0) effort *= (teamWeight / totalPeople);

    // Артефакты добавляют небольшой процент накладных
    effort *= (1 + inputs.selectedArtifactCount * CONFIG.ARTIFACT_TIME_COEFF);

    // Резервы
    const knownR = effort * (inputs.knownRiskReserve / 100);
    const mgmtR = effort * (inputs.managementReserve / 100);
    const edgeR = effort * (inputs.edgeCaseBuffer / 100);
    const total = effort + knownR + mgmtR + edgeR;

    // Длительность
    const hoursPerDay = (inputs.teamAvailability / 100) * 8;
    const hoursPerWeek = hoursPerDay * inputs.workDaysWeek;
    const activePeople = Math.max(1, totalPeople);
    const weeks = total / (hoursPerWeek * activePeople);
    const days = Math.round(weeks * inputs.workDaysWeek);

    // Откалиброванные диапазоны (±30% базовая неопределённость)
    const baseUncert = 0.30;
    const optimistic = Math.round(days * (1 - baseUncert) * 0.85);
    const pessimistic = Math.round(days * (1 + baseUncert) * 1.15);

    return {
      effort: Math.round(effort),
      totalEffort: Math.round(total),
      duration: days,
      optimistic,
      base: days,
      pessimistic
    };
  };

  // Расчёт значений радара ограничений
  const calcRadarValues = (inputs) => {
    const mRisk = CONFIG.METHODOLOGY_RISK[inputs.methodology] || 20;
    const constraintRisk = inputs.fixedConstraints.length * 5;
    const artifactFactor = Math.min(10, inputs.selectedArtifactCount * 0.4);
    const uncertainty = Math.min(80, 15 + mRisk * 0.4 + constraintRisk + artifactFactor);

    const scopeFixed = inputs.fixedConstraints.includes('constraintScope') ? 20 : 0;
    const scope = Math.min(75, 20 + Math.min(20, inputs.selectedArtifactCount * 0.8) + scopeFixed);

    const pmoCost = inputs.pmoType === 'corporate' ? 10 : 3;
    const stdCost = inputs.standards ? inputs.standards.length * 4 : 0;
    const costFixed = inputs.fixedConstraints.includes('constraintCost') ? 15 : 0;
    const cost = Math.min(75, 20 + pmoCost + stdCost + costFixed);

    const stdQuality = inputs.standards && inputs.standards.includes('iso10006') ? 15 : (inputs.standards ? inputs.standards.length * 5 : 0);
    const qualityFixed = inputs.fixedConstraints.includes('constraintQuality') ? 15 : 0;
    const quality = Math.min(75, 25 + stdQuality + qualityFixed);

    const methodTime = inputs.methodology === 'waterfall' ? 8 : inputs.methodology === 'scrum' ? -4 : 0;
    const timeFixed = inputs.fixedConstraints.includes('constraintTime') ? 18 : 0;
    const time = Math.min(75, Math.max(5, 22 + methodTime + timeFixed));

    return {
      uncertainty: Math.round(uncertainty),
      scope: Math.round(scope),
      cost: Math.round(cost),
      quality: Math.round(quality),
      time: Math.round(time)
    };
  };

  // Рендер радара (SVG)
  const renderRadar = (values) => {
    const svg = document.getElementById('radarChart');
    if (!svg) return;

    const AXES = [
      { id: 'uncertainty', label: 'Неопределённость', color: 'var(--accent5)', angle: -90 },
      { id: 'scope', label: 'Содержание', color: 'var(--accent)', angle: -18 },
      { id: 'cost', label: 'Стоимость', color: 'var(--accent4)', angle: 54 },
      { id: 'quality', label: 'Качество', color: 'var(--accent2)', angle: 126 },
      { id: 'time', label: 'Время', color: 'var(--accent3)', angle: 198 }
    ];

    const polar = (cx, cy, r, deg) => {
      const rad = deg * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const cx = 150, cy = 150, R = 90;
    let html = '';

    // Сетка
    [0.25, 0.5, 0.75, 1].forEach(lvl => {
      const pts = AXES.map(a => {
        const p = polar(cx, cy, R * lvl, a.angle);
        return `${p.x},${p.y}`;
      }).join(' ');
      html += `<polygon points="${pts}" fill="none" stroke="var(--border-bright)" stroke-width="1" opacity="0.6"/>`;
    });

    // Оси + подписи
    AXES.forEach(a => {
      const end = polar(cx, cy, R, a.angle);
      const label = polar(cx, cy, R + 26, a.angle);
      html += `<line x1="${cx}" y1="${cy}" x2="${end.x}" y2="${end.y}" stroke="var(--border-bright)" stroke-width="1"/>`;
      html += `<text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle" fill="${a.color}" font-family="Space Mono" font-size="8.5">${a.label}</text>`;
    });

    // Заполненный полигон
    const dataPts = AXES.map(a => {
      const val = Math.min(100, Math.max(0, values[a.id] || 0));
      const p = polar(cx, cy, R * (val / 100), a.angle);
      return `${p.x},${p.y}`;
    }).join(' ');
    html += `<polygon points="${dataPts}" fill="rgba(200,245,66,0.18)" stroke="var(--accent)" stroke-width="2"/>`;

    // Точки на осях
    AXES.forEach(a => {
      const val = Math.min(100, Math.max(0, values[a.id] || 0));
      const p = polar(cx, cy, R * (val / 100), a.angle);
      html += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${a.color}"/>`;

      const el = document.getElementById(`radar-${a.id}`);
      if (el) el.textContent = `${Math.round(val)}%`;
    });

    svg.innerHTML = html;
  };

  return {
    calculate,
    calcRadarValues,
    renderRadar
  };
})();

// Экспорт для совместимости
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalculatorEngine };
}
