import { volunteerService } from '../../services/VolunteerService.js';
import { scheduleService } from '../../services/ScheduleService.js';
import { eventService } from '../../services/EventService.js';
import { availabilityChecker } from '../../engine/AvailabilityChecker.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';
import { StarRating } from '../components/StarRating.js';

export class VolunteerMgmtView {
  static async render(container) {
    const event = eventService.getCurrentEvent();
    if (!event) {
      window.location.hash = '#events';
      return;
    }

    const volunteers = await volunteerService.getVolunteersByEvent(event.id);
    const categories = await scheduleService.getCategoriesByEvent(event.id);
    const schedules = await scheduleService.getSchedulesByEvent(event.id);
    const shifts = await scheduleService.getShiftsByEvent(event.id);

    container.innerHTML = `
      <div style="margin-bottom: 24px;" class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2>👥 Gestão de Voluntários</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Cadastre voluntários, disponibilidades, preferências de categoria e avaliações.
          </p>
        </div>
        <button id="btn-add-volunteer" class="btn btn-primary">
          ➕ Adicionar Voluntário
        </button>
      </div>

      <!-- BARRA DE BUSCA E FILTROS -->
      <div class="card" style="padding: 16px; margin-bottom: 20px;">
        <div class="flex gap-3 flex-wrap">
          <input type="text" id="vol-search" class="form-input" placeholder="🔍 Buscar por nome ou e-mail..." style="flex: 1; min-width: 200px;">
          <select id="vol-filter-type" class="form-select" style="width: auto; min-width: 150px;">
            <option value="all">Todos os Tipos</option>
            <option value="integral">Integral (Full-time)</option>
            <option value="part_time">Part-time</option>
          </select>
          <select id="vol-filter-exp" class="form-select" style="width: auto; min-width: 150px;">
            <option value="all">Toda Experiência</option>
            <option value="experiente">Experiente</option>
            <option value="primeira_vez">1ª Vez</option>
          </select>
        </div>
      </div>

      <!-- TABELA DE VOLUNTÁRIOS -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-container" style="border: none;">
          <table class="table" id="volunteers-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Experiência</th>
                <th>Disponibilidade / Indisponibilidades</th>
                <th>Preferências</th>
                <th>Nota Admin</th>
                <th>Uso & Escalas</th>
                <th style="text-align: center;">Ações</th>
              </tr>
            </thead>
            <tbody id="volunteers-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    const tbody = container.querySelector('#volunteers-tbody');
    const searchInput = container.querySelector('#vol-search');
    const filterType = container.querySelector('#vol-filter-type');
    const filterExp = container.querySelector('#vol-filter-exp');

    function renderTable() {
      const q = searchInput.value.toLowerCase().trim();
      const type = filterType.value;
      const exp = filterExp.value;

      const filtered = volunteers.filter(v => {
        if (q && !v.name.toLowerCase().includes(q) && !(v.email || '').toLowerCase().includes(q)) return false;
        if (type !== 'all' && v.type !== type) return false;
        if (exp !== 'all' && v.experience !== exp) return false;
        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
              Nenhum voluntário encontrado.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(v => {
        const availCount = (v.availabilities || []).length;
        const unavailCount = (v.unavailabilities || []).length;

        const prefKeys = Object.keys(v.categoryPreferences || {}).filter(k => v.categoryPreferences[k]);
        const prefBadges = prefKeys.map(catId => {
          const cat = categories.find(c => c.id === catId);
          return `<span class="badge badge-purple" style="font-size: 0.7rem;">${cat ? cat.name : catId}</span>`;
        }).join(' ');

        // Cálculo de escalas participadas, total disponível e % de uso
        let servedShifts = 0;
        shifts.forEach(s => {
          if ((s.assignments || []).some(a => a.volunteerId === v.id)) {
            servedShifts++;
          }
        });

        let possibleShifts = 0;
        if (v.isIntegral ? v.isIntegral() : v.type === 'integral') {
          possibleShifts = schedules.length;
        } else {
          schedules.forEach(sched => {
            if (availabilityChecker.isAvailableForSlot(v, sched.date, sched.startTime, sched.endTime)) {
              possibleShifts++;
            }
          });
        }

        const safePossible = Math.max(possibleShifts, 1);
        const wearRatio = servedShifts / safePossible;
        const wearPct = Math.round(wearRatio * 100);

        let wearBadgeClass = 'badge-primary';
        if (wearPct >= 75) wearBadgeClass = 'badge-danger';
        else if (wearPct >= 40) wearBadgeClass = 'badge-orange';
        else if (wearPct > 0) wearBadgeClass = 'badge-purple';
        else wearBadgeClass = 'badge-gray';

        return `
          <tr data-id="${v.id}">
            <td style="font-weight: 700;">
              <div>${v.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">${v.email || v.phone || 'Sem contato'}</div>
            </td>
            <td>
              <span class="badge ${v.type === 'integral' ? 'badge-primary' : 'badge-orange'}">
                ${v.type === 'integral' ? 'Integral' : 'Part-time'}
              </span>
            </td>
            <td>
              <span class="badge ${v.experience === 'experiente' ? 'badge-success' : 'badge-gray'}">
                ${v.experience === 'experiente' ? 'Experiente' : '1ª Vez'}
              </span>
            </td>
            <td>
              <button class="btn btn-secondary btn-sm btn-avail-modal" data-id="${v.id}" title="Configurar agenda de disponibilidade e restrições">
                ⏰ ${v.isIntegral() ? 'Total' : `${availCount} slots`} ${unavailCount > 0 ? `| ⚠️ ${unavailCount} restrições` : ''}
              </button>
            </td>
            <td>
              <button class="btn btn-secondary btn-sm btn-pref-modal" data-id="${v.id}" title="Configurar preferências de categorias">
                ${prefBadges || '<span style="color: var(--text-muted);">⚙️ Configurar</span>'}
              </button>
            </td>
            <td>
              <button class="btn btn-secondary btn-sm btn-rating-modal" data-id="${v.id}" title="Avaliar desempenho do voluntário">
                ⭐ ${v.adminRating !== undefined ? v.adminRating : 5}/5
              </button>
            </td>
            <td>
              <div class="flex items-center gap-1 flex-wrap">
                <span class="badge ${wearBadgeClass}" style="font-weight: 700;" title="${servedShifts} escalas realizadas de ${possibleShifts} disponíveis (${wearPct}% de uso)">
                  ${servedShifts}/${possibleShifts} esc. (${wearPct}%)
                </span>
              </div>
            </td>
            <td style="text-align: center;">
              <div class="flex justify-center gap-2">
                <button class="btn btn-icon btn-edit-vol" data-id="${v.id}" title="Editar voluntário">✏️</button>
                <button class="btn btn-icon btn-danger btn-delete-vol" data-id="${v.id}" title="Excluir voluntário">❌</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Handlers dos botões da tabela
      tbody.querySelectorAll('.btn-avail-modal').forEach(btn => {
        btn.onclick = () => {
          const v = volunteers.find(vol => vol.id === btn.dataset.id);
          VolunteerMgmtView.openAvailabilityModal(v, event, () => VolunteerMgmtView.render(container));
        };
      });

      tbody.querySelectorAll('.btn-pref-modal').forEach(btn => {
        btn.onclick = () => {
          const v = volunteers.find(vol => vol.id === btn.dataset.id);
          VolunteerMgmtView.openPreferencesModal(v, categories, () => VolunteerMgmtView.render(container));
        };
      });

      tbody.querySelectorAll('.btn-rating-modal').forEach(btn => {
        btn.onclick = () => {
          const v = volunteers.find(vol => vol.id === btn.dataset.id);
          VolunteerMgmtView.openRatingModal(v, () => VolunteerMgmtView.render(container));
        };
      });

      tbody.querySelectorAll('.btn-edit-vol').forEach(btn => {
        btn.onclick = () => {
          const v = volunteers.find(vol => vol.id === btn.dataset.id);
          VolunteerMgmtView.openVolunteerFormModal(v, event, () => VolunteerMgmtView.render(container));
        };
      });

      tbody.querySelectorAll('.btn-delete-vol').forEach(btn => {
        btn.onclick = async () => {
          const v = volunteers.find(vol => vol.id === btn.dataset.id);
          if (confirm(`Deseja remover o voluntário "${v.name}" do evento?`)) {
            await volunteerService.deleteVolunteer(v.id);
            Toast.success('Voluntário removido com sucesso!');
            VolunteerMgmtView.render(container);
          }
        };
      });
    }

    searchInput.oninput = renderTable;
    filterType.onchange = renderTable;
    filterExp.onchange = renderTable;

    renderTable();

    container.querySelector('#btn-add-volunteer').onclick = () => {
      VolunteerMgmtView.openVolunteerFormModal(null, event, () => VolunteerMgmtView.render(container));
    };
  }

