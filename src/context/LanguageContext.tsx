import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ArticleLanguage } from '../types';
import { safeGetItem, safeSetItem } from '../lib/persistence';
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
    nav: {
      home: 'Home',
      articles: 'Articles',
      insights: 'Research',
      projects: 'Projects',
      about: 'About',
      search: 'Search articles',
      switchLanguage: 'Language',
    },
    hero: {
      badge: 'SYSTEM.INITIALIZED',
      title1: 'OT-SEC Digital',
      title2: 'Research Lab',
      subtitle: 'Independent OT/ICS cybersecurity research for critical electric power infrastructure, with technical standards studies and applied research.',
      btnInsights: 'Explore Research',
      btnArticles: 'Latest Articles',
      langLabel: 'SELECT LANGUAGE / IDIOMA',
      langDescription: 'Choose your language preference for lab research and documentation:',
    },
    home: {
      latestTitle: 'Latest Articles',
      latestSubtitle: 'Technical articles, standards studies and analyses.',
      viewAll: 'View Articles',
      minRead: 'min read',
      views: 'views',
      areasTitle: 'Areas of Interest',
      areasSubtitle: 'OT/ICS cybersecurity and related research areas for electric power systems.',
      area1Title: 'Industrial Cybersecurity',
      area1Desc: 'Study of threats, risks and security controls in electric power OT/ICS systems, informed by technical standards.',
      area2Title: 'Artificial Intelligence',
      area2Desc: 'Investigation of AI methods for data analysis, anomaly detection and cybersecurity support in electric power systems.',
      area3Title: 'Network Engineering',
      area3Desc: 'Study of industrial network architectures and protocols for electric power systems, including segmentation, secure communication and IT/OT integration.',
      notesTitle: 'Live Lab Field Notes',
      notesSubtitle: 'Records of the lab’s own investigations, methods and results.',
      btnGoInsights: 'Go to Research',
      source: 'Source:',
    },
    articles: {
      title: 'Articles',
      subtitle: 'Long-form publications and technical deep dives.',
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
      title: 'Research & Field Notes',
      subtitle: 'Original investigations, technical results and work developed by the lab.',
      loader: 'DECRYPTING LAB NOTES...',
      filterType: 'Content Type:',
      filterTags: 'Technical Tags:',
      all: 'All',
      allTags: 'All Tags',
      resetFilters: 'Reset Filters',
      source: 'Source:',
      noNotes: 'No research notes found matching the selected filter criteria.',
      empty: 'No original lab research has been published yet.',
    },
    projects: {
      title: 'Projects & Tools',
      subtitle: 'Applied research, open-source tools, and threat intelligence platforms.',
      loader: 'LOADING REPOSITORIES...',
      viewGithub: 'View on GitHub',
      liveDemo: 'Live Demo',
    },
    about: {
      title: 'About the Lab',
      subtitle: 'Research focus, purpose and approach to study.',
      intro: 'OT-SEC Digital Research Lab is an independent industrial cybersecurity research initiative focused on OT/ICS systems in critical electric power infrastructure.',
      missionTitle: 'Our Mission',
      missionText: 'Organize and share technical standards studies, security analyses and applied research for electric power systems, distinguishing normative sources, technical interpretations and original results.',
      methodTitle: 'Research Approach',
      offensiveTitle: 'Standards and OT/ICS Security',
      offensiveText: 'Study of technical standards, threats and security controls for electric power systems, identifying sources and separating standards summaries from author analysis.',
      protocolTitle: 'Industrial Networks and AI',
      protocolText: 'Investigation of protocols, network architectures and AI methods applicable to data analysis and security in OT/ICS environments.',
      contactTitle: 'Contact & Collaboration',
      contactText: 'The lab is interested in technical exchange on electric power systems, standards and OT/ICS cybersecurity. Collaboration proposals should specify their scope and reference sources.',
      pgpFingerprint: 'PGP:',
      pgpStatus: 'A public PGP key is not yet available.',
    },
    footer: {
      desc: 'Independent OT/ICS cybersecurity research for critical electric power infrastructure, with technical standards studies and applied research.',
      sitemap: 'Sitemap',
      connect: 'Connect',
      newsletter: 'Newsletter',
      newsletterPlaceholder: 'name@example.com',
      newsletterBtn: 'Join',
      copyright: 'OT-SEC Digital Research Lab. All rights reserved.',
      systemOnline: 'SYSTEM.ONLINE',
    },
  },
  pt: {
    nav: {
      home: 'Início',
      articles: 'Artigos',
      insights: 'Pesquisas',
      projects: 'Projetos',
      about: 'Sobre',
      search: 'Buscar artigos',
      switchLanguage: 'Idioma',
    },
    hero: {
      badge: 'SISTEMA.INICIALIZADO',
      title1: 'OT-SEC Digital',
      title2: 'Research Lab',
      subtitle: 'Pesquisa independente em cibersegurança OT/ICS para a infraestrutura crítica de energia elétrica, com estudos de normas e pesquisa aplicada.',
      btnInsights: 'Explorar Pesquisas',
      btnArticles: 'Últimos Artigos',
      langLabel: 'ESCOLHA O IDIOMA / SELECT LANGUAGE',
      langDescription: 'Selecione o idioma de sua preferência para as pesquisas e documentações:',
    },
    home: {
      latestTitle: 'Artigos Recentes',
      latestSubtitle: 'Artigos técnicos, estudos de normas e análises.',
      viewAll: 'Ver Artigos',
      minRead: 'min de leitura',
      views: 'views',
      areasTitle: 'Áreas de Interesse',
      areasSubtitle: 'Cibersegurança OT/ICS e áreas de investigação relacionadas aos sistemas elétricos.',
      area1Title: 'Cibersegurança Industrial',
      area1Desc: 'Estudo de ameaças, riscos e controles de segurança em sistemas OT/ICS do setor elétrico, com apoio de normas técnicas.',
      area2Title: 'Inteligência Artificial',
      area2Desc: 'Investigação de métodos de IA para análise de dados, detecção de anomalias e apoio à cibersegurança de sistemas elétricos.',
      area3Title: 'Engenharia de Redes',
      area3Desc: 'Estudo de arquiteturas e protocolos de redes industriais do setor elétrico, incluindo segmentação, comunicação segura e integração IT/OT.',
      notesTitle: 'Notas de Campo do Lab',
      notesSubtitle: 'Registros de investigações, métodos e resultados próprios do laboratório.',
      btnGoInsights: 'Ir para Pesquisas',
      source: 'Fonte:',
    },
    articles: {
      title: 'Artigos',
      subtitle: 'Publicações detalhadas, relatórios técnicos e análises aprofundadas.',
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
      title: 'Pesquisas & Notas de Campo',
      subtitle: 'Investigações originais, resultados técnicos e trabalhos desenvolvidos pelo laboratório.',
      loader: 'DESCRIPTOGRAFANDO NOTAS DO LAB...',
      filterType: 'Tipo de Conteúdo:',
      filterTags: 'Tags Técnicas:',
      all: 'Todos',
      allTags: 'Todas as Tags',
      resetFilters: 'Limpar Filtros',
      source: 'Fonte:',
      noNotes: 'Nenhuma nota de pesquisa encontrada com os filtros selecionados.',
      empty: 'Ainda não há pesquisas próprias do laboratório publicadas.',
    },
    projects: {
      title: 'Projetos & Ferramentas',
      subtitle: 'Pesquisa aplicada, ferramentas de código aberto e plataformas de threat intelligence.',
      loader: 'CARREGANDO REPOSITÓRIOS...',
      viewGithub: 'Ver Código no GitHub',
      liveDemo: 'Demonstração Ao Vivo',
    },
    about: {
      title: 'Sobre o Laboratório',
      subtitle: 'Foco de pesquisa, propósito e abordagem de estudo.',
      intro: 'O OT-SEC Digital Research Lab é uma iniciativa de pesquisa independente em cibersegurança industrial, com foco em sistemas OT/ICS da infraestrutura crítica de energia elétrica.',
      missionTitle: 'Nossa Missão',
      missionText: 'Organizar e compartilhar estudos de normas técnicas, análises de segurança e pesquisas aplicadas aos sistemas elétricos, distinguindo fontes normativas, interpretações técnicas e resultados próprios.',
      methodTitle: 'Abordagem de Pesquisa',
      offensiveTitle: 'Normas e Segurança OT/ICS',
      offensiveText: 'Estudo de normas técnicas, ameaças e controles de segurança para sistemas elétricos, com identificação das fontes e separação entre síntese normativa e análise do autor.',
      protocolTitle: 'Redes Industriais e IA',
      protocolText: 'Investigação de protocolos, arquiteturas de rede e métodos de IA aplicáveis à análise de dados e à segurança de ambientes OT/ICS.',
      contactTitle: 'Contato & Colaboração',
      contactText: 'O laboratório tem interesse em intercâmbio técnico sobre sistemas elétricos, normas e cibersegurança OT/ICS. Propostas de colaboração devem indicar escopo e fontes de referência.',
      pgpFingerprint: 'PGP:',
      pgpStatus: 'Chave pública PGP ainda não disponibilizada.',
    },
    footer: {
      desc: 'Pesquisa independente em cibersegurança OT/ICS para a infraestrutura crítica de energia elétrica, com estudos de normas e pesquisa aplicada.',
      sitemap: 'Mapa do Site',
      connect: 'Conectar',
      newsletter: 'Boletim Informativo',
      newsletterPlaceholder: 'seu-email@exemplo.com',
      newsletterBtn: 'Inscrever',
      copyright: 'OT-SEC Digital Research Lab. Todos os direitos reservados.',
      systemOnline: 'SISTEMA.ONLINE',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      articles: 'Artículos',
      insights: 'Investigaciones',
      projects: 'Proyectos',
      about: 'Acerca de',
      search: 'Buscar artículos',
      switchLanguage: 'Idioma',
    },
    hero: {
      badge: 'SISTEMA.INICIALIZADO',
      title1: 'OT-SEC Digital',
      title2: 'Research Lab',
      subtitle: 'Investigación independiente en ciberseguridad OT/ICS para infraestructura crítica de energía eléctrica, con estudios de normas e investigación aplicada.',
      btnInsights: 'Explorar Investigaciones',
      btnArticles: 'Últimos Artículos',
      langLabel: 'SELECCIONAR IDIOMA / LANGUAGE',
      langDescription: 'Elija su preferencia de idioma para las investigaciones y documentación:',
    },
    home: {
      latestTitle: 'Artículos Recientes',
      latestSubtitle: 'Artículos técnicos, estudios de normas y análisis.',
      viewAll: 'Ver Artículos',
      minRead: 'min de lectura',
      views: 'vistas',
      areasTitle: 'Áreas de Interés',
      areasSubtitle: 'Ciberseguridad OT/ICS y áreas de investigación relacionadas con los sistemas eléctricos.',
      area1Title: 'Ciberseguridad Industrial',
      area1Desc: 'Estudio de amenazas, riesgos y controles de seguridad en sistemas OT/ICS del sector eléctrico, con apoyo de normas técnicas.',
      area2Title: 'Inteligencia Artificial',
      area2Desc: 'Investigación de métodos de IA para análisis de datos, detección de anomalías y apoyo a la ciberseguridad de sistemas eléctricos.',
      area3Title: 'Ingeniería de Redes',
      area3Desc: 'Estudio de arquitecturas y protocolos de redes industriales del sector eléctrico, incluyendo segmentación, comunicación segura e integración IT/OT.',
      notesTitle: 'Notas de Campo del Lab',
      notesSubtitle: 'Registros de investigaciones, métodos y resultados propios del laboratorio.',
      btnGoInsights: 'Ir a Investigaciones',
      source: 'Fuente:',
    },
    articles: {
      title: 'Artículos',
      subtitle: 'Publicaciones técnicas detalladas e investigaciones en profundidad.',
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
      title: 'Investigaciones & Notas de Campo',
      subtitle: 'Investigaciones originales, resultados técnicos y trabajos desarrollados por el laboratorio.',
      loader: 'DESCIFRANDO NOTAS DEL LAB...',
      filterType: 'Tipo de Contenido:',
      filterTags: 'Etiquetas Técnicas:',
      all: 'Todos',
      allTags: 'Todas las Etiquetas',
      resetFilters: 'Restablecer Filtros',
      source: 'Fuente:',
      noNotes: 'No se encontraron notas de investigación que coincidan con los filtros seleccionados.',
      empty: 'Aún no se han publicado investigaciones propias del laboratorio.',
    },
    projects: {
      title: 'Proyectos & Herramientas',
      subtitle: 'Investigación aplicada, herramientas de código abierto y plataformas de ciberdefensa.',
      loader: 'CARGANDO REPOSITORIOS...',
      viewGithub: 'Ver en GitHub',
      liveDemo: 'Demostración En Vivo',
    },
    about: {
      title: 'Acerca del Laboratorio',
      subtitle: 'Enfoque de investigación, propósito y método de estudio.',
      intro: 'OT-SEC Digital Research Lab es una iniciativa de investigación independiente en ciberseguridad industrial, centrada en sistemas OT/ICS de la infraestructura crítica de energía eléctrica.',
      missionTitle: 'Nuestra Misión',
      missionText: 'Organizar y compartir estudios de normas técnicas, análisis de seguridad e investigaciones aplicadas a sistemas eléctricos, distinguiendo fuentes normativas, interpretaciones técnicas y resultados propios.',
      methodTitle: 'Enfoque de Investigación',
      offensiveTitle: 'Normas y Seguridad OT/ICS',
      offensiveText: 'Estudio de normas técnicas, amenazas y controles de seguridad para sistemas eléctricos, con identificación de fuentes y separación entre síntesis normativa y análisis del autor.',
      protocolTitle: 'Redes Industriales e IA',
      protocolText: 'Investigación de protocolos, arquitecturas de red y métodos de IA aplicables al análisis de datos y a la seguridad de entornos OT/ICS.',
      contactTitle: 'Contacto & Colaboración',
      contactText: 'El laboratorio tiene interés en el intercambio técnico sobre sistemas eléctricos, normas y ciberseguridad OT/ICS. Las propuestas de colaboración deben indicar su alcance y fuentes de referencia.',
      pgpFingerprint: 'PGP:',
      pgpStatus: 'La clave pública PGP aún no está disponible.',
    },
    footer: {
      desc: 'Investigación independiente en ciberseguridad OT/ICS para infraestructura crítica de energía eléctrica, con estudios de normas e investigación aplicada.',
      sitemap: 'Mapa del Sitio',
      connect: 'Conectar',
      newsletter: 'Boletín Informativo',
      newsletterPlaceholder: 'tu-correo@ejemplo.com',
      newsletterBtn: 'Suscribir',
      copyright: 'OT-SEC Digital Research Lab. Todos los derechos reservados.',
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
