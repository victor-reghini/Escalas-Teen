/**
 * Motor de Validação de Disponibilidade e Conflitos de Horários
 */
export class AvailabilityChecker {
  /**
   * Converte 'HH:mm' em minutos do dia (0 a 1440)
   */
  static timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }

  /**
   * Verifica se dois intervalos [s1, e1] e [s2, e2] se sobrepõem
   */
  static isOverlap(s1, e1, s2, e2) {
    return Math.max(s1, s2) < Math.min(e1, e2);
  }

  /**
   * Verifica se um voluntário está disponível para um determinado dia e horário
   * @param {Object} volunteer - Entidade Volunteer
   * @param {string} date - 'YYYY-MM-DD'
   * @param {string} startTime - 'HH:mm'
   * @param {string} endTime - 'HH:mm'
   * @returns {boolean}
   */
  isAvailableForSlot(volunteer, date, startTime, endTime) {
    if (!volunteer || !volunteer.active) return false;

    const startMin = AvailabilityChecker.timeToMinutes(startTime);
    const endMin = AvailabilityChecker.timeToMinutes(endTime) || (startMin + 60);

    // 1. Checa indisponibilidades registradas (para qualquer tipo de voluntário)
    if (volunteer.unavailabilities && volunteer.unavailabilities.length > 0) {
      for (const unavail of volunteer.unavailabilities) {
        if (!unavail.day || unavail.day === date) {
          const uStart = AvailabilityChecker.timeToMinutes(unavail.startTime || '00:00');
          const uEnd = AvailabilityChecker.timeToMinutes(unavail.endTime || '23:59');
          if (AvailabilityChecker.isOverlap(startMin, endMin, uStart, uEnd)) {
            return false; // Conflito com indisponibilidade registrada
          }
        }
      }
    }

    // 2. Se for Integral, assume disponibilidade total (caso não haja indisponibilidade acima)
    if (volunteer.isIntegral()) {
      return true;
    }

    // 3. Se for Part-Time, deve cobrir o horário em pelo menos uma disponibilidade cadastrada
    if (volunteer.isPartTime()) {
      if (!volunteer.availabilities || volunteer.availabilities.length === 0) {
        return false; // Part-time sem disponibilidade cadastrada não pode ser escalado
      }

      let hasMatchingSlot = false;
      for (const avail of volunteer.availabilities) {
        // Se houver dia definido, deve bater com o dia da escala
        if (avail.day && avail.day !== date) continue;

        const aStart = AvailabilityChecker.timeToMinutes(avail.startTime || '00:00');
        const aEnd = AvailabilityChecker.timeToMinutes(avail.endTime || '23:59');

        // O slot de disponibilidade deve cobrir integralmente a duração da escala
        if (aStart <= startMin && aEnd >= endMin) {
          hasMatchingSlot = true;
          break;
        }
      }

      return hasMatchingSlot;
    }

    return true;
  }

  /**
   * Verifica se o voluntário já possui conflito com outra escala atribuída
   * @param {string} volunteerId 
   * @param {string} date 
   * @param {string} startTime 
   * @param {string} endTime 
   * @param {Array} currentAssignedShifts 
   * @param {string} excludeShiftId 
   * @param {number} bufferMinutes - Intervalo mínimo de descanso recomendado
   * @returns {Object} { hasHardConflict, hasSoftConflict, conflictingShift }
   */
  checkShiftConflicts(volunteerId, date, startTime, endTime, currentAssignedShifts, excludeShiftId = '', bufferMinutes = 15) {
    const startMin = AvailabilityChecker.timeToMinutes(startTime);
    const endMin = AvailabilityChecker.timeToMinutes(endTime);

    for (const shift of (currentAssignedShifts || [])) {
      if (shift.id === excludeShiftId || shift.scheduleId === excludeShiftId) continue;
      if (shift.date !== date) continue;

      const isAssigned = (shift.assignments || []).some(a => a.volunteerId === volunteerId);
      if (!isAssigned) continue;

      const sStart = AvailabilityChecker.timeToMinutes(shift.startTime);
      const sEnd = AvailabilityChecker.timeToMinutes(shift.endTime);

      // Conflito rígido: sobreposição direta
      if (AvailabilityChecker.isOverlap(startMin, endMin, sStart, sEnd)) {
        return {
          hasHardConflict: true,
          hasSoftConflict: true,
          conflictingShift: shift,
          reason: `Sobreposição de horário com a escala "${shift.title}" (${shift.startTime}-${shift.endTime})`
        };
      }

      // Conflito suave: intervalo muito curto (menos que o buffer de descanso)
      const distance = Math.min(Math.abs(startMin - sEnd), Math.abs(sStart - endMin));
      if (distance < bufferMinutes) {
        return {
          hasHardConflict: false,
          hasSoftConflict: true,
          conflictingShift: shift,
          reason: `Escala muito próxima de "${shift.title}" (${distance} min de intervalo)`
        };
      }
    }

    return { hasHardConflict: false, hasSoftConflict: false, conflictingShift: null, reason: null };
  }
}

export const availabilityChecker = new AvailabilityChecker();
