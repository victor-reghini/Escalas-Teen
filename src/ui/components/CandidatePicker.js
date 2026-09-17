import { CandidateScorer } from '../../engine/CandidateScorer.js';
import { Modal } from './Modal.js';
import { StarRating } from './StarRating.js';

export class CandidatePicker {
  /**
   * Abre o seletor inteligente de candidatos
   * @param {Object} options
   * @param {Object} options.schedule - Programação atual
   * @param {Array} options.volunteers - Lista de voluntários do evento
   * @param {Array} options.allSchedules - Todas as programações
   * @param {Array} options.currentAssignedShifts - Escalas atribuídas
   * @param {Array} options.categories - Categorias
   * @param {Array} options.feedbacks - Feedbacks
   * @param {Function} options.onSelect - Callback chamado ao escolher o voluntário
   */
  static open({
    schedule,
    volunteers,
    allSchedules,
    currentAssignedShifts,
    categories,
    feedbacks = [],
    onSelect
  }) {
    const rankedList = CandidateScorer.rankCandidates({
      volunteers,
      schedule,
      allSchedules,
      currentAssignedShifts,
      categories,
      feedbacks
    });

    const container = document.createElement('div');
    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">
          Voluntários ordenados automaticamente por <strong>Preferência de Categoria</strong>, <strong>Menor Desgaste</strong>, <strong>Avaliações</strong> e <strong>Conflitos de Horário</strong>.
        </p>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          <input type="text" id="candidate-search" class="form-input" placeholder="🔍 Buscar voluntário por nome..." style="flex: 1; min-width: 180px;">
          <select id="candidate-filter" class="form-select" style="width: auto; min-width: 140px;">
            <option value="all">Todos</option>
            <option value="eligible" selected>Apenas Elegíveis</option>
            <option value="integral">Integral</option>
            <option value="part_time">Part-time</option>
          </select>
        </div>
      </div>
      <div id="candidates-list-box" style="max-height: 480px; overflow-y: auto; padding-right: 4px;"></div>
    `;

    const listBox = container.querySelector('#candidates-list-box');
    const searchInput = container.querySelector('#candidate-search');
    const filterSelect = container.querySelector('#candidate-filter');

    function renderList() {
      const query = searchInput.value.toLowerCase().trim();
      const filter = filterSelect.value;

      listBox.innerHTML = '';

      const filtered = rankedList.filter(item => {
        const v = item.volunteer;
        if (query && !v.name.toLowerCase().includes(query)) return false;
        if (filter === 'eligible' && !item.eligible) return false;
        if (filter === 'integral' && v.type !== 'integral') return false;
        if (filter === 'part_time' && v.type !== 'part_time') return false;
        return true;
      });

      if (filtered.length === 0) {
        listBox.innerHTML = `
          <div style="text-align: center; padding: 30px; color: var(--text-muted);">
            Nenhum voluntário encontrado com os filtros atuais.
          </div>
        `;
        return;
      }

      filtered.forEach(item => {
        const v = item.volunteer;
        const itemEl = document.createElement('div');
        itemEl.className = `candidate-item ${item.eligible ? 'eligible' : 'ineligible'}`;

        const badgesHtml = (item.badges || []).map(b => 
          `<span class="badge" style="background: ${b.color}20; color: ${b.color}; border: 1px solid ${b.color}40;">${b.label}</span>`
        ).join(' ');

        const wearRatioPct = Math.round((item.wearInfo ? item.wearInfo.wearRatio : 0) * 100);
        const servedCount = item.wearInfo ? item.wearInfo.servedShifts : 0;
        const possibleCount = item.wearInfo ? item.wearInfo.possibleShifts : 0;

        itemEl.innerHTML = `
          <div class="candidate-info">
            <div class="candidate-name">
              <span>${v.name}</span>
              <span class="badge ${v.type === 'integral' ? 'badge-primary' : 'badge-orange'}">
                ${v.type === 'integral' ? 'Integral' : 'Part-time'}
              </span>
              ${badgesHtml}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; gap: 12px; align-items: center; margin-top: 4px;">
              <span>⚡ Desgaste: <strong>${wearRatioPct}%</strong> (${servedCount}/${possibleCount} escalas)</span>
              <span>⭐ Admin: <strong>${item.adminRating || 5}/5</strong></span>
              ${item.conflictInfo && item.conflictInfo.reason ? `<span style="color: #dc2626;">⚠️ ${item.conflictInfo.reason}</span>` : ''}
              ${!item.eligible && item.reason ? `<span style="color: #dc2626;">⛔ ${item.reason}</span>` : ''}
            </div>
          </div>
          <div>
            <button class="btn ${item.eligible ? 'btn-primary' : 'btn-secondary'} btn-sm">
              ${item.eligible ? 'Selecionar' : 'Forçar Seleção'}
            </button>
          </div>
        `;

        itemEl.onclick = () => {
          Modal.close();
          if (onSelect) onSelect(v);
        };

        listBox.appendChild(itemEl);
      });
    }

    searchInput.oninput = renderList;
    filterSelect.onchange = renderList;

    renderList();

    Modal.open({
      title: `👤 Selecionar Voluntário - ${schedule.title} (${schedule.startTime})`,
      content: container,
      size: 'lg'
    });
  }
}
