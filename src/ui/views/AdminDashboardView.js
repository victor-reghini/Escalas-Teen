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
    const avgWearPct = Math.round((avgWear || 0) * 100);

    // Estatísticas de Carga e Uso por Voluntário
    const volunteerStats = volunteers.map(v => {
      let servedShifts = 0;
      shifts.forEach(s => {
        if ((s.assignments || []).some(a => a.volunteerId === v.id)) {
          servedShifts++;
        }
      });

      let possibleShifts = 0;
      if (v.isIntegral()) {
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

      return {
        volunteer: v,
        servedShifts,
        possibleShifts,
        wearRatio,
        wearPct
      };
    });

    // 1. Mais Escalados (Top 5)
    const topMostServed = [...volunteerStats]
      .sort((a, b) => b.servedShifts - a.servedShifts || b.wearRatio - a.wearRatio)
      .slice(0, 5);

    // 2. Mais Precisam de Descanso (Top 5 - Maior % de Desgaste / Uso)
    const topNeedRest = [...volunteerStats]
      .filter(s => s.servedShifts > 0)
      .sort((a, b) => b.wearRatio - a.wearRatio || b.servedShifts - a.servedShifts)
      .slice(0, 5);

    // 3. Mais Descansados (Top 5 - Menor Desgaste)
    const topMostRested = [...volunteerStats]
      .sort((a, b) => a.wearRatio - b.wearRatio || a.servedShifts - b.servedShifts)
      .slice(0, 5);

    container.innerHTML = `
      <div style="margin-bottom: 28px;" class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2>📊 Painel de Controle - ${event.name}</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Visão geral de voluntários, programações, escalas e carga de trabalho do evento.
          </p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <a href="#shifts" class="btn btn-primary">⚡ Gerar & Editar Escalas</a>
          <a href="#settings" class="btn btn-secondary">⚙️ Configurações</a>
        </div>
      </div>

      <!-- CARDS DE ESTATÍSTICAS GERAIS -->
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

      <!-- RANKINGS OPERACIONAIS DE VOLUNTÁRIOS (TOP 5) -->
      <div style="margin-bottom: 28px;">
        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <span>📈</span> Monitoramento de Carga e Desgaste da Equipe
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Acompanhe o equilíbrio das escalas para evitar sobrecarga de voluntários e garantir bom descanso.
          </p>
        </div>

        <div class="grid grid-cols-3">
          <!-- TOP 5 MAIS ESCALADOS -->
          <div class="card" style="padding: 18px;">
            <div class="card-header" style="margin-bottom: 12px; padding-bottom: 8px;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #1e3a8a; display: flex; align-items: center; gap: 6px; margin: 0;">
                🏆 Mais Escalados
              </h4>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Top 5</span>
            </div>

            ${topMostServed.length === 0 || topMostServed.every(s => s.servedShifts === 0) ? `
              <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 20px;">Nenhuma escala atribuída ainda.</p>
            ` : `
              <div class="flex flex-col gap-2">
                ${topMostServed.map((s, idx) => `
                  <div class="flex items-center justify-between" style="padding: 6px 10px; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem;">
                    <div class="flex items-center gap-2 truncate">
                      <span style="font-weight: 800; color: var(--primary-700); min-width: 18px;">#${idx + 1}</span>
                      <span style="font-weight: 700;" class="truncate">${s.volunteer.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-primary" style="font-size: 0.75rem;">${s.servedShifts} escalas</span>
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${s.wearPct}%</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- TOP 5 MAIS PRECISAM DE DESCANSO -->
          <div class="card" style="padding: 18px; border-top: 3px solid #ef4444;">
            <div class="card-header" style="margin-bottom: 12px; padding-bottom: 8px;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #b91c1c; display: flex; align-items: center; gap: 6px; margin: 0;">
                ⚡ Mais Precisam de Descanso
              </h4>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Maior Desgaste</span>
            </div>

            ${topNeedRest.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 20px;">Nenhum voluntário sob sobrecarga.</p>
            ` : `
              <div class="flex flex-col gap-2">
                ${topNeedRest.map((s, idx) => `
                  <div class="flex items-center justify-between" style="padding: 6px 10px; background: #fff1f2; border-radius: var(--radius-sm); border: 1px solid #fecdd3; font-size: 0.85rem;">
                    <div class="flex items-center gap-2 truncate">
                      <span style="font-weight: 800; color: #e11d48; min-width: 18px;">#${idx + 1}</span>
                      <span style="font-weight: 700; color: #881337;" class="truncate">${s.volunteer.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-danger" style="font-size: 0.75rem;">${s.wearPct}% uso</span>
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${s.servedShifts} esc.</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- TOP 5 MAIS DESCANSADOS -->
          <div class="card" style="padding: 18px; border-top: 3px solid #10b981;">
            <div class="card-header" style="margin-bottom: 12px; padding-bottom: 8px;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #047857; display: flex; align-items: center; gap: 6px; margin: 0;">
                🌴 Mais Descansados / Disponíveis
              </h4>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Menor Carga</span>
            </div>

            ${topMostRested.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 20px;">Nenhum voluntário disponível.</p>
            ` : `
              <div class="flex flex-col gap-2">
                ${topMostRested.map((s, idx) => `
                  <div class="flex items-center justify-between" style="padding: 6px 10px; background: #f0fdf4; border-radius: var(--radius-sm); border: 1px solid #bbf7d0; font-size: 0.85rem;">
                    <div class="flex items-center gap-2 truncate">
                      <span style="font-weight: 800; color: #059669; min-width: 18px;">#${idx + 1}</span>
                      <span style="font-weight: 700; color: #064e3b;" class="truncate">${s.volunteer.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-success" style="font-size: 0.75rem;">${s.wearPct}% uso</span>
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${s.servedShifts} esc.</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
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
