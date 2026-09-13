/**
 * Entidade de Domínio: Categoria de Escala
 */
export class Category {
  constructor({
    id = '',
    eventId = '',
    name = '',
    description = '',
    color = '#2563eb', // Cor padrão para badges
    priority = 1, // Prioridade na alocação (maior = mais prioritário)
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.eventId = eventId;
    this.name = name;
    this.description = description;
    this.color = color;
    this.priority = priority;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      name: this.name,
      description: this.description,
      color: this.color,
      priority: this.priority,
      createdAt: this.createdAt
    };
  }
}
