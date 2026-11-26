// Intervals.icu Running Stats Integration
// - Counts ALL runs in mileage, weekly rhythm & streak totals
// - Verifies Strava public visibility so ONLY public runs appear in the public list
// - Resolves per-run shoe name cleanly from Intervals.icu gear
import { PROFILES } from '../data/socialLinks';

const RUNNING_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);
const APP_USER_AGENT = 'AbdlaBox/1.0.0 (+https://abdla.box)';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

interface IntervalsActivity {
  id: string;
  name?: string;
  type?: string;
  source?: string;
  start_date_local: string;
  distance?: number;
  moving_time?: number;
  total_elevation_gain?: number;
  average_heartrate?: number;
  average_cadence?: number;
  feel?: number;
  strava_id?: string | null;
  tags?: string[] | null;
  gear?: {
    id?: string | null;
    name?: string | null;
  } | null;
}

interface IntervalsGear {
  id: string;
  type?: string;
  name?: string;
}

export interface WeeklyBar {
  label: string;
  distanceKm: number;
  percent: number;
  isCurrent: boolean;
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
  feelEmoji?: string;
  shoeName?: string;
  link: string;
}

export interface RunningStats {
  thisWeek: {
    distance: number;
    timeMin: number;
    runs: number;
  };
  thisMonth: {
    distance: number;
    runs: number;
    elevationM: number;
    monthName: string;
  };
  streakDays: number;
  weeklyBars: WeeklyBar[];
  recentActivities: RunActivity[];
}

interface RawIntervalsData {
  thisWeek: { distance: number; timeMin: number; runs: number };
  thisMonth: { distance: number; runs: number; elevationM: number; monthIndex: number };
  streakDays: number;
  weeklyTotalsKm: number[]; // oldest -> newest (4 weeks)
  recentActivities: Array<{
    id: string;
    name: string;
    distance: number;
    movingTimeSec: number;
    pace: string;
    startDateLocal: string;
    avgHr?: number;
    elevationM?: number;
    feelEmoji?: string;
    shoeName?: string;
    link: string;
  }>;
}

const metersToKm = (meters: number): number => Math.round((meters / 1000) * 10) / 10;

