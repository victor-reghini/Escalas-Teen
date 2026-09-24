import { dataConnect } from '../config/dataconnect.js';
import { 
  listSchedulesByEvent, upsertSchedule, deleteSchedule 
} from '../dataconnect-generated/esm/index.esm.js';
import { Schedule } from '../models/Schedule.js';

export class ScheduleRepository {
  async create(data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    const id = raw.id || `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const schedule = new Schedule({ ...raw, id });
    const payload = schedule.toJSON();

    await upsertSchedule(dataConnect, {
      id: payload.id,
      eventId: payload.eventId,
      title: payload.title,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      generalLocation: payload.generalLocation || null,
      categoryId: payload.categoryId || null,
      requiredVolunteers: payload.requiredVolunteers || 1,
      roles: payload.roles || [],
      notes: payload.notes || null,
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return schedule;
  }

  async update(id, data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const existing = await this.getById(id, raw.eventId);
    const updatedPayload = { ...(existing ? existing.toJSON() : {}), ...raw, id };
    const schedule = new Schedule(updatedPayload);

    await upsertSchedule(dataConnect, {
      id,
      eventId: schedule.eventId,
      title: schedule.title,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      generalLocation: schedule.generalLocation || null,
      categoryId: schedule.categoryId || null,
      requiredVolunteers: schedule.requiredVolunteers || 1,
      roles: schedule.roles || [],
      notes: schedule.notes || null,
      createdAt: schedule.createdAt || new Date().toISOString()
    });

    return schedule;
  }

  async delete(id) {
    await deleteSchedule(dataConnect, { id });
    return true;
  }

  async getById(id, eventId = null) {
    if (!id) return null;
    if (eventId) {
      const list = await this.getByEvent(eventId);
      return list.find(s => s.id === id) || null;
    }
    return null;
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const res = await listSchedulesByEvent(dataConnect, { eventId });
    if (res && res.data && res.data.schedules) {
      return res.data.schedules.map(s => new Schedule(s));
    }
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

export const scheduleRepository = new ScheduleRepository();
