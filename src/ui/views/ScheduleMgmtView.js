import { scheduleService } from '../../services/ScheduleService.js';
import { eventService } from '../../services/EventService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export class ScheduleMgmtView {
  static async render(container) {
    const event = eventService.getCurrentEvent();
    if (!event) {
      window.location.hash = '#events';
      return;
    }

    const schedules = await scheduleService.getSchedulesByEvent(event.id);
    const categories = await scheduleService.getCategoriesByEvent(event.id);

    container.innerHTML = `
      <div style="margin-bottom: 24px;" class="flex items-center justify-between">
        <div>
          <h2>📅 Gestão de Programações & Categorias</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Cadastre as atividades, horários, locais e funções pré-determinadas para as escalas.
          </p>
        </div>
        <div class="flex gap-2">
          <button id="btn-manage-categories" class="btn btn-secondary">
            🏷️ Categorias (${categories.length})
          </button>
          <button id="btn-add-schedule" class="btn btn-primary">
            ➕ Nova Programação
          </button>
        </div>
      </div>

      <!-- TABELA DE PROGRAMAÇÕES -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-container" style="border: none;">
          <table class="table" id="schedules-table">
            <thead>
              <tr>
                <th>Programação</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Local Geral</th>
                <th>Categoria</th>
                <th>Voluntários / Funções</th>
                <th style="text-align: center;">Ações</th>
              </tr>
            </thead>
            <tbody id="schedules-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    const tbody = container.querySelector('#schedules-tbody');

    if (schedules.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            Nenhuma programação cadastrada no evento. Clique em <strong>➕ Nova Programação</strong> para adicionar.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = schedules.map(s => {
        const cat = categories.find(c => c.id === s.categoryId);
        const rolesText = (s.roles || []).map(r => r.name).join(', ') || 'Staff Geral';

        return `
          <tr data-id="${s.id}">
            <td style="font-weight: 700; color: var(--primary-900);">${s.title}</td>
            <td>${s.date ? s.date.split('-').reverse().join('/') : '-'}</td>
            <td><strong>${s.startTime}</strong> às <strong>${s.endTime}</strong></td>
            <td>${s.generalLocation || 'Geral'}</td>
            <td>
              ${cat ? `
                <span class="badge" style="background: ${cat.color || '#3b82f6'}20; color: ${cat.color || '#3b82f6'}; border: 1px solid ${cat.color || '#3b82f6'}40;">
                  ${cat.name}
                </span>
              ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Sem categoria</span>'}
            </td>
            <td>
              <div style="font-weight: 600;">${s.requiredVolunteers} voluntário(s)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); max-width: 220px;" class="truncate" title="${rolesText}">
                🏷️ ${rolesText}
              </div>
            </td>
            <td style="text-align: center;">
              <div class="flex justify-center gap-2">
                <button class="btn btn-icon btn-edit-schedule" data-id="${s.id}" title="Editar">✏️</button>
                <button class="btn btn-icon btn-danger btn-del-schedule" data-id="${s.id}" title="Excluir">❌</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-edit-schedule').forEach(btn => {
        btn.onclick = () => {
          const s = schedules.find(sched => sched.id === btn.dataset.id);
          ScheduleMgmtView.openScheduleModal(s, event, categories, () => ScheduleMgmtView.render(container));
        };
      });

      tbody.querySelectorAll('.btn-del-schedule').forEach(btn => {
        btn.onclick = async () => {
          const s = schedules.find(sched => sched.id === btn.dataset.id);
          if (confirm(`Deseja remover a programação "${s.title}"?`)) {
            await scheduleService.deleteSchedule(s.id);
            Toast.success('Programação removida com sucesso!');
            ScheduleMgmtView.render(container);
          }
        };
      });
    }

    container.querySelector('#btn-add-schedule').onclick = () => {
      ScheduleMgmtView.openScheduleModal(null, event, categories, () => ScheduleMgmtView.render(container));
    };

    container.querySelector('#btn-manage-categories').onclick = () => {
      ScheduleMgmtView.openCategoriesModal(event, categories, () => ScheduleMgmtView.render(container));
    };
  }

  static openScheduleModal(schedule = null, event, categories, onSaved) {
    const isEdit = !!schedule;
    const roles = schedule && schedule.roles ? [...schedule.roles] : [];

    const content = document.createElement('div');
    content.innerHTML = `
      <form id="schedule-form">
        <div class="form-group">
          <label class="form-label">Título da Programação / Atividade</label>
          <input type="text" id="sched-title" class="form-input" value="${schedule ? schedule.title : ''}" placeholder="Ex: CAFÉ DA MANHÃ, SALA DO TRONO, ALMOÇO..." required>
        </div>

        <div class="grid grid-cols-3">
          <div class="form-group">
            <label class="form-label">Data</label>
            <input type="date" id="sched-date" class="form-input" value="${schedule ? schedule.date : (event.startDate || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Hora de Início</label>
            <input type="time" id="sched-start" class="form-input" value="${schedule ? schedule.startTime : '07:30'}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Hora de Término</label>
            <input type="time" id="sched-end" class="form-input" value="${schedule ? schedule.endTime : '09:00'}" required>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Local Geral</label>
            <input type="text" id="sched-location" class="form-input" value="${schedule ? (schedule.generalLocation || '') : ''}" placeholder="Ex: Refeitório Principal, Tenda 1...">
          </div>

          <div class="form-group">
            <label class="form-label">Categoria de Escala</label>
            <select id="sched-cat" class="form-select">
              <option value="">Sem categoria (Geral)</option>
              ${categories.map(c => `<option value="${c.id}" ${schedule && schedule.categoryId === c.id ? 'selected' : ''}>${c.name} (P${c.priority || 1})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Quantidade de Voluntários Necessária</label>
          <input type="number" id="sched-vol-count" class="form-input" min="1" max="100" value="${schedule ? schedule.requiredVolunteers : 2}" required>
        </div>

        <!-- FUNÇÕES PRÉ-DETERMINADAS -->
        <div class="card" style="padding: 16px; background: #f8fafc; margin-bottom: 16px;">
          <div class="flex items-center justify-between" style="margin-bottom: 10px;">
            <label class="form-label" style="margin: 0;">🏷️ Funções Pré-determinadas (Rotação)</label>
            <span style="font-size: 0.75rem; color: var(--text-muted);">As funções rotacionam entre os voluntários</span>
          </div>

          <div id="roles-list-box" style="margin-bottom: 10px;"></div>

          <div class="flex gap-2">
            <input type="text" id="new-role-name" class="form-input" placeholder="Nome da função (Ex: Servir Buffet, Copa, Limpeza)">
            <input type="text" id="new-role-loc" class="form-input" placeholder="Local específico (Opcional)">
            <button type="button" id="btn-add-role" class="btn btn-secondary btn-sm" style="white-space: nowrap;">➕ Adicionar</button>
          </div>
        </div>

        <div class="flex justify-between" style="margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar Programação' : 'Salvar Programação'}</button>
        </div>
      </form>
    `;

    function renderRoles() {
      const box = content.querySelector('#roles-list-box');
      if (roles.length === 0) {
        box.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">Nenhuma função específica cadastrada (será atribuído "Staff").</p>';
        return;
      }

      box.innerHTML = roles.map((r, idx) => `
        <div class="flex items-center justify-between" style="padding: 6px 10px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 0.85rem;">
          <div>
            <strong>${r.name}</strong> ${r.specificLocation ? `<span style="color: var(--text-muted); font-size: 0.775rem;">(${r.specificLocation})</span>` : ''}
          </div>
          <button type="button" class="btn btn-icon btn-danger btn-sm btn-del-role" data-index="${idx}" style="padding: 2px 6px;">❌</button>
        </div>
      `).join('');

      box.querySelectorAll('.btn-del-role').forEach(b => {
        b.onclick = () => {
          roles.splice(Number(b.dataset.index), 1);
          renderRoles();
        };
      });
    }

    content.querySelector('#btn-add-role').onclick = () => {
      const nameInput = content.querySelector('#new-role-name');
      const locInput = content.querySelector('#new-role-loc');
      const name = nameInput.value.trim();
      const specificLocation = locInput.value.trim();

      if (!name) {
        Toast.error('Informe o nome da função.');
        return;
      }

      roles.push({ id: `role-${Date.now()}-${roles.length}`, name, specificLocation });
      nameInput.value = '';
      locInput.value = '';
      renderRoles();
    };

    content.querySelector('#schedule-form').onsubmit = async (e) => {
      e.preventDefault();
      try {
        const title = content.querySelector('#sched-title').value;
        const date = content.querySelector('#sched-date').value;
        const startTime = content.querySelector('#sched-start').value;
        const endTime = content.querySelector('#sched-end').value;
        const generalLocation = content.querySelector('#sched-location').value;
        const categoryId = content.querySelector('#sched-cat').value;
        const requiredVolunteers = Number(content.querySelector('#sched-vol-count').value);

        if (isEdit) {
          await scheduleService.updateSchedule(schedule.id, {
            title: title.trim().toUpperCase(),
            date,
            startTime,
            endTime,
            generalLocation,
            categoryId,
            requiredVolunteers,
            roles
          });
          Toast.success('Programação atualizada com sucesso!');
        } else {
          await scheduleService.createSchedule({
            eventId: event.id,
            title: title.trim().toUpperCase(),
            date,
            startTime,
            endTime,
            generalLocation,
            categoryId,
            requiredVolunteers,
            roles
          });
          Toast.success('Programação cadastrada com sucesso!');
        }

        Modal.close();
        if (onSaved) onSaved();
      } catch (err) {
        Toast.error(err.message || 'Erro ao salvar programação.');
      }
    };

    renderRoles();

    Modal.open({
      title: isEdit ? `✏️ Editar Programação - ${schedule.title}` : '➕ Nova Programação',
      content,
      size: 'lg'
    });
  }

  static openCategoriesModal(event, categories, onSaved) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
          Categorias definem tipos de escala (ex: Ensino, Refeição, Apoio) e ajudam no algoritmo de alocação de voluntários.
        </p>

        <!-- LISTA DE CATEGORIAS -->
        <div id="cats-list-box" style="margin-bottom: 20px; max-height: 240px; overflow-y: auto;"></div>

        <!-- FORMULÁRIO DE NOVA CATEGORIA -->
        <div class="card" style="padding: 16px; background: #f8fafc;">
          <h5 style="font-size: 0.9rem; margin-bottom: 10px; font-weight: 700;">➕ Nova Categoria</h5>
          <div class="grid grid-cols-2 gap-2" style="margin-bottom: 8px;">
            <input type="text" id="new-cat-name" class="form-input" placeholder="Nome (Ex: Ensino / Sala do Trono)" required>
            <div class="flex gap-2">
              <input type="color" id="new-cat-color" class="form-input" value="#7c3aed" style="width: 50px; padding: 4px;" title="Cor da badge">
              <input type="number" id="new-cat-prio" class="form-input" value="5" min="1" max="20" placeholder="Prioridade (1-20)" title="Prioridade no algoritmo">
            </div>
          </div>
          <input type="text" id="new-cat-desc" class="form-input" placeholder="Descrição opcional..." style="margin-bottom: 8px;">
          <button type="button" id="btn-save-new-cat" class="btn btn-primary btn-sm w-full">Salvar Categoria</button>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Fechar</button>
      </div>
    `;

    async function renderCats() {
      const currentCats = await scheduleService.getCategoriesByEvent(event.id);
      const box = content.querySelector('#cats-list-box');

      if (currentCats.length === 0) {
        box.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Nenhuma categoria cadastrada.</p>';
        return;
      }

      box.innerHTML = currentCats.map(c => `
        <div class="flex items-center justify-between" style="padding: 8px 12px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 8px;">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge" style="background: ${c.color || '#3b82f6'}; color: #ffffff;">${c.name}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Prioridade ${c.priority || 1}</span>
            </div>
            ${c.description ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${c.description}</div>` : ''}
          </div>
          <button type="button" class="btn btn-icon btn-danger btn-sm btn-del-cat" data-id="${c.id}" style="padding: 4px 8px;">❌</button>
        </div>
      `).join('');

      box.querySelectorAll('.btn-del-cat').forEach(b => {
        b.onclick = async () => {
          if (confirm('Deseja excluir esta categoria?')) {
            await scheduleService.deleteCategory(b.dataset.id);
            Toast.success('Categoria excluída!');
            await renderCats();
            if (onSaved) onSaved();
          }
        };
      });
    }

    content.querySelector('#btn-save-new-cat').onclick = async () => {
      const name = content.querySelector('#new-cat-name').value.trim();
      const color = content.querySelector('#new-cat-color').value;
      const priority = Number(content.querySelector('#new-cat-prio').value) || 1;
      const description = content.querySelector('#new-cat-desc').value.trim();

      if (!name) {
        Toast.error('Informe o nome da categoria.');
        return;
      }

      await scheduleService.createCategory({
        eventId: event.id,
        name,
        color,
        priority,
        description
      });

      content.querySelector('#new-cat-name').value = '';
      content.querySelector('#new-cat-desc').value = '';
      Toast.success('Categoria criada!');
      await renderCats();
      if (onSaved) onSaved();
    };

    renderCats();

    Modal.open({
      title: '🏷️ Categorias de Escala',
      content
    });
  }
}
