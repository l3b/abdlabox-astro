// Race Log & Personal Bests for /ar/running and /en/running
// Add new races or PRs anytime right here!

export interface RaceEntry {
  name: { ar: string; en: string };
  date: string; // YYYY-MM-DD
  location: { ar: string; en: string };
  distanceKm: number;
  time?: string;
  pace?: string;
  shoe?: string;
  stravaId?: string;
  highlight?: { ar: string; en: string };
}

export const races: RaceEntry[] = [
  {
    name: { ar: 'سباق ديار 🇧🇭', en: 'Diyar Race 🇧🇭' },
    date: '2026-11-21',
    location: { ar: 'المحرق، البحرين', en: 'Muharraq, Bahrain' },
    distanceKm: 10.6,
    shoe: 'Nike Pegasus 41',
    stravaId: '21065895527',
    highlight: { ar: 'سباق 10 كم', en: '10K Road Race' },
  },
];
