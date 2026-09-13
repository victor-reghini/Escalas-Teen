import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot 
} from 'firebase/firestore';
import { Feedback } from '../models/Feedback.js';

export class FeedbackRepository {
  constructor() {
    this.collectionName = 'feedbacks';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async create(data) {
    const id = data.id || doc(this.getCollection()).id;
    const feedback = new Feedback({ ...data, id });
    const ref = this.getRef(id);
    await setDoc(ref, feedback.toJSON());
    return feedback;
  }

  async getById(id) {
    if (!id) return null;
    const ref = this.getRef(id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return new Feedback({ id: snap.id, ...snap.data() });
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Feedback({ id: d.id, ...d.data() }));
  }

  async getByVolunteer(volunteerId) {
    if (!volunteerId) return [];
    const q = query(this.getCollection(), where('volunteerId', '==', volunteerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Feedback({ id: d.id, ...d.data() }));
  }

  async getByShift(shiftId) {
    if (!shiftId) return [];
    const q = query(this.getCollection(), where('shiftId', '==', shiftId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Feedback({ id: d.id, ...d.data() }));
  }

  subscribeByVolunteer(volunteerId, callback) {
    if (!volunteerId) return () => {};
    const q = query(this.getCollection(), where('volunteerId', '==', volunteerId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => new Feedback({ id: d.id, ...d.data() }));
      callback(list);
    });
  }
}

export const feedbackRepository = new FeedbackRepository();
