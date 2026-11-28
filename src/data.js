// Open FAIR SIS Benchmark Loader (Rome, Paris, London) + Verified Offline Fallback

export const WHO_THRESHOLD_DB = 53;

export const CITY_DATASETS = {
  rome: {
    key: 'rome',
    baselineElevationM: 21.0,
    rawUrl: 'https://raw.githubusercontent.com/spacelabdevteam-hub/sensory-impact-score-datasets/main/cities/01_rome/data/rome_sensory_impact_sis_v1.json',
    guideUrl: 'https://spacejourney.app/ciudad/roma/',
    hfUrl: 'https://huggingface.co/datasets/spacejourney/rome-sensory-impact-dataset',
    fallback: [
      {
        id: 'S-02',
        name: 'Via Appia Antica: The Basalt Rhythm',
        category: 'Secret Sanctuary',
        neighborhood: "Parco Regionale dell'Appia Antica",
        sis_score: 98,
        acoustic_noise_db: 34,
        golden_hour_window: '17:00 - 19:30 CET',
        elevation_m: 47.0,
        relative_relief_m: 26.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/via-appia-antica-the-rhythm-of-eternity/',
        description: 'Ancient Roman consular road shaded by umbrella pines with deep acoustic stillness.',
      },
      {
        id: 'L-05',
        name: 'Aventino Keyhole & Orange Garden',
        category: 'Free Restorative',
        neighborhood: 'Aventino',
        sis_score: 94,
        acoustic_noise_db: 40,
        golden_hour_window: '18:30 - 20:00 CET',
        elevation_m: 14.0,
        relative_relief_m: -7.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/the-orange-garden-and-the-secret-key/',
        description: 'Framed architectural perspective over St. Peter dome surrounded by fragrant citrus trees.',
      },
      {
        id: 'P-04',
        name: 'Vittoriano: Terrazza delle Quadrighe',
        category: 'Curated Premium',
        neighborhood: 'Piazza Venezia',
        sis_score: 94,
        acoustic_noise_db: 42,
        golden_hour_window: '18:15 - 19:40 CET',
        elevation_m: 28.0,
        relative_relief_m: 7.0,
        canonical_url: 'https://spacejourney.app/play/roma-atlas/',
        description: 'Panoramic glass elevator ascent above Imperial Rome during soft golden twilight.',
      },
    ],
  },
  paris: {
    key: 'paris',
    baselineElevationM: 35.0,
    rawUrl: 'https://raw.githubusercontent.com/spacelabdevteam-hub/sensory-impact-score-datasets/main/cities/02_paris/data/paris_sensory_dataset_v1.json',
    guideUrl: 'https://spacejourney.app/en/city/paris-en/',
    hfUrl: 'https://huggingface.co/datasets/spacejourney/paris-sensory-impact-dataset',
    fallback: [
      {
        id: 'PAR-14',
        name: 'Promenade Plantée: The Elevated Garden of Paris',
        category: 'Free Restorative',
        neighborhood: 'Bastille / 12ème Arrondissement',
        sis_score: 95,
        acoustic_noise_db: 42,
        golden_hour_window: '09:30 - 17:30 CET',
        elevation_m: 39.0,
        relative_relief_m: 4.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/promenade-plantee-the-elevated-garden-of-paris/',
        description: 'Linear botanical sanctuary perched atop a 19th-century brick railway viaduct.',
      },
      {
        id: 'PAR-10',
        name: 'Arènes de Lutèce: Echo of Roman Gaul',
        category: 'Secret Sanctuary',
        neighborhood: 'Latin Quarter / 5ème Arrondissement',
        sis_score: 92,
        acoustic_noise_db: 46,
        golden_hour_window: '11:30 - 16:30 CET',
        elevation_m: 52.0,
        relative_relief_m: 17.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/arenes-de-lutece-the-echo-of-roman-gaul/',
        description: 'First-century Gallo-Roman stone amphitheater sheltered behind quiet residential facades.',
      },
      {
        id: 'PAR-15',
        name: 'Parc des Buttes-Chaumont',
        category: 'Free Restorative',
        neighborhood: 'Belleville / 19ème Arrondissement',
        sis_score: 89,
        acoustic_noise_db: 50,
        golden_hour_window: '16:30 - 19:30 CET',
        elevation_m: 95.0,
        relative_relief_m: 60.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/parc-des-buttes-chaumont-the-temple-over-the-abyss/',
        description: 'Dramatic limestone cliffs, grottoes, and Temple de la Sibylle overlooking Paris.',
      },
    ],
  },
  london: {
    key: 'london',
    baselineElevationM: 11.0,
    rawUrl: 'https://raw.githubusercontent.com/spacelabdevteam-hub/sensory-impact-score-datasets/main/cities/03_london/data/london_sensory_impact_sis_v1.json',
    guideUrl: 'https://spacejourney.app/en/city/london/',
    hfUrl: 'https://huggingface.co/datasets/spacejourney/london-sensory-impact-dataset',
    fallback: [
      {
        id: 'L-02',
        name: 'Primrose Hill | London skyline',
        category: 'Free Restorative',
        neighborhood: 'Primrose Hill (Camden, North London)',
        sis_score: 97,
        acoustic_noise_db: 25,
        golden_hour_window: '06:00 - 07:30 GMT/BST',
        elevation_m: 55.0,
        relative_relief_m: 44.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/primrose-hill-london-skyline/',
        description: 'Protected dawn panorama above Regent Park with London lowest ambient acoustic floor.',
      },
      {
        id: 'S-04',
        name: "Barbican Conservatory: London's solarpunk oasis",
        category: 'Secret Sanctuary',
        neighborhood: 'City of London (Barbican Estate)',
        sis_score: 97,
        acoustic_noise_db: 40,
        golden_hour_window: '10:00 - 11:00 GMT/BST',
        elevation_m: 30.0,
        relative_relief_m: 19.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/barbican-conservatory-londons-solarpunk-oasis/',
        description: 'Brutalist concrete architecture peacefully reclaimed by over 2,000 tropical plant species.',
      },
      {
        id: 'L-03',
        name: 'St Dunstan in the East: The Garden Among the Ruins',
        category: 'Free Restorative',
        neighborhood: 'The Square Mile (City of London)',
        sis_score: 93,
        acoustic_noise_db: 45,
        golden_hour_window: '12:00 - 14:00 GMT/BST',
        elevation_m: 26.0,
        relative_relief_m: 15.0,
        canonical_url: 'https://spacejourney.app/en/experiencia/st-dunstan-in-the-east-the-garden-among-the-ruins/',
        description: 'Christopher Wren Gothic church ruins entwined with ivy and quiet courtyard fountains.',
      },
    ],
  },
};

