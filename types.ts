
export interface RacketCharacteristics {
  power: number;
  control: number;
  comfort: number;
  maneuverability: number;
  sweetspot: number;
  rigidity: number;
}

export interface Technology {
  label: string;
  note: string;
}

export interface Price {
  store: string;
  price: number;
  url: string;
  logo?: string;
}

export interface Racket {
  id: string;
  brand: string;
  model: string;
  year: string;
  image_url: string;
  price_range: string;
  shape: 'redonda' | 'lágrima' | 'diamante' | 'híbrida';
  balance: 'baixo' | 'médio' | 'alto';
  weight_min: number;
  weight_max: number;
  core_type: string;
  surface_type: string;
  roughness: 'Sim' | 'Não';
  characteristics: RacketCharacteristics;
  review_summary: string;
  technologies: Technology[];
  prices: Price[];
  isTrending?: boolean; // Editor's Choice Flag
  
  // New Fields
  targetPlayer?: string; // e.g. "Avançado / Profissional"
  gameStyle?: string;    // e.g. "Ataque Agressivo", "Controlo Total"
}

export interface Review {
  id: string;
  racketId: string;
  userId: string;
  userName: string;
  date: string;
  rating: number; // Overall Average (Calculated)
  characteristics: RacketCharacteristics; // Detailed Scores
  comment: string;
  playtime: string; // e.g. "1 Month", "6 Months"
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for auth check, usually hashed in real DB
  avatar?: string;
  savedProfile?: PlayerProfile;
  createdAt: string;
}

export interface PlayerProfile {
  name?: string;
  
  // Biometrics
  age: number;
  gender: 'M' | 'F' | 'Outro';
  height?: number; // cm
  weight?: number; // kg
  
  // Medical
  injuries: string[]; 

  // Context
  frequency: string;
  experience: string;
  court_type?: 'indoor' | 'outdoor' | 'mixed';
  budget: 'economy' | 'performance' | 'premium' | 'unlimited';

  // Playstyle & Tactics
  position: 'direita' | 'esquerda';
  style: 'ofensivo' | 'equilibrado' | 'consistente';
  smash_frequency?: 'low' | 'medium' | 'high'; // Defines overhead aggression
  
  // Advanced Tactics (New)
  net_style?: 'aggressive' | 'control' | 'blocking';
  baseline_style?: 'lob' | 'counter' | 'power';
  game_pace?: 'fast' | 'slow' | 'variable';

  // Preference
  touch_preference?: 'soft' | 'medium' | 'hard'; // Rubber feel preference

  // Calculated Specs Target (Internal use for algorithm)
  power: number;
  control: number;
  comfort: number;
  maneuverability: number;
  rigidity: number;
  sweetspot: number;
  weight_preference?: number; 
  
  // New field for AI text
  aiAnalysis?: string;
}
