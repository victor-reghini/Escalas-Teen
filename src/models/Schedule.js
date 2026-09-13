/**
 * Entidade de Domínio: Programação (Definição de Atividade/Escala)
 */
export class Schedule {
  constructor({
    id = '',
    eventId = '',
    title = '',
    date = '', // YYYY-MM-DD
    startTime = '', // HH:mm
    endTime = '', // HH:mm
    generalLocation = '',
    categoryId = '',
    requiredVolunteers = 1,
    roles = [], // [{ id, name, specificLocation }]
    notes = '',
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.eventId = eventId;
    this.title = title.trim().toUpperCase();
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.generalLocation = generalLocation;
    this.categoryId = categoryId;
    this.requiredVolunteers = Number(requiredVolunteers) || 1;
    this.roles = roles;
    this.notes = notes;
    this.createdAt = createdAt;
  }

  getStartDateTime() {
    return new Date(`${this.date}T${this.startTime || '00:00'}:00`);
  }

  getEndDateTime() {
    return new Date(`${this.date}T${this.endTime || '23:59'}:00`);
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      title: this.title,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      generalLocation: this.generalLocation,
      categoryId: this.categoryId,
      requiredVolunteers: this.requiredVolunteers,
      roles: this.roles,
      notes: this.notes,
      createdAt: this.createdAt
    };
  }
}
