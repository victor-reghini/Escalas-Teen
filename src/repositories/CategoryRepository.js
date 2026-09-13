import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, onSnapshot 
} from 'firebase/firestore';
import { Category } from '../models/Category.js';

export class CategoryRepository {
  constructor() {
    this.collectionName = 'categories';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async create(data) {
    const id = data.id || doc(this.getCollection()).id;
    const cat = new Category({ ...data, id });
    const ref = this.getRef(id);
    await setDoc(ref, cat.toJSON());
    return cat;
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
    return new Category({ id: snap.id, ...snap.data() });
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    const snap = await getDocs(q);
    return snap.docs.map(d => new Category({ id: d.id, ...d.data() }));
  }

  subscribeByEvent(eventId, callback) {
    if (!eventId) return () => {};
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => new Category({ id: d.id, ...d.data() }));
      callback(list);
    });
  }
}

export const categoryRepository = new CategoryRepository();
