import { dataConnect } from '../config/dataconnect.js';
import { 
  listShiftsByEvent, upsertShift, deleteShift 
} from '../dataconnect-generated/esm/index.esm.js';
import { Shift } from '../models/Shift.js';

export class ShiftRepository {
  async create(data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    const id = raw.id || `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const shift = new Shift({ ...raw, id });
    const payload = shift.toJSON();

    await upsertShift(dataConnect, {
      id: payload.id,
      eventId: payload.eventId,
      scheduleId: payload.scheduleId,
      title: payload.title || null,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      generalLocation: payload.generalLocation || null,
      categoryId: payload.categoryId || null,
      status: payload.status || 'draft',
      hasDeficit: payload.hasDeficit ?? false,
      deficitCount: payload.deficitCount ?? 0,
      assignments: payload.assignments || [],
      approvedBy: payload.approvedBy || null,
      approvedAt: payload.approvedAt || null,
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return shift;
  }

  async update(id, data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const existing = await this.getById(id, raw.eventId);
    const updatedPayload = { ...(existing ? existing.toJSON() : {}), ...raw, id };
    const shift = new Shift(updatedPayload);

    await upsertShift(dataConnect, {
      id,
      eventId: shift.eventId,
      scheduleId: shift.scheduleId,
      title: shift.title || null,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      generalLocation: shift.generalLocation || null,
      categoryId: shift.categoryId || null,
      status: shift.status || 'draft',
      hasDeficit: shift.hasDeficit ?? false,
      deficitCount: shift.deficitCount ?? 0,
      assignments: shift.assignments || [],
      approvedBy: shift.approvedBy || null,
      approvedAt: shift.approvedAt || null,
      createdAt: shift.createdAt || new Date().toISOString()
    });

    return shift;
  }

  async delete(id) {
    await deleteShift(dataConnect, { id });
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
    const res = await listShiftsByEvent(dataConnect, { eventId });
    if (res && res.data && res.data.shifts) {
      return res.data.shifts.map(s => new Shift(s));
    }
    return [];
  }

  async getBySchedule(scheduleId, eventId = null) {
    if (!scheduleId) return [];
    if (eventId) {
      const all = await this.getByEvent(eventId);
      return all.filter(s => s.scheduleId === scheduleId);
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

export const shiftRepository = new ShiftRepository();
