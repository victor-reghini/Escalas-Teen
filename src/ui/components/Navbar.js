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
        <div class="flex items-center gap-3">
          ${user ? `
            <!-- BOTÃO MENU MOBILE (LADO ESQUERDO) -->
            <button id="btn-mobile-menu" class="btn btn-icon mobile-only" style="font-size: 1.25rem; padding: 6px 10px;" aria-label="Abrir Menu Lateral">
              ☰
            </button>
          ` : ''}

          <a href="${isAdmin ? '#admin' : '#portal'}" class="navbar-brand">
            <div class="logo-icon">TS</div>
            <span class="brand-text">Escalas Teen</span>
          </a>

          ${user ? `
            <div class="event-selector-box desktop-only" id="nav-event-box" style="cursor: pointer;" title="Clique para alternar ou gerenciar eventos">
              ${eventOptionsHtml}
              <span style="font-size: 0.75rem;">▼</span>
            </div>
          ` : ''}
        </div>

        ${user ? `
          <!-- MENU DESKTOP -->
          <ul class="navbar-nav desktop-only">
            ${navLinksHtml}
          </ul>

          <div class="flex items-center gap-3 desktop-only">
            <span class="badge ${isAdmin ? 'badge-primary' : 'badge-orange'}">
              ${isAdmin ? 'ADMIN' : 'VOLUNTÁRIO'}
            </span>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); max-width: 140px;" class="truncate" title="${user.name || user.username}">
              ${user.name || user.username}
            </span>
            <button id="btn-logout" class="btn btn-secondary btn-sm" title="Sair do sistema">
              Sair
            </button>
          </div>

          <!-- INDICADOR COMPACTO MOBILE À DIREITA -->
          <div class="mobile-only flex items-center gap-2">
            <span class="badge ${isAdmin ? 'badge-primary' : 'badge-orange'}" style="font-size: 0.7rem; padding: 3px 7px;">
              ${isAdmin ? 'ADMIN' : 'VOLUNTÁRIO'}
            </span>
          </div>
        ` : `
          <div class="flex items-center gap-2">
            <a href="#login" class="btn btn-primary btn-sm">Entrar / Cadastrar</a>
          </div>
        `}
      </div>

      ${user ? `
        <!-- BACKDROP OVERLAY DO SIDE MENU MOBILE -->
        <div id="side-menu-backdrop" class="side-menu-backdrop mobile-only"></div>

        <!-- SIDE MENU DRAWER LATERAL ESQUERDO -->
        <aside id="side-menu-drawer" class="side-menu-drawer mobile-only">
          <div class="side-menu-header">
            <div class="flex items-center gap-2">
              <div class="logo-icon" style="width: 32px; height: 32px; font-size: 0.95rem;">TS</div>
              <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; color: var(--primary-900);">Escalas Teen</span>
            </div>
            <button id="btn-close-side-menu" class="btn btn-icon" style="border: none; font-size: 1.3rem; padding: 4px 8px;" aria-label="Fechar Menu">
              ✕
            </button>
          </div>

          <!-- SELETOR DE EVENTO NO SIDE MENU -->
          <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); background: #f8fafc;">
            <div class="event-selector-box" id="nav-event-box-mobile" style="cursor: pointer; width: 100%; justify-content: space-between;">
              <div class="flex items-center gap-2 truncate">
                <span style="font-size: 0.75rem; color: var(--text-muted);">🎪</span>
                <strong style="font-size: 0.85rem;" class="truncate">${event ? event.name : 'Selecionar Evento'}</strong>
              </div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">▼</span>
            </div>
          </div>

          <!-- LINKS DE NAVEGAÇÃO -->
          <div class="side-menu-content">
            <ul class="navbar-mobile-nav">
              ${navLinksHtml}
            </ul>
          </div>

          <!-- RODAPÉ COM USUÁRIO E LOGOUT -->
          <div class="side-menu-footer">
            <div class="flex items-center gap-2 truncate" style="margin-bottom: 12px;">
              <span class="badge ${isAdmin ? 'badge-primary' : 'badge-orange'}">
                ${isAdmin ? 'ADMIN' : 'VOLUNTÁRIO'}
              </span>
              <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);" class="truncate">
                ${user.name || user.username}
              </span>
            </div>
            <button id="btn-logout-mobile" class="btn btn-secondary btn-sm w-full" title="Sair do sistema">
              🚪 Sair da Conta
            </button>
          </div>
        </aside>
      ` : ''}
    `;

    // Handlers de Abertura e Fechamento do Side Menu
    const mobileMenuBtn = nav.querySelector('#btn-mobile-menu');
    const closeSideMenuBtn = nav.querySelector('#btn-close-side-menu');
    const sideDrawer = nav.querySelector('#side-menu-drawer');
    const sideBackdrop = nav.querySelector('#side-menu-backdrop');

    function openSideMenu() {
      if (sideDrawer && sideBackdrop) {
        sideDrawer.classList.add('open');
        sideBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSideMenu() {
      if (sideDrawer && sideBackdrop) {
        sideDrawer.classList.remove('open');
        sideBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (mobileMenuBtn) mobileMenuBtn.onclick = openSideMenu;
    if (closeSideMenuBtn) closeSideMenuBtn.onclick = closeSideMenu;
    if (sideBackdrop) sideBackdrop.onclick = closeSideMenu;

    // Fecha o side menu ao clicar em qualquer link
    if (sideDrawer) {
      sideDrawer.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = closeSideMenu;
      });
    }

    // Handler de Logout Desktop & Mobile
    nav.querySelectorAll('#btn-logout, #btn-logout-mobile').forEach(btn => {
      btn.onclick = async () => {
        closeSideMenu();
        await authService.logout();
        window.location.hash = '#login';
      };
    });

    // Handler de Alternar Evento Desktop & Mobile
    nav.querySelectorAll('#nav-event-box, #nav-event-box-mobile').forEach(box => {
      box.onclick = () => {
        closeSideMenu();
        window.location.hash = '#events';
      };
    });

    return nav;
  }
}
