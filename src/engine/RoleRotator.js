/**
 * Motor de Rotação de Funções (Role Rotation)
 * 
 * Regra:
 * Caso haja funções cadastradas na escala, elas devem ser rotacionadas
 * entre os voluntários a cada escala para garantir variedade e justiça.
 */
export class RoleRotator {
  /**
   * Conta o histórico de vezes que um voluntário executou cada função
   * @param {string} volunteerId 
   * @param {Array} allAssignedShifts 
   * @returns {Object} { [roleNameOrId]: count }
   */
  static getVolunteerRoleHistory(volunteerId, allAssignedShifts) {
    const history = {};
    (allAssignedShifts || []).forEach(shift => {
      (shift.assignments || []).forEach(assignment => {
        if (assignment.volunteerId === volunteerId) {
          const key = (assignment.roleName || assignment.roleId || 'Geral').toUpperCase();
          history[key] = (history[key] || 0) + 1;
        }
      });
    });
    return history;
  }

  /**
   * Sugere a melhor função disponível para um voluntário dentre as funções da programação
   * @param {string} volunteerId 
   * @param {Array} availableRoles - Funções ainda não preenchidas da programação
   * @param {Array} allAssignedShifts 
   * @returns {Object|null} Role selecionada
   */
  static selectBestRotatedRole(volunteerId, availableRoles, allAssignedShifts) {
    if (!availableRoles || availableRoles.length === 0) return null;
    if (availableRoles.length === 1) return availableRoles[0];

    const history = this.getVolunteerRoleHistory(volunteerId, allAssignedShifts);

    // Ordena as funções da menor quantidade de vezes que o voluntário já serviu nela
    const sortedRoles = [...availableRoles].sort((r1, r2) => {
      const k1 = (r1.name || r1.id || '').toUpperCase();
      const k2 = (r2.name || r2.id || '').toUpperCase();
      const count1 = history[k1] || 0;
      const count2 = history[k2] || 0;
      return count1 - count2;
    });

    return sortedRoles[0];
  }
}
