export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  area: string;
  readTime: string;
  date: string;
  coverImage?: string;
  published: boolean;
  views?: number;
}

export interface ResearchNote {
  id: string;
  date: string;
  tag: string;
  content: string;
  author?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE RESEARCH' | 'RELEASED' | 'BETA' | 'CONCEPT';
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadDate: string;
  dimensions?: string;
}

export interface AnalyticsKPIs {
  totalVisitors: number;
  pageViews: number;
  uniqueIPs: number;
  avgTimeOnSite: string;
  bounceRate: string;
  trafficSources: { name: string; value: number; color: string }[];
  hourlyTraffic: { hour: string; views: number; visitors: number }[];
  pageViewCounts: Record<string, number>;
  recentEvents: { id: string; time: string; event: string; ip: string; location: string }[];
}
