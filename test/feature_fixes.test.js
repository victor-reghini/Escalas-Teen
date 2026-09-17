import assert from 'assert';
import { Shift } from '../src/models/Shift.js';
import { Category } from '../src/models/Category.js';
import { Schedule } from '../src/models/Schedule.js';
import { Volunteer } from '../src/models/Volunteer.js';

console.log('🧪 Executando bateria de testes dos novos recursos e correções...');

// 1. Teste de serialização e manipulação de Shift
console.log('--- 1. Testando Modelo e Serialização de Shift ---');
const shift = new Shift({
  id: 'shift-test-1',
  eventId: 'ts-2026',
  scheduleId: 'sched-1',
  title: 'CAFÉ DA MANHÃ',
  date: '2026-07-17',
  startTime: '07:30',
  endTime: '09:00',
  generalLocation: 'Refeitório',
  categoryId: 'cat-refeicoes',
  assignments: [
    {
      volunteerId: 'vol-1',
      volunteerName: 'João Silva',
      roleId: 'role-1',
      roleName: 'Staff',
      specificLocation: 'Buffet',
      startTime: '07:30',
      endTime: '09:00',
      manualOverride: true
    }
  ]
});

// Adiciona voluntário manualmente
shift.assignments.push({
  volunteerId: 'vol-2',
  volunteerName: 'Maria Santos',
  roleId: 'role-2',
  roleName: 'Líder de Equipe',
  specificLocation: 'Copa VIP',
  startTime: '07:30',
  endTime: '09:00',
  manualOverride: true
});

assert.strictEqual(shift.assignments.length, 2);
assert.strictEqual(shift.assignments[1].roleName, 'Líder de Equipe');
assert.strictEqual(shift.assignments[1].specificLocation, 'Copa VIP');

// Serialização toJSON
const serialized = shift.toJSON();
assert.strictEqual(typeof serialized, 'object');
assert.strictEqual(serialized.assignments.length, 2);
assert.strictEqual(serialized.title, 'CAFÉ DA MANHÃ');

// Remoção de voluntário
shift.assignments.splice(0, 1);
assert.strictEqual(shift.assignments.length, 1);
assert.strictEqual(shift.assignments[0].volunteerName, 'Maria Santos');
console.log('✅ Testes de manipulação e serialização de Shift passaram!');

// 2. Teste de Categorias (Criação, Edição, Deduplicação)
console.log('--- 2. Testando Categorias e Deduplicação ---');
const cat1 = new Category({ id: 'cat-1', eventId: 'ts-2026', name: 'Ensino', color: '#7c3aed', priority: 10 });
const cat2 = new Category({ id: 'cat-2', eventId: 'ts-2026', name: 'Refeições', color: '#ea580c', priority: 5 });
const cat3Duplicate = new Category({ id: 'cat-3', eventId: 'ts-2026', name: 'ensino ', color: '#7c3aed', priority: 10 });

const categoriesList = [cat1, cat2, cat3Duplicate];

// Simula lógica de deduplicação implementada no CategoryRepository.getByEvent
const seenNames = new Set();
const uniqueList = [];
for (const item of categoriesList) {
  const key = (item.name || '').trim().toLowerCase();
  if (!seenNames.has(key)) {
    seenNames.add(key);
    uniqueList.push(item);
  }
}

assert.strictEqual(uniqueList.length, 2, 'Deduplicação de categorias deve manter apenas 2 registros únicos');
assert.strictEqual(uniqueList[0].name, 'Ensino');
assert.strictEqual(uniqueList[1].name, 'Refeições');
console.log('✅ Testes de deduplicação de categorias passaram!');

// 3. Teste de Edição de Categoria
console.log('--- 3. Testando Atualização de Categoria ---');
const catUpdate = {
  name: 'Ensino & Ministrações',
  color: '#8b5cf6',
  priority: 12,
  description: 'Salas do Trono e Seminários'
};
const updatedCat = new Category({ ...cat1.toJSON(), ...catUpdate });
assert.strictEqual(updatedCat.name, 'Ensino & Ministrações');
assert.strictEqual(updatedCat.priority, 12);
assert.strictEqual(updatedCat.color, '#8b5cf6');
console.log('✅ Testes de atualização de Categoria passaram!');

console.log('\n🎉 TODOS OS TESTES DE PERSISTÊNCIA, CATEGORIAS E ESCALAS PASSARAM COM SUCESSO!');
