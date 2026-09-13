/**
 * Entidade de Domínio: Voluntário
 */
export class Volunteer {
  constructor({
    id = '',
    eventId = '',
    userId = '',
    name = '',
    email = '',
    phone = '',
    type = 'integral', // 'integral' | 'part_time'
    experience = 'experiente', // 'experiente' | 'primeira_vez'
    availabilities = [], // [{ id, day, period, startTime, endTime }]
    unavailabilities = [], // [{ id, day, startTime, endTime, justification }]
    categoryPreferences = {}, // { [categoryId]: true | false }
    adminRating = 5, // 0 - 5
    adminNotes = '',
    active = true,
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
    this.name = name.trim().toUpperCase();
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.experience = experience;
    this.availabilities = availabilities;
    this.unavailabilities = unavailabilities;
    this.categoryPreferences = categoryPreferences;
    this.adminRating = adminRating;
    this.adminNotes = adminNotes;
    this.active = active;
    this.createdAt = createdAt;
  }

  isIntegral() {
    return this.type === 'integral';
  }

  isPartTime() {
    return this.type === 'part_time';
  }

  hasCategoryPreference(categoryId) {
    return !!this.categoryPreferences[categoryId];
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      type: this.type,
      experience: this.experience,
      availabilities: this.availabilities,
      unavailabilities: this.unavailabilities,
      categoryPreferences: this.categoryPreferences,
      adminRating: this.adminRating,
      adminNotes: this.adminNotes,
      active: this.active,
      createdAt: this.createdAt
    };
  }
}