  static openVolunteerFormModal(volunteer = null, event, onSaved) {
    const isEdit = !!volunteer;
    const content = document.createElement('div');
    content.innerHTML = `
      <form id="vol-form">
        <div class="form-group">
          <label class="form-label">Nome do Voluntário / Staff</label>
          <input type="text" id="v-name" class="form-input" value="${volunteer ? volunteer.name : ''}" placeholder="Ex: MATEUS SILVA" required>
        </div>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input type="email" id="v-email" class="form-input" value="${volunteer ? (volunteer.email || '') : ''}" placeholder="mateus@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Telefone / WhatsApp</label>
            <input type="text" id="v-phone" class="form-input" value="${volunteer ? (volunteer.phone || '') : ''}" placeholder="(11) 99999-9999">
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Tipo de Voluntário</label>
            <select id="v-type" class="form-select">
              <option value="integral" ${volunteer && volunteer.type === 'integral' ? 'selected' : ''}>Integral (Disponibilidade Total)</option>
              <option value="part_time" ${volunteer && volunteer.type === 'part_time' ? 'selected' : ''}>Part-time (Horários Específicos)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Experiência no TeenStreet</label>
            <select id="v-exp" class="form-select">
              <option value="experiente" ${volunteer && volunteer.experience === 'experiente' ? 'selected' : ''}>Experiente (Já participou)</option>
              <option value="primeira_vez" ${volunteer && volunteer.experience === 'primeira_vez' ? 'selected' : ''}>Primeira vez</option>
            </select>
          </div>
        </div>

        <div class="flex justify-between" style="margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Atualizar' : 'Salvar Voluntário'}</button>
        </div>
      </form>
    `;

    content.querySelector('#vol-form').onsubmit = async (e) => {
      e.preventDefault();
      try {
        const name = content.querySelector('#v-name').value;
        const email = content.querySelector('#v-email').value;
        const phone = content.querySelector('#v-phone').value;
        const type = content.querySelector('#v-type').value;
        const experience = content.querySelector('#v-exp').value;

        if (isEdit) {
          await volunteerService.updateVolunteer(volunteer.id, {
            name: name.trim().toUpperCase(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            type,
            experience
          });
          Toast.success('Voluntário atualizado com sucesso!');
        } else {
          await volunteerService.registerVolunteer({
            eventId: event.id,
            name,
            email,
            phone,
            type,
            experience
          });
          Toast.success('Voluntário cadastrado com sucesso!');
        }

        Modal.close();
        if (onSaved) onSaved();
      } catch (err) {
        Toast.error(err.message || 'Erro ao salvar voluntário.');
      }
    };

    Modal.open({
      title: isEdit ? `✏️ Editar Voluntário - ${volunteer.name}` : '➕ Novo Voluntário',
      content
    });
  }

  static openAvailabilityModal(volunteer, event, onSaved) {
    const content = document.createElement('div');
    const availabilities = [...(volunteer.availabilities || [])];
    const unavailabilities = [...(volunteer.unavailabilities || [])];

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--primary-800);">
          ${volunteer.name} (${volunteer.type === 'integral' ? 'Integral' : 'Part-time'})
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          ${volunteer.isIntegral() 
            ? 'Voluntários integrais possuem disponibilidade total automática. Caso haja um compromisso ou impedimento em algum horário, cadastre abaixo em <strong>Indisponibilidades Justificadas</strong>.'
            : 'Voluntários part-time <strong>devem</strong> cadastrar os dias e faixas de horários em que estão disponíveis.'}
        </p>
      </div>

      <!-- SEÇÃO 1: DISPONIBILIDADES (PART-TIME) -->
      ${volunteer.isPartTime() ? `
        <div class="card" style="padding: 16px; margin-bottom: 16px; background: #f8fafc;">
          <h5 style="font-size: 0.95rem; margin-bottom: 12px; font-weight: 700;">⏰ Faixas de Disponibilidade</h5>
          <div id="avail-list-box" style="margin-bottom: 12px;"></div>

          <div class="grid grid-cols-3 gap-2">
            <input type="date" id="new-avail-day" class="form-input" value="${event.startDate || ''}" placeholder="Data">
            <input type="time" id="new-avail-start" class="form-input" value="07:00">
            <input type="time" id="new-avail-end" class="form-input" value="13:00">
          </div>
          <button type="button" id="btn-add-avail-slot" class="btn btn-secondary btn-sm w-full" style="margin-top: 8px;">
            ➕ Adicionar Faixa de Horário
          </button>
        </div>
      ` : ''}

      <!-- SEÇÃO 2: INDISPONIBILIDADES JUSTIFICADAS -->
      <div class="card" style="padding: 16px; margin-bottom: 16px; background: #fff5f5; border-color: #fecaca;">
        <h5 style="font-size: 0.95rem; margin-bottom: 12px; font-weight: 700; color: #991b1b;">
          ⚠️ Indisponibilidades / Restrições com Justificativa
        </h5>
        <div id="unavail-list-box" style="margin-bottom: 12px;"></div>

        <div class="grid grid-cols-3 gap-2" style="margin-bottom: 8px;">
          <input type="date" id="new-unavail-day" class="form-input" value="${event.startDate || ''}" placeholder="Data">
          <input type="time" id="new-unavail-start" class="form-input" value="14:00">
          <input type="time" id="new-unavail-end" class="form-input" value="18:00">
        </div>
        <input type="text" id="new-unavail-just" class="form-input" placeholder="Justificativa (Ex: Consulta médica, Aula na faculdade, etc)">
        <button type="button" id="btn-add-unavail-slot" class="btn btn-danger btn-sm w-full" style="margin-top: 8px;">
          ➕ Adicionar Indisponibilidade
        </button>
      </div>

      <div class="flex justify-between" style="margin-top: 20px;">
        <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Fechar</button>
        <button type="button" id="btn-save-all-avail" class="btn btn-primary">Salvar Alterações</button>
      </div>
    `;

    function renderSlots() {
      // Render Availabilities
      const availBox = content.querySelector('#avail-list-box');
      if (availBox) {
        if (availabilities.length === 0) {
          availBox.innerHTML = '<p style="font-size: 0.8rem; color: #dc2626; font-weight: 600;">Nenhuma disponibilidade cadastrada. O voluntário não será escalado.</p>';
        } else {
          availBox.innerHTML = availabilities.map((a, i) => `
            <div class="flex items-center justify-between" style="padding: 6px 10px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 0.85rem;">
              <span>📅 ${a.day ? a.day.split('-').reverse().join('/') : 'Todos os dias'}: <strong>${a.startTime} às ${a.endTime}</strong></span>
              <button type="button" class="btn btn-icon btn-danger btn-sm btn-del-avail" data-index="${i}" style="padding: 2px 6px;">❌</button>
            </div>
          `).join('');

          availBox.querySelectorAll('.btn-del-avail').forEach(b => {
            b.onclick = () => {
              availabilities.splice(Number(b.dataset.index), 1);
              renderSlots();
            };
          });
        }
      }

      // Render Unavailabilities
      const unavailBox = content.querySelector('#unavail-list-box');
      if (unavailabilities.length === 0) {
        unavailBox.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">Nenhuma restrição cadastrada.</p>';
      } else {
        unavailBox.innerHTML = unavailabilities.map((u, i) => `
          <div class="flex items-center justify-between" style="padding: 6px 10px; background: #ffffff; border: 1px solid #fecaca; border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 0.85rem;">
            <div>
              <div>📅 ${u.day ? u.day.split('-').reverse().join('/') : 'Todos os dias'}: <strong>${u.startTime} às ${u.endTime}</strong></div>
              <div style="font-size: 0.75rem; color: #991b1b; font-style: italic;">Motivo: ${u.justification || 'Não informado'}</div>
            </div>
            <button type="button" class="btn btn-icon btn-danger btn-sm btn-del-unavail" data-index="${i}" style="padding: 2px 6px;">❌</button>
          </div>
        `).join('');

        unavailBox.querySelectorAll('.btn-del-unavail').forEach(b => {
          b.onclick = () => {
            unavailabilities.splice(Number(b.dataset.index), 1);
            renderSlots();
          };
        });
      }
    }

    const addAvailBtn = content.querySelector('#btn-add-avail-slot');
    if (addAvailBtn) {
      addAvailBtn.onclick = () => {
        const day = content.querySelector('#new-avail-day').value;
        const startTime = content.querySelector('#new-avail-start').value;
        const endTime = content.querySelector('#new-avail-end').value;
        if (!startTime || !endTime) {
          Toast.error('Informe os horários de início e fim.');
          return;
        }
        availabilities.push({ day, startTime, endTime });
        renderSlots();
      };
    }

    content.querySelector('#btn-add-unavail-slot').onclick = () => {
      const day = content.querySelector('#new-unavail-day').value;
      const startTime = content.querySelector('#new-unavail-start').value;
      const endTime = content.querySelector('#new-unavail-end').value;
      const justification = content.querySelector('#new-unavail-just').value;

      if (!justification) {
        Toast.error('Por favor, informe a justificativa da indisponibilidade.');
        return;
      }
      unavailabilities.push({ day, startTime, endTime, justification });
      content.querySelector('#new-unavail-just').value = '';
      renderSlots();
    };

    content.querySelector('#btn-save-all-avail').onclick = async () => {
      await volunteerService.updateAvailabilities(volunteer.id, availabilities);
      await volunteerService.updateUnavailabilities(volunteer.id, unavailabilities);
      Toast.success('Disponibilidades e restrições salvas!');
      Modal.close();
      if (onSaved) onSaved();
    };

    renderSlots();

    Modal.open({
      title: `⏰ Agenda & Restrições - ${volunteer.name}`,
      content
    });
  }

  static openPreferencesModal(volunteer, categories, onSaved) {
    const content = document.createElement('div');
    const prefs = { ...(volunteer.categoryPreferences || {}) };

    content.innerHTML = `
      <div style="margin-bottom: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">
          Configure quais categorias de escala o voluntário <strong>${volunteer.name}</strong> terá preferência e prioridade para ser escalado.
        </p>

        ${categories.length === 0 ? `
          <p style="color: var(--text-muted); font-size: 0.85rem;">Nenhuma categoria de escala cadastrada no evento.</p>
        ` : `
          <div class="flex flex-col gap-2">
            ${categories.map(cat => `
              <label class="flex items-center gap-3" style="padding: 10px 12px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="checkbox" class="cat-pref-check" data-id="${cat.id}" ${prefs[cat.id] ? 'checked' : ''} style="width: 18px; height: 18px;">
                <div style="flex: 1;">
                  <div style="font-weight: 700; color: var(--text-primary);">${cat.name}</div>
                  <div style="font-size: 0.775rem; color: var(--text-muted);">${cat.description || ''}</div>
                </div>
                <span class="badge" style="background: ${cat.color || '#3b82f6'}20; color: ${cat.color || '#3b82f6'};">
                  Prioridade ${cat.priority || 1}
                </span>
              </label>
            `).join('')}
          </div>
        `}
      </div>

      <div class="flex justify-between" style="margin-top: 24px;">
        <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
        <button type="button" id="btn-save-prefs" class="btn btn-primary">Salvar Preferências</button>
      </div>
    `;

    content.querySelector('#btn-save-prefs').onclick = async () => {
      const updatedPrefs = {};
      content.querySelectorAll('.cat-pref-check').forEach(chk => {
        if (chk.checked) {
          updatedPrefs[chk.dataset.id] = true;
        }
      });

      await volunteerService.updateCategoryPreferences(volunteer.id, updatedPrefs);
      Toast.success('Preferências de categoria atualizadas!');
      Modal.close();
      if (onSaved) onSaved();
    };

    Modal.open({
      title: `⚙️ Preferências de Categoria - ${volunteer.name}`,
      content
    });
  }

  static openRatingModal(volunteer, onSaved) {
    const content = document.createElement('div');
    let ratingVal = volunteer.adminRating !== undefined ? volunteer.adminRating : 5;

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
          Avaliação do administrador sobre a dedicação, pontualidade e desempenho de <strong>${volunteer.name}</strong>. Esta nota é considerada no algoritmo de escalas.
        </p>

        <div class="form-group" style="align-items: center; margin-bottom: 20px;">
          <label class="form-label" style="font-size: 1rem;">Nota (0 a 5 estrelas)</label>
          <div id="star-rating-box" style="margin-top: 6px;"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Observações do Administrador (Opcional)</label>
          <textarea id="admin-notes" class="form-textarea" rows="3" placeholder="Ex: Excelente liderança, pontual, ótima comunicação...">${volunteer.adminNotes || ''}</textarea>
        </div>
      </div>

      <div class="flex justify-between" style="margin-top: 20px;">
        <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
        <button type="button" id="btn-save-rating" class="btn btn-primary">Salvar Avaliação</button>
      </div>
    `;

    const starBox = content.querySelector('#star-rating-box');
    starBox.appendChild(StarRating.render({
      value: ratingVal,
      readOnly: false,
      onChange: (val) => { ratingVal = val; }
    }));

    content.querySelector('#btn-save-rating').onclick = async () => {
      const notes = content.querySelector('#admin-notes').value;
      await volunteerService.updateAdminRating(volunteer.id, ratingVal, notes);
      Toast.success('Avaliação salva com sucesso!');
      Modal.close();
      if (onSaved) onSaved();
    };

    Modal.open({
      title: `⭐ Avaliação do Voluntário - ${volunteer.name}`,
      content
    });
  }
}
