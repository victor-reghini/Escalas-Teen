import { authService } from '../../services/AuthService.js';
import { eventService } from '../../services/EventService.js';

export class Navbar {
  static render(currentRoute = '#admin') {
    const user = authService.getCurrentUser();
    const event = eventService.getCurrentEvent();
    const isAdmin = authService.isAdmin();

    const nav = document.createElement('nav');
    nav.className = 'navbar';

    const eventOptionsHtml = event 
      ? `<span title="${event.description || ''}">${event.name}</span>`
      : '<span>Nenhum evento selecionado</span>';

    let navLinksHtml = '';
    if (user) {
      if (isAdmin) {
        navLinksHtml = `
          <li><a href="#admin" class="nav-link ${currentRoute === '#admin' ? 'active' : ''}">Dashboard</a></li>
          <li><a href="#volunteers" class="nav-link ${currentRoute === '#volunteers' ? 'active' : ''}">Voluntários</a></li>
          <li><a href="#schedules" class="nav-link ${currentRoute === '#schedules' ? 'active' : ''}">Programação</a></li>
          <li><a href="#shifts" class="nav-link ${currentRoute === '#shifts' ? 'active' : ''}">Escalas</a></li>
          <li><a href="#history" class="nav-link ${currentRoute === '#history' ? 'active' : ''}">Histórico</a></li>
          <li><a href="#settings" class="nav-link ${currentRoute === '#settings' ? 'active' : ''}">Evento</a></li>
        `;
      } else {
        navLinksHtml = `
          <li><a href="#portal" class="nav-link ${currentRoute === '#portal' ? 'active' : ''}">Minhas Escalas</a></li>
          <li><a href="#availability" class="nav-link ${currentRoute === '#availability' ? 'active' : ''}">Minha Disponibilidade</a></li>
          <li><a href="#history" class="nav-link ${currentRoute === '#history' ? 'active' : ''}">Meu Histórico</a></li>
        `;
      }
    }

    nav.innerHTML = `
      <div class="navbar-container">
        <div class="flex items-center gap-4">
          <a href="${isAdmin ? '#admin' : '#portal'}" class="navbar-brand">
            <div class="logo-icon">TS</div>
            <span>Escalas Teen</span>
          </a>

          ${user ? `
            <div class="event-selector-box" id="nav-event-box" style="cursor: pointer;" title="Clique para alternar ou gerenciar eventos">
              ${eventOptionsHtml}
              <span style="font-size: 0.75rem;">▼</span>
            </div>
          ` : ''}
        </div>

        ${user ? `
          <ul class="navbar-nav">
            ${navLinksHtml}
          </ul>

          <div class="flex items-center gap-3">
            <span class="badge ${isAdmin ? 'badge-primary' : 'badge-orange'}">
              ${isAdmin ? 'ADMIN' : 'VOLUNTÁRIO'}
            </span>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);" class="truncate" style="max-width: 140px;">
              ${user.name || user.username}
            </span>
            <button id="btn-logout" class="btn btn-secondary btn-sm" title="Sair do sistema">
              Sair
            </button>
          </div>
        ` : `
          <div class="flex items-center gap-2">
            <a href="#login" class="btn btn-primary btn-sm">Entrar / Cadastrar</a>
          </div>
        `}
      </div>
    `;

    // Handler de Logout
    const logoutBtn = nav.querySelector('#btn-logout');
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await authService.logout();
        window.location.hash = '#login';
      };
    }

    // Handler de Alternar Evento
    const eventBox = nav.querySelector('#nav-event-box');
    if (eventBox) {
      eventBox.onclick = () => {
        window.location.hash = '#events';
      };
    }

    return nav;
  }
}