export function decodeHtmlEntities(str = '') {
  return String(str)
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\[&hellip;\]/g, '...')
    .trim();
}

export function compactWindowLabel(windowStr = '17:30 - 19:00') {
  const cleaned = String(windowStr).replace(/(\d{1,2}:\d{2}):00\b/g, '$1').trim();
  const parts = cleaned.split(/\s+/);
  return parts.slice(0, 3).join(' ');
}

export function parseWindowHour(windowStr = '17:30') {
  const m = String(windowStr).match(/(\d{1,2}):(\d{2})/);
  if (!m) return 17.5;
  return Number(m[1]) + Number(m[2]) / 60;
}

export function normalizeSanctuary(raw, cityKey) {
  const cfg = CITY_DATASETS[cityKey] || CITY_DATASETS.rome;
  const db = Number(raw.acoustic_noise_db ?? raw.estimated_noise_db ?? 45);
  const sis = Number(raw.sis_score ?? 90);
  const elev = Number(raw.elevation_m ?? cfg.baselineElevationM);
  const relRelief = Number(raw.relative_relief_m ?? (elev - cfg.baselineElevationM));
  const win = raw.golden_hour_window || raw.optimal_window || '17:30 - 19:00';

  return {
    id: String(raw.id || 'NODE'),
    cityKey,
    name: decodeHtmlEntities(raw.name || 'Sanctuary Node'),
    category: String(raw.category || 'Restorative Sanctuary'),
    neighborhood: decodeHtmlEntities(raw.neighborhood || ''),
    sisScore: Math.max(0, Math.min(100, Math.round(sis))),
    noiseDb: Math.max(15, Math.min(85, Math.round(db))),
    whoCompliant: db <= WHO_THRESHOLD_DB,
    elevationM: Number.isFinite(elev) ? Number(elev.toFixed(1)) : cfg.baselineElevationM,
    relativeReliefM: Number.isFinite(relRelief) ? Number(relRelief.toFixed(1)) : 0,
    windowRaw: String(win),
    windowShort: compactWindowLabel(win),
    windowHour: parseWindowHour(win),
    canonicalUrl: String(raw.canonical_url || cfg.guideUrl),
    description: decodeHtmlEntities(raw.description || ''),
  };
}

const cache = new Map();

export async function loadCityDataset(cityKey = 'rome', fetchImpl = globalThis.fetch) {
  const cfg = CITY_DATASETS[cityKey] || CITY_DATASETS.rome;
  if (cache.has(cfg.key)) {
    return cache.get(cfg.key);
  }

  try {
    if (typeof fetchImpl !== 'function') {
      throw new Error('Fetch unavailable');
    }
    const res = await fetchImpl(cfg.rawUrl, { cache: 'default' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const rawList = await res.json();
    if (!Array.isArray(rawList) || rawList.length === 0) {
      throw new Error('Empty dataset payload');
    }
    const sanctuaries = rawList.map((item) => normalizeSanctuary(item, cfg.key));
    const result = { source: 'live', city: cfg, sanctuaries };
    cache.set(cfg.key, result);
    return result;
  } catch {
    const sanctuaries = cfg.fallback.map((item) => normalizeSanctuary(item, cfg.key));
    const result = { source: 'fallback', city: cfg, sanctuaries };
    cache.set(cfg.key, result);
    return result;
  }
}
