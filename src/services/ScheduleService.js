import { scheduleRepository } from '../repositories/ScheduleRepository.js';
import { categoryRepository } from '../repositories/CategoryRepository.js';
import { shiftRepository } from '../repositories/ShiftRepository.js';
import { feedbackRepository } from '../repositories/FeedbackRepository.js';

export class ScheduleService {
  // --- PROGRAMAÇÕES (SCHEDULES) ---
  async getSchedulesByEvent(eventId) {
    if (!eventId) return [];
    return scheduleRepository.getByEvent(eventId);
  }

  async getScheduleById(id) {
    return scheduleRepository.getById(id);
  }

  async createSchedule(data) {
    return scheduleRepository.create(data);
  }

  async updateSchedule(id, data) {
    return scheduleRepository.update(id, data);
  }

  async deleteSchedule(id) {
    return scheduleRepository.delete(id);
  }

  // --- CATEGORIAS ---
  async getCategoriesByEvent(eventId) {
    if (!eventId) return [];
    const list = await categoryRepository.getByEvent(eventId);
    list.sort((a, b) => (b.priority || 1) - (a.priority || 1));
    return list;
  }

  async createCategory(data) {
    return categoryRepository.create(data);
  }

  async updateCategory(id, data) {
    return categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return categoryRepository.delete(id);
  }

  // --- ESCALAS (SHIFTS) ---
  async getShiftsByEvent(eventId) {
    if (!eventId) return [];
    return shiftRepository.getByEvent(eventId);
  }

  async getShiftById(id) {
    return shiftRepository.getById(id);
  }

  async saveShift(shiftData) {
    if (shiftData.id) {
      const existing = await shiftRepository.getById(shiftData.id);
      if (existing) {
        return shiftRepository.update(shiftData.id, shiftData);
      }
    }
    return shiftRepository.create(shiftData);
  }

  async approveShift(shiftId, adminUid) {
    return shiftRepository.update(shiftId, {
      status: 'approved',
      approvedBy: adminUid,
      approvedAt: new Date().toISOString()
    });
  }

  async deleteShift(shiftId) {
    return shiftRepository.delete(shiftId);
  }

  // --- FEEDBACKS ---
  async getFeedbacksByEvent(eventId) {
    return feedbackRepository.getByEvent(eventId);
  }

  async getFeedbacksByVolunteer(volunteerId) {
    return feedbackRepository.getByVolunteer(volunteerId);
  }

  async submitFeedback({
    eventId,
    shiftId = '',
    scheduleId = '',
    volunteerId,
    type = 'volunteer_feedback',
    rating,
    comment = '',
    authorUid = '',
    authorName = ''
  }) {
    return feedbackRepository.create({
      eventId,
      shiftId,
      scheduleId,
      volunteerId,
      type,
      rating: Number(rating),
      comment: comment.trim(),
      authorUid,
      authorName
    });
  }
}

export const scheduleService = new ScheduleService();
