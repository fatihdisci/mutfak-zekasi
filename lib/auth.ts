import { v4 as uuidv4 } from 'uuid';

export const getUserId = () => {
  // SSR (Sunucu tarafı) hatası almamak için kontrol
  if (typeof window === 'undefined') return '';
  
  // Tarayıcı hafızasına bak
  let id = localStorage.getItem('app_user_id');
  
  // Eğer yoksa yeni oluştur ve kaydet
  if (!id) {
    id = uuidv4();
    localStorage.setItem('app_user_id', id);
  }
  
  return id;
};