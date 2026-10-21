import type { Article, ArticleCategory, ArticleLanguage } from '../types';
import { getLocalizedArticle } from './articleLocalization';

export const ARTICLE_CATEGORIES = ['standards', 'papers', 'technical'] as const;

export function isArticleCategory(value: unknown): value is ArticleCategory {
  return ARTICLE_CATEGORIES.some(category => category === value);
}

/** Keep older editor exports compatible when no editorial category was stored. */
export function getArticleCategory(article: Pick<Article, 'category' | 'area'>): ArticleCategory {
  if (isArticleCategory(article.category)) return article.category;
  if (article.area === 'Technical Standards' || article.area === 'Regulation Update') return 'standards';
  if (article.area === 'Paper Review') return 'papers';
  return 'technical';
}

const normalizeSearch = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();

export function filterStudyArticles(
  articles: Article[], language: ArticleLanguage, category: ArticleCategory | 'all', query: string,
): Article[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return articles.filter(article => article.published === true
    && (category === 'all' || getArticleCategory(article) === category))
    .map(article => getLocalizedArticle({ ...article, category: getArticleCategory(article) }, language))
    .filter(article => {
      const text = normalizeSearch([article.title, article.summary, article.area, ...(article.tags ?? [])].join(' '));
      return terms.every(term => text.includes(term));
    });
}
