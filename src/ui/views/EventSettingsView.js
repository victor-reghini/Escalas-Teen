import { eventService } from '../../services/EventService.js';
import { storageService, StorageService } from '../../services/StorageService.js';
import { Toast } from '../components/Toast.js';

export class EventSettingsView {
  static async render(container) {
    const event = eventService.getCurrentEvent();
    if (!event) {
      window.location.hash = '#events';
      return;
    }

    const headerImg = StorageService.getHeaderImage(event);
    const footerImg = StorageService.getFooterImage(event);

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2>⚙️ Configurações do Evento - ${event.name}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Personalize as imagens de cabeçalho e rodapé para exportações (PDF/Imagem), visibilidade e regras de geração.
        </p>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- FORMULÁRIO DE DADOS GERAIS DO EVENTO -->
        <div class="card" style="grid-column: span 2;">
          <div class="card-header">
            <h3 class="card-title">📝 Informações do Evento</h3>
          </div>

          <form id="event-settings-form">
            <div class="form-group">
              <label class="form-label">Nome do Evento</label>
              <input type="text" id="set-name" class="form-input" value="${event.name}" required>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Código do Link / Slug</label>
                <input type="text" id="set-code" class="form-input" value="${event.code || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select id="set-status" class="form-select">
                  <option value="active" ${event.status === 'active' ? 'selected' : ''}>Ativo</option>
                  <option value="draft" ${event.status === 'draft' ? 'selected' : ''}>Rascunho</option>
                  <option value="archived" ${event.status === 'archived' ? 'selected' : ''}>Arquivado</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Data de Início</label>
                <input type="date" id="set-start" class="form-input" value="${event.startDate || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Data de Término</label>
                <input type="date" id="set-end" class="form-input" value="${event.endDate || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Descrição / Tema</label>
              <textarea id="set-desc" class="form-textarea" rows="2">${event.description || ''}</textarea>
            </div>

            <!-- OPÇÕES E FLAGS -->
            <div class="card" style="background: #f8fafc; padding: 16px; margin: 20px 0;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">🛡️ Regras e Políticas</h4>

              <label class="flex items-center gap-3" style="margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" id="set-open-visibility" ${event.openShiftVisibility ? 'checked' : ''} style="width: 18px; height: 18px;">
                <div>
                  <div style="font-weight: 700;">Habilitar Visualização Aberta de Escalas</div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary);">
                    Se desmarcado (padrão), voluntários enxergam apenas as escalas em que participam e seus parceiros diretos.
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-3" style="margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" id="set-auto-gen" ${event.autoGenerationEnabled !== false ? 'checked' : ''} style="width: 18px; height: 18px;">
                <div>
                  <div style="font-weight: 700;">Habilitar Motor de Geração Automática</div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary);">
                    Permite aos administradores gerar escalas automáticas baseadas em regras de desgaste e afinidades.
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-3" style="cursor: pointer;">
                <input type="checkbox" id="set-allow-reg" ${event.allowVolunteerRegistration !== false ? 'checked' : ''} style="width: 18px; height: 18px;">
                <div>
                  <div style="font-weight: 700;">Permitir Auto-Cadastro de Voluntários via Link</div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary);">
                    Permite que voluntários se cadastrem sozinhos através do link do evento.
                  </div>
                </div>
              </label>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-save-event-settings">
                💾 Salvar Configurações
              </button>
            </div>
          </form>
        </div>

        <!-- UPLOAD DE CABEÇALHO E RODAPÉ -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🖼️ Imagens de Exportação</h3>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            Estas imagens são utilizadas automaticamente na geração de <strong>PDFs</strong> e <strong>Imagens</strong> das escalas.
          </p>

          <!-- CABEÇALHO -->
          <div style="margin-bottom: 24px;">
            <label class="form-label" style="font-weight: 700;">Imagem de Cabeçalho (Header)</label>
            <div class="dropzone" id="header-dropzone">
              <div style="font-size: 1.5rem; margin-bottom: 4px;">📤</div>
              <div style="font-size: 0.85rem; font-weight: 600;">Clique para carregar novo cabeçalho</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">PNG ou JPG (Recomendado: 1200x150px)</div>
              <input type="file" id="header-file-input" accept="image/*" style="display: none;">
            </div>
            <img src="${headerImg}" id="header-preview-img" class="preview-banner" alt="Cabeçalho Atual">
          </div>

          <!-- RODAPÉ -->
          <div>
            <label class="form-label" style="font-weight: 700;">Imagem de Rodapé (Footer)</label>
            <div class="dropzone" id="footer-dropzone">
              <div style="font-size: 1.5rem; margin-bottom: 4px;">📤</div>
              <div style="font-size: 0.85rem; font-weight: 600;">Clique para carregar novo rodapé</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">PNG ou JPG (Recomendado: 1200x180px)</div>
              <input type="file" id="footer-file-input" accept="image/*" style="display: none;">
            </div>
            <img src="${footerImg}" id="footer-preview-img" class="preview-banner" alt="Rodapé Atual">
          </div>
        </div>
      </div>
    `;

    // Handler do formulário geral
    container.querySelector('#event-settings-form').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = container.querySelector('#btn-save-event-settings');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Salvando...';

      try {
        const name = container.querySelector('#set-name').value;
        const code = container.querySelector('#set-code').value;
        const status = container.querySelector('#set-status').value;
        const startDate = container.querySelector('#set-start').value;
        const endDate = container.querySelector('#set-end').value;
        const description = container.querySelector('#set-desc').value;
        const openShiftVisibility = container.querySelector('#set-open-visibility').checked;
        const autoGenerationEnabled = container.querySelector('#set-auto-gen').checked;
        const allowVolunteerRegistration = container.querySelector('#set-allow-reg').checked;

        await eventService.updateEvent(event.id, {
          name,
          code,
          status,
          startDate,
          endDate,
          description,
          openShiftVisibility,
          autoGenerationEnabled,
          allowVolunteerRegistration
        });

        Toast.success('Configurações do evento atualizadas com sucesso!');
      } catch (err) {
        Toast.error(err.message || 'Erro ao salvar configurações.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Salvar Configurações';
      }
    };

    // Handler de Upload do Header
    const headerDrop = container.querySelector('#header-dropzone');
    const headerInput = container.querySelector('#header-file-input');
    const headerPreview = container.querySelector('#header-preview-img');

    headerDrop.onclick = () => headerInput.click();
    headerInput.onchange = async () => {
      const file = headerInput.files[0];
      if (file) {
        Toast.info('Enviando imagem de cabeçalho...');
        try {
          const url = await storageService.uploadEventImage(event.id, file, 'header');
          await eventService.updateEvent(event.id, { headerImageUrl: url });
          headerPreview.src = url;
          Toast.success('Cabeçalho atualizado com sucesso!');
        } catch (err) {
          Toast.error('Erro ao enviar imagem de cabeçalho.');
        }
      }
    };

    // Handler de Upload do Footer
    const footerDrop = container.querySelector('#footer-dropzone');
    const footerInput = container.querySelector('#footer-file-input');
    const footerPreview = container.querySelector('#footer-preview-img');

    footerDrop.onclick = () => footerInput.click();
    footerInput.onchange = async () => {
      const file = footerInput.files[0];
      if (file) {
        Toast.info('Enviando imagem de rodapé...');
        try {
          const url = await storageService.uploadEventImage(event.id, file, 'footer');
          await eventService.updateEvent(event.id, { footerImageUrl: url });
          footerPreview.src = url;
          Toast.success('Rodapé atualizado com sucesso!');
        } catch (err) {
          Toast.error('Erro ao enviar imagem de rodapé.');
        }
      }
    };
  }
}
