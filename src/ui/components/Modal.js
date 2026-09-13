export class Modal {
  /**
   * Abre um modal personalizado na tela
   * @param {Object} options
   * @param {string} options.title - Título do modal
   * @param {string|HTMLElement} options.content - Conteúdo HTML ou elemento
   * @param {string} options.size - 'normal' | 'lg'
   * @param {Function} options.onClose - Callback disparado ao fechar
   * @returns {HTMLElement} O elemento overlay do modal
   */
  static open({ title = '', content = '', size = 'normal', onClose = null }) {
    // Remove modal anterior se houver
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal-overlay';

    const contentBox = document.createElement('div');
    contentBox.className = `modal-content ${size === 'lg' ? 'modal-lg' : ''}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
      this.close();
      if (onClose) onClose();
    };

    const header = document.createElement('div');
    header.className = 'card-header';
    header.style.marginBottom = '20px';
    header.innerHTML = `<h3 class="card-title">${title}</h3>`;

    const body = document.createElement('div');
    body.className = 'modal-body';

    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    contentBox.appendChild(closeBtn);
    contentBox.appendChild(header);
    contentBox.appendChild(body);
    overlay.appendChild(contentBox);

    // Fecha ao clicar fora
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.close();
        if (onClose) onClose();
      }
    };

    document.body.appendChild(overlay);
    return overlay;
  }

  static close() {
    const existing = document.getElementById('active-modal-overlay');
    if (existing) {
      existing.remove();
    }
  }
}
