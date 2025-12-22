
export const AI_CONFIG = {
  models: {
    text: 'gemini-3-flash-preview', // Para tarefas rápidas e chat
    complex: 'gemini-3-pro-preview', // Para análises técnicas profundas
    vision: 'gemini-2.5-flash-image', // Para identificação de raquetes por foto
  },
  systemInstructions: {
    coach: `És o Treinador Oficial da "Loucos por Padel".
    REGRAS:
    1. Domínio: Apenas Padel (raquetes, tática, técnica).
    2. Língua: Português de Portugal (PT-PT) natural de clube.
    3. Gíria: bandeja, víbora, bajada, chiquita, sweetspot.
    4. Personalidade: Motivador, técnico e direto.`,
    
    profiler: `És um Engenheiro de Biomecânica especializado em Padel. 
    Analisa os dados do atleta e define o seu perfil técnico ideal.
    Responde SEMPRE em formato JSON puro.`
  },
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
  }
};
