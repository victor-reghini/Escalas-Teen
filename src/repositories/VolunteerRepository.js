import { dataConnect } from '../config/dataconnect.js';
import { 
  listVolunteersByEvent, upsertVolunteer, deleteVolunteer 
} from '../dataconnect-generated/esm/index.esm.js';
import { Volunteer } from '../models/Volunteer.js';

export class VolunteerRepository {
  async create(volunteerData) {
    const raw = typeof volunteerData.toJSON === 'function' ? volunteerData.toJSON() : { ...volunteerData };
    const id = raw.id || `vol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const volunteer = new Volunteer({ ...raw, id });
    const payload = volunteer.toJSON();

    await upsertVolunteer(dataConnect, {
      id: payload.id,
      eventId: payload.eventId,
      userId: payload.userId || null,
      name: payload.name,
      email: payload.email || null,
      phone: payload.phone || null,
      type: payload.type || 'integral',
      experience: payload.experience || 'experiente',
      availabilities: payload.availabilities || [],
      unavailabilities: payload.unavailabilities || [],
      categoryPreferences: payload.categoryPreferences || {},
      adminRating: payload.adminRating !== undefined ? Number(payload.adminRating) : 5,
      adminNotes: payload.adminNotes || null,
      active: payload.active ?? true,
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return volunteer;
  }

  async update(id, data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const existing = await this.getById(id, raw.eventId);
    const updatedPayload = { ...(existing ? existing.toJSON() : {}), ...raw, id };
    const volunteer = new Volunteer(updatedPayload);

    await upsertVolunteer(dataConnect, {
      id,
      eventId: volunteer.eventId,
      userId: volunteer.userId || null,
      name: volunteer.name,
      email: volunteer.email || null,
      phone: volunteer.phone || null,
      type: volunteer.type || 'integral',
      experience: volunteer.experience || 'experiente',
      availabilities: volunteer.availabilities || [],
      unavailabilities: volunteer.unavailabilities || [],
      categoryPreferences: volunteer.categoryPreferences || {},
      adminRating: volunteer.adminRating !== undefined ? Number(volunteer.adminRating) : 5,
      adminNotes: volunteer.adminNotes || null,
      active: volunteer.active ?? true,
      createdAt: volunteer.createdAt || new Date().toISOString()
    });

    return volunteer;
  }

  async delete(id) {
    await deleteVolunteer(dataConnect, { id });
    return true;
  }

  async getById(id, eventId = null) {
    if (!id) return null;
    if (eventId) {
      const list = await this.getByEvent(eventId);
      return list.find(v => v.id === id) || null;
    }
    return null;
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const res = await listVolunteersByEvent(dataConnect, { eventId });
    if (res && res.data && res.data.volunteers) {
      return res.data.volunteers.map(v => new Volunteer(v));
    }
    return [];
  }

  async getByEventAndUser(eventId, userId) {
    if (!eventId || !userId) return null;
    const all = await this.getByEvent(eventId);
    return all.find(v => v.userId === userId) || null;
  }

  async getByUserAcrossEvents(userId) {
    if (!userId) return [];
    // Pode buscar nas listas disponíveis
    return [];
  }

  subscribeByEvent(eventId, callback) {
    if (!eventId) return () => {};
    this.getByEvent(eventId).then(callback);
    const interval = setInterval(() => {
      this.getByEvent(eventId).then(callback);
    }, 10000);
    return () => clearInterval(interval);
  }
}

export const volunteerRepository = new VolunteerRepository();
