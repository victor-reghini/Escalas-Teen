import { eventService } from '../../services/EventService.js';
import { volunteerService } from '../../services/VolunteerService.js';
import { scheduleService } from '../../services/ScheduleService.js';
import { WearCalculator } from '../../engine/WearCalculator.js';
import { availabilityChecker } from '../../engine/AvailabilityChecker.js';

export class AdminDashboardView {
  static async render(container) {
    const event = eventService.getCurrentEvent();
    if (!event) {
      window.location.hash = '#events';
      return;
    }

    const volunteers = await volunteerService.getVolunteersByEvent(event.id);
    const schedules = await scheduleService.getSchedulesByEvent(event.id);
    const shifts = await scheduleService.getShiftsByEvent(event.id);

    const approvedShifts = shifts.filter(s => s.isApproved());
    const integralCount = volunteers.filter(v => v.isIntegral()).length;
    const partTimeCount = volunteers.filter(v => v.isPartTime()).length;

    const avgWear = WearCalculator.calculateGroupAverageWear(
      volunteers,
      schedules[0] || null,
      schedules,
      shifts,
      availabilityChecker
    );
    const avgWearPct = Math.round(avgWear * 100);

    container.innerHTML = `
      <div style="margin-bottom: 28px;" class="flex items-center justify-between">
        <div>
          <h2>📊 Painel de Controle - ${event.name}</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Visão geral de voluntários, programações e escalas do evento ativo.
          </p>
        </div>
        <div class="flex gap-2">
          <a href="#shifts" class="btn btn-primary">⚡ Gerar & Editar Escalas</a>
          <a href="#settings" class="btn btn-secondary">⚙️ Configurações</a>
        </div>
      </div>

      <!-- CARDS DE ESTATÍSTICAS -->
      <div class="grid grid-cols-4" style="margin-bottom: 28px;">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-100); color: var(--primary-700);">👥</div>
          <div class="stat-info">
            <h4>Voluntários</h4>
            <div class="stat-value">${volunteers.length}</div>
            <span style="font-size: 0.775rem; color: var(--text-muted);">${integralCount} Integrais | ${partTimeCount} Part-time</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #ede9fe; color: #6d28d9;">📅</div>
          <div class="stat-info">
            <h4>Programações</h4>
            <div class="stat-value">${schedules.length}</div>
            <span style="font-size: 0.775rem; color: var(--text-muted);">Horários cadastrados</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #d1fae5; color: #047857;">📋</div>
          <div class="stat-info">
            <h4>Escalas Geradas</h4>
            <div class="stat-value">${shifts.length}</div>
            <span style="font-size: 0.775rem; color: var(--text-muted);">${approvedShifts.length} aprovadas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #ffedd5; color: #c2410c;">⚡</div>
          <div class="stat-info">
            <h4>Desgaste Médio</h4>
            <div class="stat-value">${avgWearPct}%</div>
            <span style="font-size: 0.775rem; color: var(--text-muted);">Carga média do grupo</span>
          </div>
        </div>
      </div>

      <!-- ATALHOS RÁPIDOS E PRÓXIMAS ESCALAS -->
      <div class="grid grid-cols-3">
        <div class="card" style="grid-column: span 2;">
          <div class="card-header">
            <h3 class="card-title">📋 Próximas Escalas do Evento</h3>
            <a href="#shifts" class="btn btn-secondary btn-sm">Ver Todas</a>
          </div>

          ${shifts.length === 0 ? `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
              Nenhuma escala gerada no momento. <a href="#shifts" style="font-weight: 700;">Clique aqui para gerar</a>.
            </div>
          ` : `
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Escala</th>
                    <th>Data & Horário</th>
                    <th>Local</th>
                    <th>Alocados</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${shifts.slice(0, 5).map(s => `
                    <tr>
                      <td style="font-weight: 700;">${s.title}</td>
                      <td>${s.date ? s.date.split('-').reverse().join('/') : ''} ${s.startTime}-${s.endTime}</td>
                      <td>${s.generalLocation || 'Geral'}</td>
                      <td>${(s.assignments || []).length} voluntários</td>
                      <td>
                        <span class="badge ${s.isApproved() ? 'badge-success' : 'badge-warning'}">
                          ${s.isApproved() ? 'Aprovada' : 'Rascunho'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- AÇÕES RÁPIDAS -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">⚡ Ações Rápidas</h3>
          </div>
          <div class="flex flex-col gap-3">
            <a href="#volunteers" class="btn btn-secondary w-full" style="justify-content: flex-start;">
              👥 Gerenciar Voluntários
            </a>
            <a href="#schedules" class="btn btn-secondary w-full" style="justify-content: flex-start;">
              📅 Cadastrar Programações
            </a>
            <a href="#shifts" class="btn btn-secondary w-full" style="justify-content: flex-start;">
              📋 Gerar & Aprovar Escalas
            </a>
            <a href="#history" class="btn btn-secondary w-full" style="justify-content: flex-start;">
              📜 Ver Feedbacks & Histórico
            </a>
            <a href="#settings" class="btn btn-secondary w-full" style="justify-content: flex-start;">
              🖼️ Cabeçalho e Rodapé de Exportação
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
