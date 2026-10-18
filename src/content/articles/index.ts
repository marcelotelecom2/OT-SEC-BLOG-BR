import type { Article } from '../../types';
import { ARTICLES_METADATA } from './metadata';

export { ARTICLES_METADATA };

const contents = import.meta.glob<string>('./*.md', {
  query: '?raw', import: 'default', eager: true,
});

export const PUBLISHED_ARTICLES: Article[] = ARTICLES_METADATA.map(({ contentFile, ...meta }) => {
  const content = contents[`./${contentFile}`];
  if (content === undefined) throw new Error(`Conteúdo não encontrado: ${contentFile}`);
  return { ...meta, content };
});
