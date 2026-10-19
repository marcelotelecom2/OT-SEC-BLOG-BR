import type { Article, ArticleLanguage, ArticleTranslation } from '../types';

export type ArticleTranslationMetadata = Omit<ArticleTranslation, 'content'> & {
  /** Optional Markdown file for a fully translated body. */
  contentFile?: string;
};

export type ArticleMetadata = Omit<Article, 'content' | 'translations'> & {
  contentFile: string;
  translations?: Partial<Record<ArticleLanguage, ArticleTranslationMetadata>>;
};
