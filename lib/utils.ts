// Type Definitions (Veri kalıplarımız)
export type UserProfile = {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activity_level: string;
};

// Mifflin-St Jeor Formülü ile BMR Hesaplama
// Science: Bu formül güncel tıp literatüründe en doğru kabul edilen hesaplamadır.
export const calculateBMR = (profile: UserProfile): number => {
  let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
  
  if (profile.gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Aktivite çarpanı (Basitlik için sabit 1.2 - Sedanter aldık)
  // İleride burayı kullanıcının seçimine göre dinamik yapabiliriz.
  return Math.round(bmr * 1.375); // Hafif aktif
};