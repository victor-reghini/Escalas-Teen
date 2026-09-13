import assert from 'node:assert';
import { Volunteer } from '../src/models/Volunteer.js';
import { Schedule } from '../src/models/Schedule.js';
import { Category } from '../src/models/Category.js';
import { Shift } from '../src/models/Shift.js';
import { WearCalculator } from '../src/engine/WearCalculator.js';
import { AvailabilityChecker, availabilityChecker } from '../src/engine/AvailabilityChecker.js';
import { PreferenceSolver } from '../src/engine/PreferenceSolver.js';
import { RoleRotator } from '../src/engine/RoleRotator.js';
import { CandidateScorer } from '../src/engine/CandidateScorer.js';
import { ShiftGenerator } from '../src/engine/ShiftGenerator.js';

console.log('🧪 Iniciando testes unitários do Motor de Escalas...');

// 1. Teste de Disponibilidade
{
  const volIntegral = new Volunteer({ id: 'v1', type: 'integral', active: true });
  assert.strictEqual(availabilityChecker.isAvailableForSlot(volIntegral, '2026-07-17', '12:00', '14:00'), true, 'Integral deve estar disponível por padrão');

  // Indisponibilidade cadastrada
  const volIntegralWithUnavail = new Volunteer({
    id: 'v2',
    type: 'integral',
    active: true,
    unavailabilities: [{ day: '2026-07-17', startTime: '11:30', endTime: '13:00', justification: 'Dentista' }]
  });
  assert.strictEqual(availabilityChecker.isAvailableForSlot(volIntegralWithUnavail, '2026-07-17', '12:00', '14:00'), false, 'Integral com indisponibilidade deve retornar false');

  // Part-time com slots
  const volPartTime = new Volunteer({
    id: 'v3',
    type: 'part_time',
    active: true,
    availabilities: [{ day: '2026-07-17', startTime: '07:00', endTime: '12:00' }]
  });
  assert.strictEqual(availabilityChecker.isAvailableForSlot(volPartTime, '2026-07-17', '08:00', '11:00'), true, 'Part-time dentro do slot deve retornar true');
  assert.strictEqual(availabilityChecker.isAvailableForSlot(volPartTime, '2026-07-17', '13:00', '15:00'), false, 'Part-time fora do slot deve retornar false');

  console.log('✅ 1. Testes de Disponibilidade passaram!');
}

// 2. Teste de Desgaste (Wear Calculator)
{
  const vol1 = new Volunteer({ id: 'v1', type: 'integral', active: true });
  const sched1 = new Schedule({ id: 's1', date: '2026-07-17', startTime: '08:00', endTime: '10:00' });
  const sched2 = new Schedule({ id: 's2', date: '2026-07-17', startTime: '12:00', endTime: '14:00' });
  const sched3 = new Schedule({ id: 's3', date: '2026-07-17', startTime: '18:00', endTime: '20:00' });
  
  const allSchedules = [sched1, sched2, sched3];
  const assignedShifts = [
    new Shift({ scheduleId: 's1', date: '2026-07-17', startTime: '08:00', assignments: [{ volunteerId: 'v1' }] })
  ];

  const wearAtS2 = WearCalculator.calculateVolunteerWear(vol1, sched2, allSchedules, assignedShifts, availabilityChecker);
  // No momento de sched2, houveram 2 escalas (s1 e s2), e ele serviu 1 (em s1)
  assert.strictEqual(wearAtS2.servedShifts, 1);
  assert.strictEqual(wearAtS2.possibleShifts, 2);
  assert.strictEqual(wearAtS2.wearRatio, 0.5);

  console.log('✅ 2. Testes de Cálculo de Desgaste passaram!');
}

