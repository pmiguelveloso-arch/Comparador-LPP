
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerProfile, Racket } from "../types";
import { AI_CONFIG } from "../config/aiConfig";

/**
 * Função utilitária para limpar e converter a resposta da IA para JSON
 */
const parseAIJsonResponse = (text: string) => {
  try {
    // Remove possíveis blocos de código markdown (```json ... ```)
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Erro ao processar JSON da IA:", e);
    return null;
  }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function analyzeProfileWithAI(formData: Partial<PlayerProfile>): Promise<PlayerProfile> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analisa este perfil de jogador de Padel:
    ${JSON.stringify(formData, null, 2)}
    
    Gera um veredito técnico (aiAnalysis) em PT-PT e define os scores (1-10) para:
    power, control, comfort, maneuverability, rigidity, sweetspot.
  `;

  try {
    const response = await ai.models.generateContent({
      model: AI_CONFIG.models.complex,
      contents: prompt,
      config: {
        ...AI_CONFIG.generationConfig,
        systemInstruction: AI_CONFIG.systemInstructions.profiler,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            power: { type: Type.NUMBER },
            control: { type: Type.NUMBER },
            comfort: { type: Type.NUMBER },
            maneuverability: { type: Type.NUMBER },
            rigidity: { type: Type.NUMBER },
            sweetspot: { type: Type.NUMBER },
            aiAnalysis: { type: Type.STRING }
          },
          required: ["power", "control", "comfort", "maneuverability", "rigidity", "sweetspot", "aiAnalysis"]
        }
      }
    });

    const aiResult = parseAIJsonResponse(response.text || "{}");

    return {
      ...(formData as PlayerProfile),
      power: aiResult?.power || 5,
      control: aiResult?.control || 5,
      comfort: aiResult?.comfort || 5,
      maneuverability: aiResult?.maneuverability || 5,
      rigidity: aiResult?.rigidity || 5,
      sweetspot: aiResult?.sweetspot || 5,
      aiAnalysis: aiResult?.aiAnalysis || "A tua análise está pronta baseada nos teus dados biométricos."
    };

  } catch (error) {
    console.error("AI Profiler Error:", error);
    return {
      ...(formData as PlayerProfile),
      power: 5, control: 5, comfort: 5, maneuverability: 5, rigidity: 5, sweetspot: 7,
      aiAnalysis: "O motor de IA está em manutenção, mas os teus dados foram processados localmente para os matches."
    };
  }
}

export async function identifyRacketFromImage(file: File): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Identifica esta raquete de Padel. Responde em JSON com os campos: 
    "brand" (marca), "model" (modelo), "year" (ano), "analysis" (breve descrição em PT-PT) e "confidence" (0-100).
  `;

  try {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: AI_CONFIG.models.vision,
      contents: { parts: [imagePart, { text: prompt }] },
      config: { responseMimeType: "application/json" }
    });
    return parseAIJsonResponse(response.text || "{}");
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw new Error("Não foi possível identificar a raquete através da imagem.");
  }
}

export async function chatWithPadelCoach(
    history: {role: 'user' | 'model', text: string}[],
    profile: PlayerProfile | null, 
    comparedRackets: Racket[]
): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // Adiciona contexto de perfil e raquetes ao prompt de sistema implicitamente se houver
    const contextualInstruction = `${AI_CONFIG.systemInstructions.coach} 
    ${profile ? `Contexto do utilizador: ${profile.experience}, joga à ${profile.position}, estilo ${profile.style}.` : ""}
    ${comparedRackets.length > 0 ? `Raquetes em comparação: ${comparedRackets.map(r => r.model).join(", ")}.` : ""}`;

    try {
        const response = await ai.models.generateContent({
            model: AI_CONFIG.models.text,
            contents: contents,
            config: { 
              ...AI_CONFIG.generationConfig,
              systemInstruction: contextualInstruction 
            }
        });
        return response.text || "Estou a postos! O que queres saber sobre o teu jogo?";
    } catch (error) {
        return "Tive uma falha de comunicação no court. Podes repetir a pergunta?";
    }
}
