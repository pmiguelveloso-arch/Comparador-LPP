
import { PlayerProfile, Racket } from '../types';

export function getRacketMatch(racket: Racket): number {
  if (typeof window === 'undefined') return 0;

  const profileString = localStorage.getItem("player_profile");
  
  if (!profileString) return 0;
  
  const profile: PlayerProfile = JSON.parse(profileString);
  if (!profile.style) return 0;

  let penalty = 0;

  // --- 1. AI-OPTIMIZED TARGETS ---
  const isAiOptimized = !!profile.aiAnalysis && !profile.aiAnalysis.includes("unavailable");
  const coreWeight = isAiOptimized ? 12 : 6; 

  penalty += coreWeight * Math.abs((racket.characteristics.power ?? 5) - profile.power);
  penalty += coreWeight * Math.abs((racket.characteristics.control ?? 5) - profile.control);
  penalty += 5 * Math.abs((racket.characteristics.maneuverability ?? 5) - profile.maneuverability);
  penalty += 5 * Math.abs((racket.characteristics.sweetspot ?? 5) - profile.sweetspot);
  penalty += 5 * Math.abs((racket.characteristics.comfort ?? 5) - profile.comfort);

  // --- 2. TOUCH PREFERENCE ---
  if (profile.touch_preference) {
      let targetRigidity = 5;
      if (profile.touch_preference === 'soft') targetRigidity = 3;
      if (profile.touch_preference === 'medium') targetRigidity = 6;
      if (profile.touch_preference === 'hard') targetRigidity = 9;

      const rigidityDiff = Math.abs((racket.characteristics.rigidity ?? 5) - targetRigidity);
      penalty += rigidityDiff * 10;

      if (profile.touch_preference === 'soft' && (racket.characteristics.comfort ?? 0) < 7) {
          penalty += 15;
      }
  }

  // --- 3. WEIGHT PREFERENCE (NOVO) ---
  if (profile.weight_preference) {
      const racketAvgWeight = (racket.weight_min + racket.weight_max) / 2;
      const weightDiff = Math.abs(racketAvgWeight - profile.weight_preference);
      
      // Penalizar se o peso da raquete desviar muito do pretendido
      // Ex: Quer 350g, raquete tem 375g -> diff 25 * 1.5 = 37.5 penalty
      penalty += weightDiff * 1.5;

      // Penalidade extra para extremos perigosos (muito pesada para quem quer leve)
      if (profile.weight_preference <= 355 && racketAvgWeight > 370) {
          penalty += 25;
      }
  }

  // --- 4. BIOMETRIC & PHYSICAL LOGIC ---
  if (profile.weight) {
    if (profile.weight > 90 && (racket.weight_max || 375) < 365) {
       penalty += 15; // Demasiado leve para um jogador muito pesado/forte
    } else if (profile.weight < 65 && (racket.weight_min || 360) > 370) {
       penalty += 20; // Demasiado pesada para um jogador leve
    }
  }

  // --- 5. TACTICAL COMPATIBILITY ---
  if (profile.position === 'esquerda' && racket.shape === 'redonda') penalty += 12;
  if (profile.position === 'direita' && racket.shape === 'diamante' && racket.balance === 'alto') penalty += 15;
  if (profile.style === 'ofensivo' && racket.balance === 'baixo') penalty += 15;
  if (profile.style === 'consistente' && racket.balance === 'alto') penalty += 15;
  if (profile.net_style === 'aggressive' && (racket.characteristics.power ?? 0) < 7) penalty += 10;
  if (profile.net_style === 'blocking' && (racket.characteristics.sweetspot ?? 0) < 8) penalty += 10;

  // --- 6. MEDICAL SAFEGUARDS ---
  const hasArmInjury = profile.injuries?.some(i => ['Elbow', 'Shoulder', 'Wrist'].includes(i));
  if (hasArmInjury) {
      penalty += 15 * (10 - (racket.characteristics.comfort ?? 5));
      if ((racket.characteristics.rigidity ?? 0) > 7) penalty += 40; 
      if (racket.balance === 'alto') penalty += 30; 
      if (racket.weight_min > 370) penalty += 25; 
  }

  // --- 7. BUDGET VETO ---
  const priceString = racket.price_range.replace(/[^\d-]/g, '');
  const [minPrice, maxPrice] = priceString.split('-').map(Number);
  const avgPrice = (minPrice + (maxPrice || minPrice)) / 2;

  if (profile.budget === 'economy' && avgPrice > 165) penalty += 100;
  if (profile.budget === 'performance' && avgPrice > 270) penalty += 70;

  const matchPercentage = Math.max(0, 100 - (penalty / 2.5));
  return Math.round(matchPercentage);
}
