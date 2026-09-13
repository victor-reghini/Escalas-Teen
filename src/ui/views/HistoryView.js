import { authService } from '../../services/AuthService.js';
import { volunteerService } from '../../services/VolunteerService.js';
import { eventService } from '../../services/EventService.js';
import { scheduleService } from '../../services/ScheduleService.js';

export class HistoryView {
  static async render(container) {
    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();

    if (!user) {
      window.location.hash = '#login';
      return;
    }

    const historyData = await volunteerService.getVolunteerHistoricalOverview(user.id);
    const allEvents = await eventService.getAllEvents();

    container.innerHTML = `
      <div style="margin-bottom: 24px;" class="flex items-center justify-between">
        <div>
          <h2>📜 Histórico Geral</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Acompanhe sua trajetória, escalas servidas e feedbacks em todos os eventos do TeenStreet.
          </p>
        </div>
      </div>

      <!-- RESUMO HISTÓRICO -->
      <div class="grid grid-cols-3" style="margin-bottom: 28px;">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-100); color: var(--primary-700);">🎪</div>
          <div class="stat-info">
            <h4>Eventos Participados</h4>
            <div class="stat-value">${historyData.events.length || 1}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #d1fae5; color: #047857;">📋</div>
          <div class="stat-info">
            <h4>Total de Escalas Servidas</h4>
            <div class="stat-value">
              ${Object.values(historyData.shiftsByEvent).reduce((acc, list) => acc + list.length, 0)}
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #ede9fe; color: #6d28d9;">⭐</div>
          <div class="stat-info">
            <h4>Feedbacks Enviados</h4>
            <div class="stat-value">${historyData.feedbacks.length}</div>
          </div>
        </div>
      </div>

      <!-- HISTÓRICO POR EVENTO -->
      <div id="history-events-container"></div>
    `;

    const eventsContainer = container.querySelector('#history-events-container');

    if (allEvents.length === 0) {
      eventsContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; color: var(--text-muted);">
          Nenhum histórico de eventos encontrado.
        </div>
      `;
      return;
    }

    eventsContainer.innerHTML = allEvents.map(event => {
      const shiftsInEvent = historyData.shiftsByEvent[event.id] || [];
      const feedbacksInEvent = historyData.feedbacks.filter(f => f.eventId === event.id);

      return `
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <div>
              <h3 class="card-title">🎪 ${event.name}</h3>
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                ${event.startDate ? event.startDate.split('-').reverse().join('/') : ''} até ${event.endDate ? event.endDate.split('-').reverse().join('/') : ''}
              </span>
            </div>
            <button class="btn btn-secondary btn-sm btn-switch-event" data-id="${event.id}">
              Alternar para este Evento
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- ESCALAS SERVIDAS NESTE EVENTO -->
            <div>
              <h4 style="font-size: 0.95rem; margin-bottom: 10px; font-weight: 700; color: var(--primary-900);">
                📋 Escalas Servidas (${shiftsInEvent.length})
              </h4>
              ${shiftsInEvent.length === 0 ? `
                <p style="font-size: 0.85rem; color: var(--text-muted);">Nenhuma escala registrada para você neste evento.</p>
              ` : `
                <div class="flex flex-col gap-2">
                  ${shiftsInEvent.map(s => `
                    <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.85rem;">
                      <div style="font-weight: 700; color: var(--text-primary);">${s.title}</div>
                      <div style="font-size: 0.775rem; color: var(--text-muted);">
                        📅 ${s.date} | ⏰ ${s.startTime}-${s.endTime} | 📍 ${s.generalLocation || 'Geral'}
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- FEEDBACKS REGISTRADOS -->
            <div>
              <h4 style="font-size: 0.95rem; margin-bottom: 10px; font-weight: 700; color: #7c3aed;">
                ⭐ Feedbacks Registrados (${feedbacksInEvent.length})
              </h4>
              ${feedbacksInEvent.length === 0 ? `
                <p style="font-size: 0.85rem; color: var(--text-muted);">Nenhum feedback registrado.</p>
              ` : `
                <div class="flex flex-col gap-2">
                  ${feedbacksInEvent.map(f => `
                    <div style="padding: 8px 12px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: var(--radius-sm); font-size: 0.85rem;">
                      <div class="flex items-center justify-between">
                        <span style="font-weight: 700; color: #581c87;">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)} (${f.rating}/5)</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${f.createdAt ? f.createdAt.substring(0, 10) : ''}</span>
                      </div>
                      ${f.comment ? `<div style="font-size: 0.8rem; color: #475569; margin-top: 4px; font-style: italic;">"${f.comment}"</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');

    eventsContainer.querySelectorAll('.btn-switch-event').forEach(btn => {
      btn.onclick = async () => {
        const ev = allEvents.find(e => e.id === btn.dataset.id);
        if (ev) {
          eventService.setCurrentEvent(ev);
          window.location.hash = isAdmin ? '#admin' : '#portal';
        }
      };
    });
  }
}
