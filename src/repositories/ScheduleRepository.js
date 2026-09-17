import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot 
} from 'firebase/firestore';
import { Schedule } from '../models/Schedule.js';

export class ScheduleRepository {
  constructor() {
    this.collectionName = 'schedules';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async create(data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    const id = raw.id || doc(this.getCollection()).id;
    const schedule = new Schedule({ ...raw, id });
    const ref = this.getRef(id);
    await setDoc(ref, schedule.toJSON());
    return schedule;
  }

  async update(id, data) {
    const ref = this.getRef(id);
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const cleanData = {};
    Object.keys(raw).forEach(key => {
      if (raw[key] !== undefined) {
        cleanData[key] = raw[key];
      }
    });
    await setDoc(ref, cleanData, { merge: true });
    return this.getById(id);
  }

  async delete(id) {
    const ref = this.getRef(id);
    await deleteDoc(ref);
    return true;
  }

  async getById(id) {
    if (!id) return null;
    const ref = this.getRef(id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return new Schedule({ id: snap.id, ...snap.data() });
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    try {
      const q = query(
        this.getCollection(), 
        where('eventId', '==', eventId),
        orderBy('date', 'asc'),
        orderBy('startTime', 'asc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => new Schedule({ id: d.id, ...d.data() }));
    } catch (e) {
      const q = query(this.getCollection(), where('eventId', '==', eventId));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => new Schedule({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
      return list;
    }
  }

  subscribeByEvent(eventId, callback) {
    if (!eventId) return () => {};
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => new Schedule({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
      callback(list);
    });
  }
}

export const scheduleRepository = new ScheduleRepository();
