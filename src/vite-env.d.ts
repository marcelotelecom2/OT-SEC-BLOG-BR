/// <reference types="vite/client" />

declare module 'virtual:published-articles' {
  export const PUBLISHED_ARTICLES: import('./types').Article[];
  export const PUBLISHED_PROJECTS: import('./types').Project[];
  export const PUBLISHED_NOTES: import('./types').ResearchNote[];
  export const PUBLISHED_RADAR: import('./types').RadarPublication[];
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
