import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where 
} from 'firebase/firestore';
import { User } from '../models/User.js';

export class UserRepository {
  constructor() {
    this.collectionName = 'users';
  }

  getRef(id) {
    return doc(db, this.collectionName, id);
  }

  getCollection() {
    return collection(db, this.collectionName);
  }

  async createOrUpdate(userData) {
    const id = userData.id;
    const user = new User(userData);
    const ref = this.getRef(id);
    await setDoc(ref, user.toJSON(), { merge: true });
    return user;
  }

  async getById(id) {
    if (!id) return null;
    const ref = this.getRef(id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return new User({ id: snap.id, ...snap.data() });
  }

  async getByEmail(email) {
    if (!email) return null;
    const q = query(this.getCollection(), where('email', '==', email.toLowerCase().trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return new User({ id: docData.id, ...docData.data() });
  }

  async getByUsername(username) {
    if (!username) return null;
    const cleanUsername = username.toLowerCase().trim();
    const q = query(this.getCollection(), where('username', '==', cleanUsername));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return new User({ id: docData.id, ...docData.data() });
  }

  async addEventToUser(userId, eventId) {
    const user = await this.getById(userId);
    if (!user) return;
    const eventIds = Array.from(new Set([...(user.eventIds || []), eventId]));
    await updateDoc(this.getRef(userId), { eventIds });
  }
}

export const userRepository = new UserRepository();
