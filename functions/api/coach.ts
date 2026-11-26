// Cloudflare Pages Function: GET /api/coach
// Protected by COACH_ACCESS_KEY secret — fetches live Intervals.icu training & wellness data
// Zero private run data is ever baked into static HTML!

interface Env {
  COACH_ACCESS_KEY?: string;
  INTERVALS_API_KEY?: string;
  INTERVALS_ATHLETE_ID?: string;
}

const RUNNING_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function calculatePace(seconds: number, meters: number): string {
  if (!meters || meters <= 0 || !seconds || seconds <= 0) return '--:--';
  const totalSec = Math.round(seconds / (meters / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  const jsonHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store, max-age=0',
  };

  if (!env.COACH_ACCESS_KEY) {
    return new Response(
      JSON.stringify({ error: 'Coach dashboard is not activated yet (COACH_ACCESS_KEY not set).' }),
      { status: 503, headers: jsonHeaders }
    );
  }

  const url = new URL(request.url);
  const providedKey = request.headers.get('x-coach-key') || url.searchParams.get('key') || '';

  if (!providedKey || !timingSafeEqual(providedKey, env.COACH_ACCESS_KEY)) {
    return new Response(JSON.stringify({ error: 'Invalid access key' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  if (!env.INTERVALS_API_KEY || !env.INTERVALS_ATHLETE_ID) {
    return new Response(JSON.stringify({ error: 'Intervals.icu credentials missing' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const auth = 'Basic ' + btoa(`API_KEY:${env.INTERVALS_API_KEY}`);
  const headers = { Authorization: auth, Accept: 'application/json' };

  const now = new Date();
  const oldestAct = new Date(now);
  oldestAct.setDate(oldestAct.getDate() - 60);
  const oldestWell = new Date(now);
  oldestWell.setDate(oldestWell.getDate() - 14);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const athleteId = env.INTERVALS_ATHLETE_ID;

  const [actRes, wellRes, gearRes] = await Promise.all([
    fetch(`https://intervals.icu/api/v1/athlete/${athleteId}/activities?oldest=${fmt(oldestAct)}&newest=${fmt(now)}`, { headers }),
    fetch(`https://intervals.icu/api/v1/athlete/${athleteId}/wellness?oldest=${fmt(oldestWell)}&newest=${fmt(now)}`, { headers }),
    fetch(`https://intervals.icu/api/v1/athlete/${athleteId}/gear`, { headers }),
  ]);

  if (!actRes.ok) {
    return new Response(JSON.stringify({ error: `Intervals API failed (${actRes.status})` }), {
      status: 502,
      headers: jsonHeaders,
    });
  }

  const rawActivities: any[] = await actRes.json();
  const rawWellness: any[] = wellRes.ok ? await wellRes.json() : [];
  const rawGear: any[] = gearRes.ok ? await gearRes.json() : [];

  const gearMap = new Map<string, string>();
  for (const g of rawGear) {
    if (g.id && g.name) gearMap.set(g.id, g.name.trim());
  }

  const runs = rawActivities
    .filter((a) => a.type && RUNNING_TYPES.has(a.type) && (a.distance || 0) > 0)
    .sort((a, b) => String(b.start_date_local).localeCompare(String(a.start_date_local)));

  const latestLoad = runs.find((r) => typeof r.icu_ctl === 'number');
  const ctl = latestLoad?.icu_ctl ? Math.round(latestLoad.icu_ctl * 10) / 10 : null;
  const atl = latestLoad?.icu_atl ? Math.round(latestLoad.icu_atl * 10) / 10 : null;
  const tsb = ctl !== null && atl !== null ? Math.round((ctl - atl) * 10) / 10 : null;

  const latestWellness = [...rawWellness]
    .sort((a, b) => String(b.id).localeCompare(String(a.id)))
    .slice(0, 7)
    .map((w) => ({
      date: w.id,
      restingHR: w.restingHR ?? null,
      hrv: w.hrv ? Math.round(w.hrv) : null,
      sleepHours: w.sleepSecs ? Math.round((w.sleepSecs / 3600) * 10) / 10 : null,
    }));

  return new Response(
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      fitness: { ctl, atl, tsb },
      wellness: latestWellness,
      runs: runs.slice(0, 25).map((r) => ({
        id: r.id,
        date: String(r.start_date_local).slice(0, 10),
        name: r.name || 'Run',
        distanceKm: Math.round(((r.distance || 0) / 1000) * 10) / 10,
        movingMin: Math.round((r.moving_time || 0) / 60),
        pace: calculatePace(r.moving_time || 0, r.distance || 0),
        avgHr: r.average_heartrate ? Math.round(r.average_heartrate) : null,
        maxHr: r.max_heartrate ? Math.round(r.max_heartrate) : null,
        cadenceSpm: r.average_cadence ? Math.round(r.average_cadence * 2) : null,
        elevationM: r.total_elevation_gain ? Math.round(r.total_elevation_gain) : 0,
        load: r.icu_training_load ? Math.round(r.icu_training_load) : null,
        feel: r.feel ?? null,
        shoe: r.gear?.id ? gearMap.get(r.gear.id) || null : null,
      })),
    }),
    { status: 200, headers: jsonHeaders }
  );
};
