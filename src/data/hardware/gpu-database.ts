export interface GPUHardwareEntry {
  canonicalName: string;
  aliases: string[];
  family: string;
  tier: number; // 1 to 10 scale:
  // 1 = Vintage DirectX 8/9 entry (GeForce 2/3/4, Radeon 7000/8500, Intel Extreme Graphics, GMA 950/3100)
  // 2 = Integrated Gen 5-6 / Entry DX10 (Intel HD Graphics Ironlake/Arrandale, Intel HD 2000, GMA X4500, GeForce 6200/7300, Radeon X1300/HD 2400)
  // 3 = Capable Integrated / Entry Discrete (Intel HD 3000, Intel HD 4000, GeForce 8600 GT, 9600 GT, GT 220, GT 710, Radeon HD 5450, HD 6450)
  // 4 = Modern Integrated / Solid Budget (Intel HD 520, HD 620, UHD 620, UHD 630, Radeon Vega 3, Vega 8, GeForce GT 730, GT 1030, GTX 650)
  // 5 = Entry Gaming (GeForce GTX 750 Ti, GTX 960, GTX 1050, Radeon RX 460, RX 560)
  // 6 = Mid Gaming (GeForce GTX 1060, GTX 1660 Super, Radeon RX 580, RX 5500 XT)
  // 7+ = High End Gaming (RTX 2060, 3060, RX 6600, etc.)
  vramMB?: number;
  directX?: string;
  isIntegrated?: boolean;
}

