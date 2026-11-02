import { CPU_DATABASE, HardwareEntry } from '../data/hardware/cpu-database';
import { GPU_DATABASE, GPUHardwareEntry } from '../data/hardware/gpu-database';

export interface EvaluatedHardware {
  canonicalName: string;
  family: string;
  tier: number;
  isKnown: boolean;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  originalInput: string;
}

function cleanInput(str: string): string {
  return str
    .toLowerCase()
    .replace(/®|™|\(r\)|\(tm\)/gi, '')
    .replace(/\bprocessor\b|\bcpu\b|\bgpu\b|\bgraphics\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateCPU(input: string): EvaluatedHardware {
  const raw = input.trim();
  if (!raw) {
    return {
      canonicalName: 'Unspecified CPU',
      family: 'Unknown',
      tier: 0,
      isKnown: false,
      confidence: 'unknown',
      originalInput: input,
    };
  }

  const cleaned = cleanInput(raw);

  // Exact or alias match
  for (const entry of CPU_DATABASE) {
    if (entry.aliases.some((alias) => cleaned === alias || cleaned.includes(alias))) {
      return {
        canonicalName: entry.canonicalName,
        family: entry.family,
        tier: entry.tier,
        isKnown: true,
        confidence: 'high',
        originalInput: raw,
      };
    }
  }

  // Heuristic matching based on series/generation patterns
  if (/i7\b|i9\b|ryzen\s*7|ryzen\s*9/i.test(cleaned)) {
    return {
      canonicalName: `High-End Processor (${raw})`,
      family: 'High-End Multi-Core',
      tier: 6,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/i5\b|ryzen\s*5/i.test(cleaned)) {
    return {
      canonicalName: `Mid-Range Processor (${raw})`,
      family: 'Mid-Range Multi-Core',
      tier: 4,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/i3\b|ryzen\s*3/i.test(cleaned)) {
    return {
      canonicalName: `Entry Dual/Quad Processor (${raw})`,
      family: 'Entry Multi-Core',
      tier: 3,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/pentium|celeron|athlon/i.test(cleaned)) {
    return {
      canonicalName: `Budget Processor (${raw})`,
      family: 'Budget / Low-Power',
      tier: 2,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  return {
    canonicalName: raw,
    family: 'Unrecognized CPU',
    tier: 0,
    isKnown: false,
    confidence: 'unknown',
    originalInput: raw,
  };
}

export function evaluateGPU(input: string): EvaluatedHardware {
  const raw = input.trim();
  if (!raw) {
    return {
      canonicalName: 'Unspecified GPU',
      family: 'Unknown',
      tier: 0,
      isKnown: false,
      confidence: 'unknown',
      originalInput: input,
    };
  }

  const cleaned = cleanInput(raw);

  // Exact or alias match in GPU database
  for (const entry of GPU_DATABASE) {
    if (entry.aliases.some((alias) => cleaned === alias || cleaned.includes(alias))) {
      return {
        canonicalName: entry.canonicalName,
        family: entry.family,
        tier: entry.tier,
        isKnown: true,
        confidence: 'high',
        originalInput: raw,
      };
    }
  }

  // Heuristic patterns for discrete & integrated GPUs
  if (/rtx\s*40|rtx\s*30|rx\s*7|rx\s*6/i.test(cleaned)) {
    return {
      canonicalName: `Modern Dedicated GPU (${raw})`,
      family: 'High-End Discrete GPU',
      tier: 7,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/gtx\s*16|gtx\s*10|rx\s*580|rx\s*570/i.test(cleaned)) {
    return {
      canonicalName: `Mid-Range Dedicated GPU (${raw})`,
      family: 'Mid-Range Discrete GPU',
      tier: 5,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/gtx\s*750|gtx\s*650|rx\s*550|gt\s*1030/i.test(cleaned)) {
    return {
      canonicalName: `Entry Dedicated GPU (${raw})`,
      family: 'Entry Discrete GPU',
      tier: 4,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/uhd|iris|vega/i.test(cleaned)) {
    return {
      canonicalName: `Modern Integrated Graphics (${raw})`,
      family: 'Modern Integrated Graphics',
      tier: 3,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  if (/hd\s*graphics|intel\s*hd|geforce\s*gt|radeon\s*hd/i.test(cleaned)) {
    return {
      canonicalName: `Integrated / Legacy GPU (${raw})`,
      family: 'Legacy Graphics',
      tier: 2,
      isKnown: true,
      confidence: 'medium',
      originalInput: raw,
    };
  }

  return {
    canonicalName: raw,
    family: 'Unrecognized GPU',
    tier: 0,
    isKnown: false,
    confidence: 'unknown',
    originalInput: raw,
  };
}
