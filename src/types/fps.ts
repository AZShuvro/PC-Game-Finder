export type TargetResolution = '720p' | '900p' | '1080p' | '1440p';
export type TargetPreset = 'low' | 'medium' | 'high';

export interface FPSEstimate {
  range: string; // e.g. "45–60 FPS", "30–45 FPS", "60+ FPS", "< 30 FPS"
  minEstimatedFPS: number;
  maxEstimatedFPS: number;
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
  verdictNote: string;
  bottleneck?: 'cpu' | 'gpu' | 'ram' | 'none';
  disclaimer: string;
}
