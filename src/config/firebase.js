import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyDauZ2m0UQQetx_RikxwVl2ZIAkKslD9nU",
  authDomain: "escalas-teen.firebaseapp.com",
  projectId: "escalas-teen",
  storageBucket: "escalas-teen.firebasestorage.app",
  messagingSenderId: "131365515663",
  appId: "1:131365515663:web:bd839fea54a853f1385bfa"
};

// Inicialização dos serviços Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Ativa persistência offline se suportada pelo navegador
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistência offline do Firestore falhou (múltiplas abas abertas).');
    } else if (err.code === 'unimplemented') {
      console.warn('Navegador não suporta persistência offline do Firestore.');
    }
  });
} catch (e) {
  // Ignora se já estiver ativo
}