// 3. Teste de Preferência de Categoria e Reserva (Regra do Mateus)
{
  const catEnsino = new Category({ id: 'cat-ensino', name: 'Ensino/Sala do Trono', priority: 10 });
  const catRefeicao = new Category({ id: 'cat-refeicao', name: 'Refeição', priority: 2 });

  const schedRefeicao = new Schedule({
    id: 's-ref',
    title: 'Almoço',
    date: '2026-07-17',
    startTime: '12:00',
    endTime: '13:30',
    categoryId: 'cat-refeicao',
    requiredVolunteers: 1
  });

  const schedEnsino = new Schedule({
    id: 's-ens',
    title: 'Sala do Trono',
    date: '2026-07-17',
    startTime: '14:00',
    endTime: '16:00',
    categoryId: 'cat-ensino',
    requiredVolunteers: 1
  });

  const mateus = new Volunteer({
    id: 'mateus',
    name: 'MATEUS',
    type: 'integral',
    active: true,
    categoryPreferences: { 'cat-ensino': true }
  });

  const allSchedules = [schedRefeicao, schedEnsino];
  const categories = [catEnsino, catRefeicao];

  // Quando schedRefeicao está sendo avaliada antes de schedEnsino ser preenchida:
  const res = PreferenceSolver.isVolunteerReservedForFuturePrioritySchedule(
    mateus,
    schedRefeicao,
    allSchedules,
    [],
    categories,
    availabilityChecker
  );

  assert.strictEqual(res.isReserved, true, 'Mateus deve estar reservado para a escala de Ensino');

  // Agora se a escala de Ensino já estiver cheia com OUTRO voluntário:
  const filledEnsinoShift = [
    new Shift({ scheduleId: 's-ens', date: '2026-07-17', startTime: '14:00', assignments: [{ volunteerId: 'outro_vol' }] })
  ];

  const resAfterFilled = PreferenceSolver.isVolunteerReservedForFuturePrioritySchedule(
    mateus,
    schedRefeicao,
    allSchedules,
    filledEnsinoShift,
    categories,
    availabilityChecker
  );

  assert.strictEqual(resAfterFilled.isReserved, false, 'Mateus deve ser liberado para Refeição se Ensino já estiver cheio sem ele');

  console.log('✅ 3. Testes de Preferência de Categoria e Reserva (Regra do Mateus) passaram!');
}

// 4. Teste de Rotação de Funções
{
  const roles = [
    { id: 'r1', name: 'Copa' },
    { id: 'r2', name: 'Buffet' },
    { id: 'r3', name: 'Limpeza' }
  ];

  const pastShifts = [
    new Shift({ assignments: [{ volunteerId: 'v1', roleName: 'Copa' }] }),
    new Shift({ assignments: [{ volunteerId: 'v1', roleName: 'Copa' }] }),
    new Shift({ assignments: [{ volunteerId: 'v1', roleName: 'Buffet' }] })
  ];

  const bestRole = RoleRotator.selectBestRotatedRole('v1', roles, pastShifts);
  assert.strictEqual(bestRole.name, 'Limpeza', 'A função com menor frequência (Limpeza = 0) deve ser escolhida');

  console.log('✅ 4. Testes de Rotação de Funções passaram!');
}

// 5. Teste de Geração Automática Completa
{
  const catEnsino = new Category({ id: 'cat-ensino', name: 'Ensino', priority: 10 });
  const catRef = new Category({ id: 'cat-ref', name: 'Refeição', priority: 1 });

  const sched1 = new Schedule({
    id: 's1',
    title: 'Almoço',
    date: '2026-07-17',
    startTime: '12:00',
    endTime: '13:00',
    categoryId: 'cat-ref',
    requiredVolunteers: 2,
    roles: [{ id: 'r1', name: 'Servir' }, { id: 'r2', name: 'Limpeza' }]
  });

  const sched2 = new Schedule({
    id: 's2',
    title: 'Culto/Ensino',
    date: '2026-07-17',
    startTime: '14:00',
    endTime: '16:00',
    categoryId: 'cat-ensino',
    requiredVolunteers: 1,
    roles: [{ id: 'r3', name: 'Apoio' }]
  });

  const mateus = new Volunteer({ id: 'v-mateus', name: 'MATEUS', type: 'integral', active: true, categoryPreferences: { 'cat-ensino': true } });
  const lucas = new Volunteer({ id: 'v-lucas', name: 'LUCAS', type: 'integral', active: true });
  const joao = new Volunteer({ id: 'v-joao', name: 'JOAO', type: 'integral', active: true });

  const result = ShiftGenerator.generate({
    eventId: 'evt-1',
    volunteers: [mateus, lucas, joao],
    schedules: [sched1, sched2],
    categories: [catEnsino, catRef]
  });

  assert.strictEqual(result.generatedShifts.length, 2);
  const ensinoShift = result.generatedShifts.find(s => s.scheduleId === 's2');
  const refeicaoShift = result.generatedShifts.find(s => s.scheduleId === 's1');

  assert.strictEqual(ensinoShift.assignments[0].volunteerId, 'v-mateus', 'Mateus deve ter sido alocado na escala prioritária de Ensino');
  assert.strictEqual(refeicaoShift.assignments.some(a => a.volunteerId === 'v-mateus'), false, 'Mateus não deve estar em Refeição pois estava reservado para Ensino');

  console.log('✅ 5. Testes de Geração Completa passaram com 100% de sucesso!');
}

console.log('🎉 TODOS OS TESTES DO MOTOR DE ESCALAS PASSARAM COM SUCESSO!');
