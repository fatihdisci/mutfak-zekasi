'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function getSmartRecipes(ingredients: string[], type: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // JSON formatını zorluyoruz
    });

    const prompt = `
      Sen profesyonel bir şef ve diyetisyensin. Elimdeki malzemeler: ${ingredients.join(", ")}.
      
      Bana bu malzemelerle yapabileceğim, Türkiye damak tadına uygun 3 farklı yemek tarifi öner.
      
      KESİNLİKLE şu JSON formatında yanıt ver (başka metin ekleme):
      [
        {
          "title": "Yemeğin Adı",
          "calories": 500,
          "protein": "30g",
          "carbs": "40g",
          "fats": "10g",
          "ingredients": ["1 bardak un", "2 yumurta", "tuz"],
          "instructions": ["Unu kaba al", "Yumurtayı kır", "Çırp ve pişir"]
        }
      ]
      
      Notlar:
      - "ingredients" ve "instructions" kesinlikle Array (Liste) olmalı.
      - Kalori sadece sayı olsun.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // JSON parse işlemi
    const data = JSON.parse(text);
    return data;

  } catch (error: any) {
    console.error("AI Hatası:", error);
    return { error: "Tarif üretilirken bir sorun oluştu. Lütfen tekrar dene." };
  }
}