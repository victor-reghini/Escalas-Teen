import { eventService } from '../../services/EventService.js';
import { authService } from '../../services/AuthService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export class EventSelectView {
  static async render(container) {
    const events = await eventService.getAllEvents();
    const currentEvent = eventService.getCurrentEvent();
    const isAdmin = authService.isAdmin();

    container.innerHTML = `
      <div style="margin-bottom: 28px;" class="flex items-center justify-between">
        <div>
          <h2>🎪 Gestão de Eventos</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Selecione o evento ativo ou gerencie novos eventos.
          </p>
        </div>
        ${isAdmin ? `
          <div class="flex gap-2">
            <button id="btn-clone-event" class="btn btn-secondary">
              📄 Clonar de Evento Anterior
            </button>
            <button id="btn-create-event" class="btn btn-primary">
              ➕ Novo Evento
            </button>
          </div>
        ` : ''}
      </div>

      <div class="grid grid-cols-3" id="events-grid"></div>
    `;

    const grid = container.querySelector('#events-grid');

    if (events.length === 0) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          <p style="color: var(--text-muted); font-size: 1.1rem;">Nenhum evento cadastrado.</p>
        </div>
      `;
    } else {
      events.forEach(event => {
        const isCurrent = currentEvent && currentEvent.id === event.id;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.border = isCurrent ? '2px solid var(--primary-600)' : '1px solid var(--border-color)';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';

        const inviteLink = `${window.location.origin}${window.location.pathname}#login?event=${event.code || event.id}`;

        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between" style="margin-bottom: 12px;">
              <span class="badge ${isCurrent ? 'badge-primary' : 'badge-gray'}">
                ${isCurrent ? '⭐ Evento Ativo' : '🎪 Evento'}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                ${event.startDate ? event.startDate.split('-').reverse().join('/') : ''}
              </span>
            </div>

            <h3 style="font-size: 1.25rem; margin-bottom: 8px;">${event.name}</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">
              ${event.description || 'Sem descrição cadastrada.'}
            </p>
          </div>

          <div>
            <div style="margin-bottom: 12px; padding: 8px 12px; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.8rem;">
              <div style="font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">🔗 Link do Voluntário:</div>
              <div class="flex items-center gap-2">
                <input type="text" class="form-input" style="padding: 4px 8px; font-size: 0.75rem;" value="${inviteLink}" readonly>
                <button class="btn btn-secondary btn-sm btn-copy-link" data-link="${inviteLink}" title="Copiar link">📋</button>
              </div>
            </div>

            <div class="flex gap-2">
              <button class="btn ${isCurrent ? 'btn-secondary' : 'btn-primary'} w-full btn-select-event" data-id="${event.id}">
                ${isCurrent ? 'Visualizar' : 'Selecionar Evento'}
              </button>
            </div>
          </div>
        `;

        card.querySelector('.btn-select-event').onclick = () => {
          eventService.setCurrentEvent(event);
          Toast.success(`Evento "${event.name}" selecionado!`);
          window.location.hash = isAdmin ? '#admin' : '#portal';
        };

        const copyBtn = card.querySelector('.btn-copy-link');
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(inviteLink);
            Toast.success('Link do evento copiado para a área de transferência!');
          };
        }

        grid.appendChild(card);
      });
    }

    // Modal de Novo Evento
    const createBtn = container.querySelector('#btn-create-event');
    if (createBtn) {
      createBtn.onclick = () => {
        this.openCreateEventModal();
      };
    }

    // Modal de Clonar Evento
    const cloneBtn = container.querySelector('#btn-clone-event');
    if (cloneBtn) {
      cloneBtn.onclick = () => {
        this.openCloneEventModal(events);
      };
    }
  }

  static openCreateEventModal() {
    const content = document.createElement('div');
    content.innerHTML = `
      <form id="create-event-form">
        <div class="form-group">
          <label class="form-label">Nome do Evento</label>
          <input type="text" id="ev-name" class="form-input" placeholder="Ex: TeenStreet Brasil 2026" required>
        </div>

        <div class="form-group">
          <label class="form-label">Código / Slug do Link</label>
          <input type="text" id="ev-code" class="form-input" placeholder="Ex: ts-2026">
        </div>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Data de Início</label>
            <input type="date" id="ev-start" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Data de Término</label>
            <input type="date" id="ev-end" class="form-input" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Descrição / Tema</label>
          <textarea id="ev-desc" class="form-textarea" rows="2" placeholder="Tema, versículo ou informações gerais..."></textarea>
        </div>

        <div class="flex justify-between" style="margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Evento</button>
        </div>
      </form>
    `;

    content.querySelector('#create-event-form').onsubmit = async (e) => {
      e.preventDefault();
      try {
        const name = content.querySelector('#ev-name').value;
        const code = content.querySelector('#ev-code').value;
        const startDate = content.querySelector('#ev-start').value;
        const endDate = content.querySelector('#ev-end').value;
        const description = content.querySelector('#ev-desc').value;

        const user = authService.getCurrentUser();
        const ev = await eventService.createEvent({
          name,
          code,
          startDate,
          endDate,
          description
        }, user ? user.id : null);

        Modal.close();
        Toast.success(`Evento "${ev.name}" criado com sucesso!`);
        window.location.hash = '#admin';
      } catch (err) {
        Toast.error(err.message || 'Erro ao criar evento.');
      }
    };

    Modal.open({
      title: '🎪 Criar Novo Evento',
      content
    });
  }

  static openCloneEventModal(events) {
    const currentEvent = eventService.getCurrentEvent();
    if (!currentEvent) {
      Toast.error('Selecione primeiro o evento de destino.');
      return;
    }

    const otherEvents = events.filter(e => e.id !== currentEvent.id);
    if (otherEvents.length === 0) {
      Toast.warning('Não há eventos anteriores disponíveis para clonar.');
      return;
    }

    const content = document.createElement('div');
    content.innerHTML = `
      <form id="clone-event-form">
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
          Copie automaticamente todas as <strong>Categorias</strong> e <strong>Programações</strong> de um evento anterior para o evento atual (<strong>${currentEvent.name}</strong>).
        </p>

        <div class="form-group">
          <label class="form-label">Selecione o Evento de Origem</label>
          <select id="clone-source-id" class="form-select" required>
            ${otherEvents.map(e => `<option value="${e.id}">${e.name} (${e.startDate || 'Sem data'})</option>`).join('')}
          </select>
        </div>

        <div class="flex justify-between" style="margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
          <button type="submit" class="btn btn-primary" id="btn-submit-clone">Clonar Dados</button>
        </div>
      </form>
    `;

    content.querySelector('#clone-event-form').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = content.querySelector('#btn-submit-clone');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Clonando...';

      try {
        const sourceId = content.querySelector('#clone-source-id').value;
        const result = await eventService.cloneFromPreviousEvent(sourceId, currentEvent.id);

        Modal.close();
        Toast.success(`Sucesso! ${result.clonedCategories} categorias e ${result.clonedSchedules} programações clonadas!`);
        window.location.hash = '#schedules';
      } catch (err) {
        Toast.error(err.message || 'Erro ao clonar evento.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Clonar Dados';
      }
    };

    Modal.open({
      title: '📄 Clonar de Evento Anterior',
      content
    });
  }
}
