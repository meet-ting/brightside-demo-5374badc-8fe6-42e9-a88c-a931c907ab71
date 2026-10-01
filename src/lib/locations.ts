import data from '../data/locations.json';

export interface Location {
  slug: string;
  name: string;
  area: string;
  intro: string;
  homes: string;
  focus: string;
  note: string;
  project: string;
  weeks: number;
}

export const LOCATIONS: readonly Location[] = data as Location[];
export const CANONICAL_SLUG = 'bristol';

export function getLocation(slug: string | undefined): Location | undefined {
  if (!slug) return undefined;
  return LOCATIONS.find((l) => l.slug === slug.toLowerCase());
}

export function locationTitle(l: Location): string {
  return `Home project advice in ${l.name} · Brightside`;
}

export function locationDescription(l: Location): string {
  return `Expert advice for your next home project in ${l.name}. ${l.intro} Fictional demo business.`;
}
