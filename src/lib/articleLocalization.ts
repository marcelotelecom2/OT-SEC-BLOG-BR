import type { Article, ArticleLanguage } from '../types';

export interface LocalizedArticleResult {
  article: Article;
  requestedLanguage: ArticleLanguage;
  contentLanguage: ArticleLanguage;
  metadataTranslated: boolean;
  bodyTranslated: boolean;
}

export function localizeArticle(article: Article, language: ArticleLanguage): LocalizedArticleResult {
  const sourceLanguage = article.sourceLanguage ?? 'pt';
  if (language === sourceLanguage) {
    return {
      article,
      requestedLanguage: language,
      contentLanguage: sourceLanguage,
      metadataTranslated: false,
      bodyTranslated: true,
    };
  }

  const translation = article.translations?.[language];
  const translatedContent = translation?.content?.trim();
  return {
    article: translation ? {
      ...article,
      title: translation.title || article.title,
      summary: translation.summary || article.summary,
      content: translatedContent || article.content,
    } : article,
    requestedLanguage: language,
    contentLanguage: translatedContent ? language : sourceLanguage,
    metadataTranslated: Boolean(translation?.title && translation?.summary),
    bodyTranslated: Boolean(translatedContent),
  };
}

export function getLocalizedArticle(article: Article, language: ArticleLanguage): Article {
  return localizeArticle(article, language).article;
}
