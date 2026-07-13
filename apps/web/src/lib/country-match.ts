/** Normaliza y empareja nombres GeoJSON con catálogo MTMG */

const ALIASES: Record<string, string> = {
  'united states of america': 'united states',
  usa: 'united states',
  'united states': 'united states',
  'dominican rep.': 'dominican republic',
  'dominican republic': 'dominican republic',
  'republic of venezuela': 'venezuela',
  'bolivarian republic of venezuela': 'venezuela',
  'russian federation': 'russia',
  'south korea': 'korea',
  'north korea': "korea, democratic people's republic of",
  'ivory coast': "côte d'ivoire",
  "cote d'ivoire": "côte d'ivoire",
  czechia: 'czech republic',
  'united kingdom': 'united kingdom',
  uk: 'united kingdom',
  'great britain': 'united kingdom',
  'bosnia and herzegovina': 'bosnia and herz.',
  'republic of the congo': 'congo',
  'democratic republic of the congo': 'dem. rep. congo',
  tanzania: 'united republic of tanzania',
  syria: 'syrian arab republic',
  iran: 'iran (islamic republic of)',
  laos: "lao people's democratic republic",
  moldova: 'republic of moldova',
  bolivia: 'bolivia (plurinational state of)',
  venezuela: 'venezuela',
  spain: 'spain',
  mexico: 'mexico',
  brazil: 'brazil',
  'french guiana': 'france',
};

export function normalizeCountryName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function namesMatch(a: string, b: string): boolean {
  const na = normalizeCountryName(a);
  const nb = normalizeCountryName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const aa = ALIASES[na] || na;
  const bb = ALIASES[nb] || nb;
  return aa === bb || aa.includes(bb) || bb.includes(aa);
}

/** Centro aproximado de un Feature GeoJSON */
export function featureCentroid(feat: {
  geometry?: { type?: string; coordinates?: unknown };
}): { lat: number; lng: number } {
  const coords = feat.geometry?.coordinates;
  if (!coords) return { lat: 20, lng: 0 };

  let sumLat = 0;
  let sumLng = 0;
  let n = 0;

  const walk = (c: unknown): void => {
    if (!Array.isArray(c)) return;
    if (typeof c[0] === 'number' && typeof c[1] === 'number') {
      sumLng += c[0] as number;
      sumLat += c[1] as number;
      n += 1;
      return;
    }
    for (const child of c) walk(child);
  };

  walk(coords);
  if (!n) return { lat: 20, lng: 0 };
  return { lat: sumLat / n, lng: sumLng / n };
}

export function getFeatureName(feat: { properties?: Record<string, unknown> }): string {
  const p = feat.properties || {};
  return String(p.name || p.NAME || p.ADMIN || p.admin || p.Country || '');
}
