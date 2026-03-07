const Resume = {
  init() {
    this.bindAudienceSelector();
  },

  renderSelector() {
    const audiences = Content.resume.audiences.map(aud => `
      <button class="selector-card reveal" data-audience="${aud.id}" aria-label="Резюме для ${aud.title}" type="button">
        <span class="selector-icon" aria-hidden="true">${aud.icon}</span>
        <h3 class="selector-title">${aud.title}</h3>
        <span class="selector-time font-mono">${aud.time}</span>
        <p class="selector-focus">${aud.focus}</p>
      </button>
    `).join('');

    return `
      <section class="resume-hero" aria-labelledby="resume-name">
        <div class="section-tag">◆ Резюме</div>
        <h1 id="resume-name" class="font-display reveal">${Content.resume.hero.name}</h1>
        <p class="resume-subtitle reveal">${Content.resume.hero.title}</p>
        <p class="resume-meta font-mono reveal">${Content.resume.hero.subtitle}</p>
      </section>

      <section class="selector-section" aria-labelledby="selector-heading">
        <div class="section-tag" id="selector-heading">Выберите вашу роль</div>
        <div class="selector-grid" role="group" aria-label="Выбор аудитории">
          ${audiences}
        </div>
      </section>

      <div id="contacts-container"></div>
    `;
  },

  renderContent(audienceId) {
    const data = Content.resume.content[audienceId];
    if (!data) return this.renderSelector();

    const aud = Content.resume.audiences.find(a => a.id === audienceId);
    if (!aud) return this.renderSelector();

    const formatData = data.format || { remote: true, office: false, hybrid: false };

    return `
      <section class="resume-header" aria-labelledby="resume-audience-title">
        <button class="btn-ghost" onclick="Router.navigate('#resume')" type="button" aria-label="Вернуться к выбору аудитории">← Все аудитории</button>
        <div class="section-tag">◆ ${aud.title}</div>
        <h2 id="resume-audience-title" class="font-display reveal">Информация для ${aud.title.toLowerCase()}</h2>
        <p class="font-mono">${aud.time}</p>
      </section>

      ${this.renderSectionByAudience(audienceId, data)}

      <section class="format-section" aria-labelledby="format-heading">
        <div class="section-tag" id="format-heading">Формат работы</div>
        <div class="format-grid">
          <div class="format-item ${formatData.remote ? 'active' : ''}">
            <span class="format-icon">${formatData.remote ? '✓' : '—'}</span>
            <span>Удалённо</span>
          </div>
          <div class="format-item ${formatData.office ? 'active' : ''}">
            <span class="format-icon">${formatData.office ? '✓' : '—'}</span>
            <span>Офис</span>
          </div>
          <div class="format-item ${formatData.hybrid ? 'active' : ''}">
            <span class="format-icon">${formatData.hybrid ? '✓' : '—'}</span>
            <span>Гибрид</span>
          </div>
        </div>
      </section>

      <div id="contacts-container"></div>
    `;
  },

  renderSectionByAudience(audienceId, data) {
    switch (audienceId) {
      case 'hr': return this.renderHR(data);
      case 'manager': return this.renderManager(data);
      case 'pm': return this.renderPM(data);
      case 'dev': return this.renderDev(data);
      default: return '';
    }
  },

  renderHR(data) {
    const skillsHtml = Object.entries(data.skills).map(([cat, tags]) => `
      <div class="skill-category reveal">
        <h4 class="skill-cat-title">${cat}</h4>
        <div class="skill-tags">
          ${tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

    return `
      <section class="competencies-section" aria-labelledby="comp-heading">
        <div class="section-tag" id="comp-heading">Ключевые компетенции</div>
        <div class="metrics-grid">
          ${data.competencies.map(c => `
            <div class="metric-card reveal">
              <span class="metric-icon" aria-hidden="true">${c.icon}</span>
              <h4 class="metric-title">${c.title}</h4>
              <p class="metric-desc">${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="skills-section" aria-labelledby="skills-heading">
        <div class="section-tag" id="skills-heading">Навыки</div>
        <div class="skills-grid">
          ${skillsHtml}
        </div>
      </section>
    `;
  },

  renderManager(data) {
    return `
      <section class="thesis-section">
        <blockquote class="thesis-quote reveal">«${data.thesis}»</blockquote>
      </section>

      <section class="plan90-section" aria-labelledby="plan90-heading">
        <div class="section-tag" id="plan90-heading">План первых 90 дней</div>
        <div class="timeline-grid">
          ${data.plan90.map(p => `
            <div class="timeline-item reveal">
              <span class="timeline-period font-mono">${p.period}</span>
              <h4 class="timeline-stage">${p.stage}</h4>
              <ul class="timeline-tasks">
                ${p.tasks.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="principles-section" aria-labelledby="principles-heading">
        <div class="section-tag" id="principles-heading">Принципы управления</div>
        <div class="principles-grid">
          ${data.principles.map(p => `
            <div class="principle-card reveal">
              <h4 class="principle-title">${p.title}</h4>
              <p class="principle-desc">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="risks-section" aria-labelledby="risks-heading">
        <div class="section-tag" id="risks-heading">Управление рисками</div>
        <div class="risks-grid">
          ${data.risks.map(r => `
            <div class="risk-item reveal">
              <span class="risk-name">${r.name}</span>
              <span class="risk-level ${r.level}">${r.level === 'high' ? 'Высокий' : r.level === 'medium' ? 'Средний' : 'Низкий'}</span>
              <span class="risk-mitigation">${r.mitigation}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  renderPM(data) {
    const toolsHtml = Object.entries(data.tools).map(([cat, items]) => `
      <div class="tools-category reveal">
        <h4 class="tools-cat-title">${cat}</h4>
        <div class="tools-list">
          ${items.map(t => `
            <div class="tool-item">
              <span class="tool-name">${t.name}</span>
              <span class="tool-level font-mono ${t.level.toLowerCase()}">${t.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `
      <section class="methodologies-section" aria-labelledby="methods-heading">
        <div class="section-tag" id="methods-heading">Методологии</div>
        <div class="metrics-grid">
          ${data.methodologies.map(m => `
            <div class="metric-card reveal">
              <h4 class="metric-title">${m.name}</h4>
              <p class="metric-desc">${m.desc}</p>
              <span class="metric-level">${m.level}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="tools-section-resume" aria-labelledby="tools-heading">
        <div class="section-tag" id="tools-heading">Инструменты</div>
        <div class="tools-grid-pm">
          ${toolsHtml}
        </div>
      </section>

      <section class="process-section" aria-labelledby="process-heading">
        <div class="section-tag" id="process-heading">Процесс управления</div>
        <div class="timeline-grid">
          ${data.process.map(p => `
            <div class="timeline-item reveal">
              <span class="timeline-step font-mono">${p.step}</span>
              <h4 class="timeline-stage">${p.title}</h4>
              <p class="timeline-desc">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  renderDev(data) {
    return `
      <section class="architecture-section" aria-labelledby="arch-heading">
        <div class="section-tag" id="arch-heading">Архитектура NCOM</div>
        <div class="architecture-diagram">
          ${data.architecture.layers.map(l => `
            <div class="arch-layer reveal">
              <span class="arch-name">${l.name}</span>
              <span class="arch-desc">${l.desc}</span>
            </div>
          `).join('')}
        </div>
        <p class="arch-flow font-mono">Data Flow: ${data.architecture.dataFlow}</p>
      </section>

      <section class="algorithms-section" aria-labelledby="algo-heading">
        <div class="section-tag" id="algo-heading">Алгоритмы</div>
        <div class="risks-grid">
          ${data.algorithms.map(a => `
            <div class="risk-item reveal">
              <span class="risk-name">${a.name}</span>
              <code class="risk-mitigation font-mono">${a.code}</code>
              <span class="risk-level low">${a.complexity}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="stack-section" aria-labelledby="stack-heading">
        <div class="section-tag" id="stack-heading">Стек технологий</div>
        <div class="skills-grid">
          ${Object.entries(data.stack).map(([cat, techs]) => `
            <div class="skill-category reveal">
              <h4 class="skill-cat-title">${cat}</h4>
              <div class="skill-tags">
                ${techs.map(t => `<span class="skill-tag">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="github-section">
        <a href="${data.github.url}" class="contact-block" target="_blank" rel="noopener noreferrer" aria-label="Открыть GitHub (новая вкладка)">
          <span class="contact-icon" aria-hidden="true">⌘</span>
          <span class="contact-label">GitHub</span>
          <span class="contact-value">${data.github.repo}</span>
        </a>
      </section>
    `;
  },

  bindAudienceSelector() {
    document.querySelectorAll('.selector-card').forEach(card => {
      card.addEventListener('click', () => {
        const audience = card.dataset.audience;
        if (audience) Router.navigate('#resume/' + audience);
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const audience = card.dataset.audience;
          if (audience) Router.navigate('#resume/' + audience);
        }
      });
    });
  }
};
