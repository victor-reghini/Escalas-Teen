import { volunteerRepository } from '../repositories/VolunteerRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { shiftRepository } from '../repositories/ShiftRepository.js';
import { feedbackRepository } from '../repositories/FeedbackRepository.js';
import { eventRepository } from '../repositories/EventRepository.js';
import { Volunteer } from '../models/Volunteer.js';

export class VolunteerService {
  async getVolunteersByEvent(eventId) {
    if (!eventId) return [];
    return volunteerRepository.getByEvent(eventId);
  }

  async getVolunteerById(id) {
    return volunteerRepository.getById(id);
  }

  async getVolunteerByUserAndEvent(userId, eventId) {
    if (!userId || !eventId) return null;
    return volunteerRepository.getByEventAndUser(eventId, userId);
  }

  /**
   * Registra um novo voluntário vinculado ao evento atual
   */
  async registerVolunteer({
    eventId,
    userId = null,
    name,
    email = '',
    phone = '',
    type = 'integral',
    experience = 'experiente',
    availabilities = [],
    unavailabilities = [],
    categoryPreferences = {}
  }) {
    if (!eventId || !name) {
      throw new Error('Evento e nome do voluntário são obrigatórios.');
    }

    const cleanName = name.trim().toUpperCase();

    // Cria ou atualiza voluntário no evento
    const volunteer = await volunteerRepository.create({
      eventId,
      userId,
      name: cleanName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      type,
      experience,
      availabilities,
      unavailabilities,
      categoryPreferences,
      adminRating: 5,
      active: true
    });

    if (userId) {
      await userRepository.addEventToUser(userId, eventId);
    }

    return volunteer;
  }

  async updateVolunteer(id, data) {
    return volunteerRepository.update(id, data);
  }

  async updateAvailabilities(volunteerId, availabilities) {
    return volunteerRepository.update(volunteerId, { availabilities });
  }

  async updateUnavailabilities(volunteerId, unavailabilities) {
    return volunteerRepository.update(volunteerId, { unavailabilities });
  }

  async updateCategoryPreferences(volunteerId, categoryPreferences) {
    return volunteerRepository.update(volunteerId, { categoryPreferences });
  }

  async updateAdminRating(volunteerId, adminRating, adminNotes = '') {
    return volunteerRepository.update(volunteerId, { adminRating: Number(adminRating), adminNotes });
  }

  async deleteVolunteer(id) {
    return volunteerRepository.delete(id);
  }

  /**
   * Obtém histórico completo de escalas e feedbacks de um voluntário em todos os eventos
   */
  async getVolunteerHistoricalOverview(userId) {
    if (!userId) return { pastEvents: [], pastShifts: [], feedbacks: [] };

    // 1. Busca todos os registros de voluntário deste usuário
    const userVolunteers = await volunteerRepository.getByUserAcrossEvents(userId);
    const volunteerIds = userVolunteers.map(v => v.id);

    // 2. Busca todos os feedbacks submetidos ou recebidos
    const allFeedbacks = [];
    for (const vId of volunteerIds) {
      const fbList = await feedbackRepository.getByVolunteer(vId);
      allFeedbacks.push(...fbList);
    }

    // 3. Busca eventos associados
    const eventIds = Array.from(new Set(userVolunteers.map(v => v.eventId)));
    const events = [];
    const shiftsByEvent = {};

    for (const eId of eventIds) {
      const ev = await eventRepository.getById(eId);
      if (ev) events.push(ev);

      const allShifts = await shiftRepository.getByEvent(eId);
      const myShifts = allShifts.filter(s => 
        s.assignments && s.assignments.some(a => volunteerIds.includes(a.volunteerId))
      );
      shiftsByEvent[eId] = myShifts;
    }

    return {
      events,
      userVolunteers,
      shiftsByEvent,
      feedbacks: allFeedbacks
    };
  }
}

export const volunteerService = new VolunteerService();
