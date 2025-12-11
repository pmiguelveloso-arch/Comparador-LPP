
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerProfile } from "../types";

// Initialize Gemini Client
// IMPORTANT: In a real production app, the API key should be handled securely (e.g., via backend proxy).
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    Return the result in JSON format matching the schema.
  `;

  try {
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
            aiAnalysis: { type: Type.STRING, description: "Coach's analysis summary" }
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
      aiAnalysis: aiResult.aiAnalysis || "AI Analysis unavailable."
    };

    return completeProfile;

  } catch (error) {
    console.error("AI Analysis Failed, falling back to local logic:", error);
    
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
      aiAnalysis: "Analysis generated via local offline algorithm (AI Unavailable)."
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
      "analysis": "Short visual description of why you identified this racket (max 20 words)"
    }
  `;

  try {
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
