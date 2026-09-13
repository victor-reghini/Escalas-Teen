import { eventRepository } from '../repositories/EventRepository.js';
import { categoryRepository } from '../repositories/CategoryRepository.js';
import { scheduleRepository } from '../repositories/ScheduleRepository.js';
import { shiftRepository } from '../repositories/ShiftRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { Event } from '../models/Event.js';

export class EventService {
  constructor() {
    this.currentEvent = null;
    this.eventListeners = [];
  }

  async init(preferredEventId = null) {
    let event = null;

    try {
      // Cria uma promessa com timeout para evitar bloqueio em caso de rede instável
      const fetchWithTimeout = (promise, ms = 2500) => 
        Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

      // 1. Tenta carregar pelo preferredEventId (ex: URL param ?event=ID)
      if (preferredEventId) {
        event = await fetchWithTimeout(eventRepository.getById(preferredEventId)).catch(() => null) 
             || await fetchWithTimeout(eventRepository.getByCode(preferredEventId)).catch(() => null);
      }

      // 2. Se não houver, tenta carregar do localStorage
      if (!event) {
        const savedId = localStorage.getItem('last_event_id');
        if (savedId) {
          event = await fetchWithTimeout(eventRepository.getById(savedId)).catch(() => null);
        }
      }

      // 3. Se ainda não houver, busca o primeiro evento ativo existente
      if (!event) {
        const all = await fetchWithTimeout(eventRepository.getAll()).catch(() => []);
        if (all && all.length > 0) {
          event = all[0];
        }
      }

      // 4. Se não existir nenhum evento no banco, tenta criar o evento padrão do TeenStreet
      if (!event) {
        event = await fetchWithTimeout(this.createInitialDefaultEvent()).catch(() => null);
      }
    } catch (e) {
      console.warn('Fallback local para evento ativo.');
    }

    // Se falhar ou estiver offline, usa o evento padrão em memória
    if (!event) {
      event = new Event({
        id: 'teenstreet-2026',
        name: 'TeenStreet Brasil 2026',
        code: 'ts-2026',
        startDate: '2026-07-16',
        endDate: '2026-07-21',
        description: 'Congresso TeenStreet Brasil 2026 - O Chamado',
        status: 'active'
      });
    }

    this.setCurrentEvent(event);
    return event;
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  setCurrentEvent(event) {
    this.currentEvent = event;
    if (event && event.id) {
      localStorage.setItem('last_event_id', event.id);
    }
    this.notifyListeners();
  }

  onEventChange(callback) {
    this.eventListeners.push(callback);
    callback(this.currentEvent);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.eventListeners.forEach(cb => {
      try { cb(this.currentEvent); } catch(e) { console.error(e); }
    });
  }

  async getAllEvents() {
    return eventRepository.getAll();
  }

  async getEventByIdOrCode(idOrCode) {
    if (!idOrCode) return null;
    return await eventRepository.getById(idOrCode) || await eventRepository.getByCode(idOrCode);
  }

  async createEvent(eventData, creatorUserId = null) {
    const adminUids = creatorUserId ? [creatorUserId] : [];
    const event = await eventRepository.create({
      ...eventData,
      adminUids
    });

    if (creatorUserId) {
      await userRepository.addEventToUser(creatorUserId, event.id);
    }

    this.setCurrentEvent(event);
    return event;
  }

  async updateEvent(id, data) {
    const updated = await eventRepository.update(id, data);
    if (this.currentEvent && this.currentEvent.id === id) {
      this.setCurrentEvent(updated);
    }
    return updated;
  }

  async deleteEvent(id) {
    await eventRepository.delete(id);
    if (this.currentEvent && this.currentEvent.id === id) {
      const all = await eventRepository.getAll();
      this.setCurrentEvent(all.length > 0 ? all[0] : null);
    }
    return true;
  }

  /**
   * Clona Categorias e Programações de um evento anterior para o evento atual
   */
  async cloneFromPreviousEvent(sourceEventId, targetEventId) {
    if (!sourceEventId || !targetEventId) {
      throw new Error('IDs de evento de origem e destino são obrigatórios.');
    }

    // 1. Clona Categorias
    const sourceCategories = await categoryRepository.getByEvent(sourceEventId);
    const categoryIdMap = {}; // mapeia ID antigo -> ID novo

    for (const cat of sourceCategories) {
      const newCat = await categoryRepository.create({
        eventId: targetEventId,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        priority: cat.priority
      });
      categoryIdMap[cat.id] = newCat.id;
    }

    // 2. Clona Programações
    const sourceSchedules = await scheduleRepository.getByEvent(sourceEventId);
    const targetEvent = await eventRepository.getById(targetEventId);
    const defaultDate = targetEvent ? targetEvent.startDate : '';

    let clonedCount = 0;
    for (const sched of sourceSchedules) {
      const newCategoryId = categoryIdMap[sched.categoryId] || '';
      await scheduleRepository.create({
        eventId: targetEventId,
        title: sched.title,
        date: defaultDate || sched.date,
        startTime: sched.startTime,
        endTime: sched.endTime,
        generalLocation: sched.generalLocation,
        categoryId: newCategoryId,
        requiredVolunteers: sched.requiredVolunteers,
        roles: sched.roles || [],
        notes: sched.notes || ''
      });
      clonedCount++;
    }

    return {
      clonedCategories: sourceCategories.length,
      clonedSchedules: clonedCount
    };
  }

  /**
   * Cria o evento padrão do TeenStreet se a base estiver vazia
   */
  async createInitialDefaultEvent() {
    const event = await eventRepository.create({
      id: 'teenstreet-2026',
      name: 'TeenStreet Brasil 2026',
      code: 'ts-2026',
      startDate: '2026-07-16',
      endDate: '2026-07-21',
      description: 'Congresso TeenStreet Brasil 2026 - O Chamado',
      status: 'active',
      allowVolunteerRegistration: true,
      openShiftVisibility: false,
      autoGenerationEnabled: true
    });

    // Cria categorias padrão
    await categoryRepository.create({
      eventId: event.id,
      name: 'Ensino / Sala do Trono',
      description: 'Atividades espirituais, ministrações e discipulado',
      color: '#7c3aed',
      priority: 10
    });

    await categoryRepository.create({
      eventId: event.id,
      name: 'Refeições (Café / Almoço / Jantar)',
      description: 'Serviço de refeitório, buffet e copa',
      color: '#ea580c',
      priority: 3
    });

    await categoryRepository.create({
      eventId: event.id,
      name: 'Apoio Geral & Limpeza',
      description: 'Organização de tendas, logística e manutenção',
      color: '#2563eb',
      priority: 2
    });

    return event;
  }
}

export const eventService = new EventService();
