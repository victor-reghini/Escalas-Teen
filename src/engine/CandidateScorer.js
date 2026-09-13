import { WearCalculator } from './WearCalculator.js';
import { AvailabilityChecker, availabilityChecker } from './AvailabilityChecker.js';
import { PreferenceSolver } from './PreferenceSolver.js';
import { RoleRotator } from './RoleRotator.js';

/**
 * Motor de Pontuação e Ranqueamento de Candidatos para Escalas
 */
export class CandidateScorer {
  /**
   * Avalia e pontua um voluntário para uma determinada programação
   * @returns {Object} { score, eligible, badges, wearInfo, conflictInfo, details }
   */
  static scoreCandidate({
    volunteer,
    schedule,
    allSchedules,
    currentAssignedShifts,
    categories,
    feedbacks = [],
    groupAverageWear = 0,
    checker = availabilityChecker
  }) {
    if (!volunteer || !volunteer.active) {
      return { score: -9999, eligible: false, reason: 'Voluntário inativo' };
    }

    const badges = [];
    let totalScore = 100; // Pontuação base

    // 1. CHECAGEM DE DISPONIBILIDADE
    const isAvailable = checker.isAvailableForSlot(volunteer, schedule.date, schedule.startTime, schedule.endTime);
    if (!isAvailable) {
      return {
        score: -9999,
        eligible: false,
        reason: 'Indisponível no horário cadastrado',
        badges: [{ label: 'Indisponível', level: 'danger', color: '#dc2626' }]
      };
    }

    // 2. CHECAGEM DE CONFLITOS DE ESCALAS EXISTENTES
    const conflict = checker.checkShiftConflicts(
      volunteer.id, 
      schedule.date, 
      schedule.startTime, 
      schedule.endTime, 
      currentAssignedShifts, 
      schedule.id
    );

    if (conflict.hasHardConflict) {
      return {
        score: -9999,
        eligible: false,
        reason: conflict.reason,
        badges: [{ label: 'Conflito de Horário', level: 'danger', color: '#dc2626' }]
      };
    }

    if (conflict.hasSoftConflict) {
      totalScore -= 35;
      badges.push({ label: 'Intervalo Curto', level: 'warning', color: '#d97706' });
    }

    // 3. PREFERÊNCIA DE CATEGORIA E RESERVA ESTRATÉGICA
    const isCategoryPreferred = volunteer.hasCategoryPreference(schedule.categoryId);
    if (isCategoryPreferred) {
      totalScore += 50;
      badges.push({ label: '★ Categoria Preferida', level: 'preference', color: '#8b5cf6' });
    }

    const reservation = PreferenceSolver.isVolunteerReservedForFuturePrioritySchedule(
      volunteer,
      schedule,
      allSchedules,
      currentAssignedShifts,
      categories,
      checker
    );

    if (reservation.isReserved) {
      totalScore -= 80;
      badges.push({ label: 'Reservado p/ Prioritária', level: 'caution', color: '#f59e0b' });
    }

    // 4. CÁLCULO DE DESGASTE (WEAR)
    const wearInfo = WearCalculator.calculateVolunteerWear(
      volunteer,
      schedule,
      allSchedules,
      currentAssignedShifts,
      checker
    );

    const wearBadge = WearCalculator.getWearBadge(wearInfo.wearRatio, groupAverageWear);
    if (wearBadge.level === 'high') {
      totalScore -= wearBadge.scorePenalty;
      badges.push({ label: wearBadge.label, level: 'wear-high', color: wearBadge.color });
    } else if (wearBadge.level === 'low') {
      totalScore += wearBadge.scoreBonus;
      badges.push({ label: wearBadge.label, level: 'wear-low', color: wearBadge.color });
    }

    // 5. AVALIAÇÃO DO ADMINISTRADOR (0 a 5 estrelas)
    const adminRating = volunteer.adminRating !== undefined ? volunteer.adminRating : 5;
    totalScore += (adminRating - 3) * 10; // +20 para 5 estrelas, -20 para 1 estrela

    // 6. FEEDBACK DO VOLUNTÁRIO EM ESCALAS ANTERIORES
    const volunteerFeedbacks = feedbacks.filter(f => f.volunteerId === volunteer.id && f.type === 'volunteer_feedback');
    if (volunteerFeedbacks.length > 0) {
      const avgFeedback = volunteerFeedbacks.reduce((sum, f) => sum + f.rating, 0) / volunteerFeedbacks.length;
      totalScore += (avgFeedback - 3) * 8;
    }

    // 7. EXPERIÊNCIA (Bônus para experiente em posições-chave)
    if (volunteer.experience === 'experiente') {
      totalScore += 5;
    } else {
      badges.push({ label: '1ª Vez', level: 'info', color: '#06b6d4' });
    }

    return {
      score: Math.round(totalScore),
      eligible: true,
      badges,
      wearInfo,
      conflictInfo: conflict,
      reservationInfo: reservation,
      isCategoryPreferred,
      adminRating
    };
  }

  /**
   * Ranqueia uma lista de voluntários para a programação atual
   */
  static rankCandidates({
    volunteers,
    schedule,
    allSchedules,
    currentAssignedShifts,
    categories,
    feedbacks = [],
    checker = availabilityChecker
  }) {
    const groupAverageWear = WearCalculator.calculateGroupAverageWear(
      volunteers,
      schedule,
      allSchedules,
      currentAssignedShifts,
      checker
    );

    const results = (volunteers || []).map(volunteer => {
      const evaluation = this.scoreCandidate({
        volunteer,
        schedule,
        allSchedules,
        currentAssignedShifts,
        categories,
        feedbacks,
        groupAverageWear,
        checker
      });

      return {
        volunteer,
        ...evaluation
      };
    });

    // Ordena: Primeiro os elegíveis com maior score, depois os não elegíveis
    results.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return b.score - a.score;
    });

    return results;
  }
}
