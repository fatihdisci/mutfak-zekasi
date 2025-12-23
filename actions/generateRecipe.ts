'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function getSmartRecipes(ingredients: string[], type: string) {
  try {
    // --- GÜNCELLEME: En kararlı model olan 1.5-flash'a geri döndük ---
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Sen profesyonel bir şefsin. Elimdeki malzemeler: ${ingredients.join(", ")}.
      
      Bu malzemelerle yapabileceğim, Türk damak tadına uygun 3 farklı yemek tarifi oluştur.
      
      Çok Önemli Kurallar:
      1. Yanıtın SADECE geçerli bir JSON formatında olmalı.
      2. JSON anahtarları (keys) KESİNLİKLE İngilizce olmalı: "title", "calories", "protein", "carbs", "fats", "ingredients", "instructions".
      3. "ingredients" ve "instructions" alanları kesinlikle String Array (Liste) olmalı.
      4. "ingredients" listesinde sadece malzeme isimleri ve miktarları olsun.
      5. "instructions" listesinde adım adım yapılışı olsun.

      Beklenen JSON Formatı Örneği:
      [
        {
          "title": "Mercimek Çorbası",
          "calories": 250,
          "protein": "15g",
          "carbs": "30g",
          "fats": "5g",
          "ingredients": ["1 su bardağı kırmızı mercimek", "1 adet soğan", "1 yemek kaşığı salça"],
          "instructions": ["Mercimekleri yıkayın.", "Soğanları doğrayıp kavurun.", "Suyu ekleyip kaynatın."]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    
    // Markdown ve fazlalık temizliği
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // JSON parse işlemi
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Hatası:", text);
      return { error: "AI yanıtı okunamadı, lütfen tekrar dene." };
    }

    // Dizi kontrolü (Tek bir tarif gelirse diziye çevir)
    if (!Array.isArray(data)) {
        if (data.recipes && Array.isArray(data.recipes)) {
            data = data.recipes;
        } else {
            data = [data];
        }
    }

    return data;

  } catch (error: any) {
    console.error("AI Genel Hatası:", error);
    return { error: `Model Hatası: ${error.message || "Bilinmeyen bir hata oluştu."}` };
  }
}