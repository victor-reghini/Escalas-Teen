import './styles/index.css';
import './styles/components.css';
import './styles/views.css';

import { authService } from './services/AuthService.js';
import { eventService } from './services/EventService.js';
import { Router } from './ui/router.js';

async function bootstrap() {
  const appContainer = document.getElementById('app');

  // Inicializa serviços essenciais
  const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
  const eventParam = urlParams.get('event');

  await eventService.init(eventParam);
  await authService.init();

  // Inicializa o roteador
  const router = new Router(appContainer);
  router.handleRoute();
}

bootstrap().catch(err => {
  console.error('Erro ao inicializar Escalas Teen:', err);
});
