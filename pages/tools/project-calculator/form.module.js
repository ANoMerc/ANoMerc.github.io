/**
════════════════════════════════════════════════════════════════════════════
ProjectWB Form Module v1.3
════════════════════════════════════════════════════════════════════════════
Управление формами:
- Экспертный режим
- Аккордеоны
- Роли команды
- Валидация
- Сбор данных
- Отображение результатов
- Экспорт (JSON/CSV)
*/

const FormModule = (() => {
  let expertMode = false;

  const init = () => {
    initExpertToggle();
    initAccordion();
    initMethodologyListeners();
    initTeamRoles();
    initButtons();
    validateForm();
  };

  // Экспертный режим
  const initExpertToggle = () => {
    const btn = document.getElementById('expertModeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      expertMode = !expertMode;
      btn.classList.toggle('active', expertMode);
      btn.textContent = expertMode ? '⚙ Режим эксперта: ВКЛ' : '⚙ Режим эксперта: ВЫКЛ';
      document.querySelectorAll('.expert-field').forEach(el => {
        el.style.display = expertMode ? 'block' : 'none';
      });
    });
  };

  // Аккордеоны
  const initAccordion = () => {
    document.querySelectorAll('.accordion-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const content = hdr.nextElementSibling;
        if (!content) return;
        content.classList.toggle('active');
        const arrow = hdr.querySelector('.accordion-arrow');
        if (arrow) arrow.textContent = content.classList.contains('active') ? '−' : '+';
      });
    });
  };

  // Пересчёт артефактов при смене методологии / PMO
  const initMethodologyListeners = () => {
    ['methodology', 'pmoType'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        rebuildArtifacts();
        validateForm();
      });
    });

    // Стандарты и фреймворки тоже влияют на артефакты
    ['std21502','std21504','std10006','riskPRAMG','riskSRMPPP'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', rebuildArtifacts);
    });
    document.getElementById('competencyFramework')?.addEventListener('change', rebuildArtifacts);
    document.getElementById('baseEffort')?.addEventListener('input', validateForm);
  };

  const rebuildArtifacts = () => {
    const inputs = getInputsForArtifacts();
    const phases = RecommendationEngine.buildArtifacts(inputs);
    ArtifactModule.render(phases);
  };

  const getInputsForArtifacts = () => ({
    methodology: document.getElementById('methodology')?.value || 'waterfall',
    pmoType: document.getElementById('pmoType')?.value || 'corporate',
    competencyFramework: document.getElementById('competencyFramework')?.value || 'none',
    standards: getCheckedValues(['std21502','std21504','std10006']),
    riskFrameworks: getCheckedValues(['riskPRAMG','riskSRMPPP'])
  });

  // Роли команды
  const initTeamRoles = () => {
    const container = document.getElementById('teamRolesContainer');
    const addBtn = document.getElementById('addRoleBtn');
    if (!container || !addBtn) return;

    // Первая роль по умолчанию
    addRole(container);

    // Удаление через делегирование на контейнер
    container.addEventListener('click', e => {
      if (e.target.closest('.btn-role-remove')) {
        const row = e.target.closest('.team-role-item');
        if (row) row.remove();
      }
    });

    // При смене типа роли — обновляем домены
    container.addEventListener('change', e => {
      if (e.target.classList.contains('role-type')) {
        const row = e.target.closest('.team-role-item');
        const domain = row?.querySelector('.role-domain');
        if (domain) rebuildDomains(e.target.value, domain);
      }
    });

    addBtn.addEventListener('click', () => addRole(container));
  };

  const addRole = (container) => {
    const id = `role-${Date.now()}`;
    const div = document.createElement('div');
    div.className = 'team-role-item';
    div.dataset.id = id;
    const defaultType = 'backend';
    const domainOptions = buildDomainOptions(defaultType);

    div.innerHTML = `
      <div class="role-row-main">
        <select class="role-type" title="Тип роли">
          ${Object.entries(CONFIG.ROLE_LABELS).map(([v, l]) =>
            `<option value="${v}"${v === defaultType ? ' selected' : ''}>${l}</option>`
          ).join('')}
        </select>
        <select class="role-grade" title="Грейд">
          <option value="junior">Junior</option>
          <option value="middle" selected>Middle</option>
          <option value="senior">Senior</option>
        </select>
        <input type="number" class="role-count" value="1" min="1" max="50" title="Количество">
        <button type="button" class="btn-role-remove" title="Удалить роль">✕</button>
      </div>
      <div class="role-row-extra">
        <select class="role-domain" title="Сфера экспертности">
          ${domainOptions}
        </select>
        <input type="text" class="role-spec" placeholder="Специализация (опц.)" title="Специализация внутри домена">
      </div>
    `;
    container.appendChild(div);
  };

  const buildDomainOptions = (type) => {
    const domains = CONFIG.ROLE_DOMAINS[type] || ['General'];
    return domains.map(d => `<option value="${d}">${d}</option>`).join('');
  };

  const rebuildDomains = (type, domainEl) => {
    domainEl.innerHTML = buildDomainOptions(type);
  };

  // Валидация
  const validateForm = () => {
    const effortEl = document.getElementById('baseEffort');
    const fgEffort = document.getElementById('fg-base-effort');
    const calcBtn = document.getElementById('calcBtn');
    let valid = true;

    if (effortEl && fgEffort) {
      const v = parseFloat(effortEl.value);
      if (!effortEl.value || isNaN(v) || v <= 0) {
        fgEffort.classList.add('error');
        valid = false;
      } else {
        fgEffort.classList.remove('error');
      }
    }

    if (calcBtn) calcBtn.disabled = !valid;
    return valid;
  };

  // Кнопки
  const initButtons = () => {
    document.getElementById('calcBtn')?.addEventListener('click', runCalculation);
    document.getElementById('calibrateBtn')?.addEventListener('click', calibrate);
    document.getElementById('exportJSON')?.addEventListener('click', exportJSON);
    document.getElementById('exportCSV')?.addEventListener('click', exportCSV);
  };

  const runCalculation = () => {
    if (!validateForm()) return;
    const inputs = getFormInputs();
    const result = CalculatorEngine.calculate(inputs);
    displayResults(inputs, result);
  };

  const getFormInputs = () => {
    return {
      baseEffort: parseFloat(document.getElementById('baseEffort')?.value) || 1000,
      methodology: document.getElementById('methodology')?.value || 'waterfall',
      pmoType: document.getElementById('pmoType')?.value || 'corporate',
      pmGrade: document.getElementById('pmGrade')?.value || 'middle',
      competencyFramework: document.getElementById('competencyFramework')?.value || 'none',
      aiModels: getCheckedValues(['aiLSTM','aiCNN','aiGRU','aiMLP','aiRNN']),
      standards: getCheckedValues(['std21502','std21504','std10006']),
      riskFrameworks: getCheckedValues(['riskPRAMG','riskSRMPPP']),
      fixedConstraints: getCheckedValues(['constraintScope','constraintTime','constraintCost','constraintQuality']),
      teamRoles: getTeamRoles(),
      workDaysWeek: parseInt(document.getElementById('workDaysWeek')?.value) || 5,
      teamAvailability: parseFloat(document.getElementById('teamAvailability')?.value) || 62.5,
      knownRiskReserve: parseFloat(document.getElementById('knownRiskReserve')?.value) || 10,
      managementReserve: parseFloat(document.getElementById('managementReserve')?.value) || 5,
      edgeCaseBuffer: parseFloat(document.getElementById('edgeCaseBuffer')?.value) || 15,
      selectedArtifactCount: RecommendationEngine.getSelectedCount()
    };
  };

  const getTeamRoles = () => {
    const roles = [];
    document.querySelectorAll('.team-role-item').forEach(row => {
      roles.push({
        type: row.querySelector('.role-type')?.value || 'backend',
        grade: row.querySelector('.role-grade')?.value || 'middle',
        count: parseInt(row.querySelector('.role-count')?.value) || 1,
        domain: row.querySelector('.role-domain')?.value || '',
        spec: row.querySelector('.role-spec')?.value || ''
      });
    });
    return roles.length > 0 ? roles : [{ type: 'backend', grade: 'middle', count: 1, domain: '', spec: '' }];
  };

  const getCheckedValues = (ids) => {
    return ids.reduce((acc, id) => {
      const el = document.getElementById(id);
      if (el && el.checked) acc.push(el.value);
      return acc;
    }, []);
  };

  // Отображение результатов
  const displayResults = (inputs, result) => {
    window.lastCalc = { inputs, result, ts: new Date().toISOString() };
    const show = id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; };
    show('resultContainer');

    setText('durationRange', `${result.optimistic} — ${result.pessimistic} дней`);
    setText('effortRange', `~${result.effort} — ${result.totalEffort} часов трудозатрат`);
    setText('journeyOptimistic', `${result.optimistic} дней`);
    setText('journeyBase', `${result.base} дней`);
    setText('journeyPessimistic', `${result.pessimistic} дней`);

    const radarValues = CalculatorEngine.calcRadarValues(inputs);
    CalculatorEngine.renderRadar(radarValues);
    renderRoleLoading(inputs.teamRoles);

    document.getElementById('resultContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const renderRoleLoading = (roles) => {
    const container = document.getElementById('roleLoadingBars');
    if (!container) return;

    const totalPeople = roles.reduce((s, r) => s + r.count, 0) || 1;
    container.innerHTML = roles.map(r => {
      const pct = Math.round((r.count / totalPeople) * 100);
      const label = CONFIG.ROLE_LABELS[r.type] || r.type;
      const extra = r.domain ? ` · ${r.domain}` : '';
      return `<div class="role-loading-bar">
        <span class="role-loading-label">${label}${extra} <em style="color:var(--muted)">(${r.grade})</em></span>
        <div class="role-loading-track">
          <div class="role-loading-fill" style="width:${pct}%"></div>
        </div>
        <span class="role-loading-value">${r.count} чел. / ${pct}%</span>
      </div>`;
    }).join('');
  };

  // Калибровка и экспорт
  const calibrate = () => {
    const actual = parseFloat(prompt('Фактическая длительность (дни):'));
    const est = parseFloat(prompt('Оценённая длительность (дни):'));
    if (actual > 0 && est > 0) {
      alert(`Коэффициент калибровки: ${(actual / est).toFixed(3)}\n\nПрименяйте его как множитель к базовому размеру проекта.`);
    }
  };

  const exportJSON = () => {
    if (!window.lastCalc) { alert('Сначала выполните расчёт'); return; }
    download(JSON.stringify(window.lastCalc, null, 2), 'application/json', 'pwb-estimate.json');
  };

  const exportCSV = () => {
    if (!window.lastCalc) { alert('Сначала выполните расчёт'); return; }
    const { inputs, result } = window.lastCalc;
    const rows = [
      ['Параметр', 'Значение'],
      ['Методология', inputs.methodology],
      ['PMO', inputs.pmoType],
      ['Базовый размер', inputs.baseEffort],
      ['Артефакты выбрано', inputs.selectedArtifactCount],
      ['Команда', inputs.teamRoles.map(r => `${CONFIG.ROLE_LABELS[r.type]}(${r.grade})×${r.count}`).join('; ')],
      ['Трудозатраты (ч)', result.totalEffort],
      ['Длительность (дн)', result.duration],
      ['Оптимистичный (дн)', result.optimistic],
      ['Базовый (дн)', result.base],
      ['Пессимистичный (дн)', result.pessimistic],
      ['Радар — Неопределённость', result.radarValues ? result.radarValues.uncertainty + '%' : 'N/A'],
      ['Радар — Содержание', result.radarValues ? result.radarValues.scope + '%' : 'N/A'],
      ['Радар — Стоимость', result.radarValues ? result.radarValues.cost + '%' : 'N/A'],
      ['Радар — Качество', result.radarValues ? result.radarValues.quality + '%' : 'N/A'],
      ['Радар — Время', result.radarValues ? result.radarValues.time + '%' : 'N/A']
    ];
    download(rows.map(r => r.join(',')).join('\n'), 'text/csv', 'pwb-estimate.csv');
  };

  const download = (content, type, name) => {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([content], { type })),
      download: name
    });
    a.click();
  };

  return { init };
})();

// Экспорт для совместимости
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormModule };
}
