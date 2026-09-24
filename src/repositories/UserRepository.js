import { dataConnect } from '../config/dataconnect.js';
import { 
  getUserById, getUserByEmail, getUserByUsername, upsertUser, deleteUser 
} from '../dataconnect-generated/esm/index.esm.js';
import { User } from '../models/User.js';

export class UserRepository {
  async createOrUpdate(userData) {
    const raw = typeof userData.toJSON === 'function' ? userData.toJSON() : { ...userData };
    const id = raw.id || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user = new User({ ...raw, id });
    const payload = user.toJSON();

    await upsertUser(dataConnect, {
      id: payload.id,
      email: payload.email,
      username: payload.username || null,
      name: payload.name,
      role: payload.role || 'volunteer',
      phone: payload.phone || null,
      avatarUrl: payload.avatarUrl || null,
      eventIds: payload.eventIds || [],
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return user;
  }

  async getById(id) {
    if (!id) return null;
    const res = await getUserById(dataConnect, { id });
    if (res && res.data && res.data.user) {
      return new User(res.data.user);
    }
    return null;
  }

  async getByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const res = await getUserByEmail(dataConnect, { email: cleanEmail });
    if (res && res.data && res.data.users && res.data.users.length > 0) {
      return new User(res.data.users[0]);
    }
    return null;
  }

  async getByUsername(username) {
    if (!username) return null;
    const cleanUsername = username.toLowerCase().trim();
    const res = await getUserByUsername(dataConnect, { username: cleanUsername });
    if (res && res.data && res.data.users && res.data.users.length > 0) {
      return new User(res.data.users[0]);
    }
    return null;
  }

  async addEventToUser(userId, eventId) {
    const user = await this.getById(userId);
    if (!user) return;
    const eventIds = Array.from(new Set([...(user.eventIds || []), eventId]));
    await this.createOrUpdate({ ...user.toJSON(), eventIds });
  }

  async delete(id) {
    await deleteUser(dataConnect, { id });
    return true;
  }
}

export const userRepository = new UserRepository();
