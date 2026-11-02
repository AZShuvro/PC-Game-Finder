import { SupportedOS } from './game';

export interface PCSpecs {
  ramGB: number;
  cpu: string;
  gpu: string;
  storageGB: number;
  operatingSystem: SupportedOS;
  lastUpdated?: string;
}

export const VALID_RAM_OPTIONS = [2, 3, 4, 6, 8, 12, 16, 24, 32, 64] as const;
export type ValidRAMOption = typeof VALID_RAM_OPTIONS[number];

export const VALID_OS_OPTIONS: SupportedOS[] = [
  'Windows XP',
  'Windows Vista',
  'Windows 7',
  'Windows 8.1',
  'Windows 10',
  'Windows 11',
  'Other',
];
