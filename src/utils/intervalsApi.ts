// Intervals.icu Running Stats Integration
// - Counts ALL runs in mileage, weekly rhythm, consistency heatmap & streak totals
// - Verifies Strava public visibility so ONLY public runs appear in public feeds
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

export interface MonthlyBar {
  key: string;
  label: string;
  distanceKm: number;
  runs: number;
  percent: number;
}

export interface HeatmapDay {
  date: string;
  distanceKm: number;
  level: 0 | 1 | 2 | 3 | 4;
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
  monthlyBars: MonthlyBar[];
  heatmapDays: HeatmapDay[];
  totalRecentKm: number;
  totalRecentRuns: number;
  recentActivities: RunActivity[];
  allPublicActivities: RunActivity[];
}

interface RawIntervalsData {
  thisWeek: { distance: number; timeMin: number; runs: number };
  thisMonth: { distance: number; runs: number; elevationM: number; monthIndex: number };
  streakDays: number;
  weeklyTotalsKm: number[];
  monthlyBuckets: Array<{ key: string; monthIndex: number; year: number; distanceKm: number; runs: number }>;
  heatmapDays: HeatmapDay[];
  totalRecentKm: number;
  totalRecentRuns: number;
  publicActivities: Array<{
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

async function isStravaActivityPublic(stravaId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.strava.com/activities/${stravaId}`, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': BROWSER_USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 200) return true;
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
    oldestDate.setUTCDate(oldestDate.getUTCDate() - 182); // ~26 weeks for consistency heatmap
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

    const gearMap = new Map<string, string>();
    if (gearRes.status === 'fulfilled' && gearRes.value.ok) {
      const rawGear: IntervalsGear[] = await gearRes.value.json();
      for (const g of rawGear) {
        if (g.id && g.name) {
          gearMap.set(g.id, cleanShoeName(g.name));
        }
      }
    }

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

    // 4-week totals
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

    // Monthly buckets across fetched range (up to last 6 months, oldest -> newest)
    const monthlyMap = new Map<string, { year: number; monthIndex: number; distanceKm: number; runs: number }>();
    for (const r of runs) {
      const key = r.start_date_local.slice(0, 7);
      const [yy, mm] = key.split('-').map(Number);
      const existing = monthlyMap.get(key) || { year: yy, monthIndex: mm - 1, distanceKm: 0, runs: 0 };
      existing.distanceKm = Math.round((existing.distanceKm + (r.distance || 0) / 1000) * 10) / 10;
      existing.runs += 1;
      monthlyMap.set(key, existing);
    }
    const monthlyBuckets = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => ({ key, ...v }));

    // Build 26-week daily heatmap (182 days aligned to Sunday start)
    const dailyKm = new Map<string, number>();
    for (const r of runs) {
      const day = r.start_date_local.slice(0, 10);
      dailyKm.set(day, Math.round(((dailyKm.get(day) || 0) + (r.distance || 0) / 1000) * 10) / 10);
    }

    const heatmapStart = new Date(startOfCurrentWeek);
    heatmapStart.setUTCDate(heatmapStart.getUTCDate() - 25 * 7);
    const heatmapDays: HeatmapDay[] = [];
    const cursor = new Date(heatmapStart);
    while (cursor <= todayDate) {
      const iso = cursor.toISOString().slice(0, 10);
      const km = dailyKm.get(iso) || 0;
      const level: 0 | 1 | 2 | 3 | 4 =
        km === 0 ? 0 : km < 4 ? 1 : km < 7 ? 2 : km < 10 ? 3 : 4;
      heatmapDays.push({ date: iso, distanceKm: km, level });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const monthRuns = runs.filter((r) => r.start_date_local.startsWith(currentMonthPrefix));
    const streakDays = calculateStreakDays(runs.map((r) => r.start_date_local));

    // Verify public Strava visibility on up to 20 recent runs
    const candidates = runs
      .filter((r) => {
        if (!r.strava_id) return false;
        const lowerTags = (r.tags || []).map((t) => t.toLowerCase());
        if (lowerTags.includes('private') || lowerTags.includes('hidden')) return false;
        return true;
      })
      .slice(0, 20);

    const visibilityResults = await Promise.all(
      candidates.map(async (r) => ({
        run: r,
        isPublic: await isStravaActivityPublic(r.strava_id!),
      }))
    );

    const publicActivities = visibilityResults
      .filter((x) => x.isPublic)
      .map((x) => x.run)
      .slice(0, 8)
      .map((r) => {
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
      monthlyBuckets,
      heatmapDays,
      totalRecentKm: sumDist(runs),
      totalRecentRuns: runs.length,
      publicActivities,
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

  const maxMonth = Math.max(...raw.monthlyBuckets.map((m) => m.distanceKm), 1);
  const monthlyBars: MonthlyBar[] = raw.monthlyBuckets.map((m) => {
    const dt = new Date(Date.UTC(m.year, m.monthIndex, 15));
    const label = dt.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    });
    return {
      key: m.key,
      label,
      distanceKm: m.distanceKm,
      runs: m.runs,
      percent: Math.max(12, Math.round((m.distanceKm / maxMonth) * 100)),
    };
  });

  const formattedPublic = raw.publicActivities.map((a) => ({
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
    monthlyBars,
    heatmapDays: raw.heatmapDays,
    totalRecentKm: raw.totalRecentKm,
    totalRecentRuns: raw.totalRecentRuns,
    recentActivities: formattedPublic.slice(0, 3),
    allPublicActivities: formattedPublic,
  };
}
