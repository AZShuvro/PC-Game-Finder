import { Game, SupportedOS } from '../types/game';
import { PCSpecs } from '../types/pc-specs';
import { CompatibilityResult, ComponentEvaluation, CompatibilityVerdict } from '../types/compatibility';
import { evaluateCPU, evaluateGPU } from './hardware-tiers';

const OS_RANK: Record<SupportedOS, number> = {
  'Windows XP': 1,
  'Windows Vista': 2,
  'Windows 7': 3,
  'Windows 8.1': 4,
  'Windows 10': 5,
  'Windows 11': 6,
  'Other': 3,
};

function checkOSCompatibility(userOS: SupportedOS, supportedList: SupportedOS[]): boolean {
  if (supportedList.includes(userOS)) return true;
  const userRank = OS_RANK[userOS] ?? 3;
  // Modern Windows (10/11) backwards compatibility with older Windows (XP, Vista, 7, 8.1)
  for (const os of supportedList) {
    const gameRank = OS_RANK[os] ?? 3;
    if (userRank >= gameRank) return true;
  }
  return false;
}

export function checkCompatibility(pc: PCSpecs, game: Game): CompatibilityResult {
  const minReq = game.minimumRequirements;
  const recReq = game.recommendedRequirements;

  // 1. RAM Evaluation
  const userRAM = pc.ramGB;
  const minRAM = minReq.ramGB;
  const recRAM = recReq.ramGB;
  const meetsMinRAM = userRAM >= minRAM;
  const meetsRecRAM = userRAM >= recRAM;

  let ramStatus: ComponentEvaluation['status'] = 'pass';
  let ramExplanation = '';

  if (!meetsMinRAM) {
    ramStatus = 'fail';
    ramExplanation = `Your ${userRAM} GB RAM is below the minimum ${minRAM} GB required by this title.`;
  } else if (!meetsRecRAM) {
    ramStatus = 'pass';
    ramExplanation = `Your ${userRAM} GB RAM meets the game's ${minRAM} GB minimum requirement, but is below the recommended ${recRAM} GB.`;
  } else {
    ramStatus = 'pass';
    ramExplanation = `Your ${userRAM} GB RAM satisfies both minimum (${minRAM} GB) and recommended (${recRAM} GB) specifications.`;
  }

  const ramEval: ComponentEvaluation = {
    component: 'ram',
    status: ramStatus,
    meetsMinimum: meetsMinRAM,
    meetsRecommended: meetsRecRAM,
    userValue: `${userRAM} GB`,
    minimumRequired: `${minRAM} GB`,
    recommendedRequired: `${recRAM} GB`,
    explanation: ramExplanation,
  };

  // 2. Storage Evaluation
  const userStorage = pc.storageGB;
  const minStorage = minReq.storageGB;
  const meetsStorage = userStorage >= minStorage;

  const storageEval: ComponentEvaluation = {
    component: 'storage',
    status: meetsStorage ? 'pass' : 'fail',
    meetsMinimum: meetsStorage,
    meetsRecommended: meetsStorage,
    userValue: `${userStorage} GB free`,
    minimumRequired: `${minStorage} GB required`,
    recommendedRequired: `${minStorage} GB required`,
    explanation: meetsStorage
      ? `You have ${userStorage} GB free space, which satisfies the ${minStorage} GB installation footprint.`
      : `Insufficient storage space. You have ${userStorage} GB free, but the game requires at least ${minStorage} GB.`,
  };

  // 3. OS Evaluation
  const osCompatible = checkOSCompatibility(pc.operatingSystem, game.supportedOperatingSystems);
  const osEval: ComponentEvaluation = {
    component: 'os',
    status: osCompatible ? 'pass' : 'fail',
    meetsMinimum: osCompatible,
    meetsRecommended: osCompatible,
    userValue: pc.operatingSystem,
    minimumRequired: minReq.operatingSystem || 'Windows 7',
    recommendedRequired: recReq.operatingSystem || 'Windows 10',
    explanation: osCompatible
      ? `${pc.operatingSystem} is compatible with this game's platform runtime.`
      : `${pc.operatingSystem} is not listed in the supported operating systems for this game.`,
  };

  // 4. CPU Evaluation
  const cpuEvalResult = evaluateCPU(pc.cpu);
  const minCpuTier = minReq.minCpuTier ?? 1;
  const recCpuTier = recReq.recCpuTier ?? 2;

  let cpuStatus: ComponentEvaluation['status'] = 'pass';
  let cpuMeetsMin = true;
  let cpuMeetsRec = false;
  let cpuExplanation = '';

  if (!cpuEvalResult.isKnown) {
    cpuStatus = 'unknown';
    cpuMeetsMin = false;
    cpuExplanation = `Could not confidently evaluate "${pc.cpu}". Manual verification recommended against requirement: ${minReq.cpu}.`;
  } else if (cpuEvalResult.tier >= recCpuTier) {
    cpuStatus = 'pass';
    cpuMeetsMin = true;
    cpuMeetsRec = true;
    cpuExplanation = `Identified as ${cpuEvalResult.canonicalName}. Exceeds both minimum and recommended CPU requirements.`;
  } else if (cpuEvalResult.tier >= minCpuTier) {
    cpuStatus = 'pass';
    cpuMeetsMin = true;
    cpuMeetsRec = false;
    cpuExplanation = `Identified as ${cpuEvalResult.canonicalName}. Meets minimum requirements for playable performance, with lower headroom for high settings.`;
  } else if (cpuEvalResult.tier === minCpuTier - 1) {
    cpuStatus = 'borderline';
    cpuMeetsMin = false;
    cpuExplanation = `Identified as ${cpuEvalResult.canonicalName}. Slightly below minimum requirement tier; may experience slowdowns or frame drops.`;
  } else {
    cpuStatus = 'fail';
    cpuMeetsMin = false;
    cpuExplanation = `Identified as ${cpuEvalResult.canonicalName}. Substantially below the minimum processor requirement (${minReq.cpu}).`;
  }

  const cpuEval: ComponentEvaluation = {
    component: 'cpu',
    status: cpuStatus,
    meetsMinimum: cpuMeetsMin,
    meetsRecommended: cpuMeetsRec,
    userValue: pc.cpu,
    minimumRequired: minReq.cpu,
    recommendedRequired: recReq.cpu,
    explanation: cpuExplanation,
  };

  // 5. GPU Evaluation
  const gpuEvalResult = evaluateGPU(pc.gpu);
  const minGpuTier = minReq.minGpuTier ?? 1;
  const recGpuTier = recReq.recGpuTier ?? 2;

  let gpuStatus: ComponentEvaluation['status'] = 'pass';
  let gpuMeetsMin = true;
  let gpuMeetsRec = false;
  let gpuExplanation = '';

  if (!gpuEvalResult.isKnown) {
    gpuStatus = 'unknown';
    gpuMeetsMin = false;
    gpuExplanation = `Could not confidently classify "${pc.gpu}". Compatibility depends on graphic driver support for ${minReq.gpu}.`;
  } else if (gpuEvalResult.tier >= recGpuTier) {
    gpuStatus = 'pass';
    gpuMeetsMin = true;
    gpuMeetsRec = true;
    gpuExplanation = `Identified as ${gpuEvalResult.canonicalName}. Fully satisfies recommended graphics hardware tier.`;
  } else if (gpuEvalResult.tier >= minGpuTier) {
    gpuStatus = 'pass';
    gpuMeetsMin = true;
    gpuMeetsRec = false;
    gpuExplanation = `Identified as ${gpuEvalResult.canonicalName}. Capable of running the game within minimum graphical parameters.`;
  } else if (gpuEvalResult.tier === minGpuTier - 1) {
    gpuStatus = 'borderline';
    gpuMeetsMin = false;
    gpuExplanation = `Identified as ${gpuEvalResult.canonicalName}. Below minimum graphics tier; may encounter shader or rendering performance issues.`;
  } else {
    gpuStatus = 'fail';
    gpuMeetsMin = false;
    gpuExplanation = `Identified as ${gpuEvalResult.canonicalName}. Does not meet the minimum graphics architecture requirement.`;
  }

  const gpuEval: ComponentEvaluation = {
    component: 'gpu',
    status: gpuStatus,
    meetsMinimum: gpuMeetsMin,
    meetsRecommended: gpuMeetsRec,
    userValue: pc.gpu,
    minimumRequired: minReq.gpu,
    recommendedRequired: recReq.gpu,
    explanation: gpuExplanation,
  };

  // 6. Overall Verdict Calculation
  // CRITICAL RULE:
  // - If any critical minimum requirement fails -> 'not-recommended'
  // - If no critical failure exists, but CPU or GPU is unknown or borderline -> 'maybe'
  // - If all minimum requirements are satisfied -> 'can-run'
  // Note: Meeting minimum requirements means CAN RUN. Being below recommended requirements must NOT result in MAYBE!
  const hasHardFailure =
    ramStatus === 'fail' ||
    storageEval.status === 'fail' ||
    osEval.status === 'fail' ||
    cpuStatus === 'fail' ||
    gpuStatus === 'fail';

  const hasUncertainty =
    cpuStatus === 'unknown' ||
    gpuStatus === 'unknown' ||
    cpuStatus === 'borderline' ||
    gpuStatus === 'borderline';

  let verdict: CompatibilityVerdict = 'can-run';
  let verdictLabel = 'Can Run';
  let summary = '';
  let confidence: 'high' | 'medium' | 'low' = 'high';

  if (hasHardFailure) {
    verdict = 'not-recommended';
    verdictLabel = 'Not Recommended';
    confidence = 'high';
    const failedParts: string[] = [];
    if (ramStatus === 'fail') failedParts.push('RAM');
    if (storageEval.status === 'fail') failedParts.push('Storage');
    if (osEval.status === 'fail') failedParts.push('Operating System');
    if (cpuStatus === 'fail') failedParts.push('Processor');
    if (gpuStatus === 'fail') failedParts.push('Graphics');
    summary = `Your PC falls short of the minimum requirements for ${failedParts.join(', ')}. The game may fail to launch or experience unplayable frame rates.`;
  } else if (hasUncertainty) {
    verdict = 'maybe';
    verdictLabel = 'Maybe';
    confidence = 'medium';
    summary = 'Your hardware is on the borderline or contains unverified components. The game may run on lower resolutions or settings, but performance may be inconsistent.';
  } else {
    verdict = 'can-run';
    verdictLabel = 'Can Run';
    confidence = 'high';
    if (!meetsRecRAM || !cpuMeetsRec || !gpuMeetsRec) {
      summary = `Your PC satisfies all minimum requirements to run ${game.title}. Playable on modest settings.`;
    } else {
      summary = `Your PC meets or exceeds both minimum and recommended requirements for ${game.title}. Expect a smooth experience!`;
    }
  }

  return {
    verdict,
    verdictLabel,
    summary,
    confidence,
    components: {
      ram: ramEval,
      cpu: cpuEval,
      gpu: gpuEval,
      storage: storageEval,
      os: osEval,
    },
    disclaimer:
      'Compatibility results are estimates based on available hardware and game requirement data. Actual performance may vary.',
  };
}
