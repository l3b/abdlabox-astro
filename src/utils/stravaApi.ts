// Strava API Integration — fetches running stats once per build with in-memory caching
import { PROFILES } from '../data/socialLinks';

export const ANNUAL_RUNNING_GOAL_KM = 750;
const APP_USER_AGENT = 'AbdlaBox/1.0.0 (+https://abdla.box)';

const RUNNING_TYPES = new Set(['Run', 'VirtualRun', 'TrailRun', 'Walk', 'Hike']);

interface StravaActivity {
  id: number;
  name: string;
  description?: string;
  distance: number;
  moving_time: number;
  start_date: string;
  type: string;
  average_speed: number;
  max_speed: number;
  total_elevation_gain: number;
  private?: boolean;
  photos?: {
    primary?: {
      urls?: {
        '600'?: string;
      };
    };
    count?: number;
  };
}

interface StravaApiStats {
  recent_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elevation_gain: number;
  };
  all_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elevation_gain: number;
  };
  ytd_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elevation_gain: number;
  };
}

interface RawStravaData {
  thisWeek: { distance: number; time: number; runs: number };
  thisMonth: { distance: number; runs: number };
  thisYear: { distance: number; runs: number; progress: number };
  recentActivities: Array<{
    id: number;
    name: string;
    description?: string;
    distance: number;
    movingTimeSec: number;
    startDate: string;
    pace: string;
    photoUrl?: string;
  }>;
}

export interface RunningStats {
  thisWeek: {
    distance: number;
    time: number;
    runs: number;
  };
  thisMonth: {
    distance: number;
    runs: number;
  };
  thisYear: {
    distance: number;
    runs: number;
    progress: number;
  };
  recentActivities: Array<{
    id: number;
    name: string;
    description?: string;
    distance: number;
    time: string;
    date: string;
    pace: string;
    photoUrl?: string;
  }>;
}

const metersToKm = (meters: number): number => Math.round((meters / 1000) * 10) / 10;

