'use server';

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// API Anahtarını Çevresel Değişkenlerden Al
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const analysisSchema = {
  description: "Yemek analizi çıktısı",
  type: SchemaType.OBJECT,
  properties: {
    food_name: { type: SchemaType.STRING, description: "Yemeğin kısa, özet başlığı (Örn: Öğle Yemeği - Tavuklu Salata)" },
    calories: { type: SchemaType.NUMBER, description: "Tahmini toplam kalori (kcal)" },
    protein: { type: SchemaType.NUMBER, description: "Tahmini protein (gram)" },
    carbs: { type: SchemaType.NUMBER, description: "Tahmini karbonhidrat (gram)" },
    fats: { type: SchemaType.NUMBER, description: "Tahmini yağ (gram)" },
    summary_text: { type: SchemaType.STRING, description: "Kullanıcıya hitaben yazılmış, kaloriyi ve içeriği özetleyen samimi bir cümle." },
  },
  required: ["food_name", "calories", "protein", "carbs", "fats", "summary_text"],
};

export async function analyzeMeal(text: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const prompt = `
      Sen uzman bir diyetisyensin. Kullanıcı sana gün içinde ne yediğini serbest metin olarak yazacak.
      Görevin:
      1. Metni analiz et ve içindeki yiyeceklerin toplam besin değerlerini (Kalori, Protein, Karbonhidrat, Yağ) tahmin et.
      2. "summary_text" alanına şu şablona uygun bir cümle yaz: "Bugün [Yemek İsimleri] yediniz. Bu öğünden yaklaşık [Kalori] kalori aldınız. [Kısa bir sağlık yorumu]."
      3. "food_name" alanına günlüğe kaydedilecek kısa bir başlık yaz.
      
      Kullanıcı Girdisi: "${text}"
      
      Yanıtı sadece Türkçe ve JSON formatında ver.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return JSON.parse(responseText);

  } catch (error: any) {
    console.error("Yemek Analiz Hatası:", error);
    return { error: "Yemek analizi yapılamadı. Lütfen tekrar deneyin." };
  }
}