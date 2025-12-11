
import { PlayerProfile, Racket } from '../types';

export function getRacketMatch(racket: Racket): number {
  const profileString = localStorage.getItem("player_profile");
  
  if (!profileString) return 0;
  
  const profile: PlayerProfile = JSON.parse(profileString);
  if (!profile.style) return 0;

  let score = 0;

  // --- 0. AI CONFIDENCE BOOST ---
  // If the profile was generated/analyzed by AI, we trust the numeric targets (Power, Control, etc.) 
  // much more than a simple heuristic. We increase the weight of the Core Stats comparison.
  const isAiOptimized = profile.aiAnalysis && !profile.aiAnalysis.includes("unavailable");
  const coreWeight = isAiOptimized ? 7 : 5; // Stricter adherence to target stats if AI calculated them

  // --- 1. CORE COMPATIBILITY ---
  // Compare racket stats vs Profile Target Stats
  score += coreWeight * Math.abs((racket.characteristics.power ?? 5) - profile.power);
  score += coreWeight * Math.abs((racket.characteristics.control ?? 5) - profile.control);
  
  // Secondary stats
  score += 3 * Math.abs((racket.characteristics.maneuverability ?? 5) - profile.maneuverability);
  score += 3 * Math.abs((racket.characteristics.sweetspot ?? 5) - profile.sweetspot);
  
  // --- 2. BIOMETRIC STABILITY (Weight/Height Logic) ---
  if (profile.weight && profile.weight > 85) {
     if (racket.weight_max < 365) score += 10; // Penalty for instability
  }
  if (profile.weight && profile.weight < 65) {
     if (racket.weight_min > 370) score += 12; // Penalty for unwieldy weight
  }

  // --- 3. TACTICAL & COURT CONTEXT ---
  
  // Smash Frequency
  if (profile.smash_frequency === 'high') {
      if (racket.balance === 'baixo') score += 15;
      if (racket.shape === 'redonda') score += 10;
  }

  // Net Style
  if (profile.net_style === 'aggressive') {
      // Needs balance but also maneuverability to move fast
      if (racket.characteristics.maneuverability < 6) score += 10;
  } else if (profile.net_style === 'blocking') {
      // Needs stability (sweetspot/control)
      if (racket.characteristics.sweetspot < 7) score += 8;
  }

  // Baseline Style
  if (profile.baseline_style === 'lob') {
      // Needs control
      if (racket.characteristics.control < 7) score += 6;
  }

  // Game Pace
  if (profile.game_pace === 'fast') {
      // Needs maneuverability
      if (racket.characteristics.maneuverability < 7) score += 8;
  }

  // Court Type
  if (profile.court_type === 'outdoor') {
      if (racket.core_type.includes('Hard')) score += 8;
  }

  // --- 4. SENSORIAL PREFERENCE (Touch) - EXPLICIT USER PREFERENCE ---
  // High weighting because this is a subjective "feel" that ruins user experience if wrong
  if (profile.touch_preference === 'soft') {
      if (racket.characteristics.rigidity > 6) score += 25; // Massive penalty
      if (racket.characteristics.comfort < 6) score += 10;
  } else if (profile.touch_preference === 'hard') {
      if (racket.characteristics.rigidity < 5) score += 25; // Massive penalty
  } else if (profile.touch_preference === 'medium') {
      if (racket.characteristics.rigidity > 8 || racket.characteristics.rigidity < 3) score += 15;
  }

  // --- 5. MEDICAL SAFEGUARDS (Veto Power) ---
  const hasArmInjury = profile.injuries?.some(i => ['Elbow', 'Shoulder'].includes(i));
  if (hasArmInjury) {
      score += 5 * Math.abs((racket.characteristics.comfort ?? 5) - 10);
      if (racket.characteristics.rigidity > 6) score += 30; // Hard Veto
      if (racket.balance === 'alto') score += 25; // Hard Veto
      if (racket.weight_min > 370) score += 15; 
  }

  // --- 6. BUDGET ---
  const priceString = racket.price_range.replace(/[^\d-]/g, '');
  const [minPrice, maxPrice] = priceString.split('-').map(Number);
  const avgPrice = (minPrice + (maxPrice || minPrice)) / 2;

  if (profile.budget === 'economy' && avgPrice > 160) score += 50; // Pricing out
  if (profile.budget === 'performance' && avgPrice > 260) score += 30;

  // Final Calc
  const matchPercentage = Math.max(0, 100 - score);
  return Math.round(matchPercentage);
}
