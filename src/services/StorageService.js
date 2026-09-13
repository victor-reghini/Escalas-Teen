import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DEFAULT_HEADER_IMG } from '../assets/defaultHeader.js';
import { DEFAULT_FOOTER_IMG } from '../assets/defaultFooter.js';

export class StorageService {
  /**
   * Converte arquivo local para Base64 Data URL
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Faz upload da imagem de cabeçalho ou rodapé para o Firebase Storage
   * com fallback automático para Base64
   */
  async uploadEventImage(eventId, file, type = 'header') {
    try {
      const extension = file.name.split('.').pop() || 'png';
      const storageRef = ref(storage, `events/${eventId}/${type}_${Date.now()}.${extension}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (e) {
      console.warn(`Upload para Firebase Storage falhou (${e.message}). Utilizando persistência Base64 local/Firestore.`);
      return await StorageService.fileToBase64(file);
    }
  }

  /**
   * Retorna a imagem de cabeçalho (personalizada ou padrão)
   */
  static getHeaderImage(event) {
    if (event && event.headerImageUrl && event.headerImageUrl.length > 50) {
      return event.headerImageUrl;
    }
    return DEFAULT_HEADER_IMG;
  }

  /**
   * Retorna a imagem de rodapé (personalizada ou padrão)
   */
  static getFooterImage(event) {
    if (event && event.footerImageUrl && event.footerImageUrl.length > 50) {
      return event.footerImageUrl;
    }
    return DEFAULT_FOOTER_IMG;
  }
}

export const storageService = new StorageService();
