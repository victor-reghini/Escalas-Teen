import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot 
} from 'firebase/firestore';
import { Event } from '../models/Event.js';

export class EventRepository {
  constructor() {
    this.collectionName = 'events';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async create(eventData) {
    const id = eventData.id || doc(this.getCollection()).id;
    const event = new Event({ ...eventData, id });
    const ref = this.getRef(id);
    await setDoc(ref, event.toJSON());
    return event;
  }

  async update(id, data) {
    const ref = this.getRef(id);
    await updateDoc(ref, data);
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
    return new Event({ id: snap.id, ...snap.data() });
  }

  async getByCode(code) {
    if (!code) return null;
    const q = query(this.getCollection(), where('code', '==', code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return new Event({ id: docData.id, ...docData.data() });
  }

  async getAll() {
    try {
      const q = query(this.getCollection(), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => new Event({ id: d.id, ...d.data() }));
    } catch (e) {
      // Fallback sem ordenação caso índice não exista
      const snap = await getDocs(this.getCollection());
      return snap.docs.map(d => new Event({ id: d.id, ...d.data() }));
    }
  }

  subscribeAll(callback) {
    return onSnapshot(this.getCollection(), (snap) => {
      const events = snap.docs.map(d => new Event({ id: d.id, ...d.data() }));
      callback(events);
    });
  }
}

export const eventRepository = new EventRepository();
