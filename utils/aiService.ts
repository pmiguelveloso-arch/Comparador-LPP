
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerProfile, Racket } from "../types";

// Lazy initialization holder
let aiClient: GoogleGenAI | null = null;

// Helper to safely get the API Key across different environments (Vite, Next, Webpack)
const getApiKey = (): string | undefined => {
  // 1. Try Vite (Vercel default for static React)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
      // @ts-ignore
      if (import.meta.env.API_KEY) return import.meta.env.API_KEY;
    }
  } catch (e) {}

  // 2. Try Node/Webpack (Standard process.env)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.API_KEY) return process.env.API_KEY;
      if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    }
  } catch (e) {}

  return undefined;
};

// Helper to safely get the client instance
const getAiClient = (): GoogleGenAI => {
  if (aiClient) return aiClient;

  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key not found in environment variables (VITE_API_KEY or API_KEY). AI features will be disabled.");
    // We throw specific error to be caught by feature handlers
    throw new Error("MISSING_API_KEY");
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

export async function analyzeProfileWithAI(formData: Partial<PlayerProfile>): Promise<PlayerProfile> {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are an expert Padel Equipment Coach and Biomechanics Analyst.
    Analyze the following player data and determine the OPTIMAL target racket specifications for them.
    
    Player Data:
    - Age: ${formData.age}
    - Gender: ${formData.gender}
    - Height: ${formData.height}cm
    - Weight: ${formData.weight}kg
    - Injuries: ${formData.injuries?.join(", ")}
    - Level: ${formData.experience}
    - Play Frequency: ${formData.frequency}
    - Court Position: ${formData.position}
    - Playstyle Archetype: ${formData.style}
    - Smash Frequency: ${formData.smash_frequency}
    - Court Type: ${formData.court_type}
    - Touch Preference: ${formData.touch_preference}
    
    New Tactical Data:
    - Net Style: ${formData.net_style} (e.g. Aggressive puncher vs Blocker)
    - Baseline Style: ${formData.baseline_style} (e.g. Lob Master vs Counter-attacker)
    - Game Pace: ${formData.game_pace}

    Rules for Analysis:
    1. Safety First: If they have elbow/shoulder injuries, you MUST lower the target Rigidity (<5) and maximize Comfort (>8).
    2. Physics: Heavier/stronger players can handle heavier/stiffer rackets. Lighter players need maneuverability.
    3. Tactical Correlations:
       - "Aggressive Net" players need high Maneuverability and medium-high balance.
       - "Lob Masters" need a larger sweetspot and possibly lower balance for control.
       - "Counter-attackers" need high reactivity (high maneuverability, medium rigidity).
    4. Provide a "Coach's Analysis" summary (max 40 words) explaining WHY you chose these specs based on their tactical DNA.
    5. **CRITICAL: The "aiAnalysis" text MUST be in PORTUGUESE (PT-PT).**

    Return the result in JSON format matching the schema.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            power: { type: Type.NUMBER, description: "Target Power (1-10)" },
            control: { type: Type.NUMBER, description: "Target Control (1-10)" },
            comfort: { type: Type.NUMBER, description: "Target Comfort (1-10)" },
            maneuverability: { type: Type.NUMBER, description: "Target Maneuverability (1-10)" },
            rigidity: { type: Type.NUMBER, description: "Target Rigidity (1-10)" },
            sweetspot: { type: Type.NUMBER, description: "Target Sweetspot (1-10)" },
            aiAnalysis: { type: Type.STRING, description: "Coach's analysis summary in Portuguese" }
          },
          required: ["power", "control", "comfort", "maneuverability", "rigidity", "sweetspot", "aiAnalysis"]
        }
      }
    });

    const aiResult = JSON.parse(response.text || "{}");

    // Merge AI results with the original form data
    const completeProfile: PlayerProfile = {
      ...(formData as PlayerProfile),
      power: aiResult.power || 5,
      control: aiResult.control || 5,
      comfort: aiResult.comfort || 5,
      maneuverability: aiResult.maneuverability || 5,
      rigidity: aiResult.rigidity || 5,
      sweetspot: aiResult.sweetspot || 5,
      aiAnalysis: aiResult.aiAnalysis || "Análise IA indisponível."
    };

    return completeProfile;

  } catch (error: any) {
    console.warn("AI Analysis unavailable or failed. Using fallback logic.", error.message);
    
    // Fallback logic if AI fails (e.g. no key, network error)
    let basePower = 5;
    let baseControl = 5;
    
    if (formData.style === 'ofensivo') { basePower = 8; baseControl = 5; }
    else if (formData.style === 'consistente') { basePower = 4; baseControl = 9; }
    
    // Safety override
    const hasInjury = formData.injuries?.some(i => i !== 'None');
    
    return {
      ...(formData as PlayerProfile),
      power: hasInjury ? Math.min(basePower, 6) : basePower,
      control: baseControl,
      comfort: hasInjury ? 9 : 5,
      maneuverability: 5,
      rigidity: hasInjury ? 4 : 6,
      sweetspot: 7,
      aiAnalysis: "Análise gerada via algoritmo local (IA Indisponível)."
    };
  }
}

