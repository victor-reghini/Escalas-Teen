import { scheduleService } from '../../services/ScheduleService.js';
import { volunteerService } from '../../services/VolunteerService.js';
import { eventService } from '../../services/EventService.js';
import { authService } from '../../services/AuthService.js';
import { ShiftGenerator } from '../../engine/ShiftGenerator.js';
import { Shift } from '../../models/Shift.js';
import { CandidatePicker } from '../components/CandidatePicker.js';
import { ShiftExportModal } from './ShiftExportModal.js';
import { Toast } from '../components/Toast.js';
import { Modal } from '../components/Modal.js';

export class ShiftGenerationView {
  static async render(container) {
    const event = eventService.getCurrentEvent();
    if (!event) {
      window.location.hash = '#events';
      return;
    }

    const volunteers = await volunteerService.getVolunteersByEvent(event.id);
    const schedules = await scheduleService.getSchedulesByEvent(event.id);
    const categories = await scheduleService.getCategoriesByEvent(event.id);
    const shifts = await scheduleService.getShiftsByEvent(event.id);
    const feedbacks = await scheduleService.getFeedbacksByEvent(event.id);
    const isAdmin = authService.isAdmin();

    container.innerHTML = `
      <div style="margin-bottom: 24px;" class="flex items-center justify-between">
        <div>
          <h2>📋 Gestão e Geração de Escalas</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Gere escalas inteligentes com cálculo de desgaste e preferências ou monte manualmente.
          </p>
        </div>
        <div class="flex gap-2">
          ${event.autoGenerationEnabled !== false ? `
            <button id="btn-generate-shifts" class="btn btn-primary">
              ⚡ Gerar Escalas Automaticamente
            </button>
          ` : `
            <span class="badge badge-warning" style="padding: 8px 12px; font-size: 0.85rem;">
              ⚠️ Geração Automática Desabilitada
            </span>
          `}
          <button id="btn-create-manual-shift" class="btn btn-secondary">
            ➕ Nova Escala Manual
          </button>
          ${shifts.length > 0 ? `
            <button id="btn-export-all-shifts" class="btn btn-accent">
              📤 Exportar Todas
            </button>
          ` : ''}
        </div>
      </div>

      <!-- LISTA DE ESCALAS -->
      <div id="shifts-list-container"></div>
    `;

    const listContainer = container.querySelector('#shifts-list-container');

    function renderShifts() {
      if (shifts.length === 0) {
        listContainer.innerHTML = `
          <div class="card" style="text-align: center; padding: 50px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">📋</div>
            <h3 style="margin-bottom: 8px;">Nenhuma escala gerada no momento</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
              Clique em <strong>Gerar Escalas Automaticamente</strong> para alocar os voluntários com base em desgaste e categorias, ou crie manualmente.
            </p>
            <div class="flex justify-center gap-2">
              <button class="btn btn-primary" onclick="document.querySelector('#btn-generate-shifts')?.click()">
                ⚡ Gerar Escalas Automaticamente
              </button>
            </div>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = shifts.map((shift, shiftIndex) => {
        const cat = categories.find(c => c.id === shift.categoryId);
        const isApproved = shift.isApproved();
        const assignments = shift.assignments || [];

        return `
          <div class="shift-card" data-id="${shift.id}">
            <div class="shift-card-header">
              <div class="flex items-center gap-3">
                <span style="font-size: 1.25rem;">📋</span>
                <input type="text" class="shift-title-input" value="${shift.title}" style="background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 1.1rem; font-weight: 700; padding: 4px 8px; border-radius: var(--radius-sm); outline: none;" data-id="${shift.id}">
                ${cat ? `
                  <span class="badge" style="background: #ffffff; color: ${cat.color || '#1e3a8a'}; font-size: 0.75rem;">
                    ${cat.name}
                  </span>
                ` : ''}
              </div>

              <div class="flex items-center gap-2">
                <span class="badge ${isApproved ? 'badge-success' : 'badge-warning'}">
                  ${isApproved ? '✅ Aprovada' : '⏳ Rascunho / Pendente'}
                </span>
                <button class="btn btn-secondary btn-sm btn-export-single" data-id="${shift.id}" title="Exportar (WhatsApp, PDF, Imagem)">
                  📤 Exportar
                </button>
                ${!isApproved ? `
                  <button class="btn btn-success btn-sm btn-approve-shift" data-id="${shift.id}" title="Aprovar e Publicar Escala">
                    ✅ Aprovar
                  </button>
                ` : ''}
                <button class="btn btn-icon btn-danger btn-sm btn-delete-shift" data-id="${shift.id}" title="Remover Escala" style="background: rgba(255,255,255,0.2); color: #fff; border: none;">
                  ❌
                </button>
              </div>
            </div>

            <div class="shift-meta-bar">
              <div>📅 Data: <strong>${shift.date ? shift.date.split('-').reverse().join('/') : '-'}</strong></div>
              <div>⏰ Horário Geral: <strong>${shift.startTime} às ${shift.endTime}</strong></div>
              <div>📍 Local Geral: <strong>${shift.generalLocation || 'Refeitório / Geral'}</strong></div>
              <div>👥 Total Alocados: <strong>${assignments.length} voluntários</strong></div>
            </div>

            <div class="shift-assignments">
              <div class="table-container" style="margin-bottom: 12px;">
                <table class="table">
                  <thead>
                    <tr>
                      <th style="width: 35%;">VOLUNTÁRIO</th>
                      <th style="width: 25%;">HORÁRIO</th>
                      <th style="width: 30%;">FUNÇÃO / LOCAL</th>
                      <th style="width: 10%; text-align: center;">AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${assignments.length === 0 ? `
                      <tr>
                        <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">
                          Nenhum voluntário escalado. Clique em <strong>➕ Adicionar Voluntário</strong> abaixo.
                        </td>
                      </tr>
                    ` : assignments.map((a, aIdx) => `
                      <tr data-assignment-index="${aIdx}">
                        <td style="font-weight: 700;">
                          <div class="flex items-center justify-between">
                            <span>${a.volunteerName}</span>
                            <button class="btn btn-icon btn-sm btn-change-volunteer" data-shift-id="${shift.id}" data-index="${aIdx}" title="Substituir por outro voluntário ordenado por afinidade">
                              🔄
                            </button>
                          </div>
                        </td>
                        <td>
                          <input type="text" class="form-input input-time-range" value="${a.startTime || shift.startTime} - ${a.endTime || shift.endTime}" style="padding: 4px 8px; font-size: 0.85rem;" data-shift-id="${shift.id}" data-index="${aIdx}">
                        </td>
                        <td>
                          <input type="text" class="form-input input-role-loc" value="${a.roleName || 'Staff'}${a.specificLocation ? ` (${a.specificLocation})` : ''}" style="padding: 4px 8px; font-size: 0.85rem;" data-shift-id="${shift.id}" data-index="${aIdx}">
                        </td>
                        <td style="text-align: center;">
                          <button class="btn btn-icon btn-danger btn-sm btn-remove-assignment" data-shift-id="${shift.id}" data-index="${aIdx}" title="Remover voluntário">
                            ❌
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="flex justify-between items-center">
                <button class="btn btn-secondary btn-sm btn-add-assignment" data-id="${shift.id}">
                  ➕ Adicionar Voluntário à Escala
                </button>
                <div class="flex gap-2">
                  <button class="btn btn-secondary btn-sm btn-duplicate-shift" data-id="${shift.id}">
                    📄 Duplicar Escala
                  </button>
                  <button class="btn btn-primary btn-sm btn-save-shift" data-id="${shift.id}">
                    💾 Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Handlers de interação
      listContainer.querySelectorAll('.btn-export-single').forEach(btn => {
        btn.onclick = () => {
          const s = shifts.find(shift => shift.id === btn.dataset.id);
          ShiftExportModal.open(s, event);
        };
      });

      listContainer.querySelectorAll('.btn-approve-shift').forEach(btn => {
        btn.onclick = async () => {
          const user = authService.getCurrentUser();
          await scheduleService.approveShift(btn.dataset.id, user ? user.id : 'admin');
          Toast.success('Escala aprovada e publicada!');
          ShiftGenerationView.render(container);
        };
      });

      listContainer.querySelectorAll('.btn-delete-shift').forEach(btn => {
        btn.onclick = async () => {
          if (confirm('Deseja remover esta escala inteira?')) {
            await scheduleService.deleteShift(btn.dataset.id);
            Toast.success('Escala excluída com sucesso!');
            ShiftGenerationView.render(container);
          }
        };
      });

      listContainer.querySelectorAll('.btn-add-assignment').forEach(btn => {
        btn.onclick = () => {
          const shift = shifts.find(s => s.id === btn.dataset.id);
          const sched = schedules.find(sc => sc.id === shift.scheduleId) || shift;

          CandidatePicker.open({
            schedule: sched,
            volunteers,
            allSchedules: schedules,
            currentAssignedShifts: shifts,
            categories,
            feedbacks,
            onSelect: async (chosenVolunteer) => {
              if (!shift.assignments) shift.assignments = [];
              shift.assignments.push({
                volunteerId: chosenVolunteer.id,
                volunteerName: chosenVolunteer.name,
                roleId: `role-${Date.now()}`,
                roleName: 'Staff',
                specificLocation: shift.generalLocation,
                startTime: shift.startTime,
                endTime: shift.endTime,
                manualOverride: true
              });

              await scheduleService.saveShift(shift);
              Toast.success(`${chosenVolunteer.name} adicionado à escala!`);
              ShiftGenerationView.render(container);
            }
          });
        };
      });

      listContainer.querySelectorAll('.btn-change-volunteer').forEach(btn => {
        btn.onclick = () => {
          const shift = shifts.find(s => s.id === btn.dataset.shiftId);
          const aIdx = Number(btn.dataset.index);
          const sched = schedules.find(sc => sc.id === shift.scheduleId) || shift;

          CandidatePicker.open({
            schedule: sched,
            volunteers,
            allSchedules: schedules,
            currentAssignedShifts: shifts,
            categories,
            feedbacks,
            onSelect: async (chosenVolunteer) => {
              shift.assignments[aIdx].volunteerId = chosenVolunteer.id;
              shift.assignments[aIdx].volunteerName = chosenVolunteer.name;
              shift.assignments[aIdx].manualOverride = true;

              await scheduleService.saveShift(shift);
              Toast.success(`Substituído por ${chosenVolunteer.name}!`);
              ShiftGenerationView.render(container);
            }
          });
        };
      });

      listContainer.querySelectorAll('.btn-remove-assignment').forEach(btn => {
        btn.onclick = async () => {
          const shift = shifts.find(s => s.id === btn.dataset.shiftId);
          const aIdx = Number(btn.dataset.index);
          shift.assignments.splice(aIdx, 1);
          await scheduleService.saveShift(shift);
          Toast.success('Voluntário removido da escala.');
          ShiftGenerationView.render(container);
        };
      });

      listContainer.querySelectorAll('.btn-save-shift').forEach(btn => {
        btn.onclick = async () => {
          const card = btn.closest('.shift-card');
          const shift = shifts.find(s => s.id === btn.dataset.id);
          const titleInput = card.querySelector('.shift-title-input');
          shift.title = titleInput.value.trim().toUpperCase();

          card.querySelectorAll('tbody tr').forEach((tr, idx) => {
            const timeInput = tr.querySelector('.input-time-range');
            const roleInput = tr.querySelector('.input-role-loc');
            if (timeInput && shift.assignments[idx]) {
              const parts = timeInput.value.split('-').map(p => p.trim());
              shift.assignments[idx].startTime = parts[0] || shift.startTime;
              shift.assignments[idx].endTime = parts[1] || shift.endTime;
            }
            if (roleInput && shift.assignments[idx]) {
              shift.assignments[idx].roleName = roleInput.value.trim();
            }
          });

          await scheduleService.saveShift(shift);
          Toast.success('Escala salva com sucesso!');
        };
      });

      listContainer.querySelectorAll('.btn-duplicate-shift').forEach(btn => {
        btn.onclick = async () => {
          const shift = shifts.find(s => s.id === btn.dataset.id);
          const newShift = new Shift({
            ...shift.toJSON(),
            id: `shift-clone-${Date.now()}`,
            title: `${shift.title} (CÓPIA)`,
            status: 'draft'
          });
          await scheduleService.saveShift(newShift);
          Toast.success('Escala duplicada com sucesso!');
          ShiftGenerationView.render(container);
        };
      });
    }

    renderShifts();

    // Handler de Geração Automática
    const generateBtn = container.querySelector('#btn-generate-shifts');
    if (generateBtn) {
      generateBtn.onclick = async () => {
        if (schedules.length === 0) {
          Toast.error('Cadastre pelo menos uma programação antes de gerar escalas.');
          return;
        }
        if (volunteers.length === 0) {
          Toast.error('Cadastre voluntários antes de gerar escalas.');
          return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = '⚡ Gerando escalas inteligentes...';

        try {
          const result = ShiftGenerator.generate({
            eventId: event.id,
            volunteers,
            schedules,
            categories,
            feedbacks,
            existingShifts: shifts
          });

          // Salva todas as escalas geradas no Firestore
          for (const s of result.generatedShifts) {
            await scheduleService.saveShift(s);
          }

          if (result.warnings.length > 0) {
            Toast.warning(`Escalas geradas com ${result.warnings.length} aviso(s) de voluntários faltantes.`);
          } else {
            Toast.success(`🎉 Todas as ${result.generatedShifts.length} escalas geradas com sucesso!`);
          }

          ShiftGenerationView.render(container);
        } catch (err) {
          Toast.error(err.message || 'Erro ao gerar escalas.');
        } finally {
          generateBtn.disabled = false;
          generateBtn.textContent = '⚡ Gerar Escalas Automaticamente';
        }
      };
    }

    // Handler de Nova Escala Manual
    const manualBtn = container.querySelector('#btn-create-manual-shift');
    if (manualBtn) {
      manualBtn.onclick = () => {
        ShiftGenerationView.openCreateManualShiftModal(event, categories, () => ShiftGenerationView.render(container));
      };
    }

    // Handler de Exportar Todas
    const exportAllBtn = container.querySelector('#btn-export-all-shifts');
    if (exportAllBtn) {
      exportAllBtn.onclick = () => {
        ShiftExportModal.openAll(shifts, event);
      };
    }
  }

  static openCreateManualShiftModal(event, categories, onSaved) {
    const content = document.createElement('div');
    content.innerHTML = `
      <form id="manual-shift-form">
        <div class="form-group">
          <label class="form-label">Título da Escala</label>
          <input type="text" id="m-title" class="form-input" placeholder="Ex: ESCALA CAFÉ DA MANHÃ - 17/07/2026" required>
        </div>

        <div class="grid grid-cols-3">
          <div class="form-group">
            <label class="form-label">Data</label>
            <input type="date" id="m-date" class="form-input" value="${event.startDate || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Início</label>
            <input type="time" id="m-start" class="form-input" value="07:30" required>
          </div>
          <div class="form-group">
            <label class="form-label">Fim</label>
            <input type="time" id="m-end" class="form-input" value="09:00" required>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Local Geral</label>
            <input type="text" id="m-loc" class="form-input" placeholder="Ex: Refeitório Principal">
          </div>
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select id="m-cat" class="form-select">
              <option value="">Sem categoria</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="flex justify-between" style="margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
          <button type="submit" class="btn btn-primary">Criar Escala</button>
        </div>
      </form>
    `;

    content.querySelector('#manual-shift-form').onsubmit = async (e) => {
      e.preventDefault();
      try {
        const title = content.querySelector('#m-title').value;
        const date = content.querySelector('#m-date').value;
        const startTime = content.querySelector('#m-start').value;
        const endTime = content.querySelector('#m-end').value;
        const generalLocation = content.querySelector('#m-loc').value;
        const categoryId = content.querySelector('#m-cat').value;

        const shift = new Shift({
          id: `shift-manual-${Date.now()}`,
          eventId: event.id,
          scheduleId: `sched-manual-${Date.now()}`,
          title: title.trim().toUpperCase(),
          date,
          startTime,
          endTime,
          generalLocation,
          categoryId,
          status: 'draft',
          assignments: []
        });

        await scheduleService.saveShift(shift);
        Toast.success('Escala criada! Adicione voluntários.');
        Modal.close();
        if (onSaved) onSaved();
      } catch (err) {
        Toast.error(err.message || 'Erro ao criar escala.');
      }
    };

    Modal.open({
      title: '➕ Nova Escala Manual',
      content
    });
  }
}
