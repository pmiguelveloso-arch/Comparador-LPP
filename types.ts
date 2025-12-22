
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
  isTrending?: boolean; 
  
  // YouTube Integration
  youtubeIds?: string[];
  
  targetPlayer?: string; 
  gameStyle?: string;    
}

export interface Review {
  id: string;
  racketId: string;
  userId: string;
  userName: string;
  date: string;
  rating: number; 
  characteristics: RacketCharacteristics; 
  comment: string;
  playtime: string; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
  avatar?: string;
  savedProfile?: PlayerProfile;
  createdAt: string;
}

export interface PlayerProfile {
  name?: string;
  age: number;
  gender: 'M' | 'F' | 'Outro';
  height?: number; 
  weight?: number; 
  injuries: string[]; 
  frequency: string;
  experience: string;
  court_type?: 'indoor' | 'outdoor' | 'mixed';
  budget: 'economy' | 'performance' | 'premium' | 'unlimited';
  position: 'direita' | 'esquerda';
  style: 'ofensivo' | 'equilibrado' | 'consistente';
  smash_frequency?: 'low' | 'medium' | 'high'; 
  net_style?: 'aggressive' | 'control' | 'blocking';
  baseline_style?: 'lob' | 'counter' | 'power';
  game_pace?: 'fast' | 'slow' | 'variable';
  touch_preference?: 'soft' | 'medium' | 'hard'; 
  power: number;
  control: number;
  comfort: number;
  maneuverability: number;
  rigidity: number;
  sweetspot: number;
  weight_preference?: number; 
  aiAnalysis?: string;
}
