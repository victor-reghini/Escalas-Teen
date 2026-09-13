/**
 * Motor de Resolução de Preferências de Categoria e Reservas de Voluntários
 * 
 * Exemplo de Regra:
 * Se Mateus tem preferência por "Ensino", e há uma escala de "Refeição" antes ou próxima
 * de uma de "Ensino", Mateus é reservado para "Ensino" e NÃO alocado para "Refeição",
 * a menos que a de "Ensino" já esteja preenchida sem ele.
 */
export class PreferenceSolver {
  /**
   * Ordena as programações para garantir que escalas com categorias prioritárias
   * sejam processadas e preenchidas primeiro pelo gerador.
   * @param {Array} schedules 
   * @param {Array} categories 
   * @returns {Array} Programações ordenadas por prioridade estratégica
   */
  static sortSchedulesByStrategicPriority(schedules, categories) {
    const categoryMap = {};
    (categories || []).forEach(c => {
      categoryMap[c.id] = c;
    });

    return [...(schedules || [])].sort((a, b) => {
      const catA = categoryMap[a.categoryId];
      const catB = categoryMap[b.categoryId];

      const priorityA = catA ? (catA.priority || 1) : 0;
      const priorityB = catB ? (catB.priority || 1) : 0;

      // 1. Maior prioridade de categoria primeiro (ex: Ensino/Sala do Trono)
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // 2. Ordem cronológica (Data e Hora)
      const timeA = `${a.date}T${a.startTime || '00:00'}`;
      const timeB = `${b.date}T${b.startTime || '00:00'}`;
      return timeA.localeCompare(timeB);
    });
  }

  /**
   * Verifica se um voluntário está reservado para uma escala futura mais prioritária
   * @param {Object} volunteer 
   * @param {Object} currentSchedule 
   * @param {Array} allSchedules 
   * @param {Array} currentAssignedShifts 
   * @param {Array} categories 
   * @param {AvailabilityChecker} availabilityChecker 
   * @returns {Object} { isReserved, reservedForSchedule, reason }
   */
  static isVolunteerReservedForFuturePrioritySchedule(
    volunteer, 
    currentSchedule, 
    allSchedules, 
    currentAssignedShifts, 
    categories, 
    availabilityChecker
  ) {
    if (!volunteer.categoryPreferences || Object.keys(volunteer.categoryPreferences).length === 0) {
      return { isReserved: false };
    }

    const categoryMap = {};
    (categories || []).forEach(c => { categoryMap[c.id] = c; });

    const currentCat = categoryMap[currentSchedule.categoryId];
    const currentPriority = currentCat ? (currentCat.priority || 1) : 0;
    const currentScheduleHasPref = volunteer.hasCategoryPreference(currentSchedule.categoryId);

    // Se a programação atual já é de uma categoria preferida pelo voluntário, ele não precisa ser barrado
    if (currentScheduleHasPref) {
      return { isReserved: false };
    }

    const currentTimestamp = new Date(`${currentSchedule.date}T${currentSchedule.startTime || '00:00'}:00`).getTime();
    // Janela de reserva de proximidade (ex: até 6 horas à frente)
    const reservationWindowMs = 6 * 60 * 60 * 1000;

    // Procura escalas futuras dentro da janela que sejam da categoria preferida do voluntário
    for (const sched of allSchedules) {
      if (sched.id === currentSchedule.id) continue;
      if (!volunteer.hasCategoryPreference(sched.categoryId)) continue;

      const schedTimestamp = new Date(`${sched.date}T${sched.startTime || '00:00'}:00`).getTime();
      const diffMs = schedTimestamp - currentTimestamp;

      // Se a escala preferida ocorre logo em seguida (ou simultaneamente) dentro da janela
      if (diffMs >= 0 && diffMs <= reservationWindowMs) {
        // Checa se o voluntário é elegível para essa escala preferida
        const isEligible = availabilityChecker.isAvailableForSlot(volunteer, sched.date, sched.startTime, sched.endTime);
        if (!isEligible) continue;

        // Checa se a escala preferida já foi gerada/preenchida
        const assignedShift = (currentAssignedShifts || []).find(s => s.scheduleId === sched.id);
        if (assignedShift) {
          const isAlreadyAssignedInPref = (assignedShift.assignments || []).some(a => a.volunteerId === volunteer.id);
          const isFull = (assignedShift.assignments || []).length >= sched.requiredVolunteers;

          // Se a escala preferida já está cheia e o voluntário NÃO foi escalado nela, ele é liberado!
          if (isFull && !isAlreadyAssignedInPref) {
            continue; // Liberado para a escala atual (ex: Refeição)
          }

          if (isAlreadyAssignedInPref) {
            // Já está na preferida, não pode conflitar com a atual
            return {
              isReserved: true,
              reservedForSchedule: sched,
              reason: `Já escalado na sua categoria preferencial em "${sched.title}"`
            };
          }
        }

        // Se a escala preferida ainda não foi preenchida ou o voluntário é necessário nela
        const targetCat = categoryMap[sched.categoryId];
        const targetPriority = targetCat ? (targetCat.priority || 1) : 1;

        if (targetPriority >= currentPriority) {
          return {
            isReserved: true,
            reservedForSchedule: sched,
            reason: `Reservado para categoria preferencial "${targetCat ? targetCat.name : 'Especial'}" na programação "${sched.title}" (${sched.startTime})`
          };
        }
      }
    }

    return { isReserved: false };
  }
}
