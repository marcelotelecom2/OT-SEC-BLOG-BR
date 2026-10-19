import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ArticleLanguage } from '../types';
import { safeGetItem, safeSetItem } from '../lib/persistence';
export { getLocalizedArticle } from '../lib/articleLocalization';

export type Language = ArticleLanguage;

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
      insights: 'Insights',
      projects: 'Projects',
      about: 'About',
      search: 'Search articles',
      switchLanguage: 'Language',
    },
    hero: {
      badge: 'SYSTEM.INITIALIZED',
      title1: 'OT-SEC Digital',
      title2: 'Research Lab',
      subtitle: 'Independent research on Industrial Cybersecurity, Artificial Intelligence and Critical Infrastructure.',
      btnInsights: 'Explore Insights',
      btnArticles: 'Latest Articles',
      langLabel: 'SELECT LANGUAGE / IDIOMA',
      langDescription: 'Choose your language preference for lab research and documentation:',
    },
    home: {
      latestTitle: 'Latest Research',
      latestSubtitle: 'Recent publications and technical notes',
      viewAll: 'View All',
      minRead: 'min read',
      views: 'views',
      areasTitle: 'Research Areas',
      areasSubtitle: 'Core domains of investigation and active development',
      area1Title: 'Industrial Cybersecurity',
      area1Desc: 'Securing critical manufacturing, energy and water infrastructure against advanced adversaries.',
      area2Title: 'Artificial Intelligence',
      area2Desc: 'Applied machine learning models for anomaly detection and automated protocol triage.',
      area3Title: 'Network Engineering',
      area3Desc: 'Resilient zero-trust architectures for converged IT/OT networks and legacy field controllers.',
      notesTitle: 'Live Lab Field Notes',
      notesSubtitle: 'Real-time updates from our vulnerability research and threat intelligence feeds.',
      btnGoInsights: 'Go to Insights',
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
      title: 'Insights',
      subtitle: 'Live tactical telemetry, threat intelligence observations, and lab notes.',
      loader: 'DECRYPTING LAB NOTES...',
      filterType: 'Content Type:',
      filterTags: 'Technical Tags:',
      all: 'All',
      allTags: 'All Tags',
      resetFilters: 'Reset Filters',
      source: 'Source:',
      noNotes: 'No research notes found matching the selected filter criteria.',
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
      subtitle: 'Mission, methodology, and operational principles.',
      intro: 'The OT-SEC Digital Research Lab is an independent initiative dedicated to exploring the intersection of Industrial Cybersecurity, Artificial Intelligence, and Critical Infrastructure.',
      missionTitle: 'Our Mission',
      missionText: 'To bridge the gap between legacy operational technology (OT) systems and modern security paradigms. As adversaries shift focus from IT data theft to physical kinetic impacts, our goal is to provide actionable intelligence, open-source tooling, and architectural guidance to ensure the resilience of the systems that power our world.',
      methodTitle: 'Methodology',
      offensiveTitle: 'Offensive Research',
      offensiveText: 'We study adversary tactics, techniques, and procedures (TTPs) specific to industrial control systems to build better defenses.',
      protocolTitle: 'Protocol Analysis',
      protocolText: 'Deep packet inspection and reverse engineering of proprietary SCADA protocols to identify inherent design flaws and zero-day vulnerabilities.',
      contactTitle: 'Contact & Collaboration',
      contactText: 'We collaborate with asset owners, vendors, and academic institutions. For secure communications regarding vulnerability disclosures, threat intelligence sharing, or research partnerships, please reach out via encrypted channels.',
      pgpFingerprint: 'PGP FINGERPRINT:',
    },
    footer: {
      desc: 'Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.',
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
      title2: 'Laboratório de Pesquisa',
      subtitle: 'Pesquisa independente em Cibersegurança Industrial, Inteligência Artificial e Infraestrutura Crítica.',
      btnInsights: 'Explorar Pesquisas',
      btnArticles: 'Últimos Artigos',
      langLabel: 'ESCOLHA O IDIOMA / SELECT LANGUAGE',
      langDescription: 'Selecione o idioma de sua preferência para as pesquisas e documentações:',
    },
    home: {
      latestTitle: 'Pesquisas Recentes',
      latestSubtitle: 'Publicações recentes e notas técnicas do laboratório',
      viewAll: 'Ver Todos',
      minRead: 'min de leitura',
      views: 'views',
      areasTitle: 'Áreas de Pesquisa',
      areasSubtitle: 'Domínios centrais de investigação e desenvolvimento ativo',
      area1Title: 'Cibersegurança Industrial',
      area1Desc: 'Proteção de infraestruturas críticas de manufatura, energia e água contra adversários avançados.',
      area2Title: 'Inteligência Artificial',
      area2Desc: 'Modelos de machine learning aplicados para detecção de anomalias e triagem automática de protocolos.',
      area3Title: 'Engenharia de Redes',
      area3Desc: 'Arquiteturas resilientes de zero trust para redes convergentes IT/OT e controladores legados.',
      notesTitle: 'Notas de Campo do Lab',
      notesSubtitle: 'Atualizações em tempo real de pesquisas de vulnerabilidades e feeds de inteligência de ameaças.',
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
      subtitle: 'Telemetria tática em tempo real, inteligência de ameaças e notas de engenharia reversa.',
      loader: 'DESCRIPTOGRAFANDO NOTAS DO LAB...',
      filterType: 'Tipo de Conteúdo:',
      filterTags: 'Tags Técnicas:',
      all: 'Todos',
      allTags: 'Todas as Tags',
      resetFilters: 'Limpar Filtros',
      source: 'Fonte:',
      noNotes: 'Nenhuma nota de pesquisa encontrada com os filtros selecionados.',
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
      subtitle: 'Missão, metodologia e princípios operacionais do laboratório.',
      intro: 'O OT-SEC Digital Research Lab é uma iniciativa independente dedicada a explorar a convergência entre Cibersegurança Industrial, Inteligência Artificial e Infraestrutura Crítica.',
      missionTitle: 'Nossa Missão',
      missionText: 'Construir a ponte entre sistemas legados de tecnologia operacional (OT) e os paradigmas modernos de segurança. À medida que adversários migram do roubo de dados de TI para impactos físicos e cinéticos, nosso objetivo é fornecer inteligência acionável, ferramentas open-source e orientações arquiteturais para garantir a resiliência dos sistemas vitais.',
      methodTitle: 'Metodologia',
      offensiveTitle: 'Pesquisa Ofensiva',
      offensiveText: 'Estudamos táticas, técnicas e procedimentos (TTPs) de adversários específicos para sistemas de controle industrial a fim de construir defesas mais robustas.',
      protocolTitle: 'Análise de Protocolos',
      protocolText: 'Inspeção profunda de pacotes e engenharia reversa de protocolos SCADA proprietários para identificar falhas de design e vulnerabilidades zero-day.',
      contactTitle: 'Contato & Colaboração',
      contactText: 'Colaboramos com operadores de infraestruturas críticas, fabricantes e instituições acadêmicas. Para comunicações seguras sobre divulgação de vulnerabilidades ou parcerias de pesquisa, entre em contato via canais criptografados.',
      pgpFingerprint: 'PGP FINGERPRINT:',
    },
    footer: {
      desc: 'Pesquisa independente em Cibersegurança Industrial, Segurança de Redes Elétricas, Inteligência Artificial e Infraestruturas Críticas.',
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
      title2: 'Laboratorio de Investigación',
      subtitle: 'Investigación independiente en Ciberseguridad Industrial, Inteligencia Artificial e Infraestructuras Críticas.',
      btnInsights: 'Explorar Investigaciones',
      btnArticles: 'Últimos Artículos',
      langLabel: 'SELECCIONAR IDIOMA / LANGUAGE',
      langDescription: 'Elija su preferencia de idioma para las investigaciones y documentación:',
    },
    home: {
      latestTitle: 'Investigaciones Recientes',
      latestSubtitle: 'Publicaciones recientes y notas técnicas del laboratorio',
      viewAll: 'Ver Todos',
      minRead: 'min de lectura',
      views: 'vistas',
      areasTitle: 'Áreas de Investigación',
      areasSubtitle: 'Dominios centrales de investigación y desarrollo activo',
      area1Title: 'Ciberseguridad Industrial',
      area1Desc: 'Protección de infraestructuras críticas de energía, manufactura y agua frente a adversarios avanzados.',
      area2Title: 'Inteligencia Artificial',
      area2Desc: 'Modelos de machine learning aplicados para detección de anomalías y triaje automatizado de protocolos.',
      area3Title: 'Ingeniería de Redes',
      area3Desc: 'Arquitecturas resilientes de zero trust para redes convergentes IT/OT y controladores heredados.',
      notesTitle: 'Notas de Campo del Lab',
      notesSubtitle: 'Actualizaciones en tiempo real de investigaciones de vulnerabilidades y fuentes de inteligencia de amenazas.',
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
      subtitle: 'Telemetría táctica en tiempo real, inteligencia sobre amenazas y notas de ingeniería inversa.',
      loader: 'DESCIFRANDO NOTAS DEL LAB...',
      filterType: 'Tipo de Contenido:',
      filterTags: 'Etiquetas Técnicas:',
      all: 'Todos',
      allTags: 'Todas las Etiquetas',
      resetFilters: 'Restablecer Filtros',
      source: 'Fuente:',
      noNotes: 'No se encontraron notas de investigación que coincidan con los filtros seleccionados.',
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
      subtitle: 'Misión, metodología y principios operativos del laboratorio.',
      intro: 'El OT-SEC Digital Research Lab es una iniciativa independiente dedicada a explorar la convergencia entre Ciberseguridad Industrial, Inteligencia Artificial e Infraestructuras Críticas.',
      missionTitle: 'Nuestra Misión',
      missionText: 'Cerrar la brecha entre los sistemas heredados de tecnología operativa (OT) y los paradigmas modernos de seguridad. A medida que los atacantes pasan del robo de datos informáticos a impactos físicos cinéticos, nuestro objetivo es proporcionar inteligencia procesable, herramientas de código abierto y orientación arquitectónica para garantizar la resiliencia de los sistemas esenciales.',
      methodTitle: 'Metodología',
      offensiveTitle: 'Investigación Ofensiva',
      offensiveText: 'Estudiamos tácticas, técnicas y procedimientos (TTPs) de adversarios específicos para sistemas de control industrial con el fin de construir mejores defensas.',
      protocolTitle: 'Análisis de Protocolos',
      protocolText: 'Inspección profunda de paquetes e ingeniería inversa de protocolos SCADA propietarios para identificar fallas de diseño y vulnerabilidades de día cero.',
      contactTitle: 'Contacto & Colaboración',
      contactText: 'Colaboramos con operadores de infraestructuras críticas, fabricantes e instituciones académicas. Para comunicaciones seguras sobre divulgación de vulnerabilidades o alianzas de investigación, comuníquese mediante canales cifrados.',
      pgpFingerprint: 'PGP FINGERPRINT:',
    },
    footer: {
      desc: 'Investigación independiente en Ciberseguridad Industrial, Seguridad de Redes Eléctricas, Inteligencia Artificial e Infraestructuras Críticas.',
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
    if (typeof window === 'undefined') return 'en';
    const saved = safeGetItem('ot_sec_language') as Language;
    if (saved && (saved === 'en' || saved === 'pt' || saved === 'es')) {
      return saved;
    }
    // Always default to English on first visit
    return 'en';
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