// Clean duplicated model strings like "Nike Pegasus 41 pegasus 41 blue" -> "Nike Pegasus 41"
function cleanShoeName(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
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
  const [y, m, d] = dateLocal.slice(0, 10).split('-').map(Number);
  const activityDay = new Date(Date.UTC(y, m - 1, d));

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

// Verify whether a Strava activity is publicly viewable (200 OK vs 307 /register/free for private)
async function isStravaActivityPublic(stravaId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.strava.com/activities/${stravaId}`, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': BROWSER_USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 200) return true;
    // Some Strava edges reject HEAD with 405 — fall back to lightweight GET
    if (res.status === 405) {
      const getRes = await fetch(`https://www.strava.com/activities/${stravaId}`, {
        method: 'GET',
        redirect: 'manual',
        headers: { 'User-Agent': BROWSER_USER_AGENT },
        signal: AbortSignal.timeout(5000),
      });
      return getRes.status === 200;
    }
    return false;
  } catch {
    return false;
  }
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
      'User-Agent': APP_USER_AGENT,
    };

    const nowKsa = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const oldestDate = new Date(nowKsa);
    oldestDate.setUTCDate(oldestDate.getUTCDate() - 90);
    const oldest = oldestDate.toISOString().slice(0, 10);
    const newest = nowKsa.toISOString().slice(0, 10);

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

    // Build shoe ID -> clean name lookup
    const gearMap = new Map<string, string>();
    if (gearRes.status === 'fulfilled' && gearRes.value.ok) {
      const rawGear: IntervalsGear[] = await gearRes.value.json();
      for (const g of rawGear) {
        if (g.id && g.name) {
          gearMap.set(g.id, cleanShoeName(g.name));
        }
      }
    }

    // Calendar boundaries in KSA time (Sunday start of week)
    const todayDate = new Date(
      Date.UTC(nowKsa.getUTCFullYear(), nowKsa.getUTCMonth(), nowKsa.getUTCDate())
    );
    const startOfCurrentWeek = new Date(todayDate);
    startOfCurrentWeek.setUTCDate(startOfCurrentWeek.getUTCDate() - startOfCurrentWeek.getUTCDay());

    const currentYear = nowKsa.getUTCFullYear();
    const currentMonthIdx = nowKsa.getUTCMonth();
    const currentMonthPrefix = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

    const sumDist = (arr: IntervalsActivity[]) =>
      metersToKm(arr.reduce((s, r) => s + (r.distance || 0), 0));
    const sumElev = (arr: IntervalsActivity[]) =>
      Math.round(arr.reduce((s, r) => s + (r.total_elevation_gain || 0), 0));

    // 4-week totals (oldest -> current week)
    const weeklyTotalsKm: number[] = [];
    let currentWeekRuns: IntervalsActivity[] = [];
    for (let w = 3; w >= 0; w--) {
      const wStart = new Date(startOfCurrentWeek);
      wStart.setUTCDate(wStart.getUTCDate() - w * 7);
      const wEnd = new Date(wStart);
      wEnd.setUTCDate(wEnd.getUTCDate() + 7);

      const startStr = wStart.toISOString().slice(0, 10);
      const endStr = wEnd.toISOString().slice(0, 10);
      const bucket = runs.filter((r) => {
        const d = r.start_date_local.slice(0, 10);
        return d >= startStr && d < endStr;
      });
      weeklyTotalsKm.push(sumDist(bucket));
      if (w === 0) currentWeekRuns = bucket;
    }

    const monthRuns = runs.filter((r) => r.start_date_local.startsWith(currentMonthPrefix));
    const streakDays = calculateStreakDays(runs.map((r) => r.start_date_local));

    // Filter recent activities to ONLY public Strava runs (never leaking private runs)
    const candidates = runs
      .filter((r) => {
        if (!r.strava_id) return false;
        const lowerTags = (r.tags || []).map((t) => t.toLowerCase());
        if (lowerTags.includes('private') || lowerTags.includes('hidden')) return false;
        return true;
      })
      .slice(0, 15);

    const visibilityResults = await Promise.all(
      candidates.map(async (r) => ({
        run: r,
        isPublic: await isStravaActivityPublic(r.strava_id!),
      }))
    );

    const publicRuns = visibilityResults
      .filter((x) => x.isPublic)
      .map((x) => x.run)
      .slice(0, 3);

    const recentActivities = publicRuns.map((r) => {
      const shoeName =
        (r.gear?.id ? gearMap.get(r.gear.id) : undefined) ||
        (r.gear?.name ? cleanShoeName(r.gear.name) : undefined);

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
        feelEmoji: feelToEmoji(r.feel),
        shoeName,
        link: r.strava_id ? `https://www.strava.com/activities/${r.strava_id}` : PROFILES.strava.url,
      };
    });

    return {
      thisWeek: {
        distance: sumDist(currentWeekRuns),
        timeMin: Math.round(currentWeekRuns.reduce((s, r) => s + (r.moving_time || 0), 0) / 60),
        runs: currentWeekRuns.length,
      },
      thisMonth: {
        distance: sumDist(monthRuns),
        runs: monthRuns.length,
        elevationM: sumElev(monthRuns),
        monthIndex: currentMonthIdx,
      },
      streakDays,
      weeklyTotalsKm,
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

  const monthDate = new Date(Date.UTC(2026, raw.thisMonth.monthIndex, 15));
  const monthName = monthDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'long',
    timeZone: 'UTC',
  });

  const maxWeek = Math.max(...raw.weeklyTotalsKm, 1);
  const weekLabels =
    locale === 'ar'
      ? ['قبل 3 أ', 'قبل 2 أ', 'الأسبوع الماضي', 'هذا الأسبوع']
      : ['3w ago', '2w ago', 'Last wk', 'This wk'];

  const weeklyBars: WeeklyBar[] = raw.weeklyTotalsKm.map((km, idx) => ({
    label: weekLabels[idx],
    distanceKm: km,
    percent: km > 0 ? Math.max(12, Math.round((km / maxWeek) * 100)) : 4,
    isCurrent: idx === 3,
  }));

  return {
    thisWeek: raw.thisWeek,
    thisMonth: {
      distance: raw.thisMonth.distance,
      runs: raw.thisMonth.runs,
      elevationM: raw.thisMonth.elevationM,
      monthName,
    },
    streakDays: raw.streakDays,
    weeklyBars,
    recentActivities: raw.recentActivities.map((a) => ({
      id: a.id,
      name: a.name,
      distance: a.distance,
      time: secondsToTime(a.movingTimeSec, locale),
      pace: a.pace,
      date: formatRelativeDate(a.startDateLocal, locale),
      avgHr: a.avgHr,
      elevationM: a.elevationM,
      feelEmoji: a.feelEmoji,
      shoeName: a.shoeName,
      link: a.link,
    })),
  };
}
