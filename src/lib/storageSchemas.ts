import type { Article, ResearchNote, Project, MediaItem, AnalyticsKPIs } from '../types';

const record = (value: unknown): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value);
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const optionalStrings = (value: Record<string, any>, fields: string[]) => fields.every(field => value[field] === undefined || typeof value[field] === 'string');
const optionalTags = (value: Record<string, any>) => value.tags === undefined || strings(value.tags);
const articleLanguages = ['en', 'pt', 'es'];
const optionalTranslations = (value: Record<string, any>) => value.translations === undefined
  || (record(value.translations) && Object.entries(value.translations).every(([language, translation]) =>
    articleLanguages.includes(language) && record(translation)
    && typeof translation.title === 'string' && typeof translation.summary === 'string'
    && (translation.content === undefined || typeof translation.content === 'string')));

export const isArticleArray = (value: unknown): value is Article[] => Array.isArray(value) && value.every(item =>
  record(item) && typeof item.id === 'string' && typeof item.title === 'string'
  && optionalStrings(item, ['slug', 'summary', 'content', 'area', 'readTime', 'date', 'coverImage', 'author', 'updatedAt'])
  && optionalTags(item) && (item.published === undefined || typeof item.published === 'boolean')
  && (item.sourceLanguage === undefined || articleLanguages.includes(item.sourceLanguage))
  && optionalTranslations(item)
  && (item.views === undefined || (typeof item.views === 'number' && Number.isFinite(item.views) && item.views >= 0)));
export const isStringArray = strings;
export const isViewCounts = (value: unknown): value is Record<string, number> => record(value)
  && Object.values(value).every(count => typeof count === 'number' && Number.isFinite(count) && count >= 0);
export const isNoteArray = (value: unknown): value is ResearchNote[] => Array.isArray(value) && value.every(item =>
  record(item) && ['id', 'date', 'tag', 'content'].every(field => typeof item[field] === 'string')
  && optionalStrings(item, ['title', 'summary', 'contentType', 'sourceName', 'sourceUrl', 'author'])
  && optionalTags(item) && (item.published === undefined || typeof item.published === 'boolean'));
export const isProjectArray = (value: unknown): value is Project[] => Array.isArray(value) && value.every(item =>
  record(item) && ['id', 'title', 'description', 'status'].every(field => typeof item[field] === 'string')
  && strings(item.tags) && optionalStrings(item, ['githubUrl', 'demoUrl', 'coverImage']));
export const isMediaArray = (value: unknown): value is MediaItem[] => Array.isArray(value) && value.every(item =>
  record(item) && ['id', 'name', 'url', 'type', 'size', 'uploadDate'].every(field => typeof item[field] === 'string')
  && optionalStrings(item, ['dimensions']));
export const isAnalytics = (value: unknown): value is AnalyticsKPIs => record(value)
  && ['totalVisitors', 'pageViews', 'uniqueIPs'].every(field => typeof value[field] === 'number' && Number.isFinite(value[field]))
  && ['avgTimeOnSite', 'bounceRate'].every(field => typeof value[field] === 'string')
  && isViewCounts(value.pageViewCounts)
  && Array.isArray(value.recentEvents) && value.recentEvents.every(item => record(item) && ['id', 'time', 'event', 'ip', 'location'].every(field => typeof item[field] === 'string'))
  && Array.isArray(value.trafficSources) && value.trafficSources.every(item => record(item) && typeof item.name === 'string' && typeof item.value === 'number' && typeof item.color === 'string')
  && Array.isArray(value.hourlyTraffic) && value.hourlyTraffic.every(item => record(item) && typeof item.hour === 'string' && typeof item.views === 'number' && typeof item.visitors === 'number');
