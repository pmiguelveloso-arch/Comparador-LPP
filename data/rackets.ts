
import { Racket } from '../types';

// 2026 Models (New Generation)
import { vertex06_2026 } from './rackets/2026/bullpadel/vertex_06';
import { at10_18k_2026 } from './rackets/2026/nox/at10_18k_2026';
import { metalbone_3_5_2026 } from './rackets/2026/adidas/metalbone_3_5';
import { extreme_pro_2026 } from './rackets/2026/head/extreme_pro_2026';

// 2025 Models
import { vertex05_2025 } from './rackets/2025/bullpadel/vertex_05';
import { hack04_2025 } from './rackets/2025/bullpadel/hack_04';
import { at10_18k_2025 } from './rackets/2025/nox/at10_18k_2025';
import { metalbone_3_4_2025 } from './rackets/2025/adidas/metalbone_3_4';
import { extreme_pro_2025 } from './rackets/2025/head/extreme_pro_2025';
import { electra_st4_2025 } from './rackets/2025/siux/electra_st4';
import { technical_viper_2025 } from './rackets/2025/babolat/technical_viper_2025';

// 2024 Models
import { vertex04_2024 } from './rackets/2024/bullpadel/vertex_04';
import { at10_18k_2024 } from './rackets/2024/nox/at10_18k';
import { metalbone_3_3_2024 } from './rackets/2024/adidas/metalbone_3_3';
import { extreme_pro_2024 } from './rackets/2024/head/extreme_pro';
import { metheora_warrior_2024 } from './rackets/2024/starvie/metheora_warrior';

// 2023 Models
import { pr990_hybrid_soft_2023 } from './rackets/2023/kuikma/pr990_hybrid_soft';

export const RACKETS: Racket[] = [
  // 2026 (New Gen)
  vertex06_2026,
  at10_18k_2026,
  metalbone_3_5_2026,
  extreme_pro_2026,

  // 2025 (Flagships)
  vertex05_2025,
  hack04_2025,
  at10_18k_2025,
  metalbone_3_4_2025,
  extreme_pro_2025,
  electra_st4_2025,
  technical_viper_2025,

  // 2024
  vertex04_2024,
  at10_18k_2024,
  metalbone_3_3_2024,
  extreme_pro_2024,
  metheora_warrior_2024,

  // 2023
  pr990_hybrid_soft_2023
];

export const BRANDS = ["Bullpadel", "Nox", "Adidas", "Head", "Kuikma", "StarVie", "Babolat", "Siux"];
