/**
 * Entidade de Domínio: Feedback e Avaliação
 */
export class Feedback {
  constructor({
    id = '',
    eventId = '',
    shiftId = '',
    scheduleId = '',
    volunteerId = '',
    type = 'volunteer_feedback', // 'volunteer_feedback' | 'admin_feedback'
    rating = 5, // 0 - 5 estrelas
    comment = '',
    authorUid = '',
    authorName = '',
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.eventId = eventId;
    this.shiftId = shiftId;
    this.scheduleId = scheduleId;
    this.volunteerId = volunteerId;
    this.type = type;
    this.rating = Number(rating);
    this.comment = comment;
    this.authorUid = authorUid;
    this.authorName = authorName;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      shiftId: this.shiftId,
      scheduleId: this.scheduleId,
      volunteerId: this.volunteerId,
      type: this.type,
      rating: this.rating,
      comment: this.comment,
      authorUid: this.authorUid,
      authorName: this.authorName,
      createdAt: this.createdAt
    };
  }
}
