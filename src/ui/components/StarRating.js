export class StarRating {
  /**
   * Renderiza estrelas interativas ou somente leitura
   * @param {Object} options
   * @param {number} options.value - Nota atual (0 a 5)
   * @param {boolean} options.readOnly - Se false, permite clicar para alterar
   * @param {Function} options.onChange - Callback com a nova nota
   * @returns {HTMLElement}
   */
  static render({ value = 5, readOnly = false, onChange = null }) {
    const container = document.createElement('div');
    container.className = 'star-rating';
    container.dataset.rating = value;

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = `star ${i <= value ? 'filled' : ''}`;
      star.innerHTML = '★';

      if (!readOnly) {
        star.onclick = () => {
          container.dataset.rating = i;
          container.querySelectorAll('.star').forEach((s, idx) => {
            if (idx < i) s.classList.add('filled');
            else s.classList.remove('filled');
          });
          if (onChange) onChange(i);
        };
      }

      container.appendChild(star);
    }

    return container;
  }
}
