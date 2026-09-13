import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, onSnapshot 
} from 'firebase/firestore';
import { Volunteer } from '../models/Volunteer.js';

export class VolunteerRepository {
  constructor() {
    this.collectionName = 'volunteers';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async create(volunteerData) {
    const id = volunteerData.id || doc(this.getCollection()).id;
    const volunteer = new Volunteer({ ...volunteerData, id });
    const ref = this.getRef(id);
    await setDoc(ref, volunteer.toJSON());
    return volunteer;
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
    return new Volunteer({ id: snap.id, ...snap.data() });
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Volunteer({ id: d.id, ...d.data() }));
  }

  async getByEventAndUser(eventId, userId) {
    if (!eventId || !userId) return null;
    const q = query(
      this.getCollection(), 
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return new Volunteer({ id: d.id, ...d.data() });
  }

  async getByUserAcrossEvents(userId) {
    if (!userId) return [];
    const q = query(this.getCollection(), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Volunteer({ id: d.id, ...d.data() }));
  }

  subscribeByEvent(eventId, callback) {
    if (!eventId) return () => {};
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => new Volunteer({ id: d.id, ...d.data() }));
      callback(list);
    });
  }
}

export const volunteerRepository = new VolunteerRepository();
