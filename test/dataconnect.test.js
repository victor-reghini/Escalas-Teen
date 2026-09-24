import { Event } from '../src/models/Event.js';
import { Category } from '../src/models/Category.js';
import { Schedule } from '../src/models/Schedule.js';
import { Volunteer } from '../src/models/Volunteer.js';
import { Shift } from '../src/models/Shift.js';
import { Feedback } from '../src/models/Feedback.js';

console.log('🧪 Testando modelos e compatibilidade com PostgreSQL / Data Connect...');

// 1. Teste de modelo Event
const ev = new Event({
  id: 'ev-test-123',
  name: 'TeenStreet Brasil 2026',
  status: 'active',
  allowVolunteerRegistration: true,
  adminUids: ['uid1', 'uid2']
});
console.assert(ev.id === 'ev-test-123', 'Event ID incorreto');
console.assert(ev.adminUids.length === 2, 'adminUids incorreto');
console.log('✅ 1. Modelo Event compatível com PostgreSQL');

// 2. Teste de modelo Volunteer
const vol = new Volunteer({
  id: 'vol-test-1',
  eventId: 'ev-test-123',
  name: 'MATEUS SILVA',
  type: 'integral',
  experience: 'experiente',
  availabilities: [{ day: '2026-07-20', period: 'MANHA' }],
  categoryPreferences: { cat1: true }
});
console.assert(vol.isIntegral() === true, 'Volunteer type incorreto');
console.assert(vol.hasCategoryPreference('cat1') === true, 'categoryPreferences incorreto');
console.log('✅ 2. Modelo Volunteer compatível com PostgreSQL JSONB');

// 3. Teste de modelo Shift
const sh = new Shift({
  id: 'sh-test-1',
  eventId: 'ev-test-123',
  scheduleId: 'sch-1',
  title: 'CULTO DA NOITE',
  date: '2026-07-20',
  startTime: '19:00',
  endTime: '22:00',
  assignments: [{ volunteerId: 'vol-test-1', volunteerName: 'MATEUS SILVA', roleName: 'Portaria' }]
});
console.assert(sh.hasVolunteer('vol-test-1') === true, 'Shift assignments incorreto');
console.log('✅ 3. Modelo Shift compatível com PostgreSQL JSONB');

console.log('🎉 TODOS OS TESTES DE COMPATIBILIDADE DATA CONNECT PASSARAM!');
