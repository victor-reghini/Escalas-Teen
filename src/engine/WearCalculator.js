/**
 * Motor de Cálculo de Desgaste (Wear & Fatigue)
 * 
 * Regra:
 * - Voluntários Integrais: escalas_servidas / total_escalas_do_evento_ate_o_momento
 * - Voluntários Part-Time: escalas_servidas / total_escalas_nos_periodos_disponiveis_ate_o_momento
 * - Comparação com a média geral do grupo para equalização justa da carga de trabalho.
 */
export class WearCalculator {
  /**
   * Converte data e hora em timestamp para ordenação temporal
   */
  static parseDateTime(dateStr, timeStr) {
    if (!dateStr) return new Date(0);
    return new Date(`${dateStr}T${timeStr || '00:00'}:00`).getTime();
  }

  /**
   * Calcula o desgaste de um voluntário até o momento de uma determinada programação
   * @param {Object} volunteer - Entidade Volunteer
   * @param {Object} currentSchedule - Programação atual (ponto temporal)
   * @param {Array} allSchedules - Todas as programações do evento
   * @param {Array} allAssignedShifts - Todas as escalas com atribuições até o momento
   * @param {AvailabilityChecker} availabilityChecker - Instância para checar disponibilidade
   * @returns {Object} { servedShifts, possibleShifts, wearRatio, deviationFromMean }
   */
  static calculateVolunteerWear(volunteer, currentSchedule, allSchedules, allAssignedShifts, availabilityChecker) {
    const currentTimestamp = currentSchedule 
      ? this.parseDateTime(currentSchedule.date, currentSchedule.startTime)
      : Date.now();

    // 1. Quantidade de escalas servidas pelo voluntário antes ou até o momento atual
    let servedShifts = 0;
    (allAssignedShifts || []).forEach(shift => {
      const shiftTimestamp = this.parseDateTime(shift.date, shift.startTime);
      if (shiftTimestamp < currentTimestamp || (currentSchedule && shift.scheduleId === currentSchedule.id)) {
        const isAssigned = (shift.assignments || []).some(a => a.volunteerId === volunteer.id);
        if (isAssigned) {
          servedShifts++;
        }
      }
    });

    // 2. Total de escalas possíveis até o momento
    let possibleShifts = 0;
    (allSchedules || []).forEach(sched => {
      const schedTimestamp = this.parseDateTime(sched.date, sched.startTime);
      if (schedTimestamp <= currentTimestamp) {
        if (volunteer.isIntegral()) {
          // Integral: todas as programações ocorridas são potenciais
          possibleShifts++;
        } else {
          // Part-time: apenas programações nos períodos em que estava disponível
          if (availabilityChecker && availabilityChecker.isAvailableForSlot(volunteer, sched.date, sched.startTime, sched.endTime)) {
            possibleShifts++;
          }
        }
      }
    });

    // Prevenção de divisão por zero
    const safePossible = Math.max(possibleShifts, 1);
    const wearRatio = servedShifts / safePossible;

    return {
      servedShifts,
      possibleShifts,
      wearRatio: Math.min(Math.max(wearRatio, 0), 1)
    };
  }

  /**
   * Calcula a média geral de desgaste de todos os voluntários
   */
  static calculateGroupAverageWear(volunteers, currentSchedule, allSchedules, allAssignedShifts, availabilityChecker) {
    if (!volunteers || volunteers.length === 0) return 0;

    let totalRatio = 0;
    volunteers.forEach(v => {
      const wear = this.calculateVolunteerWear(v, currentSchedule, allSchedules, allAssignedShifts, availabilityChecker);
      totalRatio += wear.wearRatio;
    });

    return totalRatio / volunteers.length;
  }

  /**
   * Retorna a classificação e badge de desgaste (Baixo, Normal, Alto)
   */
  static getWearBadge(volunteerWearRatio, groupAverageWear) {
    const diff = volunteerWearRatio - groupAverageWear;
    if (diff > 0.25) {
      return { label: 'Desgaste Alto', level: 'high', color: '#ef4444', scorePenalty: 40 };
    }
    if (diff < -0.15) {
      return { label: 'Disponível / Descansado', level: 'low', color: '#10b981', scoreBonus: 25 };
    }
    return { label: 'Desgaste Normal', level: 'normal', color: '#3b82f6', scoreBonus: 0 };
  }
}
