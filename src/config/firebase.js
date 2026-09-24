import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuração do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDauZ2m0UQQetx_RikxwVl2ZIAkKslD9nU",
  authDomain: "escalas-teen.firebaseapp.com",
  projectId: "escalas-teen",
  storageBucket: "escalas-teen.firebasestorage.app",
  messagingSenderId: "131365515663",
  appId: "1:131365515663:web:bd839fea54a853f1385bfa"
};

// Inicialização dos serviços Firebase (Auth & Storage)
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
