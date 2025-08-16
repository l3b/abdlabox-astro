// Strava API Integration
// Fetches running stats at build time

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  type: string;
  average_speed: number;
  max_speed: number;
  total_elevation_gain: number;
  private?: boolean;
}

interface StravaStats {
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

interface RunningStats {
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
    progress: number; // percentage of annual goal (500km)
  };
  recentActivities: Array<{
    id: number;
    name: string;
    distance: number;
    time: string;
    date: string;
    pace: string;
  }>;
}

// Convert meters to kilometers
const metersToKm = (meters: number): number => {
  return Math.round((meters / 1000) * 10) / 10;
};

// Convert seconds to readable time
const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

// Calculate pace (min/km)
const calculatePace = (seconds: number, meters: number): string => {
  const minutes = seconds / 60;
  const km = meters / 1000;
  const paceMinutes = Math.floor(minutes / km);
  const paceSeconds = Math.round((minutes / km - paceMinutes) * 60);
  return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
};

// Format date relative to today
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'اليوم';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'أمس';
  } else {
    const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 7) {
      return `منذ ${days} أيام`;
    }
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  }
};

export async function fetchStravaStats(): Promise<RunningStats | null> {
  try {
    // Check if credentials are available
    const clientId = import.meta.env.STRAVA_CLIENT_ID;
    const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
    const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;
    
    if (!clientId || !clientSecret || !refreshToken) {
      console.log('Strava credentials not configured');
      // Return mock data for development
      const mockYearDistance = 450.7;
      const annualGoal = 750; // km
      return {
        thisWeek: {
          distance: 24.5,
          time: 135,
          runs: 3
        },
        thisMonth: {
          distance: 98.3,
          runs: 12
        },
        thisYear: {
          distance: mockYearDistance,
          runs: 58,
          progress: Math.min(100, Math.round((mockYearDistance / annualGoal) * 100))
        },
        recentActivities: [
          {
            id: 12345678,
            name: 'جري صباحي',
            distance: 10.2,
            time: '52 min',
            date: 'أمس',
            pace: '5:06'
          },
          {
            id: 12345679,
            name: 'جري مسائي سريع',
            distance: 5.5,
            time: '25 min',
            date: 'منذ 3 أيام',
            pace: '4:32'
          },
          {
            id: 12345680,
            name: 'جري طويل نهاية الأسبوع',
            distance: 15.0,
            time: '1h 22m',
            date: 'منذ 5 أيام',
            pace: '5:28'
          }
        ]
      };
    }
    
    // Get new access token using refresh token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to refresh Strava token');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // First get the athlete ID
    const athleteResponse = await fetch(
      'https://www.strava.com/api/v3/athlete',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!athleteResponse.ok) {
      throw new Error('Failed to fetch athlete data');
    }
    
    const athleteData = await athleteResponse.json();
    const athleteId = athleteData.id;
    
    // Fetch athlete stats
    const statsResponse = await fetch(
      `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!statsResponse.ok) {
      throw new Error('Failed to fetch Strava stats');
    }
    
    const stats: StravaStats = await statsResponse.json();
    
    // Try to fetch recent activities, but don't fail if it doesn't work
    let runningActivities: StravaActivity[] = [];
    try {
      const activitiesResponse = await fetch(
        'https://www.strava.com/api/v3/athlete/activities?per_page=10',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (activitiesResponse.ok) {
        const activities: StravaActivity[] = await activitiesResponse.json();
        // Filter only public running activities
        runningActivities = activities.filter(a => 
          (a.type === 'Run' || a.type === 'VirtualRun' || a.type === 'Walk') &&
          !a.private // Only include public activities
        ).slice(0, 3);
        console.log(`Found ${runningActivities.length} public running activities`);
      } else {
        const errorText = await activitiesResponse.text();
        console.warn(`Could not fetch Strava activities (${activitiesResponse.status}): ${errorText}`);
      }
    } catch (activityError) {
      console.warn('Error fetching activities:', activityError);
      // Continue without activities
    }
    
    // Calculate stats
    const weeklyDistance = metersToKm(stats.recent_run_totals.distance / 4); // Average of last 4 weeks
    const yearDistance = metersToKm(stats.ytd_run_totals.distance);
    const annualGoal = 750; // km - Annual target (updated)
    const yearProgress = Math.min(100, Math.round((yearDistance / annualGoal) * 100));
    
    return {
      thisWeek: {
        distance: weeklyDistance,
        time: Math.round(stats.recent_run_totals.moving_time / 4 / 60), // minutes
        runs: Math.round(stats.recent_run_totals.count / 4)
      },
      thisMonth: {
        distance: metersToKm(stats.recent_run_totals.distance),
        runs: stats.recent_run_totals.count
      },
      thisYear: {
        distance: yearDistance,
        runs: stats.ytd_run_totals.count,
        progress: yearProgress
      },
      recentActivities: runningActivities.map(activity => ({
        id: activity.id,
        name: activity.name,
        distance: metersToKm(activity.distance),
        time: secondsToTime(activity.moving_time),
        date: formatRelativeDate(activity.start_date),
        pace: calculatePace(activity.moving_time, activity.distance)
      }))
    };
    
  } catch (error) {
    console.error('Error fetching Strava data:', error);
    return null;
  }
}