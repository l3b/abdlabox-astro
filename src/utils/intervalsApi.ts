// Intervals.icu Running Stats Integration (Garmin + Strava merged, zero subscription required)
import { PROFILES } from '../data/socialLinks';

export const ANNUAL_RUNNING_GOAL_KM = 750;
const RUNNING_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);
const SHOE_LIFE_KM = 800;

interface IntervalsActivity {
  id: string;
  name?: string;
  description?: string | null;
  type?: string;
  source?: string;
  start_date_local: string;
  distance?: number;
  moving_time?: number;
  total_elevation_gain?: number;
  average_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  calories?: number;
  feel?: number;
  device_name?: string;
  strava_id?: string | null;
  external_id?: string | null;
  icu_ctl?: number;
  icu_atl?: number;
  gear?: {
    id?: string | null;
    name?: string | null;
    distance?: number | null;
  } | null;
}

interface IntervalsGear {
  id: string;
  type?: string;
  name?: string;
  distance?: number;
  activities?: number;
  retired?: string | null;
}

export interface ShoeItem {
  id: string;
  name: string;
  distanceKm: number;
  wearPercent: number;
}

export interface RunActivity {
  id: string;
  name: string;
  distance: number;
  time: string;
  pace: string;
  date: string;
  avgHr?: number;
  elevationM?: number;
  cadenceSpm?: number;
  calories?: number;
  feelEmoji?: string;
  shoeName?: string;
  deviceName?: string;
  link: string;
  linkSource: 'strava' | 'garmin';
}

export interface RunningStats {
  thisWeek: {
    distance: number;
    timeMin: number;
    runs: number;
    elevationM: number;
  };
  thisMonth: {
    distance: number;
    runs: number;
    elevationM: number;
  };
  thisYear: {
    distance: number;
    runs: number;
    elevationM: number;
    progress: number;
    funFact: string;
  };
  streakDays: number;
  primaryWatch?: string;
  shoes: ShoeItem[];
  recentActivities: RunActivity[];
}

interface RawIntervalsData {
  thisWeek: { distance: number; timeMin: number; runs: number; elevationM: number };
  thisMonth: { distance: number; runs: number; elevationM: number };
  thisYear: { distance: number; runs: number; elevationM: number; progress: number };
  streakDays: number;
  primaryWatch?: string;
  shoes: ShoeItem[];
  recentActivities: Array<{
    id: string;
    name: string;
    distance: number;
    movingTimeSec: number;
    pace: string;
    startDateLocal: string;
    avgHr?: number;
    elevationM?: number;
    cadenceSpm?: number;
    calories?: number;
    feelEmoji?: string;
    shoeName?: string;
    deviceName?: string;
    link: string;
    linkSource: 'strava' | 'garmin';
  }>;
}

const metersToKm = (meters: number): number => Math.round((meters / 1000) * 10) / 10;

// Clean up duplicated model strings like "Nike Pegasus 41 pegasus 41 blue" -> "Nike Pegasus 41"
function cleanShoeName(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  // Remove duplicated trailing words/phrases (case-insensitive)
  const words = trimmed.split(' ');
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(w);
  }
  return deduped.join(' ').replace(/\s*-\s*$/, '').trim() || trimmed;
}

