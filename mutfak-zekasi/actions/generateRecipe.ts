'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function getSmartRecipes(
  ingredients: string[], 
  userHistoryAnalysis: string = 'normal'
) {
  // GÜNCELLEME: 'gemini-pro' yerine 'gemini-1.5-flash' kullanıyoruz.
  // Flash modeli ücretsiz katman için çok daha stabil ve hızlıdır.
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Sen uzman bir diyetisyen ve şefsin.
    Elimdeki malzemeler: ${ingredients.join(", ")}. (Tuz, yağ, su var kabul et).
    
    Bana tam olarak 3 tarif öner. Çıktıyı SADECE aşağıdaki JSON formatında ver, başka metin yazma:
    [
      {
        "name": "Yemek Adı",
        "missing_ingredients": ["Eksik1", "Eksik2"],
        "calories": 500,
        "protein": 20,
        "carbs": 30,
        "fats": 10,
        "instructions": "Hazırlanışı...",
        "health_benefit": "Fayda..."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON temizleme (AI bazen ```json ekler)
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    // HATA DETAYI: Buradaki hata terminalinde (VS Code) görünecektir.
    console.error("GEMINI API HATASI DETAYI:", error);
    return []; 
  }
}