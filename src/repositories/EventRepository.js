import { dataConnect } from '../config/dataconnect.js';
import { 
  listEvents, getEventById, upsertEvent, deleteEvent 
} from '../dataconnect-generated/esm/index.esm.js';
import { Event } from '../models/Event.js';

export class EventRepository {
  async create(eventData) {
    const raw = typeof eventData.toJSON === 'function' ? eventData.toJSON() : { ...eventData };
    const id = raw.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event = new Event({ ...raw, id });
    const payload = event.toJSON();

    await upsertEvent(dataConnect, {
      id: payload.id,
      name: payload.name,
      code: payload.code || null,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      description: payload.description || null,
      status: payload.status || 'active',
      allowVolunteerRegistration: payload.allowVolunteerRegistration ?? true,
      openShiftVisibility: payload.openShiftVisibility ?? false,
      autoGenerationEnabled: payload.autoGenerationEnabled ?? true,
      headerImageUrl: payload.headerImageUrl || null,
      footerImageUrl: payload.footerImageUrl || null,
      adminUids: payload.adminUids || [],
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return event;
  }

  async update(id, data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const existing = await this.getById(id);
    const updatedPayload = { ...(existing ? existing.toJSON() : {}), ...raw, id };
    const event = new Event(updatedPayload);

    await upsertEvent(dataConnect, {
      id,
      name: event.name,
      code: event.code || null,
      startDate: event.startDate || null,
      endDate: event.endDate || null,
      description: event.description || null,
      status: event.status || 'active',
      allowVolunteerRegistration: event.allowVolunteerRegistration ?? true,
      openShiftVisibility: event.openShiftVisibility ?? false,
      autoGenerationEnabled: event.autoGenerationEnabled ?? true,
      headerImageUrl: event.headerImageUrl || null,
      footerImageUrl: event.footerImageUrl || null,
      adminUids: event.adminUids || [],
      createdAt: event.createdAt || new Date().toISOString()
    });

    return event;
  }

  async delete(id) {
    await deleteEvent(dataConnect, { id });
    return true;
  }

  async getById(id) {
    if (!id) return null;
    const res = await getEventById(dataConnect, { id });
    if (res && res.data && res.data.event) {
      return new Event(res.data.event);
    }
    return null;
  }

  async getByCode(code) {
    if (!code) return null;
    const all = await this.getAll();
    return all.find(e => e.code === code) || null;
  }

  async getAll() {
    const res = await listEvents(dataConnect);
    if (res && res.data && res.data.events) {
      return res.data.events.map(e => new Event(e));
    }
    return [];
  }

  subscribeAll(callback) {
    this.getAll().then(callback);
    // Polling leve para atualizações em tempo real
    const interval = setInterval(() => {
      this.getAll().then(callback);
    }, 10000);
    return () => clearInterval(interval);
  }
}

export const eventRepository = new EventRepository();
