import { ExportService } from '../../services/ExportService.js';
import { StorageService } from '../../services/StorageService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export class ShiftExportModal {
  /**
   * Abre o modal de exportação para uma escala individual
   */
  static open(shift, event) {
    const formattedText = ExportService.formatShiftAsWhatsAppText(shift, event);
    const headerImg = StorageService.getHeaderImage(event);
    const footerImg = StorageService.getFooterImage(event);

    const assignments = shift.assignments || [];
    const dateFormatted = shift.date ? shift.date.split('-').reverse().join('/') : '';

    const content = document.createElement('div');
    content.innerHTML = `
      <!-- ABAS DE EXPORTAÇÃO -->
      <div class="flex gap-2" style="border-bottom: 2px solid var(--border-color); padding-bottom: 12px; margin-bottom: 20px; overflow-x: scroll">
        <button type="button" class="btn btn-primary btn-sm btn-tab" data-tab="tab-preview">
          🖼️ Visualização & Imagem
        </button>
        <button type="button" class="btn btn-secondary btn-sm btn-tab" data-tab="tab-whatsapp">
          💬 Texto WhatsApp
        </button>
        <button type="button" class="btn btn-secondary btn-sm btn-tab" data-tab="tab-pdf">
          📄 Download PDF
        </button>
      </div>

      <!-- ABA 1: PREVIEW VISUAL / EXPORTAR IMAGEM -->
      <div id="tab-preview" class="tab-pane">
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0; overflow: hidden; margin-bottom: 16px;" id="export-image-render-area">
          <!-- CABEÇALHO OFICIAL -->
          <img src="${headerImg}" style="width: 100%; height: auto; max-height: 90px; object-fit: cover; display: block;" alt="Cabeçalho">

          <!-- CONTEÚDO DA TABELA -->
          <div style="padding: 20px;">
            <h3 style="text-align: center; color: #1e3a8a; font-size: 1.3rem; font-weight: 800; margin-bottom: 6px; text-transform: uppercase;">
              ${shift.title}
            </h3>
            <p style="text-align: center; color: #475569; font-size: 0.875rem; margin-bottom: 16px;">
              Local Geral: <strong>${shift.generalLocation || 'Refeitório / Geral'}</strong> | Horário: <strong>${shift.startTime} às ${shift.endTime}</strong> ${dateFormatted ? `| Data: <strong>${dateFormatted}</strong>` : ''}
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 0.875rem;">
              <thead>
                <tr style="background-color: #b4c6e7; color: #000000; text-align: left;">
                  <th style="border: 1px solid #94a3b8; padding: 8px 12px; width: 40%;">VOLUNTÁRIO</th>
                  <th style="border: 1px solid #94a3b8; padding: 8px 12px; width: 25%; text-align: center;">HORÁRIO</th>
                  <th style="border: 1px solid #94a3b8; padding: 8px 12px; width: 35%;">FUNÇÃO / LOCAL</th>
                </tr>
              </thead>
              <tbody>
                ${assignments.length === 0 ? `
                  <tr>
                    <td colspan="3" style="border: 1px solid #94a3b8; padding: 12px; text-align: center; color: #64748b;">
                      Nenhum voluntário escalado.
                    </td>
                  </tr>
                ` : assignments.map(a => {
      const timeRange = (a.startTime && a.endTime) ? `${a.startTime} - ${a.endTime}` : `${shift.startTime} - ${shift.endTime}`;
      const roleAndLoc = a.specificLocation && a.specificLocation !== shift.generalLocation
        ? `${a.roleName || 'Staff'} (${a.specificLocation})`
        : (a.roleName || 'Staff');

      return `
                    <tr>
                      <td style="border: 1px solid #94a3b8; padding: 8px 12px; font-weight: 700;">${a.volunteerName}</td>
                      <td style="border: 1px solid #94a3b8; padding: 8px 12px; text-align: center;">${timeRange}</td>
                      <td style="border: 1px solid #94a3b8; padding: 8px 12px;">${roleAndLoc}</td>
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>

          <!-- RODAPÉ OFICIAL -->
          <img src="${footerImg}" style="width: 100%; height: auto; max-height: 90px; object-fit: cover; display: block;" alt="Rodapé">
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" id="btn-download-image" class="btn btn-primary">
            🖼️ Baixar Imagem (PNG)
          </button>
        </div>
      </div>

      <!-- ABA 2: TEXTO WHATSAPP -->
      <div id="tab-whatsapp" class="tab-pane" style="display: none;">
        <div class="form-group">
          <label class="form-label">Texto Formatado para o WhatsApp:</label>
          <textarea id="whatsapp-text-area" class="export-preview-box w-full" rows="12" readonly>${formattedText}</textarea>
        </div>

        <div class="flex justify-end gap-2" style="margin-top: 16px;">
          <button type="button" id="btn-copy-whatsapp" class="btn btn-success">
            📋 Copiar Texto Formatado
          </button>
        </div>
      </div>

      <!-- ABA 3: PDF -->
      <div id="tab-pdf" class="tab-pane" style="display: none;">
        <div style="text-align: center; padding: 30px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">📄</div>
          <h4 style="margin-bottom: 8px;">Download da Escala em PDF</h4>
          <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem;">
            O PDF será gerado com o cabeçalho oficial, a tabela formatada e o rodapé configurado no evento.
          </p>
          <button type="button" id="btn-download-pdf" class="btn btn-primary btn-lg">
            📥 Gerar e Baixar PDF
          </button>
        </div>
      </div>
    `;

    // Gerenciador de Abas
    const tabs = content.querySelectorAll('.btn-tab');
    const panes = content.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => {
          t.classList.remove('btn-primary');
          t.classList.add('btn-secondary');
        });
        tab.classList.remove('btn-secondary');
        tab.classList.add('btn-primary');

        panes.forEach(p => p.style.display = 'none');
        content.querySelector(`#${tab.dataset.tab}`).style.display = 'block';
      };
    });

    // Handler: Baixar Imagem
    content.querySelector('#btn-download-image').onclick = async () => {
      const renderArea = content.querySelector('#export-image-render-area');
      const safeTitle = (shift.title || 'escala').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      await ExportService.exportAsImage(renderArea, `${safeTitle}.png`);
      Toast.success('Imagem baixada com sucesso!');
    };

    // Handler: Copiar WhatsApp
    content.querySelector('#btn-copy-whatsapp').onclick = () => {
      const text = content.querySelector('#whatsapp-text-area').value;
      navigator.clipboard.writeText(text);
      Toast.success('Texto copiado para a área de transferência!');
    };

    // Handler: Baixar PDF
    content.querySelector('#btn-download-pdf').onclick = async () => {
      const safeTitle = (shift.title || 'escala').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      await ExportService.generatePDF(shift, event, safeTitle);
      Toast.success('PDF gerado e baixado!');
    };

    Modal.open({
      title: `📤 Exportar Escala - ${shift.title}`,
      content,
      size: 'lg'
    });
  }

  /**
   * Abre modal para exportar todas as escalas do evento juntas
   */
  static openAll(shifts, event) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h4 style="margin-bottom: 8px;">Exportar Todas as ${shifts.length} Escalas</h4>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem;">
          Escolha o formato desejado para exportar o conjunto completo de escalas do evento.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <div class="card" style="padding: 24px; text-align: center; cursor: pointer;" id="btn-export-all-pdf-card">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">📄</div>
            <h4 style="font-weight: 700; margin-bottom: 4px;">PDF Completo (A4)</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Todas as escalas com cabeçalhos e rodapés oficiais</p>
            <button class="btn btn-primary btn-sm w-full">Baixar PDF Completo</button>
          </div>

          <div class="card" style="padding: 24px; text-align: center; cursor: pointer;" id="btn-export-all-whatsapp-card">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">💬</div>
            <h4 style="font-weight: 700; margin-bottom: 4px;">Texto para WhatsApp</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Todas as escalas concatenadas e formatadas</p>
            <button class="btn btn-success btn-sm w-full">Copiar Todo o Texto</button>
          </div>
        </div>
      </div>
    `;

    content.querySelector('#btn-export-all-pdf-card').onclick = async () => {
      const fileName = `${event.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_escalas_completas`;
      await ExportService.generatePDF(shifts, event, fileName);
      Toast.success('PDF completo gerado com sucesso!');
      Modal.close();
    };

    content.querySelector('#btn-export-all-whatsapp-card').onclick = () => {
      let fullText = `🌟 *${event.name.toUpperCase()} - ESCALAS GERAIS* 🌟\n\n`;
      shifts.forEach(s => {
        fullText += ExportService.formatShiftAsWhatsAppText(s, event) + '\n\n';
      });
      navigator.clipboard.writeText(fullText);
      Toast.success('Todas as escalas copiadas para a área de transferência!');
      Modal.close();
    };

    Modal.open({
      title: '📤 Exportação Geral de Escalas',
      content,
      size: 'lg'
    });
  }
}
