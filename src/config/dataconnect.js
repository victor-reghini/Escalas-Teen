import { getDataConnect } from 'firebase/data-connect';
import { app } from './firebase.js';
import { connectorConfig } from '../dataconnect-generated/esm/index.esm.js';

// Inicialização segura da instância do Firebase Data Connect (PostgreSQL)
let dcInstance = null;
try {
  dcInstance = getDataConnect(app, connectorConfig);
} catch (e) {
  console.warn('Inicialização adiada do Data Connect:', e);
}

export const dataConnect = dcInstance;
export { connectorConfig };
