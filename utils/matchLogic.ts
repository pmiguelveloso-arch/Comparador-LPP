
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
  const coreWeight = isAiOptimized ? 7 : 4; // Increased weight for AI-derived stats

  // --- 1. CORE COMPATIBILITY ---
  // Compare racket stats vs Profile Target Stats
  score += coreWeight * Math.abs((racket.characteristics.power ?? 5) - profile.power);
  score += coreWeight * Math.abs((racket.characteristics.control ?? 5) - profile.control);
  
  // Secondary stats
  score += 3 * Math.abs((racket.characteristics.maneuverability ?? 5) - profile.maneuverability);
  score += 3 * Math.abs((racket.characteristics.sweetspot ?? 5) - profile.sweetspot);
  
  // --- 2. BIOMETRIC STABILITY (Weight/Height Logic) ---
  // Heavy players need mass for stability. Light players need maneuverability.
  if (profile.weight) {
    if (profile.weight > 90) {
       // Player is heavy/strong
       if (racket.weight_max < 365) score += 10; // Penalty: racket too light/unstable
    } else if (profile.weight < 65) {
       // Player is light
       if (racket.weight_min > 370) score += 15; // Penalty: racket too heavy
    }
  }

  // --- 3. TACTICAL & COURT CONTEXT ---
  
  // Smash Frequency (Overhead Aggression)
  if (profile.smash_frequency === 'high') {
      // High frequency smashers need head mass or aerodynamic shapes
      if (racket.balance === 'baixo') score += 15;
      if (racket.shape === 'redonda') score += 12;
      if ((racket.characteristics.power ?? 0) < 7) score += 8;
  } else if (profile.smash_frequency === 'low') {
      // Low smash freq: Avoid head-heavy diamonds that punish defense
      if (racket.shape === 'diamante' && racket.balance === 'alto') {
          score += 8;
      }
  }

  // Net Style (Volley Behavior)
  if (profile.net_style === 'aggressive') {
      // "Punch Volleys" - Needs maneuverability + rigidity
      if ((racket.characteristics.maneuverability ?? 0) < 7) score += 8;
      if ((racket.characteristics.rigidity ?? 0) < 6) score += 5; 
  } else if (profile.net_style === 'blocking') {
      // "Defensive Wall" - Needs sweetspot + stability
      if ((racket.characteristics.sweetspot ?? 0) < 8) score += 8;
      if ((racket.characteristics.control ?? 0) < 7) score += 4;
  }

  // Baseline Style (Defense)
  if (profile.baseline_style === 'lob') {
      // Precision lobs require control and manageable balance
      if ((racket.characteristics.control ?? 0) < 7) score += 6;
      if (racket.balance === 'alto') score += 6; 
  } else if (profile.baseline_style === 'counter') {
      // Fast transition - Needs high maneuverability
      if ((racket.characteristics.maneuverability ?? 0) < 8) score += 7;
  }

  // Game Pace
  if (profile.game_pace === 'fast') {
      // Fast game = needs maneuverability to react
      if (racket.weight_min > 370) score += 8; 
      if ((racket.characteristics.maneuverability ?? 0) < 7) score += 8;
  }

  // Court Type
  if (profile.court_type === 'outdoor') {
      // Outdoor balls get heavy/soft. Needs slightly harder racket or more power.
      if ((racket.characteristics.power ?? 0) < 6) score += 5;
  } else if (profile.court_type === 'indoor') {
      // Fast conditions. Control is premium.
      if ((racket.characteristics.control ?? 0) < 6) score += 5;
  }

  // --- 4. SENSORIAL PREFERENCE (Touch) - EXPLICIT USER PREFERENCE ---
  // Using a gradient distance function for smoother scoring based on rigidity
  if (profile.touch_preference) {
      let idealRigidity = 5;
      if (profile.touch_preference === 'soft') idealRigidity = 3;
      if (profile.touch_preference === 'medium') idealRigidity = 6;
      if (profile.touch_preference === 'hard') idealRigidity = 9;

      const rigidityDiff = Math.abs((racket.characteristics.rigidity ?? 5) - idealRigidity);
      
      // Weight of preference: 4 points per unit of difference
      score += rigidityDiff * 4;

      // Extra penalty for mismatches in comfort for soft-preference players
      if (profile.touch_preference === 'soft' && (racket.characteristics.comfort ?? 0) < 7) {
          score += 10;
      }
  }

  // --- 5. MEDICAL SAFEGUARDS (Veto Power) ---
  const hasArmInjury = profile.injuries?.some(i => ['Elbow', 'Shoulder'].includes(i));
  if (hasArmInjury) {
      // Veto logic for injuries
      score += 6 * Math.abs((racket.characteristics.comfort ?? 5) - 10); // Maximize comfort target (10)
      
      if ((racket.characteristics.rigidity ?? 0) > 6) score += 30; // Hard Veto on stiff rackets
      if (racket.balance === 'alto') score += 25; // Hard Veto on head heavy
      if (racket.weight_min > 370) score += 20; // Hard Veto on heavy rackets
      
      // Vibration dampening tech check (heuristic based on model/brand could go here, 
      // but relying on comfort stat is safer for generic logic)
  }

  // --- 6. BUDGET ---
  const priceString = racket.price_range.replace(/[^\d-]/g, '');
  const [minPrice, maxPrice] = priceString.split('-').map(Number);
  const avgPrice = (minPrice + (maxPrice || minPrice)) / 2;

  if (profile.budget === 'economy' && avgPrice > 160) score += 60; // Hard price out
  if (profile.budget === 'performance' && avgPrice > 260) score += 40;

  // Final Calc
  const matchPercentage = Math.max(0, 100 - score);
  return Math.round(matchPercentage);
}
