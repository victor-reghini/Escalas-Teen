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
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    
    // Validação para não criar categorias duplicadas com o mesmo nome para o mesmo evento
    if (raw.eventId && raw.name) {
      const existingCats = await this.getByEvent(raw.eventId);
      const normalizedName = raw.name.trim().toLowerCase();
      const duplicate = existingCats.find(c => c.name.trim().toLowerCase() === normalizedName);
      if (duplicate) {
        return duplicate;
      }
    }

    const id = raw.id || doc(this.getCollection()).id;
    const cat = new Category({ ...raw, id });
    const ref = this.getRef(id);
    await setDoc(ref, cat.toJSON());
    return cat;
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
    return new Category({ id: snap.id, ...snap.data() });
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => new Category({ id: d.id, ...d.data() }));
    
    // Deduplica por nome case-insensitive caso existam duplicatas herdadas no banco
    const seenNames = new Set();
    const uniqueList = [];
    for (const item of list) {
      const key = (item.name || '').trim().toLowerCase();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  }

  subscribeByEvent(eventId, callback) {
    if (!eventId) return () => {};
    const q = query(this.getCollection(), where('eventId', '==', eventId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => new Category({ id: d.id, ...d.data() }));
      const seenNames = new Set();
      const uniqueList = [];
      for (const item of list) {
        const key = (item.name || '').trim().toLowerCase();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          uniqueList.push(item);
        }
      }
      callback(uniqueList);
    });
  }
}

export const categoryRepository = new CategoryRepository();