export const GPU_DATABASE: GPUHardwareEntry[] = [
  // Vintage DirectX 8/9 (Tier 1)
  { canonicalName: 'Intel GMA 950', aliases: ['gma 950', 'intel gma 950', 'gma 3100', 'gma 3150'], family: 'Intel GMA', tier: 1, directX: '9.0c', isIntegrated: true },
  { canonicalName: 'NVIDIA GeForce 4 MX', aliases: ['geforce 4', 'geforce 4 mx', 'gf4', 'geforce 2', 'geforce 3'], family: 'NVIDIA GeForce', tier: 1, directX: '8.1' },
  { canonicalName: 'ATI Radeon 8500', aliases: ['radeon 8500', 'radeon 7500', 'radeon 9200', 'radeon 9000'], family: 'ATI Radeon', tier: 1, directX: '8.1' },
  { canonicalName: 'NVIDIA GeForce FX 5200', aliases: ['geforce fx 5200', 'fx 5200', 'fx5200', 'geforce fx'], family: 'NVIDIA GeForce', tier: 1, directX: '9.0' },

  // Tier 2: Early Intel HD Graphics & Entry DX10 (Matches generic "Intel HD Graphics" on Pentium P6200/Ironlake)
  {
    canonicalName: 'Intel HD Graphics (Gen 5 Ironlake)',
    aliases: [
      'intel hd graphics',
      'intel hd',
      'intel(r) hd graphics',
      'intel graphics media accelerator',
      'intel hd graphics (arrandale)',
      'intel hd graphics (ironlake)',
    ],
    family: 'Intel HD Graphics',
    tier: 2,
    directX: '10.0',
    isIntegrated: true,
  },
  { canonicalName: 'Intel HD Graphics 2000', aliases: ['hd 2000', 'intel hd 2000', 'intel(r) hd graphics 2000'], family: 'Intel HD Graphics', tier: 2, directX: '10.1', isIntegrated: true },
  { canonicalName: 'NVIDIA GeForce 6600 GT', aliases: ['geforce 6600', '6600 gt', 'geforce 6200', 'geforce 7300', 'geforce 7600 gs'], family: 'NVIDIA GeForce', tier: 2, directX: '9.0c' },
  { canonicalName: 'ATI Radeon X1600', aliases: ['radeon x1600', 'radeon x1300', 'radeon x800', 'radeon 9800 pro'], family: 'ATI Radeon', tier: 2, directX: '9.0c' },
  { canonicalName: 'ATI Radeon HD 2400', aliases: ['radeon hd 2400', 'hd 2400', 'hd 3450', 'hd 4350'], family: 'ATI Radeon', tier: 2, directX: '10.0' },

  // Tier 3: Capable Integrated (Sandy Bridge / Ivy Bridge) & GT 710
  { canonicalName: 'Intel HD Graphics 3000', aliases: ['hd 3000', 'intel hd 3000', 'intel(r) hd graphics 3000'], family: 'Intel HD Graphics', tier: 3, directX: '10.1', isIntegrated: true },
  { canonicalName: 'Intel HD Graphics 4000', aliases: ['hd 4000', 'intel hd 4000', 'intel(r) hd graphics 4000'], family: 'Intel HD Graphics', tier: 3, directX: '11.0', isIntegrated: true },
  { canonicalName: 'Intel HD Graphics 4400', aliases: ['hd 4400', 'intel hd 4400'], family: 'Intel HD Graphics', tier: 3, directX: '11.1', isIntegrated: true },
  { canonicalName: 'NVIDIA GeForce 8600 GT', aliases: ['8600 gt', 'geforce 8600', 'geforce 9600 gt', '9600 gt'], family: 'NVIDIA GeForce', tier: 3, directX: '10.0' },
  { canonicalName: 'NVIDIA GeForce GT 710', aliases: ['gt 710', 'geforce gt 710', 'gt 610'], family: 'NVIDIA GeForce', tier: 3, directX: '11.0' },
  { canonicalName: 'AMD Radeon HD 5450', aliases: ['hd 5450', 'radeon hd 5450', 'hd 6450'], family: 'AMD Radeon', tier: 3, directX: '11.0' },

  // Tier 4: Modern Integrated (Skylake/Kaby Lake/Comet Lake) & GT 1030
  { canonicalName: 'Intel HD Graphics 520', aliases: ['hd 520', 'intel hd 520', 'intel hd graphics 530', 'hd 530'], family: 'Intel HD Graphics', tier: 4, directX: '12.0', isIntegrated: true },
  { canonicalName: 'Intel UHD Graphics 620', aliases: ['uhd 620', 'intel uhd 620', 'intel uhd graphics 620', 'uhd graphics 620'], family: 'Intel UHD Graphics', tier: 4, directX: '12.0', isIntegrated: true },
  { canonicalName: 'Intel UHD Graphics 630', aliases: ['uhd 630', 'intel uhd 630', 'intel uhd graphics 630', 'uhd graphics 630'], family: 'Intel UHD Graphics', tier: 4, directX: '12.0', isIntegrated: true },
  { canonicalName: 'Intel Iris Plus Graphics', aliases: ['iris plus', 'intel iris', 'iris plus graphics', 'intel iris graphics'], family: 'Intel Iris', tier: 4, directX: '12.0', isIntegrated: true },
  { canonicalName: 'AMD Radeon Vega 3', aliases: ['vega 3', 'radeon vega 3'], family: 'AMD Radeon Vega', tier: 4, isIntegrated: true },
  { canonicalName: 'AMD Radeon Vega 8', aliases: ['vega 8', 'radeon vega 8', 'radeon vega 7'], family: 'AMD Radeon Vega', tier: 4, isIntegrated: true },
  { canonicalName: 'NVIDIA GeForce GT 1030', aliases: ['gt 1030', 'geforce gt 1030', 'gt 730', 'geforce gt 730'], family: 'NVIDIA GeForce', tier: 4, directX: '12.0' },
  { canonicalName: 'NVIDIA GeForce GTX 650', aliases: ['gtx 650', 'geforce gtx 650', 'gtx 550 ti'], family: 'NVIDIA GeForce', tier: 4, directX: '11.0' },

  // Tier 5: Entry Dedicated Gaming
  { canonicalName: 'NVIDIA GeForce GTX 750 Ti', aliases: ['gtx 750 ti', '750 ti', 'geforce gtx 750'], family: 'NVIDIA GeForce', tier: 5, directX: '12.0' },
  { canonicalName: 'NVIDIA GeForce GTX 960', aliases: ['gtx 960', 'geforce gtx 960'], family: 'NVIDIA GeForce', tier: 5, directX: '12.0' },
  { canonicalName: 'NVIDIA GeForce GTX 1050', aliases: ['gtx 1050', '1050', 'gtx 1050 ti', '1050 ti'], family: 'NVIDIA GeForce', tier: 5, directX: '12.0' },
  { canonicalName: 'AMD Radeon RX 560', aliases: ['rx 560', 'radeon rx 560', 'rx 460', 'hd 7850'], family: 'AMD Radeon', tier: 5, directX: '12.0' },
  { canonicalName: 'Intel Iris Xe Graphics', aliases: ['iris xe', 'intel iris xe', 'intel iris xe graphics'], family: 'Intel Iris', tier: 5, directX: '12.0', isIntegrated: true },

  // Tier 6: Mid Gaming
  { canonicalName: 'NVIDIA GeForce GTX 1060', aliases: ['gtx 1060', '1060 6gb', '1060 3gb', 'gtx 1650', 'gtx 1660'], family: 'NVIDIA GeForce', tier: 6, directX: '12.0' },
  { canonicalName: 'AMD Radeon RX 580', aliases: ['rx 580', 'radeon rx 580', 'rx 570', 'rx 5500 xt'], family: 'AMD Radeon', tier: 6, directX: '12.0' },

  // Tier 7+: High Performance
  { canonicalName: 'NVIDIA GeForce RTX 3060', aliases: ['rtx 3060', 'rtx 2060', 'rtx 3050', 'rtx 4060'], family: 'NVIDIA GeForce', tier: 7, directX: '12.0' },
  { canonicalName: 'AMD Radeon RX 6600', aliases: ['rx 6600', 'rx 6700 xt', 'rx 7600'], family: 'AMD Radeon', tier: 7, directX: '12.0' },
];
