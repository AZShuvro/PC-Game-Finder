export interface HardwareEntry {
  canonicalName: string;
  aliases: string[];
  family: string;
  tier: number; // 1 to 10 scale:
  // 1 = Retro (Pentium III/IV, Athlon XP)
  // 2 = Basic/Older Dual Core (Core 2 Duo, Pentium P6000/P6200, Athlon 64 X2, Celeron dual core)
  // 3 = Capable Dual Core / Early Quad (Core 2 Quad, 1st/2nd Gen Core i3, AMD Phenom II)
  // 4 = Mainstream Quad Core (Core i5 2nd-4th Gen, Ryzen 3 1200, FX-6300)
  // 5 = Solid Midrange (Core i5 6th-8th Gen, Ryzen 5 1600/2600)
  // 6 = Modern Midrange (Core i5 9th-11th Gen, Ryzen 5 3600/5600)
  // 7+ = Modern High-End
  clockGHz?: number;
  cores?: number;
  notes?: string;
}

export const CPU_DATABASE: HardwareEntry[] = [
  // Retro / Entry (Tier 1)
  { canonicalName: 'Intel Pentium III', aliases: ['pentium 3', 'pentium iii', 'p3'], family: 'Intel Pentium', tier: 1, cores: 1 },
  { canonicalName: 'Intel Pentium 4', aliases: ['pentium 4', 'pentium iv', 'p4'], family: 'Intel Pentium', tier: 1, cores: 1 },
  { canonicalName: 'Intel Celeron D', aliases: ['celeron d', 'intel celeron'], family: 'Intel Celeron', tier: 1, cores: 1 },
  { canonicalName: 'AMD Athlon XP', aliases: ['athlon xp', 'amd athlon'], family: 'AMD Athlon', tier: 1, cores: 1 },

  // Older Dual-Cores / Budget Mobile (Tier 2) - includes Intel Pentium P6200!
  { canonicalName: 'Intel Pentium P6200', aliases: ['pentium p6200', 'p6200', 'intel p6200'], family: 'Intel Pentium', tier: 2, clockGHz: 2.13, cores: 2 },
  { canonicalName: 'Intel Pentium P6100', aliases: ['pentium p6100', 'p6100'], family: 'Intel Pentium', tier: 2, clockGHz: 2.0, cores: 2 },
  { canonicalName: 'Intel Core 2 Duo E4500', aliases: ['core 2 duo', 'core2 duo', 'c2d', 'core 2 duo e4500'], family: 'Intel Core 2', tier: 2, cores: 2 },
  { canonicalName: 'Intel Core 2 Duo E8400', aliases: ['e8400', 'core 2 duo e8400'], family: 'Intel Core 2', tier: 2, clockGHz: 3.0, cores: 2 },
  { canonicalName: 'AMD Athlon 64 X2', aliases: ['athlon 64 x2', 'athlon x2', 'amd x2'], family: 'AMD Athlon', tier: 2, cores: 2 },
  { canonicalName: 'Intel Pentium Dual-Core E2140', aliases: ['pentium dual-core', 'pentium dual core', 'pentium e2140', 'pentium e5400', 'pentium g2020', 'pentium g620'], family: 'Intel Pentium', tier: 2, cores: 2 },
  { canonicalName: 'Intel Celeron N4000', aliases: ['celeron n4000', 'celeron n4020', 'n4000', 'n4020', 'n3350'], family: 'Intel Celeron', tier: 2, cores: 2 },

  // Capable Multi-Core / Budget Modern (Tier 3)
  { canonicalName: 'Intel Core 2 Quad Q6600', aliases: ['q6600', 'core 2 quad', 'core2 quad'], family: 'Intel Core 2', tier: 3, clockGHz: 2.4, cores: 4 },
  { canonicalName: 'Intel Core i3-530', aliases: ['i3-530', 'i3 530', 'core i3 1st gen'], family: 'Intel Core i3', tier: 3, cores: 2 },
  { canonicalName: 'Intel Core i3-2100', aliases: ['i3-2100', 'i3 2100', 'core i3 2100'], family: 'Intel Core i3', tier: 3, clockGHz: 3.1, cores: 2 },
  { canonicalName: 'Intel Core i3-3220', aliases: ['i3-3220', 'i3 3220'], family: 'Intel Core i3', tier: 3, cores: 2 },
  { canonicalName: 'AMD Phenom II X4 955', aliases: ['phenom ii', 'phenom 2', 'phenom ii x4', 'phenom x4'], family: 'AMD Phenom', tier: 3, cores: 4 },
  { canonicalName: 'AMD Athlon 200GE', aliases: ['athlon 200ge', '200ge'], family: 'AMD Athlon', tier: 3, cores: 2 },
  { canonicalName: 'Intel Pentium Gold G6400', aliases: ['pentium gold', 'g6400', 'g5400'], family: 'Intel Pentium', tier: 3, cores: 2 },

  // Mainstream Quad (Tier 4)
  { canonicalName: 'Intel Core i5-2400', aliases: ['i5-2400', 'i5 2400', 'core i5 2nd gen'], family: 'Intel Core i5', tier: 4, clockGHz: 3.1, cores: 4 },
  { canonicalName: 'Intel Core i5-3470', aliases: ['i5-3470', 'i5 3470'], family: 'Intel Core i5', tier: 4, cores: 4 },
  { canonicalName: 'Intel Core i5-4460', aliases: ['i5-4460', 'i5 4460', 'core i5 4460'], family: 'Intel Core i5', tier: 4, clockGHz: 3.2, cores: 4 },
  { canonicalName: 'Intel Core i7-2600', aliases: ['i7-2600', 'i7 2600', 'core i7 2600'], family: 'Intel Core i7', tier: 4, cores: 4 },
  { canonicalName: 'AMD FX-6300', aliases: ['fx-6300', 'fx 6300', 'fx-8350', 'fx 8350'], family: 'AMD FX', tier: 4, cores: 6 },
  { canonicalName: 'AMD Ryzen 3 1200', aliases: ['ryzen 3 1200', 'r3 1200', 'ryzen 3 2200g'], family: 'AMD Ryzen 3', tier: 4, cores: 4 },

  // Solid Midrange (Tier 5)
  { canonicalName: 'Intel Core i5-6500', aliases: ['i5-6500', 'i5 6500', 'i5-7400'], family: 'Intel Core i5', tier: 5, cores: 4 },
  { canonicalName: 'Intel Core i7-4790K', aliases: ['i7-4790k', 'i7 4790', 'i7-6700', 'i7 6700'], family: 'Intel Core i7', tier: 5, cores: 4 },
  { canonicalName: 'AMD Ryzen 5 1600', aliases: ['ryzen 5 1600', 'r5 1600', 'ryzen 5 2600', 'r5 2600'], family: 'AMD Ryzen 5', tier: 5, cores: 6 },
  { canonicalName: 'Intel Core i3-10100', aliases: ['i3-10100', 'i3 10100', 'i3-12100'], family: 'Intel Core i3', tier: 5, cores: 4 },

  // Modern Midrange & High (Tier 6+)
  { canonicalName: 'AMD Ryzen 5 3600', aliases: ['ryzen 5 3600', 'r5 3600', 'ryzen 5 5600', 'r5 5600', '5600x'], family: 'AMD Ryzen 5', tier: 6, cores: 6 },
  { canonicalName: 'Intel Core i5-10400', aliases: ['i5-10400', 'i5 10400', 'i5-11400', 'i5-12400', '12400f'], family: 'Intel Core i5', tier: 6, cores: 6 },
  { canonicalName: 'AMD Ryzen 7 5700X', aliases: ['ryzen 7 5700x', 'ryzen 7 5800x', 'r7 5700x'], family: 'AMD Ryzen 7', tier: 7, cores: 8 },
  { canonicalName: 'Intel Core i7-12700K', aliases: ['i7-12700k', 'i7 12700', 'i7-13700k'], family: 'Intel Core i7', tier: 8, cores: 12 },
];
