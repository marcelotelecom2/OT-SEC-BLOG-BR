export interface SiteAnalytics {
  source: 'Cloudflare Web Analytics';
  start: string;
  end: string;
  visits: number;
  pageViews: number;
}

export const analyticsDashboardUrl = 'https://dash.cloudflare.com/4729b34deb4cf5a7f8033d8519eaf6ad/web-analytics/overview?siteTag~in=e497662b337b4a6ebb3c397563bc10f6';
