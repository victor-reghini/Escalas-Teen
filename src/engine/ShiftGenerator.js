import { Shift } from '../models/Shift.js';
import { PreferenceSolver } from './PreferenceSolver.js';
import { CandidateScorer } from './CandidateScorer.js';
import { RoleRotator } from './RoleRotator.js';
import { availabilityChecker } from './AvailabilityChecker.js';

/**
 * Motor Principal de Geração Automática de Escalas
 */
export class ShiftGenerator {
  /**
   * Executa a geração de escalas para todas as programações do evento
   * @param {Object} params
   * @param {string} params.eventId
   * @param {Array} params.volunteers
   * @param {Array} params.schedules
   * @param {Array} params.categories
   * @param {Array} params.feedbacks
   * @param {Array} params.existingShifts - Escalas já salvas ou aprovadas
   * @returns {Object} { generatedShifts, warnings, summary }
   */
  static generate({
    eventId,
    volunteers,
    schedules,
    categories = [],
    feedbacks = [],
    existingShifts = []
  }) {
    const warnings = [];
    const generatedShifts = [];
    
    // Mantém estado dinâmico das escalas geradas durante a execução
    const workingShifts = [...(existingShifts || [])];

    // 1. Ordenação estratégica das programações (categorias prioritárias primeiro, depois cronológico)
    const strategicSchedules = PreferenceSolver.sortSchedulesByStrategicPriority(schedules, categories);

    for (const schedule of strategicSchedules) {
      const requiredCount = schedule.requiredVolunteers || 1;
      const rolesPool = [...(schedule.roles || [])];

      // Ranqueia os candidatos para esta programação
      const rankedCandidates = CandidateScorer.rankCandidates({
        volunteers,
        schedule,
        allSchedules: schedules,
        currentAssignedShifts: workingShifts,
        categories,
        feedbacks,
        checker: availabilityChecker
      });

      const eligibleCandidates = rankedCandidates.filter(c => c.eligible);
      const assignedVolunteers = [];
      const assignments = [];

      // Seleção dos melhores candidatos até preencher a quantidade necessária
      for (const candidate of eligibleCandidates) {
        if (assignedVolunteers.length >= requiredCount) break;

        // Evita duplicidade na mesma escala
        if (assignedVolunteers.some(v => v.id === candidate.volunteer.id)) continue;

        assignedVolunteers.push(candidate.volunteer);
      }

      // Se não atingiu o número necessário com voluntários 100% livres de reserva, tenta voluntários reservados
      if (assignedVolunteers.length < requiredCount) {
        const remainingNeeded = requiredCount - assignedVolunteers.length;
        warnings.push({
          scheduleId: schedule.id,
          scheduleTitle: schedule.title,
          needed: requiredCount,
          assigned: assignedVolunteers.length,
          message: `Escala "${schedule.title}" (${schedule.date} ${schedule.startTime}) necessita de ${requiredCount} voluntários mas apenas ${assignedVolunteers.length} foram alocados.`
        });
      }

      // Atribuição e rotação de funções para os voluntários selecionados
      const unassignedRoles = [...rolesPool];
      assignedVolunteers.forEach((volunteer, index) => {
        let assignedRole = null;

        if (unassignedRoles.length > 0) {
          // Seleciona a melhor função com base no histórico de rotação
          assignedRole = RoleRotator.selectBestRotatedRole(volunteer.id, unassignedRoles, workingShifts);
          const roleIndex = unassignedRoles.findIndex(r => (r.id && r.id === assignedRole.id) || (r.name && r.name === assignedRole.name));
          if (roleIndex !== -1) {
            unassignedRoles.splice(roleIndex, 1);
          }
        }

        const roleName = assignedRole ? (assignedRole.name || 'Staff') : (rolesPool[index] ? rolesPool[index].name : 'Geral');
        const specificLoc = assignedRole ? (assignedRole.specificLocation || schedule.generalLocation) : schedule.generalLocation;

        assignments.push({
          volunteerId: volunteer.id,
          volunteerName: volunteer.name,
          roleId: assignedRole ? assignedRole.id : `role-${index}`,
          roleName: roleName,
          specificLocation: specificLoc,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          manualOverride: false
        });
      });

      // Cria a entidade Shift gerada
      const shift = new Shift({
        id: `shift-${schedule.id}`,
        eventId,
        scheduleId: schedule.id,
        title: schedule.title,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        generalLocation: schedule.generalLocation,
        categoryId: schedule.categoryId,
        status: 'draft',
        assignments
      });

      generatedShifts.push(shift);
      // Atualiza a lista de trabalho para que as próximas escalas computem desgaste e conflito
      const existingIdx = workingShifts.findIndex(s => s.scheduleId === schedule.id);
      if (existingIdx !== -1) {
        workingShifts[existingIdx] = shift;
      } else {
        workingShifts.push(shift);
      }
    }

    return {
      generatedShifts,
      warnings,
      summary: {
        totalSchedules: schedules.length,
        totalShiftsGenerated: generatedShifts.length,
        fullyStaffed: schedules.length - warnings.length,
        partiallyStaffed: warnings.length
      }
    };
  }
}
