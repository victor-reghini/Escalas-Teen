import { dataConnect } from '../config/dataconnect.js';
import { 
  listFeedbacksByEvent, upsertFeedback, deleteFeedback 
} from '../dataconnect-generated/esm/index.esm.js';
import { Feedback } from '../models/Feedback.js';

export class FeedbackRepository {
  async create(data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    const id = raw.id || `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const feedback = new Feedback({ ...raw, id });
    const payload = feedback.toJSON();

    await upsertFeedback(dataConnect, {
      id: payload.id,
      eventId: payload.eventId,
      volunteerId: payload.volunteerId,
      shiftId: payload.shiftId || null,
      rating: Number(payload.rating) || 5,
      comments: payload.comments || null,
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return feedback;
  }

  async delete(id) {
    await deleteFeedback(dataConnect, { id });
    return true;
  }

  async getById(id, eventId = null) {
    if (!id) return null;
    if (eventId) {
      const list = await this.getByEvent(eventId);
      return list.find(f => f.id === id) || null;
    }
    return null;
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const res = await listFeedbacksByEvent(dataConnect, { eventId });
    if (res && res.data && res.data.feedbacks) {
      return res.data.feedbacks.map(f => new Feedback(f));
    }
    return [];
  }

  async getByVolunteer(volunteerId, eventId = null) {
    if (!volunteerId) return [];
    if (eventId) {
      const all = await this.getByEvent(eventId);
      return all.filter(f => f.volunteerId === volunteerId);
    }
    return [];
  }

  async getByShift(shiftId, eventId = null) {
    if (!shiftId) return [];
    if (eventId) {
      const all = await this.getByEvent(eventId);
      return all.filter(f => f.shiftId === shiftId);
    }
    return [];
  }

  subscribeByVolunteer(volunteerId, callback) {
    if (!volunteerId) return () => {};
    return () => {};
  }
}

export const feedbackRepository = new FeedbackRepository();
