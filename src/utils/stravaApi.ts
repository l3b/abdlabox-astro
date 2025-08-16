// Strava API Integration
// Fetches running stats at build time

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
    description?: string;
    distance: number;
    time: string;
    date: string;
    pace: string;
    photoUrl?: string;
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

// Format date relative to today (bilingual support)
const formatRelativeDate = (dateString: string, locale: 'ar' | 'en' = 'ar'): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (locale === 'en') {
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (days < 7) {
        return `${days} days ago`;
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } else {
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
  }
};

export async function fetchStravaStats(locale: 'ar' | 'en' = 'ar'): Promise<RunningStats | null> {
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
            name: 'Morning Run',
            description: 'Easy morning run with sunrise',
            distance: 10.2,
            time: '52 min',
            date: locale === 'en' ? 'Yesterday' : 'أمس',
            pace: '5:06'
          },
          {
            id: 12345679,
            name: 'Evening Speed Run',
            description: 'Speed training on the track',
            distance: 5.5,
            time: '25 min',
            date: locale === 'en' ? '3 days ago' : 'منذ 3 أيام',
            pace: '4:32'
          },
          {
            id: 12345680,
            name: 'Weekend Long Run',
            description: 'Long run preparing for next race',
            distance: 15.0,
            time: '1h 22m',
            date: locale === 'en' ? '5 days ago' : 'منذ 5 أيام',
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
    
    // Fetch all activities for the year to calculate accurate YTD totals
    let actualYtdDistance = 0;
    let actualYtdRuns = 0;
    
    try {
      const currentYear = new Date().getFullYear();
      const yearStart = new Date(currentYear, 0, 1).getTime() / 1000; // Unix timestamp
      
      // Fetch up to 200 activities (should cover the whole year)
      const allActivitiesResponse = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${yearStart}&per_page=200`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (allActivitiesResponse.ok) {
        const allActivities: StravaActivity[] = await allActivitiesResponse.json();
        
        // Filter and sum all running/walking activities for the year
        const runningActivities = allActivities.filter(a => 
          a.type === 'Run' || 
          a.type === 'VirtualRun' || 
          a.type === 'TrailRun' || 
          a.type === 'Walk' || 
          a.type === 'Hike'
        );
        
        actualYtdRuns = runningActivities.length;
        actualYtdDistance = metersToKm(runningActivities.reduce((sum, activity) => sum + activity.distance, 0));
        
        console.log(`Calculated YTD totals: ${actualYtdRuns} activities, ${actualYtdDistance} km (includes Trail Runs & Walks)`);
        console.log(`API ytd_run_totals: ${stats.ytd_run_totals.count} runs, ${metersToKm(stats.ytd_run_totals.distance)} km (Run type only)`);
      }
    } catch (error) {
      console.warn('Could not calculate actual YTD totals, using API stats:', error);
      actualYtdDistance = metersToKm(stats.ytd_run_totals.distance);
      actualYtdRuns = stats.ytd_run_totals.count;
    }
    
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
        // Filter only public running/walking activities - include all types
        const publicActivities = activities.filter(a => 
          (a.type === 'Run' || 
           a.type === 'VirtualRun' || 
           a.type === 'TrailRun' || 
           a.type === 'Walk' || 
           a.type === 'Hike') &&
          !a.private // Only include public activities
        ).slice(0, 3);
        
        // Fetch detailed data for each activity to get descriptions and photos
        runningActivities = [];
        for (const activity of publicActivities) {
          try {
            const detailResponse = await fetch(
              `https://www.strava.com/api/v3/activities/${activity.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              }
            );
            
            if (detailResponse.ok) {
              const detailedActivity = await detailResponse.json();
              runningActivities.push(detailedActivity);
            } else {
              // If detail fetch fails, use the basic activity
              runningActivities.push(activity);
            }
          } catch (detailError) {
            console.warn(`Could not fetch details for activity ${activity.id}:`, detailError);
            // Use basic activity if detail fetch fails
            runningActivities.push(activity);
          }
        }
        
        console.log(`Found ${runningActivities.length} public running activities with details`);
      } else {
        const errorText = await activitiesResponse.text();
        console.warn(`Could not fetch Strava activities (${activitiesResponse.status}): ${errorText}`);
      }
    } catch (activityError) {
      console.warn('Error fetching activities:', activityError);
      // Continue without activities
    }
    
    // Calculate stats - use actualYtdDistance if we calculated it, otherwise fall back to API stats
    const weeklyDistance = metersToKm(stats.recent_run_totals.distance / 4); // Average of last 4 weeks
    const yearDistance = actualYtdDistance || metersToKm(stats.ytd_run_totals.distance);
    const yearRuns = actualYtdRuns || stats.ytd_run_totals.count;
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
        runs: yearRuns,
        progress: yearProgress
      },
      recentActivities: runningActivities.map(activity => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        distance: metersToKm(activity.distance),
        time: secondsToTime(activity.moving_time),
        date: formatRelativeDate(activity.start_date, locale),
        pace: calculatePace(activity.moving_time, activity.distance),
        photoUrl: activity.photos?.primary?.urls?.['600']
      }))
    };
    
  } catch (error) {
    console.error('Error fetching Strava data:', error);
    return null;
  }
}