export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  area: string;
  readTime: string;
  date: string;
  coverImage?: string;
  published: boolean;
  views?: number;
  author?: string;
  updatedAt?: string;
  tags?: string[];
}

export type ContentType =
  | 'Paper Review'
  | 'News Analysis'
  | 'Technology Watch'
  | 'Regulation Update'
  | 'Vulnerability Analysis'
  | 'Industry Watch';

export interface ResearchNote {
  id: string;
  title?: string;
  date: string;
  summary?: string;
  content: string;
  contentType?: ContentType | string;
  tag: string;
  tags?: string[];
  sourceName?: string;
  sourceUrl?: string;
  author?: string;
  published?: boolean;
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
