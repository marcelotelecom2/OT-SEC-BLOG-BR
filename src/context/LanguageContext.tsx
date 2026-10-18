import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article } from '../types';

export type Language = 'en' | 'pt' | 'es';

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

export const ARTICLE_TRANSLATIONS: Record<string, Record<Language, { title: string; summary: string }>> = {
  '1': {
    en: {
      title: 'The Role of AI in Detecting Anomalies in ICS Networks',
      summary: 'An exploration of how machine learning models can be trained on Modbus and DNP3 traffic to identify novel attack vectors and misconfigurations in real-time.',
    },
    pt: {
      title: 'O Papel da IA na Detecção de Anomalias em Redes ICS',
      summary: 'Uma exploração de como modelos de machine learning podem ser treinados em tráfego Modbus e DNP3 para identificar novos vetores de ataque e configurações incorretas em tempo real.',
    },
    es: {
      title: 'El Papel de la IA en la Detección de Anomalías en Redes ICS',
      summary: 'Una exploración de cómo los modelos de machine learning pueden entrenarse con tráfico Modbus y DNP3 para identificar nuevos vectores de ataque y errores de configuración en tiempo real.',
    },
  },
  '2': {
    en: {
      title: 'Deconstructing the Stuxnet Payload: Lessons Still Unlearned',
      summary: 'A retrospective analysis of the world\'s most famous cyberweapon, focusing on the specific Siemens Step7 DLL injections and how modern OT systems are still vulnerable to similar tactics.',
    },
    pt: {
      title: 'Desconstruindo o Payload do Stuxnet: Lições Ainda Não Aprendidas',
      summary: 'Uma análise retrospectiva da ciberarma mais famosa do mundo, focando nas injeções específicas de DLL no Siemens Step7 e como sistemas OT modernos ainda estão vulneráveis a táticas similares.',
    },
    es: {
      title: 'Desconstruyendo el Payload de Stuxnet: Lecciones Aún No Aprendidas',
      summary: 'Un análisis retrospectivo de la ciberarma más famosa del mundo, centrado en las inyecciones específicas de DLL en Siemens Step7 y cómo los sistemas OT modernos siguen siendo vulnerables a tácticas similares.',
    },
  },
  '3': {
    en: {
      title: 'Zero Trust Architecture in Legacy SCADA Environments',
      summary: 'Implementing micro-segmentation and identity-based access controls in networks running 20-year-old PLCs that lack native authentication mechanisms.',
    },
    pt: {
      title: 'Arquitetura Zero Trust em Ambientes SCADA Legados',
      summary: 'Implementando microssegmentação e controles de acesso baseados em identidade em redes com PLCs de mais de 20 anos que carecem de mecanismos nativos de autenticação.',
    },
    es: {
      title: 'Arquitectura Zero Trust en Entornos SCADA Heredados',
      summary: 'Implementación de microsegmentación y controles de acceso basados en identidad en redes con PLCs de más de 20 años que carecen de mecanismos nativos de autenticación.',
    },
  },
  '4': {
    en: {
      title: 'Analyzing the Impact of 5G on Smart Grid Security',
      summary: 'With the rollout of 5G infrastructure in power grids, the attack surface expands. We look at the security implications of ultra-reliable low-latency communication (URLLC) in power distribution.',
    },
    pt: {
      title: 'Analisando o Impacto do 5G na Segurança de Redes Elétricas Inteligentes (Smart Grid)',
      summary: 'Com a expansão da infraestrutura 5G nas redes elétricas, a superfície de ataque aumenta. Analisamos as implicações de segurança da comunicação ultraconfiável de baixa latência (URLLC) na distribuição de energia.',
    },
    es: {
      title: 'Analizando el Impacto del 5G en la Seguridad de Redes Eléctricas Inteligentes (Smart Grid)',
      summary: 'Con el despliegue de la infraestructura 5G en las redes eléctricas, la superficie de ataque se amplía. Analizamos las implicaciones de seguridad de la comunicación ultraconfiable de baja latencia (URLLC) en la distribución de energía.',
    },
  },
  '5': {
    en: {
      title: 'Reverse Engineering Proprietary PLC Protocols',
      summary: 'A technical guide on capturing, analyzing, and fuzzing undocumented industrial protocols using custom Wireshark dissectors and software-defined radios (SDR).',
    },
    pt: {
      title: 'Engenharia Reversa de Protocolos Proprietários de PLCs',
      summary: 'Um guia técnico sobre captura, análise e fuzzing de protocolos industriais não documentados usando dissectors customizados do Wireshark e rádios definidos por software (SDR).',
    },
    es: {
      title: 'Ingeniería Inversa de Protocolos Propietarios de PLCs',
      summary: 'Una guía técnica sobre captura, análisis y fuzzing de protocolos industriales no documentados utilizando diseccionadores personalizados de Wireshark y radios definidas por software (SDR).',
    },
  },
  '6': {
    en: {
      title: 'NERC CIP-002: How BES Cyber Systems Are Classified by Impact',
      summary: 'A deep technical breakdown of NERC CIP-002 criteria, explaining how Bulk Electric System (BES) cyber assets and systems are categorized into High, Medium, and Low impact ratings.',
    },
    pt: {
      title: 'NERC CIP-002: Como Sistemas Cibernéticos BES São Classificados por Impacto',
      summary: 'Uma análise técnica aprofundada dos critérios da norma NERC CIP-002, explicando como ativos e sistemas cibernéticos do Sistema Elétrico de Potência (BES) são categorizados em classificações de impacto Alto, Médio e Baixo.',
    },
    es: {
      title: 'NERC CIP-002: Cómo se Clasifican los Sistemas Cibernéticos BES por Impacto',
      summary: 'Un análisis técnico profundo de los criterios de la norma NERC CIP-002, explicando cómo los activos y sistemas cibernéticos del Sistema Eléctrico de Potencia (BES) se clasifican en niveles de impacto Alto, Medio y Bajo.',
    },
  },
};

export function getLocalizedArticle(article: Article, language: Language): Article {
  const custom = ARTICLE_TRANSLATIONS[article.id];
  if (!custom) return article;

  const translation = custom[language] || custom.en;
  return {
    ...article,
    title: translation.title || article.title,
    summary: translation.summary || article.summary,
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('ot_sec_language') as Language;
    if (saved && (saved === 'en' || saved === 'pt' || saved === 'es')) {
      return saved;
    }
    // Always default to English on first visit
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ot_sec_language', lang);
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
