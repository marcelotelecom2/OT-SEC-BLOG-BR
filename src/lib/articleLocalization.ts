import type { Article, ArticleLanguage } from '../types';

export interface LocalizedArticleResult {
  article: Article;
  requestedLanguage: ArticleLanguage;
  contentLanguage: ArticleLanguage;
  metadataTranslated: boolean;
  bodyTranslated: boolean;
}

const AREA_TRANSLATIONS: Record<string, Partial<Record<ArticleLanguage, string>>> = {
  'Artificial Intelligence': { pt: 'Inteligência Artificial', es: 'Inteligencia Artificial' },
  'Vulnerability Analysis': { pt: 'Análise de Vulnerabilidades', es: 'Análisis de Vulnerabilidades' },
  'Network Engineering': { pt: 'Engenharia de Redes', es: 'Ingeniería de Redes' },
  'Regulation Update': { pt: 'Atualização Regulatória', es: 'Actualización Regulatoria' },
  'Technical Standards': { pt: 'Normas Técnicas', es: 'Normas Técnicas' },
  'ICS Security': { pt: 'Segurança ICS', es: 'Seguridad ICS' },
  'Power Grid Security': { pt: 'Segurança de Redes Elétricas', es: 'Seguridad de Redes Eléctricas' },
  'Threat Intelligence': { pt: 'Inteligência de Ameaças', es: 'Inteligencia de Amenazas' },
};

export function localizeReadTime(readTime: string, language: ArticleLanguage): string {
  const minutes = readTime.match(/\d+/)?.[0];
  if (!minutes) return readTime;
  if (language === 'pt') return `${minutes} min de leitura`;
  if (language === 'es') return `${minutes} min de lectura`;
  return `${minutes} min read`;
}

export function localizeArticleArea(area: string, language: ArticleLanguage): string {
  return AREA_TRANSLATIONS[area]?.[language] ?? area;
}

function localizeSharedMetadata(article: Article, language: ArticleLanguage): Article {
  return {
    ...article,
    readTime: localizeReadTime(article.readTime, language),
    area: localizeArticleArea(article.area, language),
  };
}

export function localizeArticle(article: Article, language: ArticleLanguage): LocalizedArticleResult {
  const sourceLanguage = article.sourceLanguage ?? 'pt';
  if (language === sourceLanguage) {
    return {
      article: localizeSharedMetadata(article, language),
      requestedLanguage: language,
      contentLanguage: sourceLanguage,
      metadataTranslated: false,
      bodyTranslated: true,
    };
  }

  const translation = article.translations?.[language];
  const translatedContent = translation?.content?.trim();
  return {
    article: localizeSharedMetadata(translation ? {
      ...article,
      title: translation.title || article.title,
      summary: translation.summary || article.summary,
      content: translatedContent || article.content,
    } : article, language),
    requestedLanguage: language,
    contentLanguage: translatedContent ? language : sourceLanguage,
    metadataTranslated: Boolean(translation?.title && translation?.summary),
    bodyTranslated: Boolean(translatedContent),
  };
}

export function getLocalizedArticle(article: Article, language: ArticleLanguage): Article {
  return localizeArticle(article, language).article;
}
