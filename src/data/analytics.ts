
interface AnalyticsConfig {
  googleAnalytics: {
    id: string;
  };
  mixpanel: {
    token: string;
  };
  clarity: {
    projectId: string;
  };
}

export const analyticsConfig: AnalyticsConfig = {
  googleAnalytics: {
    id: "G-NPJ3GB4J5J",
  },
  mixpanel: {
    token: "0df4e7563753bb31d3c1799662244a07",
  },
  clarity: {
    projectId: "rcrw6ep32i",
  },
};
