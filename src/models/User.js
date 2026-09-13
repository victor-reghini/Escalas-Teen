/**
 * Entidade de Domínio: Usuário
 */
export class User {
  constructor({
    id = '',
    email = '',
    username = '',
    name = '',
    role = 'volunteer', // 'admin' | 'volunteer'
    phone = '',
    avatarUrl = '',
    eventIds = [],
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.email = email;
    this.username = username || (email ? email.split('@')[0] : '');
    this.name = name;
    this.role = role;
    this.phone = phone;
    this.avatarUrl = avatarUrl;
    this.eventIds = eventIds;
    this.createdAt = createdAt;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      name: this.name,
      role: this.role,
      phone: this.phone,
      avatarUrl: this.avatarUrl,
      eventIds: this.eventIds,
      createdAt: this.createdAt
    };
  }
}
