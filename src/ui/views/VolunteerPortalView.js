import { authService } from '../../services/AuthService.js';
import { eventService } from '../../services/EventService.js';
import { volunteerService } from '../../services/VolunteerService.js';
import { scheduleService } from '../../services/ScheduleService.js';
import { VolunteerMgmtView } from './VolunteerMgmtView.js';
import { StarRating } from '../components/StarRating.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export class VolunteerPortalView {
  static async render(container) {
    const user = authService.getCurrentUser();
    const event = eventService.getCurrentEvent();

    if (!user) {
      window.location.hash = '#login';
      return;
    }

    if (!event) {
      window.location.hash = '#events';
      return;
    }

    // Busca o cadastro do voluntário vinculado a este usuário e evento
    let volunteer = await volunteerService.getVolunteerByUserAndEvent(user.id, event.id);

    // Se ainda não estiver vinculado no evento ativo, auto-vincula
    if (!volunteer) {
      volunteer = await volunteerService.registerVolunteer({
        eventId: event.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        type: 'integral',
        experience: 'experiente'
      });
    }

    const allShifts = await scheduleService.getShiftsByEvent(event.id);
    const myFeedbacks = await scheduleService.getFeedbacksByVolunteer(volunteer.id);

    // Regra de privacidade:
    // Se o evento estiver configurado com openShiftVisibility = true, exibe todas;
    // caso contrário, exibe apenas as escalas em que o voluntário está atribuído.
    const visibleShifts = event.openShiftVisibility
      ? allShifts
      : allShifts.filter(s => (s.assignments || []).some(a => a.volunteerId === volunteer.id));

    container.innerHTML = `
      <div style="margin-bottom: 24px;" class="flex items-center justify-between">
        <div>
          <h2>👋 Olá, ${volunteer.name}!</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Acompanhe suas escalas no <strong>${event.name}</strong>, parceiros de equipe e envie feedbacks.
          </p>
        </div>
        <div class="flex gap-2">
          <button id="btn-my-availability" class="btn btn-secondary">
            ⏰ Minha Disponibilidade & Restrições
          </button>
          <a href="#history" class="btn btn-secondary">
            📜 Meu Histórico
          </a>
        </div>
      </div>

      <!-- CARDS DE INFORMAÇÕES PESSOAIS -->
      <div class="grid grid-cols-3" style="margin-bottom: 24px;">
        <div class="card" style="padding: 18px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Meu Tipo</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin-top: 4px;">
            ${volunteer.type === 'integral' ? 'Integral (Full-time)' : 'Part-time'}
          </div>
          <span style="font-size: 0.775rem; color: var(--text-muted);">
            ${volunteer.isIntegral() ? 'Disponibilidade total automática' : `${(volunteer.availabilities || []).length} faixas cadastradas`}
          </span>
        </div>

        <div class="card" style="padding: 18px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Minhas Escalas</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin-top: 4px;">
            ${allShifts.filter(s => (s.assignments || []).some(a => a.volunteerId === volunteer.id)).length} escala(s)
          </div>
          <span style="font-size: 0.775rem; color: var(--text-muted);">Atribuídas a você</span>
        </div>

        <div class="card" style="padding: 18px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Visibilidade</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin-top: 4px;">
            ${event.openShiftVisibility ? 'Visualização Aberta' : 'Minhas Escalas'}
          </div>
          <span style="font-size: 0.775rem; color: var(--text-muted);">
            ${event.openShiftVisibility ? 'Você pode ver todas as escalas' : 'Você vê suas escalas e colegas de equipe'}
          </span>
        </div>
      </div>

      <!-- LISTA DE ESCALAS DO VOLUNTÁRIO -->
      <h3 style="margin-bottom: 16px;">📋 Escalas Programadas</h3>
      <div id="volunteer-shifts-list"></div>
    `;

    const shiftsList = container.querySelector('#volunteer-shifts-list');

    if (visibleShifts.length === 0) {
      shiftsList.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🌟</div>
          <h4 style="margin-bottom: 6px;">Você ainda não possui escalas atribuídas</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Assim que a equipe de liderança publicar as escalas, elas aparecerão detalhadas aqui.
          </p>
        </div>
      `;
    } else {
      shiftsList.innerHTML = visibleShifts.map(shift => {
        const isMyShift = (shift.assignments || []).some(a => a.volunteerId === volunteer.id);
        const myAssignment = (shift.assignments || []).find(a => a.volunteerId === volunteer.id);
        const existingFeedback = myFeedbacks.find(f => f.shiftId === shift.id);

        return `
          <div class="shift-card" style="border: ${isMyShift ? '2px solid var(--primary-600)' : '1px solid var(--border-color)'};">
            <div class="shift-card-header" style="background: ${isMyShift ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : '#475569'};">
              <div>
                <h3 style="color: #ffffff;">${shift.title}</h3>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-top: 2px;">
                  📅 ${shift.date ? shift.date.split('-').reverse().join('/') : ''} | ⏰ ${shift.startTime} às ${shift.endTime} | 📍 ${shift.generalLocation || 'Refeitório / Geral'}
                </div>
              </div>

              ${isMyShift ? `
                <div>
                  <button class="btn btn-secondary btn-sm btn-submit-feedback" data-shift-id="${shift.id}" style="background: #ffffff; color: #1e3a8a;">
                    ${existingFeedback ? `⭐ Avaliado (${existingFeedback.rating}★)` : '⭐ Enviar Feedback'}
                  </button>
                </div>
              ` : ''}
            </div>

            <div class="shift-assignments">
              ${isMyShift && myAssignment ? `
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 16px;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: #1d4ed8;">🎯 Sua Função Nesta Escala:</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #1e3a8a; margin-top: 2px;">
                    ${myAssignment.roleName || 'Staff'} ${myAssignment.specificLocation ? `(${myAssignment.specificLocation})` : ''}
                  </div>
                  <div style="font-size: 0.85rem; color: #3b82f6;">
                    Horário: <strong>${myAssignment.startTime || shift.startTime} às ${myAssignment.endTime || shift.endTime}</strong>
                  </div>
                </div>
              ` : ''}

              <h5 style="font-size: 0.9rem; margin-bottom: 8px; font-weight: 700; color: var(--text-secondary);">
                👥 Voluntários Escalados Juntos:
              </h5>

              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Voluntário</th>
                      <th>Horário</th>
                      <th>Função / Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(shift.assignments || []).map(a => `
                      <tr style="${a.volunteerId === volunteer.id ? 'background: #eff6ff; font-weight: 700;' : ''}">
                        <td>${a.volunteerName} ${a.volunteerId === volunteer.id ? ' <span class="badge badge-primary">Você</span>' : ''}</td>
                        <td>${a.startTime || shift.startTime} - ${a.endTime || shift.endTime}</td>
                        <td>${a.roleName || 'Staff'}${a.specificLocation ? ` (${a.specificLocation})` : ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      }).join('');

      shiftsList.querySelectorAll('.btn-submit-feedback').forEach(btn => {
        btn.onclick = () => {
          const shiftId = btn.dataset.shiftId;
          const shift = visibleShifts.find(s => s.id === shiftId);
          VolunteerPortalView.openFeedbackModal(volunteer, shift, event, user, () => VolunteerPortalView.render(container));
        };
      });
    }

    container.querySelector('#btn-my-availability').onclick = () => {
      VolunteerMgmtView.openAvailabilityModal(volunteer, event, () => VolunteerPortalView.render(container));
    };
  }

  static openFeedbackModal(volunteer, shift, event, user, onSaved) {
    const content = document.createElement('div');
    let ratingVal = 5;

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 4px; color: var(--primary-900);">${shift.title}</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
          Como foi sua experiência servindo nesta escala? Sua avaliação ajuda a liderança a melhorar as próximas alocações.
        </p>

        <div class="form-group" style="align-items: center; margin-bottom: 20px;">
          <label class="form-label" style="font-size: 1rem;">Sua Avaliação (0 a 5 estrelas)</label>
          <div id="portal-star-box" style="margin-top: 6px;"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Comentário ou Sugestão (Opcional)</label>
          <textarea id="feedback-comment" class="form-textarea" rows="3" placeholder="Conte o que achou, se sentiu cansaço, afinidade com a função, etc..."></textarea>
        </div>
      </div>

      <div class="flex justify-between" style="margin-top: 20px;">
        <button type="button" class="btn btn-secondary" onclick="document.querySelector('#active-modal-overlay').remove()">Cancelar</button>
        <button type="button" id="btn-save-feedback" class="btn btn-primary">Enviar Feedback</button>
      </div>
    `;

    const starBox = content.querySelector('#portal-star-box');
    starBox.appendChild(StarRating.render({
      value: ratingVal,
      readOnly: false,
      onChange: (val) => { ratingVal = val; }
    }));

    content.querySelector('#btn-save-feedback').onclick = async () => {
      const comment = content.querySelector('#feedback-comment').value;

      await scheduleService.submitFeedback({
        eventId: event.id,
        shiftId: shift.id,
        scheduleId: shift.scheduleId,
        volunteerId: volunteer.id,
        type: 'volunteer_feedback',
        rating: ratingVal,
        comment,
        authorUid: user ? user.id : '',
        authorName: volunteer.name
      });

      Toast.success('Muito obrigado! Seu feedback foi enviado.');
      Modal.close();
      if (onSaved) onSaved();
    };

    Modal.open({
      title: '⭐ Feedback da Escala',
      content
    });
  }
}