const secondsToTime = (seconds: number, locale: 'ar' | 'en'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (locale === 'ar') {
    return hours > 0 ? `${hours} س ${minutes} د` : `${minutes} د`;
  }
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const calculatePace = (seconds: number, meters: number): string => {
  if (!meters || meters <= 0 || !seconds || seconds <= 0) return '--:--';
  const totalPaceSec = Math.round(seconds / (meters / 1000));
  const paceMinutes = Math.floor(totalPaceSec / 60);
  const paceSeconds = totalPaceSec % 60;
  return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
};

const feelToEmoji = (feel?: number): string | undefined => {
  switch (feel) {
    case 1:
      return '🔥';
    case 2:
      return '😊';
    case 3:
      return '🙂';
    case 4:
      return '😮‍💨';
    case 5:
      return '🥵';
    default:
      return undefined;
  }
};

const formatRelativeDate = (dateLocal: string, locale: 'ar' | 'en'): string => {
  const datePart = dateLocal.slice(0, 10); // YYYY-MM-DD
  const [y, m, d] = datePart.split('-').map(Number);
  const activityDay = new Date(Date.UTC(y, m - 1, d));

  // Use Asia/Riyadh (UTC+3) for "today" comparison
  const nowKsa = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const todayUtc = new Date(
    Date.UTC(nowKsa.getUTCFullYear(), nowKsa.getUTCMonth(), nowKsa.getUTCDate())
  );
  const diffDays = Math.round((todayUtc.getTime() - activityDay.getTime()) / 86400_000);

  if (locale === 'en') {
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDay.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }

  if (diffDays <= 0) return 'اليوم';
  if (diffDays === 1) return 'أمس';
  if (diffDays === 2) return 'منذ يومين';
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  return activityDay.toLocaleDateString('ar-SA', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

function calculateStreakDays(runDates: string[]): number {
  if (runDates.length === 0) return 0;
  const uniqueDays = new Set(runDates.map((d) => d.slice(0, 10)));
  const nowKsa = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const cursor = new Date(
    Date.UTC(nowKsa.getUTCFullYear(), nowKsa.getUTCMonth(), nowKsa.getUTCDate())
  );

  const fmt = (dt: Date) => dt.toISOString().slice(0, 10);
  // If user hasn't run yet today, allow streak starting from yesterday
  if (!uniqueDays.has(fmt(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (uniqueDays.has(fmt(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function buildFunDistanceFact(km: number, locale: 'ar' | 'en'): string {
  const marathons = Math.round((km / 42.195) * 10) / 10;
  const causewayCrossings = Math.round(km / 25);

  if (km >= 400) {
    const dammamRiyadh = Math.round((km / 400) * 10) / 10;
    return locale === 'ar'
      ? `≈ ${marathons} ماراثون • ${dammamRiyadh}× طريق الدمام–الرياض`
      : `≈ ${marathons} marathons • ${dammamRiyadh}× Dammam–Riyadh`;
  }
  if (km >= 50) {
    return locale === 'ar'
      ? `≈ ${marathons} ماراثون • ${causewayCrossings}× جسر الملك فهد`
      : `≈ ${marathons} marathons • ${causewayCrossings}× King Fahd Causeway`;
  }
  return locale === 'ar'
    ? `≈ ${Math.round(km * 1300).toLocaleString('en-US')} خطوة حتى الآن`
    : `≈ ${Math.round(km * 1300).toLocaleString('en-US')} steps so far`;
}

let rawCache: Promise<RawIntervalsData | null> | null = null;

async function loadRawIntervalsData(): Promise<RawIntervalsData | null> {
  const apiKey = import.meta.env.INTERVALS_API_KEY;
  const athleteId = import.meta.env.INTERVALS_ATHLETE_ID;

  if (!apiKey || !athleteId) {
    console.warn('Intervals.icu credentials not configured');
    return null;
  }

  try {
    const auth = 'Basic ' + Buffer.from(`API_KEY:${apiKey}`).toString('base64');
    const headers = {
      Authorization: auth,
      Accept: 'application/json',
      'User-Agent': 'AbdlaBox/1.0.0 (+https://abdla.box)',
    };

    const nowKsa = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const currentYear = nowKsa.getUTCFullYear();
    const oldest = `${currentYear}-01-01`;
    const newest = `${currentYear}-12-31`;

    const [activitiesRes, gearRes] = await Promise.allSettled([
      fetch(
        `https://intervals.icu/api/v1/athlete/${athleteId}/activities?oldest=${oldest}&newest=${newest}`,
        { headers, signal: AbortSignal.timeout(10000) }
      ),
      fetch(`https://intervals.icu/api/v1/athlete/${athleteId}/gear`, {
        headers,
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (activitiesRes.status !== 'fulfilled' || !activitiesRes.value.ok) {
      const status =
        activitiesRes.status === 'fulfilled' ? activitiesRes.value.status : 'network_error';
      console.error(`Intervals.icu activities fetch failed: ${status}`);
      return null;
    }

    const allActivities: IntervalsActivity[] = await activitiesRes.value.json();
    const runs = allActivities
      .filter((a) => a.type && RUNNING_TYPES.has(a.type) && (a.distance || 0) > 0)
      .sort((a, b) => b.start_date_local.localeCompare(a.start_date_local));

    // Parse shoe closet from /gear
    const gearMap = new Map<string, ShoeItem>();
    let shoes: ShoeItem[] = [];
    if (gearRes.status === 'fulfilled' && gearRes.value.ok) {
      const rawGear: IntervalsGear[] = await gearRes.value.json();
      shoes = rawGear
        .filter((g) => g.type === 'Shoes' && !g.retired && g.name)
        .map((g) => {
          const distanceKm = Math.round((g.distance || 0) / 1000);
          const item: ShoeItem = {
            id: g.id,
            name: cleanShoeName(g.name!),
            distanceKm,
            wearPercent: Math.min(100, Math.round((distanceKm / SHOE_LIFE_KM) * 100)),
          };
          gearMap.set(g.id, item);
          return item;
        })
        .sort((a, b) => b.distanceKm - a.distanceKm);
    }

    // Calendar boundaries in KSA time (Sunday start of week)
    const todayDate = new Date(
      Date.UTC(nowKsa.getUTCFullYear(), nowKsa.getUTCMonth(), nowKsa.getUTCDate())
    );
    const startOfWeek = new Date(todayDate);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());
    const startOfWeekStr = startOfWeek.toISOString().slice(0, 10);

    const currentMonthPrefix = `${currentYear}-${String(nowKsa.getUTCMonth() + 1).padStart(2, '0')}`;

    const weekRuns = runs.filter((r) => r.start_date_local.slice(0, 10) >= startOfWeekStr);
    const monthRuns = runs.filter((r) => r.start_date_local.startsWith(currentMonthPrefix));

    const sumDist = (arr: IntervalsActivity[]) =>
      metersToKm(arr.reduce((s, r) => s + (r.distance || 0), 0));
    const sumElev = (arr: IntervalsActivity[]) =>
      Math.round(arr.reduce((s, r) => s + (r.total_elevation_gain || 0), 0));

    const yearDistance = sumDist(runs);
    const yearProgress = Math.min(100, Math.round((yearDistance / ANNUAL_RUNNING_GOAL_KM) * 100));
    const streakDays = calculateStreakDays(runs.map((r) => r.start_date_local));

    const primaryWatch = runs.find((r) => r.device_name)?.device_name;

    // Pick top 3 active shoes (prioritize shoes used recently, then highest mileage)
    const recentGearIds = new Set(
      runs
        .slice(0, 15)
        .map((r) => r.gear?.id)
        .filter((id): id is string => Boolean(id))
    );
    const sortedShoes = [...shoes]
      .sort((a, b) => {
        const aRecent = recentGearIds.has(a.id) ? 1 : 0;
        const bRecent = recentGearIds.has(b.id) ? 1 : 0;
        if (aRecent !== bRecent) return bRecent - aRecent;
        return b.distanceKm - a.distanceKm;
      })
      .slice(0, 3);

    const recentActivities = runs.slice(0, 3).map((r) => {
      const matchedShoe = r.gear?.id ? gearMap.get(r.gear.id)?.name : undefined;
      const shoeName = matchedShoe || (r.gear?.name ? cleanShoeName(r.gear.name) : undefined);

      const hasStrava = Boolean(r.strava_id);
      const link = hasStrava
        ? `https://www.strava.com/activities/${r.strava_id}`
        : r.external_id && r.source === 'GARMIN_CONNECT'
          ? `https://connect.garmin.com/modern/activity/${r.external_id}`
          : PROFILES.strava.url;

      return {
        id: r.id,
        name: r.name || 'Run',
        distance: metersToKm(r.distance || 0),
        movingTimeSec: r.moving_time || 0,
        pace: calculatePace(r.moving_time || 0, r.distance || 0),
        startDateLocal: r.start_date_local,
        avgHr: r.average_heartrate ? Math.round(r.average_heartrate) : undefined,
        elevationM:
          r.total_elevation_gain && r.total_elevation_gain >= 1
            ? Math.round(r.total_elevation_gain)
            : undefined,
        cadenceSpm: r.average_cadence ? Math.round(r.average_cadence * 2) : undefined,
        calories: r.calories ? Math.round(r.calories) : undefined,
        feelEmoji: feelToEmoji(r.feel),
        shoeName,
        deviceName: r.device_name,
        link,
        linkSource: hasStrava ? ('strava' as const) : ('garmin' as const),
      };
    });

    return {
      thisWeek: {
        distance: sumDist(weekRuns),
        timeMin: Math.round(weekRuns.reduce((s, r) => s + (r.moving_time || 0), 0) / 60),
        runs: weekRuns.length,
        elevationM: sumElev(weekRuns),
      },
      thisMonth: {
        distance: sumDist(monthRuns),
        runs: monthRuns.length,
        elevationM: sumElev(monthRuns),
      },
      thisYear: {
        distance: yearDistance,
        runs: runs.length,
        elevationM: sumElev(runs),
        progress: yearProgress,
      },
      streakDays,
      primaryWatch,
      shoes: sortedShoes,
      recentActivities,
    };
  } catch (error) {
    console.error('Error fetching Intervals.icu running stats:', error);
    return null;
  }
}

export async function fetchRunningStats(locale: 'ar' | 'en' = 'ar'): Promise<RunningStats | null> {
  if (!rawCache) {
    rawCache = loadRawIntervalsData();
  }
  const raw = await rawCache;
  if (!raw) return null;

  return {
    thisWeek: raw.thisWeek,
    thisMonth: raw.thisMonth,
    thisYear: {
      ...raw.thisYear,
      funFact: buildFunDistanceFact(raw.thisYear.distance, locale),
    },
    streakDays: raw.streakDays,
    primaryWatch: raw.primaryWatch,
    shoes: raw.shoes,
    recentActivities: raw.recentActivities.map((a) => ({
      id: a.id,
      name: a.name,
      distance: a.distance,
      time: secondsToTime(a.movingTimeSec, locale),
      pace: a.pace,
      date: formatRelativeDate(a.startDateLocal, locale),
      avgHr: a.avgHr,
      elevationM: a.elevationM,
      cadenceSpm: a.cadenceSpm,
      calories: a.calories,
      feelEmoji: a.feelEmoji,
      shoeName: a.shoeName,
      deviceName: a.deviceName,
      link: a.link,
      linkSource: a.linkSource,
    })),
  };
}
