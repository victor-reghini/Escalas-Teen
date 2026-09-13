/**
 * Entidade de Domínio: Escala Atribuída (Gerada ou Manual)
 */
export class Shift {
  constructor({
    id = '',
    eventId = '',
    scheduleId = '',
    title = '',
    date = '',
    startTime = '',
    endTime = '',
    generalLocation = '',
    categoryId = '',
    status = 'draft', // 'draft' | 'pending_approval' | 'approved' | 'published'
    assignments = [], // [{ volunteerId, volunteerName, roleId, roleName, specificLocation, startTime, endTime, manualOverride }]
    approvedBy = '',
    approvedAt = null,
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.eventId = eventId;
    this.scheduleId = scheduleId;
    this.title = title.trim().toUpperCase();
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.generalLocation = generalLocation;
    this.categoryId = categoryId;
    this.status = status;
    this.assignments = assignments;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
    this.createdAt = createdAt;
  }

  isApproved() {
    return this.status === 'approved' || this.status === 'published';
  }

  hasVolunteer(volunteerId) {
    return this.assignments.some(a => a.volunteerId === volunteerId);
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
      scheduleId: this.scheduleId,
      title: this.title,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      generalLocation: this.generalLocation,
      categoryId: this.categoryId,
      status: this.status,
      assignments: this.assignments,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      createdAt: this.createdAt
    };
  }
}
