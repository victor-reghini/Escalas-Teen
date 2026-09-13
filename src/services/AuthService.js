import { auth } from '../config/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { userRepository } from '../repositories/UserRepository.js';
import { User } from '../models/User.js';

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  init() {
    return new Promise((resolve) => {
      let resolved = false;

      // Restaura sessão de Admin mestre se ativa
      if (localStorage.getItem('admin_session') === 'true') {
        this.currentUser = new User({
          id: 'admin-master',
          email: 'admin@escalas-teen.com',
          username: 'admin',
          name: 'Administrador Teen',
          role: 'admin'
        });
        resolved = true;
        this.notifyListeners();
        resolve(this.currentUser);
        return;
      }

      // Timeout de segurança para não travar o carregamento inicial da interface
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(this.currentUser);
        }
      }, 1500);

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            let userProfile = await userRepository.getById(firebaseUser.uid);
            if (!userProfile) {
              userProfile = new User({
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Usuário'),
                username: (firebaseUser.email ? firebaseUser.email.split('@')[0] : '').toLowerCase()
              });
              await userRepository.createOrUpdate(userProfile.toJSON()).catch(() => null);
            }
            this.currentUser = userProfile;
          } catch (e) {
            this.currentUser = new User({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Usuário',
              username: (firebaseUser.email ? firebaseUser.email.split('@')[0] : '').toLowerCase()
            });
          }
        } else {
          if (localStorage.getItem('admin_session') !== 'true') {
            this.currentUser = null;
          }
        }
        this.notifyListeners();
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(this.currentUser);
        }
      });
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser ? this.currentUser.isAdmin() : false;
  }

  onAuthChange(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentUser);
      } catch (e) {
        console.error('Erro no listener de auth:', e);
      }
    });
  }

  /**
   * Login flexível por E-mail ou Nome de Usuário
   * Suporta usuário admin com senha admin
   */
  async login(loginIdentifier, password) {
    if (!loginIdentifier || !password) {
      throw new Error('Informe o e-mail ou nome de usuário e a senha.');
    }

    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Verificação de credenciais de Administrador Mestre (admin / admin ou admin123)
    if ((cleanId === 'admin' || cleanId === 'admin@escalas-teen.com') && (cleanPass === 'admin' || cleanPass === 'admin123')) {
      const adminUser = new User({
        id: 'admin-master',
        email: 'admin@escalas-teen.com',
        username: 'admin',
        name: 'Administrador Teen',
        role: 'admin'
      });

      localStorage.setItem('admin_session', 'true');
      await userRepository.createOrUpdate(adminUser.toJSON()).catch(() => null);

      this.currentUser = adminUser;
      this.notifyListeners();
      return adminUser;
    }

    let email = cleanId;

    // Se não for formato de e-mail, busca o usuário pelo username no Firestore
    if (!email.includes('@')) {
      const userDoc = await userRepository.getByUsername(email);
      if (!userDoc || !userDoc.email) {
        throw new Error('Nome de usuário não encontrado.');
      }
      email = userDoc.email;
    }

    const cred = await signInWithEmailAndPassword(auth, email, password);
    let user = await userRepository.getById(cred.user.uid);
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  /**
   * Cadastro de novo usuário (apenas voluntários podem se auto-cadastrar)
   */
  async register({ email, username, password, name, role = 'volunteer', eventId = null }) {
    if (!email || !password || !name) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase();

    // Checa se o username já está em uso
    const existing = await userRepository.getByUsername(cleanUsername);
    if (existing) {
      throw new Error('Este nome de usuário já está em uso.');
    }

    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = new User({
      id: cred.user.uid,
      email: cleanEmail,
      username: cleanUsername,
      name: name.trim(),
      role: role || 'volunteer',
      eventIds: eventId ? [eventId] : []
    });

    await userRepository.createOrUpdate(user.toJSON());
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  async logout() {
    localStorage.removeItem('admin_session');
    try {
      await signOut(auth);
    } catch (e) {}
    this.currentUser = null;
    this.notifyListeners();
  }

  async resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
}

export const authService = new AuthService();