const secondsToTime = (seconds: number, locale: 'ar' | 'en'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (locale === 'ar') {
    if (hours > 0) return `${hours} س ${minutes} د`;
    return `${minutes} دقيقة`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
};

const calculatePace = (seconds: number, meters: number): string => {
  if (!meters || meters <= 0 || !seconds || seconds <= 0) return '--:--';
  const totalPaceSec = Math.round(seconds / (meters / 1000));
  const paceMinutes = Math.floor(totalPaceSec / 60);
  const paceSeconds = totalPaceSec % 60;
  return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
};

const formatRelativeDate = (dateString: string, locale: 'ar' | 'en' = 'ar'): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (locale === 'en') {
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    const days = Math.max(1, Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
    if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (date.toDateString() === today.toDateString()) return 'اليوم';
  if (date.toDateString() === yesterday.toDateString()) return 'أمس';
  const days = Math.max(1, Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
  if (days === 1) return 'منذ يوم';
  if (days === 2) return 'منذ يومين';
  if (days < 7) return `منذ ${days} أيام`;
  return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
};

let rawStravaCache: Promise<RawStravaData | null> | null = null;

async function loadRawStravaData(): Promise<RawStravaData | null> {
  try {
    const clientId = import.meta.env.STRAVA_CLIENT_ID;
    const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
    const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      if (import.meta.env.DEV) {
        const mockYearDistance = 450.7;
        const now = Date.now();
        return {
          thisWeek: { distance: 24.5, time: 135, runs: 3 },
          thisMonth: { distance: 98.3, runs: 12 },
          thisYear: {
            distance: mockYearDistance,
            runs: 58,
            progress: Math.min(100, Math.round((mockYearDistance / ANNUAL_RUNNING_GOAL_KM) * 100)),
          },
          recentActivities: [
            {
              id: 12345678,
              name: 'Morning Run',
              description: 'Easy morning run with sunrise',
              distance: 10.2,
              movingTimeSec: 52 * 60,
              startDate: new Date(now - 86400_000).toISOString(),
              pace: '5:06',
            },
            {
              id: 12345679,
              name: 'Evening Speed Run',
              description: 'Speed training on the track',
              distance: 5.5,
              movingTimeSec: 25 * 60,
              startDate: new Date(now - 3 * 86400_000).toISOString(),
              pace: '4:32',
            },
            {
              id: 12345680,
              name: 'Weekend Long Run',
              description: 'Long run preparing for next race',
              distance: 15.0,
              movingTimeSec: 82 * 60,
              startDate: new Date(now - 5 * 86400_000).toISOString(),
              pace: '5:28',
            },
          ],
        };
      }
      console.warn('Strava credentials not configured');
      return null;
    }

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': APP_USER_AGENT,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text().catch(() => '');
      throw new Error(`Failed to refresh Strava token (${tokenResponse.status}): ${errBody.slice(0, 200)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken: string = tokenData.access_token;
    const authHeaders = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'User-Agent': APP_USER_AGENT,
    };

    // Resolve athleteId from /athlete, falling back to configured profile athleteId if /athlete fails
    let athleteId = PROFILES.strava.athleteId;
    try {
      const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: authHeaders,
        signal: AbortSignal.timeout(8000),
      });
      if (athleteResponse.ok) {
        const athleteData = await athleteResponse.json();
        if (athleteData?.id) athleteId = String(athleteData.id);
      } else {
        const errBody = await athleteResponse.text().catch(() => '');
        console.warn(`Strava /athlete returned ${athleteResponse.status}: ${errBody.slice(0, 200)}`);
      }
    } catch (e) {
      console.warn('Strava /athlete request error, using fallback athleteId:', e);
    }

    const now = new Date();
    const yearStart = Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000);

    const [statsRes, yearActivitiesRes, recentActivitiesRes] = await Promise.allSettled([
      fetch(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
        headers: authHeaders,
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`https://www.strava.com/api/v3/athlete/activities?after=${yearStart}&per_page=200`, {
        headers: authHeaders,
        signal: AbortSignal.timeout(8000),
      }),
      fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
        headers: authHeaders,
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    let apiStats: StravaApiStats | null = null;
    if (statsRes.status === 'fulfilled') {
      if (statsRes.value.ok) {
        apiStats = await statsRes.value.json();
      } else {
        const errBody = await statsRes.value.text().catch(() => '');
        console.warn(`Strava /stats returned ${statsRes.value.status}: ${errBody.slice(0, 200)}`);
      }
    }

    let yearRunningActivities: StravaActivity[] = [];
    if (yearActivitiesRes.status === 'fulfilled') {
      if (yearActivitiesRes.value.ok) {
        const allActivities: StravaActivity[] = await yearActivitiesRes.value.json();
        yearRunningActivities = allActivities.filter((a) => RUNNING_TYPES.has(a.type));
      } else {
        const errBody = await yearActivitiesRes.value.text().catch(() => '');
        console.warn(`Strava /activities (YTD) returned ${yearActivitiesRes.value.status}: ${errBody.slice(0, 200)}`);
      }
    }

    if (!apiStats && yearRunningActivities.length === 0) {
      console.error('Strava returned neither stats nor activities — check OAuth scopes or API access');
      return null;
    }

    // Calculate actual current week (Sunday-Saturday for KSA/standard) and calendar month
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weekActivities = yearRunningActivities.filter((a) => new Date(a.start_date) >= startOfWeek);
    const monthActivities = yearRunningActivities.filter((a) => new Date(a.start_date) >= startOfMonth);

    const hasYearActivities = yearRunningActivities.length > 0;

    const weekDistance = hasYearActivities
      ? metersToKm(weekActivities.reduce((s, a) => s + a.distance, 0))
      : apiStats
        ? metersToKm(apiStats.recent_run_totals.distance / 4)
        : 0;
    const weekTime = hasYearActivities
      ? Math.round(weekActivities.reduce((s, a) => s + a.moving_time, 0) / 60)
      : apiStats
        ? Math.round(apiStats.recent_run_totals.moving_time / 4 / 60)
        : 0;
    const weekRuns = hasYearActivities
      ? weekActivities.length
      : apiStats
        ? Math.round(apiStats.recent_run_totals.count / 4)
        : 0;

    const monthDistance = hasYearActivities
      ? metersToKm(monthActivities.reduce((s, a) => s + a.distance, 0))
      : apiStats
        ? metersToKm(apiStats.recent_run_totals.distance)
        : 0;
    const monthRuns = hasYearActivities
      ? monthActivities.length
      : apiStats
        ? apiStats.recent_run_totals.count
        : 0;

    const yearDistance = hasYearActivities
      ? metersToKm(yearRunningActivities.reduce((s, a) => s + a.distance, 0))
      : apiStats
        ? metersToKm(apiStats.ytd_run_totals.distance)
        : 0;
    const yearRuns = hasYearActivities
      ? yearRunningActivities.length
      : apiStats
        ? apiStats.ytd_run_totals.count
        : 0;

    const yearProgress = Math.min(100, Math.round((yearDistance / ANNUAL_RUNNING_GOAL_KM) * 100));

    // Fetch details for latest 3 public running activities in parallel
    let detailedActivities: StravaActivity[] = [];
    if (recentActivitiesRes.status === 'fulfilled' && recentActivitiesRes.value.ok) {
      const activities: StravaActivity[] = await recentActivitiesRes.value.json();
      const publicActivities = activities
        .filter((a) => RUNNING_TYPES.has(a.type) && !a.private)
        .slice(0, 3);

      detailedActivities = await Promise.all(
        publicActivities.map(async (activity) => {
          try {
            const detailRes = await fetch(`https://www.strava.com/api/v3/activities/${activity.id}`, {
              headers: authHeaders,
              signal: AbortSignal.timeout(6000),
            });
            return detailRes.ok ? await detailRes.json() : activity;
          } catch {
            return activity;
          }
        })
      );
    }

    return {
      thisWeek: { distance: weekDistance, time: weekTime, runs: weekRuns },
      thisMonth: { distance: monthDistance, runs: monthRuns },
      thisYear: { distance: yearDistance, runs: yearRuns, progress: yearProgress },
      recentActivities: detailedActivities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        distance: metersToKm(activity.distance),
        movingTimeSec: activity.moving_time,
        startDate: activity.start_date,
        pace: calculatePace(activity.moving_time, activity.distance),
        photoUrl: activity.photos?.primary?.urls?.['600'],
      })),
    };
  } catch (error) {
    console.error('Error fetching Strava data:', error);
    return null;
  }
}

export async function fetchStravaStats(locale: 'ar' | 'en' = 'ar'): Promise<RunningStats | null> {
  if (!rawStravaCache) {
    rawStravaCache = loadRawStravaData();
  }
  const raw = await rawStravaCache;
  if (!raw) return null;

  return {
    thisWeek: raw.thisWeek,
    thisMonth: raw.thisMonth,
    thisYear: raw.thisYear,
    recentActivities: raw.recentActivities.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      distance: a.distance,
      time: secondsToTime(a.movingTimeSec, locale),
      date: formatRelativeDate(a.startDate, locale),
      pace: a.pace,
      photoUrl: a.photoUrl,
    })),
  };
}
