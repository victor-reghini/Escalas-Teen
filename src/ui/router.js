import { authService } from '../services/AuthService.js';
import { eventService } from '../services/EventService.js';
import { Navbar } from './components/Navbar.js';
import { LoginView } from './views/LoginView.js';
import { EventSelectView } from './views/EventSelectView.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';
import { VolunteerMgmtView } from './views/VolunteerMgmtView.js';
import { ScheduleMgmtView } from './views/ScheduleMgmtView.js';
import { ShiftGenerationView } from './views/ShiftGenerationView.js';
import { VolunteerPortalView } from './views/VolunteerPortalView.js';
import { HistoryView } from './views/HistoryView.js';
import { EventSettingsView } from './views/EventSettingsView.js';

export class Router {
  constructor(appContainer) {
    this.appContainer = appContainer;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    authService.onAuthChange(() => this.handleRoute());
    eventService.onEventChange(() => this.handleRoute());
  }

  async handleRoute() {
    const rawHash = window.location.hash || '';
    const [routePart, queryPart] = rawHash.split('?');
    const route = routePart || '';

    // Extrai parâmetros de query como ?event=...
    const urlParams = new URLSearchParams(queryPart || window.location.search);
    const eventParam = urlParams.get('event');

    if (eventParam) {
      await eventService.init(eventParam);
    }

    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();

    // Redirecionamentos de segurança
    if (!user && route !== '#login') {
      window.location.hash = '#login' + (eventParam ? `?event=${eventParam}` : '');
      return;
    }

    if (user && route === '#login') {
      window.location.hash = isAdmin ? '#admin' : '#portal';
      return;
    }

    // Se admin tentar acessar rota inexistente ou padrão
    let activeRoute = route;
    if (!activeRoute) {
      activeRoute = isAdmin ? '#admin' : '#portal';
    }

    // Limpa a tela e renderiza a Navbar
    this.appContainer.innerHTML = '';
    const navbarEl = Navbar.render(activeRoute);
    this.appContainer.appendChild(navbarEl);

    const mainContent = document.createElement('main');
    mainContent.className = 'main-content';
    this.appContainer.appendChild(mainContent);

    // Roteamento para as Views
    switch (activeRoute) {
      case '#login':
        LoginView.render(mainContent, eventParam);
        break;

      case '#events':
        EventSelectView.render(mainContent);
        break;

      case '#admin':
        if (!isAdmin) { window.location.hash = '#portal'; return; }
        AdminDashboardView.render(mainContent);
        break;

      case '#volunteers':
        if (!isAdmin) { window.location.hash = '#portal'; return; }
        VolunteerMgmtView.render(mainContent);
        break;

      case '#schedules':
        if (!isAdmin) { window.location.hash = '#portal'; return; }
        ScheduleMgmtView.render(mainContent);
        break;

      case '#shifts':
        if (!isAdmin) { window.location.hash = '#portal'; return; }
        ShiftGenerationView.render(mainContent);
        break;

      case '#settings':
        if (!isAdmin) { window.location.hash = '#portal'; return; }
        EventSettingsView.render(mainContent);
        break;

      case '#portal':
      case '#availability':
        VolunteerPortalView.render(mainContent);
        break;

      case '#history':
        HistoryView.render(mainContent);
        break;

      default:
        window.location.hash = isAdmin ? '#admin' : '#portal';
        break;
    }
  }
}
