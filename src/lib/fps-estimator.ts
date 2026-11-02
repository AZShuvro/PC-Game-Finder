import { Game } from '../types/game';
import { PCSpecs } from '../types/pc-specs';
import { FPSEstimate, TargetPreset, TargetResolution } from '../types/fps';
import { evaluateCPU, evaluateGPU } from './hardware-tiers';

const RESOLUTION_SCALERS: Record<TargetResolution, number> = {
  '720p': 1.35,
  '900p': 1.15,
  '1080p': 1.0,
  '1440p': 0.65,
};

const PRESET_SCALERS: Record<TargetPreset, number> = {
  low: 1.3,
  medium: 1.0,
  high: 0.75,
};

export function estimateFPS(
  pc: PCSpecs | null,
  game: Game,
  resolution: TargetResolution = '1080p',
  preset: TargetPreset = 'medium'
): FPSEstimate {
  const disclaimer =
    'FPS values are approximate estimates, not measured benchmarks. Real performance depends on drivers, temperatures, background applications, game settings, and hardware condition.';

  if (!pc) {
    return {
      range: 'Configure PC Specs',
      minEstimatedFPS: 0,
      maxEstimatedFPS: 0,
      confidence: 'unavailable',
      verdictNote: 'Enter your computer specifications to view estimated performance.',
      disclaimer,
    };
  }

  const cpuEval = evaluateCPU(pc.cpu);
  const gpuEval = evaluateGPU(pc.gpu);

  // If both CPU and GPU are unknown, return honest uncertainty
  if (!cpuEval.isKnown && !gpuEval.isKnown) {
    return {
      range: 'Unavailable',
      minEstimatedFPS: 0,
      maxEstimatedFPS: 0,
      confidence: 'unavailable',
      verdictNote: 'FPS estimate unavailable for this unrecognized hardware configuration.',
      disclaimer,
    };
  }

  const minCpuTier = game.minimumRequirements.minCpuTier ?? 1;
  const minGpuTier = game.minimumRequirements.minGpuTier ?? 1;
  const recCpuTier = game.recommendedRequirements.recCpuTier ?? 2;
  const recGpuTier = game.recommendedRequirements.recGpuTier ?? 2;

  // Use conservative fallback if one is unknown
  const userCpuTier = cpuEval.isKnown ? cpuEval.tier : minCpuTier;
  const userGpuTier = gpuEval.isKnown ? gpuEval.tier : minGpuTier;

  // Identify bottleneck
  let bottleneck: 'cpu' | 'gpu' | 'ram' | 'none' = 'none';
  if (pc.ramGB < game.minimumRequirements.ramGB) {
    bottleneck = 'ram';
  } else if (userGpuTier < minGpuTier) {
    bottleneck = 'gpu';
  } else if (userCpuTier < minCpuTier) {
    bottleneck = 'cpu';
  }

  // Baseline FPS calculation at 1080p Medium
  // If user meets recommended requirements, baseline is ~60 FPS
  // If user meets minimum requirements, baseline is ~35-45 FPS
  // If user is below minimum requirements, baseline is < 25 FPS
  let baseFPS = 45;

  const gpuRelativeScore = (userGpuTier - minGpuTier) / Math.max(1, recGpuTier - minGpuTier);
  const cpuRelativeScore = (userCpuTier - minCpuTier) / Math.max(1, recCpuTier - minCpuTier);

  // Weighted average: GPU 60%, CPU 40%
  const overallRelativeScore = gpuRelativeScore * 0.6 + cpuRelativeScore * 0.4;

  if (overallRelativeScore >= 1.0) {
    baseFPS = 60 + Math.min(30, (overallRelativeScore - 1) * 20);
  } else if (overallRelativeScore >= 0) {
    baseFPS = 35 + overallRelativeScore * 25;
  } else {
    // Below minimum
    baseFPS = Math.max(15, 30 + overallRelativeScore * 15);
  }

  // RAM penalty if below minimum
  if (pc.ramGB < game.minimumRequirements.ramGB) {
    baseFPS *= 0.5;
  }

  // Apply Resolution and Preset scalers
  const resMult = RESOLUTION_SCALERS[resolution];
  const presetMult = PRESET_SCALERS[preset];
  const targetCalculated = baseFPS * resMult * presetMult;

  // Convert to honest, discrete ranges
  let range = '';
  let minFPS = 0;
  let maxFPS = 0;

  if (targetCalculated >= 70) {
    range = '60+ FPS';
    minFPS = 60;
    maxFPS = 90;
  } else if (targetCalculated >= 52) {
    range = '50–60 FPS';
    minFPS = 50;
    maxFPS = 60;
  } else if (targetCalculated >= 40) {
    range = '40–50 FPS';
    minFPS = 40;
    maxFPS = 50;
  } else if (targetCalculated >= 28) {
    range = '30–40 FPS';
    minFPS = 30;
    maxFPS = 40;
  } else if (targetCalculated >= 20) {
    range = '20–30 FPS';
    minFPS = 20;
    maxFPS = 30;
  } else {
    range = '< 20 FPS';
    minFPS = 10;
    maxFPS = 20;
  }

  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (!cpuEval.isKnown || !gpuEval.isKnown) {
    confidence = 'low';
  } else if (cpuEval.confidence === 'medium' || gpuEval.confidence === 'medium') {
    confidence = 'medium';
  }

  let verdictNote = '';
  if (minFPS >= 50) {
    verdictNote = `Smooth, fluid gameplay expected at ${resolution} on ${preset} preset.`;
  } else if (minFPS >= 30) {
    verdictNote = `Fully playable console-style target at ${resolution} on ${preset} preset.`;
  } else {
    verdictNote = `May experience frame drops. Consider lowering resolution to 720p or reducing preset to Low.`;
  }

  return {
    range,
    minEstimatedFPS: minFPS,
    maxEstimatedFPS: maxFPS,
    confidence,
    verdictNote,
    bottleneck,
    disclaimer,
  };
}
