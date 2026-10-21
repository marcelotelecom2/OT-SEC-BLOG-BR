import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ArticleLanguage } from '../types';
import { safeGetItem, safeSetItem } from '../lib/persistence';
import { RADAR_TRANSLATIONS } from '../constants/radarTranslations';
import { ABOUT_TRANSLATIONS } from '../constants/aboutTranslations';
export { getLocalizedArticle } from '../lib/articleLocalization';

export type Language = ArticleLanguage;
export const DEFAULT_LANGUAGE: Language = 'en';

export function resolveLanguagePreference(saved: string | null): Language {
  return saved === 'en' || saved === 'pt' || saved === 'es' ? saved : DEFAULT_LANGUAGE;
}

export function resolveLanguageFromPath(pathname: string): Language | null {
  const language = pathname.match(/^\/(en|pt|es)\/articles\//)?.[1];
  return language === 'en' || language === 'pt' || language === 'es' ? language : null;
}

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', shortLabel: 'PT', flag: '🇧🇷' },
  { code: 'es', label: 'Español', shortLabel: 'ES', flag: '🇪🇸' },
];

export const TRANSLATIONS = {
  en: {
    radar: RADAR_TRANSLATIONS.en,
    nav: {
      home: 'Home',
      articles: 'Studies & Analyses',
      insights: 'OT Radar',
      projects: 'Projects',
      about: 'About',
      search: 'Search articles',
      switchLanguage: 'Language',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      loading: 'LOADING CONTENT...',
    },
    hero: {
      badge: 'SYSTEM.INITIALIZED',
      title1: 'OT-SEC',
      title2: 'Technical Knowledge',
      subtitle: 'Knowledge, technology and security for critical energy infrastructure.',
      btnInsights: 'OT Radar',
      btnArticles: 'Studies & Analyses',
      langLabel: 'SELECT LANGUAGE / IDIOMA',
      langDescription: 'Choose your language for OT-SEC technical content:',
    },
    home: {
      latestTitle: 'Latest Articles',
      latestSubtitle: 'Technical knowledge in OT/ICS cybersecurity for the electric power sector.',
      viewAll: 'View all',
    },
    articles: {
      title: 'Studies & Analyses',
      subtitle: 'Commented standards, commented papers and technical analyses for OT/ICS security.',
      categories: { standards: 'Commented standards', papers: 'Commented papers', technical: 'Technical analyses' },
      categoryLabel: 'Filter by category',
      allCategories: 'All',
      searchLabel: 'Search studies and analyses',
      searchPlaceholder: 'Search by title, summary, topic or tag…',
      results: 'Results: {count}',
      resetFilters: 'Clear filters',
      noResults: 'No publications match this category and search. Try another filter or clear the search.',
      loader: 'FETCHING ARTICLE INDEX...',
      empty: 'No published articles found. Log into Admin Panel to create new articles.',
      minRead: 'min read',
      views: 'views',
    },
    articleDetail: {
      backBtn: 'Back to Articles Index',
      notFoundTitle: '[404] ARTICLE_NOT_FOUND',
      notFoundDesc: 'The requested publication identifier does not exist in the index.',
      returnBtn: 'Return to Articles',
      views: 'views',
      metadataOnlyNotice: 'The title and summary are translated. The article body is available in {language}.',
      untranslatedNotice: 'This article is not available in the selected language. The content below is shown in {language}.',
    },
    insights: {
      title: 'Technical notes archive',
      subtitle: 'Preserved technical notes and references.',
      loader: 'LOADING TECHNICAL NOTES...',
      filterType: 'Content Type:',
      filterTags: 'Technical Tags:',
      all: 'All',
      allTags: 'All Tags',
      resetFilters: 'Reset Filters',
      source: 'Source:',
      noNotes: 'No research notes found matching the selected filter criteria.',
      empty: 'No technical notes are available in this archive.',
    },
    projects: {
      title: 'Project archive',
      subtitle: 'Preserved project and tool references. This archive does not represent OT-SEC research or services.',
      empty: 'No verified projects have been published yet.',
      loader: 'LOADING REPOSITORIES...',
      viewGithub: 'View on GitHub',
      liveDemo: 'Live Demo',
    },
    about: ABOUT_TRANSLATIONS.en,
    footer: {
      desc: 'An independent knowledge initiative in OT/ICS cybersecurity for critical electric power infrastructure. Technical studies, analyses and sector updates.',
      sitemap: 'Sitemap',
      connect: 'Connect',
      newsletter: 'Newsletter',
      newsletterPlaceholder: 'name@example.com',
      newsletterBtn: 'Join',
      copyright: 'OT-SEC. All rights reserved.',
      systemOnline: 'SYSTEM.ONLINE',
    },
  },
  pt: {
    radar: RADAR_TRANSLATIONS.pt,
    nav: {
      home: 'Início',
      articles: 'Estudos & Análises',
      insights: 'Radar OT',
      projects: 'Projetos',
      about: 'Sobre',
      search: 'Buscar artigos',
      switchLanguage: 'Idioma',
      openMenu: 'Abrir menu de navegação',
      closeMenu: 'Fechar menu de navegação',
      loading: 'CARREGANDO CONTEÚDO...',
    },
    hero: {
      badge: 'SISTEMA.INICIALIZADO',
      title1: 'OT-SEC',
      title2: 'Conhecimento Técnico',
      subtitle: 'Conhecimento, tecnologia e segurança para infraestruturas críticas de energia.',
      btnInsights: 'Radar OT',
      btnArticles: 'Estudos & Análises',
      langLabel: 'ESCOLHA O IDIOMA / SELECT LANGUAGE',
      langDescription: 'Selecione o idioma de sua preferência para o conteúdo técnico do OT-SEC:',
    },
    home: {
      latestTitle: 'Artigos Recentes',
      latestSubtitle: 'Conhecimento técnico em cibersegurança OT/ICS para o setor elétrico.',
      viewAll: 'Ver todos',
    },
    articles: {
      title: 'Estudos & Análises',
      subtitle: 'Normas comentadas, papers comentados e análises técnicas para a segurança OT/ICS.',
      categories: { standards: 'Normas comentadas', papers: 'Papers comentados', technical: 'Análises técnicas' },
      categoryLabel: 'Filtrar por categoria',
      allCategories: 'Todos',
      searchLabel: 'Buscar estudos e análises',
      searchPlaceholder: 'Buscar por título, resumo, assunto ou tag…',
      results: 'Resultados: {count}',
      resetFilters: 'Limpar filtros',
      noResults: 'Nenhuma publicação corresponde à categoria e à busca. Experimente outro filtro ou limpe a busca.',
      loader: 'CARREGANDO ÍNDICE DE ARTIGOS...',
      empty: 'Nenhum artigo publicado encontrado. Acesse o Painel Admin para criar artigos.',
      minRead: 'min de leitura',
      views: 'visualizações',
    },
    articleDetail: {
      backBtn: 'Voltar ao Índice de Artigos',
      notFoundTitle: '[404] ARTIGO_NÃO_ENCONTRADO',
      notFoundDesc: 'O identificador da publicação solicitada não existe no índice.',
      returnBtn: 'Retornar aos Artigos',
      views: 'visualizações',
      metadataOnlyNotice: 'O título e o resumo estão traduzidos. O corpo do artigo está disponível em {language}.',
      untranslatedNotice: 'Este artigo não está disponível no idioma selecionado. O conteúdo abaixo é exibido em {language}.',
    },
    insights: {
      title: 'Arquivo de notas técnicas',
      subtitle: 'Notas técnicas e referências preservadas.',
      loader: 'CARREGANDO NOTAS TÉCNICAS...',
      filterType: 'Tipo de Conteúdo:',
      filterTags: 'Tags Técnicas:',
      all: 'Todos',
      allTags: 'Todas as Tags',
      resetFilters: 'Limpar Filtros',
      source: 'Fonte:',
      noNotes: 'Nenhuma nota de pesquisa encontrada com os filtros selecionados.',
      empty: 'Não há notas técnicas disponíveis neste arquivo.',
    },
    projects: {
      empty: 'Nenhum projeto verificado foi publicado até o momento.',
      title: 'Arquivo de projetos',
      subtitle: 'Referências de projetos e ferramentas preservadas. Este arquivo não representa pesquisas ou serviços do OT-SEC.',
      loader: 'CARREGANDO REPOSITÓRIOS...',
      viewGithub: 'Ver Código no GitHub',
      liveDemo: 'Demonstração Ao Vivo',
    },
    about: ABOUT_TRANSLATIONS.pt,
    footer: {
      desc: 'Iniciativa independente de conhecimento em cibersegurança OT/ICS para a infraestrutura crítica de energia elétrica. Estudos, análises técnicas e atualizações do setor.',
      sitemap: 'Mapa do Site',
      connect: 'Conectar',
      newsletter: 'Boletim Informativo',
      newsletterPlaceholder: 'seu-email@exemplo.com',
      newsletterBtn: 'Inscrever',
      copyright: 'OT-SEC. Todos os direitos reservados.',
      systemOnline: 'SISTEMA.ONLINE',
    },
  },
  es: {
    radar: RADAR_TRANSLATIONS.es,
    nav: {
      home: 'Inicio',
      articles: 'Estudios y Análisis',
      insights: 'Radar OT',
      projects: 'Proyectos',
      about: 'Acerca de',
      search: 'Buscar artículos',
      switchLanguage: 'Idioma',
      openMenu: 'Abrir menú de navegación',
      closeMenu: 'Cerrar menú de navegación',
      loading: 'CARGANDO CONTENIDO...',
    },
    hero: {
      badge: 'SISTEMA.INICIALIZADO',
      title1: 'OT-SEC',
      title2: 'Conocimiento Técnico',
      subtitle: 'Conocimiento, tecnología y seguridad para infraestructuras críticas de energía.',
      btnInsights: 'Radar OT',
      btnArticles: 'Estudios y Análisis',
      langLabel: 'SELECCIONAR IDIOMA / LANGUAGE',
      langDescription: 'Elija su idioma para el contenido técnico de OT-SEC:',
    },
    home: {
      latestTitle: 'Artículos Recientes',
      latestSubtitle: 'Conocimiento técnico en ciberseguridad OT/ICS para el sector eléctrico.',
      viewAll: 'Ver todos',
    },
    articles: {
      title: 'Estudios y Análisis',
      subtitle: 'Normas comentadas, papers comentados y análisis técnicos para la seguridad OT/ICS.',
      categories: { standards: 'Normas comentadas', papers: 'Papers comentados', technical: 'Análisis técnicos' },
      categoryLabel: 'Filtrar por categoría',
      allCategories: 'Todos',
      searchLabel: 'Buscar estudios y análisis',
      searchPlaceholder: 'Buscar por título, resumen, tema o etiqueta…',
      results: 'Resultados: {count}',
      resetFilters: 'Limpiar filtros',
      noResults: 'Ninguna publicación coincide con la categoría y la búsqueda. Prueba otro filtro o borra la búsqueda.',
      loader: 'OBTENIENDO ÍNDICE DE ARTÍCULOS...',
      empty: 'No se encontraron artículos publicados. Inicie sesión en el Panel Admin para crear artículos.',
      minRead: 'min de lectura',
      views: 'vistas',
    },
    articleDetail: {
      backBtn: 'Volver al Índice de Artículos',
      notFoundTitle: '[404] ARTÍCULO_NO_ENCONTRADO',
      notFoundDesc: 'El identificador de publicación solicitado no existe en el índice.',
      returnBtn: 'Volver a Artículos',
      views: 'vistas',
      metadataOnlyNotice: 'El título y el resumen están traducidos. El cuerpo del artículo está disponible en {language}.',
      untranslatedNotice: 'Este artículo no está disponible en el idioma seleccionado. El contenido se muestra en {language}.',
    },
    insights: {
      title: 'Archivo de notas técnicas',
      subtitle: 'Notas técnicas y referencias conservadas.',
      loader: 'CARGANDO NOTAS TÉCNICAS...',
      filterType: 'Tipo de Contenido:',
      filterTags: 'Etiquetas Técnicas:',
      all: 'Todos',
      allTags: 'Todas las Etiquetas',
      resetFilters: 'Restablecer Filtros',
      source: 'Fuente:',
      noNotes: 'No se encontraron notas de investigación que coincidan con los filtros seleccionados.',
      empty: 'No hay notas técnicas disponibles en este archivo.',
    },
    projects: {
      empty: 'Todavía no se han publicado proyectos verificados.',
      title: 'Archivo de proyectos',
      subtitle: 'Referencias de proyectos y herramientas conservadas. Este archivo no representa investigaciones ni servicios de OT-SEC.',
      loader: 'CARGANDO REPOSITORIOS...',
      viewGithub: 'Ver en GitHub',
      liveDemo: 'Demostración En Vivo',
    },
    about: ABOUT_TRANSLATIONS.es,
    footer: {
      desc: 'Iniciativa independiente de conocimiento en ciberseguridad OT/ICS para la infraestructura crítica de energía eléctrica. Estudios, análisis técnicos y novedades del sector.',
      sitemap: 'Mapa del Sitio',
      connect: 'Conectar',
      newsletter: 'Boletín Informativo',
      newsletterPlaceholder: 'tu-correo@ejemplo.com',
      newsletterBtn: 'Suscribir',
      copyright: 'OT-SEC. Todos los derechos reservados.',
      systemOnline: 'SISTEMA.ONLINE',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    return resolveLanguageFromPath(window.location.pathname)
      ?? resolveLanguagePreference(safeGetItem('ot_sec_language'));
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      safeSetItem('ot_sec_language', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
