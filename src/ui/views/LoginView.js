import { authService } from '../../services/AuthService.js';
import { eventService } from '../../services/EventService.js';
import { Toast } from '../components/Toast.js';

export class LoginView {
  static render(container, inviteEventId = null) {
    let isRegisterMode = false;
    let selectedEvent = eventService.getCurrentEvent();

    container.innerHTML = `
      <div style="max-width: 440px; margin: 40px auto; padding: 0 16px;">
        <div class="card" style="padding: 32px 28px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div class="logo-icon" style="width: 54px; height: 54px; font-size: 1.5rem; margin: 0 auto 12px auto;">TS</div>
            <h2 id="auth-title" style="font-size: 1.6rem; color: var(--primary-900);">Acessar Escalas Teen</h2>
            <p id="auth-subtitle" style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
              ${selectedEvent ? `Vinculado ao evento: <strong>${selectedEvent.name}</strong>` : 'Entre com sua conta ou cadastre-se'}
            </p>
          </div>

          <form id="auth-form">
            <div id="register-fields" style="display: none;">
              <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="auth-name" class="form-input" placeholder="Ex: Mateus Silva">
              </div>

              <div class="form-group">
                <label class="form-label">Nome de Usuário (Username)</label>
                <input type="text" id="auth-username" class="form-input" placeholder="Ex: mateus.silva">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" id="label-login-id">E-mail ou Nome de Usuário</label>
              <input type="text" id="auth-login-id" class="form-input" placeholder="seu.usuario ou seu@email.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Senha</label>
              <input type="password" id="auth-password" class="form-input" placeholder="••••••••" required>
            </div>

            <button type="submit" id="btn-auth-submit" class="btn btn-primary w-full" style="margin-top: 10px; padding: 12px;">
              Entrar
            </button>
          </form>

          <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              <span id="auth-toggle-text">Ainda não tem conta?</span>
              <a href="javascript:void(0)" id="auth-toggle-btn" style="font-weight: 700; margin-left: 6px;">
                Cadastre-se aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    `;

    const form = container.querySelector('#auth-form');
    const titleEl = container.querySelector('#auth-title');
    const subtitleEl = container.querySelector('#auth-subtitle');
    const registerFields = container.querySelector('#register-fields');
    const labelLoginId = container.querySelector('#label-login-id');
    const submitBtn = container.querySelector('#btn-auth-submit');
    const toggleBtn = container.querySelector('#auth-toggle-btn');
    const toggleText = container.querySelector('#auth-toggle-text');

    toggleBtn.onclick = () => {
      isRegisterMode = !isRegisterMode;

      if (isRegisterMode) {
        titleEl.textContent = 'Criar Nova Conta';
        subtitleEl.textContent = 'Cadastre-se para participar das escalas';
        registerFields.style.display = 'block';
        labelLoginId.textContent = 'E-mail Principal';
        submitBtn.textContent = 'Criar Conta';
        toggleText.textContent = 'Já possui uma conta?';
        toggleBtn.textContent = 'Entrar aqui';
      } else {
        titleEl.textContent = 'Acessar Escalas Teen';
        subtitleEl.textContent = selectedEvent ? `Vinculado ao evento: ${selectedEvent.name}` : 'Entre com sua conta';
        registerFields.style.display = 'none';
        labelLoginId.textContent = 'E-mail ou Nome de Usuário';
        submitBtn.textContent = 'Entrar';
        toggleText.textContent = 'Ainda não tem conta?';
        toggleBtn.textContent = 'Cadastre-se aqui';
      }
    };

    form.onsubmit = async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processando...';

      try {
        const password = container.querySelector('#auth-password').value;

        if (isRegisterMode) {
          const email = container.querySelector('#auth-login-id').value;
          const name = container.querySelector('#auth-name').value;
          const username = container.querySelector('#auth-username').value;
          const eventId = selectedEvent ? selectedEvent.id : null;

          const user = await authService.register({
            email,
            username,
            password,
            name,
            role: 'volunteer', // Apenas Admins podem alterar o papel de usuários
            eventId
          });

          Toast.success(`Conta criada com sucesso! Bem-vindo(a), ${user.name}!`);
          window.location.hash = user.isAdmin() ? '#admin' : '#portal';
        } else {
          const loginId = container.querySelector('#auth-login-id').value;
          const user = await authService.login(loginId, password);

          Toast.success(`Login realizado com sucesso! Olá, ${user.name}!`);
          window.location.hash = user.isAdmin() ? '#admin' : '#portal';
        }
      } catch (err) {
        Toast.error(err.message || 'Erro ao processar autenticação.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isRegisterMode ? 'Criar Conta' : 'Entrar';
      }
    };
  }
}