// Helper to convert file to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function identifyRacketFromImage(file: File): Promise<any> {
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    Analyze this image of a Padel Racket.
    Identify the Brand, Model, and approximate Year.
    Also, estimate its Shape (Diamante, Lagrima, Redonda) based on the visual geometry.
    
    Return ONLY a JSON object with these fields:
    {
      "brand": "String (e.g. Bullpadel, Nox, Adidas)",
      "model": "String (e.g. Vertex 03, AT10, Metalbone)",
      "year": "String (e.g. 2023, 2024)",
      "shape": "String",
      "confidence": "Number (0-100)",
      "analysis": "Short visual description of why you identified this racket (max 20 words) in PORTUGUESE (PT-PT)"
    }
  `;

  try {
    const ai = getAiClient();
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { role: 'user', parts: [imagePart, { text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Vision Failed:", error);
    throw error;
  }
}

export async function chatWithPadelCoach(
    history: {role: 'user' | 'model', text: string}[],
    profile: PlayerProfile | null, 
    comparedRackets: Racket[]
): Promise<string> {
    const modelId = "gemini-2.5-flash";

    const profileContext = profile 
        ? `PLAYER PROFILE: Level: ${profile.experience}, Style: ${profile.style}, Position: ${profile.position}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Injuries: ${profile.injuries?.join(',')}, Touch Pref: ${profile.touch_preference}. Targets: Power ${profile.power}/10, Control ${profile.control}/10.`
        : "PLAYER PROFILE: Unknown/Guest (Ask them about their level and style if relevant).";

    const racketContext = comparedRackets.length > 0
        ? `RACKETS BEING COMPARED: ${comparedRackets.map(r => `${r.brand} ${r.model} (${r.year}) - Shape: ${r.shape}, Balance: ${r.balance}, Hardness: ${r.characteristics.rigidity}/10`).join(' VS ')}`
        : "RACKETS BEING COMPARED: None selected yet.";

    const systemPrompt = `
        You are "Coach AI", a world-class Padel Expert and Technical Consultant for "Loucos por Padel".
        
        YOUR GOAL: Help the user choose the perfect racket based on their profile and the rackets they are comparing.
        
        CONTEXT:
        ${profileContext}
        ${racketContext}

        GUIDELINES:
        1. Be concise, professional, but enthusiastic.
        2. If the user is comparing rackets, analyze which one fits their PROFILE better. Explain WHY based on physics (balance, weight, hardness).
        3. If there is a mismatch (e.g., beginner looking at a pro diamond racket), gently warn them and suggest why it might be difficult.
        4. If you lack info (e.g., injuries or level), ask the user specifically about it to refine your advice.
        5. Use formatting like bullet points for clarity.
        6. **IMPORTANT: ALWAYS RESPOND IN PORTUGUESE (PT-PT).**
        
        Answer the user's latest message based on this context.
    `;

    // Convert history to Gemini format
    const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] }, // System instruction as first user message for context
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
    ];

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: modelId,
            contents: contents
        });
        return response.text || "Estou a analisar os dados do campo... tenta perguntar novamente.";
    } catch (error) {
        console.error("Chat Error", error);
        return "Modo Offline: Não foi possível conectar ao treinador IA (Verifique a API Key).";
    }
}
