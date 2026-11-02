export type CompatibilityVerdict = 'can-run' | 'maybe' | 'not-recommended';

export type ComponentStatus = 'pass' | 'borderline' | 'fail' | 'unknown';

export interface ComponentEvaluation {
  component: 'ram' | 'cpu' | 'gpu' | 'storage' | 'os';
  status: ComponentStatus;
  meetsMinimum: boolean;
  meetsRecommended: boolean;
  userValue: string | number;
  minimumRequired: string | number;
  recommendedRequired: string | number;
  explanation: string;
}

export interface CompatibilityResult {
  verdict: CompatibilityVerdict;
  verdictLabel: string;
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  components: {
    ram: ComponentEvaluation;
    cpu: ComponentEvaluation;
    gpu: ComponentEvaluation;
    storage: ComponentEvaluation;
    os: ComponentEvaluation;
  };
  disclaimer: string;
}
