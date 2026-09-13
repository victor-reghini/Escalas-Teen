/**
 * Entidade de Domínio: Evento
 */
export class Event {
  constructor({
    id = '',
    name = '',
    code = '',
    startDate = '',
    endDate = '',
    description = '',
    status = 'active', // 'active' | 'draft' | 'archived'
    allowVolunteerRegistration = true,
    openShiftVisibility = false, // false = apenas minhas escalas; true = todas
    autoGenerationEnabled = true,
    headerImageUrl = '',
    footerImageUrl = '',
    adminUids = [],
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.name = name;
    this.code = code || this.generateCode(name);
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.status = status;
    this.allowVolunteerRegistration = allowVolunteerRegistration;
    this.openShiftVisibility = openShiftVisibility;
    this.autoGenerationEnabled = autoGenerationEnabled;
    this.headerImageUrl = headerImageUrl;
    this.footerImageUrl = footerImageUrl;
    this.adminUids = adminUids;
    this.createdAt = createdAt;
  }

  generateCode(name) {
    if (!name) return 'ts-event';
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      status: this.status,
      allowVolunteerRegistration: this.allowVolunteerRegistration,
      openShiftVisibility: this.openShiftVisibility,
      autoGenerationEnabled: this.autoGenerationEnabled,
      headerImageUrl: this.headerImageUrl,
      footerImageUrl: this.footerImageUrl,
      adminUids: this.adminUids,
      createdAt: this.createdAt
    };
  }
}
