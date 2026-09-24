import { dataConnect } from '../config/dataconnect.js';
import { 
  listCategoriesByEvent, upsertCategory, deleteCategory 
} from '../dataconnect-generated/esm/index.esm.js';
import { Category } from '../models/Category.js';

export class CategoryRepository {
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

    const id = raw.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cat = new Category({ ...raw, id });
    const payload = cat.toJSON();

    await upsertCategory(dataConnect, {
      id: payload.id,
      eventId: payload.eventId,
      name: payload.name,
      description: payload.description || null,
      color: payload.color || '#2563eb',
      priority: payload.priority || 1,
      createdAt: payload.createdAt || new Date().toISOString()
    });

    return cat;
  }

  async update(id, data) {
    const raw = typeof data.toJSON === 'function' ? data.toJSON() : { ...data };
    delete raw.id;
    const existing = await this.getById(id, raw.eventId);
    const updatedPayload = { ...(existing ? existing.toJSON() : {}), ...raw, id };
    const cat = new Category(updatedPayload);

    await upsertCategory(dataConnect, {
      id,
      eventId: cat.eventId,
      name: cat.name,
      description: cat.description || null,
      color: cat.color || '#2563eb',
      priority: cat.priority || 1,
      createdAt: cat.createdAt || new Date().toISOString()
    });

    return cat;
  }

  async delete(id) {
    await deleteCategory(dataConnect, { id });
    return true;
  }

  async getById(id, eventId = null) {
    if (!id) return null;
    if (eventId) {
      const list = await this.getByEvent(eventId);
      return list.find(c => c.id === id) || null;
    }
    // Caso não tenha eventId, busca pelas categorias disponíveis
    return null;
  }

  async getByEvent(eventId) {
    if (!eventId) return [];
    const res = await listCategoriesByEvent(dataConnect, { eventId });
    if (res && res.data && res.data.categories) {
      const list = res.data.categories.map(c => new Category(c));
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

export const categoryRepository = new CategoryRepository();
