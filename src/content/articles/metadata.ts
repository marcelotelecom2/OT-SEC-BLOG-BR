import { Article } from '../../types';

export type ArticleMetadata = Omit<Article, 'content'> & { contentFile: string };

export const ARTICLES_METADATA: ArticleMetadata[] = [
{
  "id": "10",
  "contentFile": "iec-62351-ameacas-deliberadas-sistemas-eletricos.md",
  "slug": "iec-62351-ameacas-deliberadas-sistemas-eletricos",
  "title": "IEC 62351: ameaças deliberadas aos sistemas elétricos",
  "summary": "Um resumo comentado da IEC 62351-1 sobre ameaças deliberadas: pessoas, acessos, equipamentos e informações que precisam ser considerados na segurança OT.",
  "date": "2026-10-18",
  "readTime": "4 min de leitura",
  "area": "Regulation Update",
  "author": "Walter Rodrigues",
  "published": true,
  "views": 0,
  "tags": [
    "IEC 62351",
    "OT Security",
    "Sistemas elétricos"
  ],
  "coverImage": "/images/articles/iec-62351-ameacas-deliberadas-sistemas-eletricos.jpg"
},
{
  "id": "9",
  "contentFile": "iec-62351-ameacas-nao-intencionais.md",
  "slug": "iec-62351-ameacas-nao-intencionais-seguranca-ot",
  "title": "IEC 62351: ameaças não intencionais também fazem parte da segurança OT",
  "summary": "A IEC 62351-1 amplia a segurança OT ao considerar falhas humanas, equipamentos, safety e desastres naturais como ameaças aos sistemas elétricos.",
  "date": "2026-10-18",
  "readTime": "4 min de leitura",
  "area": "Regulation Update",
  "author": "Walter Rodrigues",
  "published": true,
  "views": 0,
  "tags": [
    "IEC 62351",
    "OT Security",
    "Sistemas elétricos"
  ],
  "coverImage": "/images/articles/iec-62351-ameacas-nao-intencionais.jpg"
},
{
  "id": "8",
  contentFile: 'iec-62351-entendendo-ameacas-deliberadas.md',
  "slug": "iec-62351-entendendo-ameacas-deliberadas-sistemas-eletricos",
  "title": "IEC 62351: Entendendo as ameaças deliberadas aos sistemas elétricos",
  "summary": "Entenda as ameaças deliberadas aos sistemas elétricos na IEC 62351-1: insiders, espionagem, vandalismo, hackers, malware, furto e terrorismo.",
  "date": "2026-10-18",
  "readTime": "5 min de leitura",
  "area": "Regulation Update",
  "author": "Walter Rodrigues",
  "published": true,
  "views": 0,
  "tags": [
    "IEC 62351",
    "OT Security",
    "Sistemas elétricos"
  ],
  "coverImage": "/images/articles/iec-62351-entendendo-ameacas-deliberadas.jpg"
},
  {
  "id": "7",
  contentFile: 'iec-62351-ameacas-deliberadas.md',
  "slug": "iec-62351-ameacas-deliberadas-alem-de-hackers",
  "title": "IEC 62351: ameaças deliberadas vão muito além de hackers",
  "summary": "Ameaças deliberadas em sistemas elétricos vão além de hackers. Conheça a visão da IEC 62351-1 sobre insiders, malware, espionagem e impactos em OT.",
  "date": "2026-10-18",
  "readTime": "5 min de leitura",
  "area": "Regulation Update",
  "author": "Walter Rodrigues",
  "published": true,
  "views": 0,
  "tags": [
    "IEC 62351",
    "OT Security",
    "Sistemas elétricos"
  ],
  "coverImage": "/images/articles/iec-62351-ameacas-deliberadas.jpg"
},
  {
    id: '1',
    contentFile: 'ai-detecting-anomalies-ics-networks.md',
    slug: 'the-role-of-ai-in-detecting-anomalies-in-ics-networks',
    title: 'The Role of AI in Detecting Anomalies in ICS Networks',
    summary: 'An exploration of how machine learning models can be trained on Modbus and DNP3 traffic to identify novel attack vectors and misconfigurations in real-time.',
    date: '2026-07-10',
    readTime: '12 min read',
    area: 'Artificial Intelligence',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    contentFile: 'stuxnet-payload-retrospective.md',
    slug: 'deconstructing-the-stuxnet-payload-lessons-still-unlearned',
    title: 'Deconstructing the Stuxnet Payload: Lessons Still Unlearned',
    summary: 'A retrospective analysis of the world\'s most famous cyberweapon, focusing on the specific Siemens Step7 DLL injections and how modern OT systems are still vulnerable to similar tactics.',
    date: '2026-06-22',
    readTime: '18 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    contentFile: 'zero-trust-legacy-scada.md',
    slug: 'zero-trust-architecture-in-legacy-scada-environments',
    title: 'Zero Trust Architecture in Legacy SCADA Environments',
    summary: 'Implementing micro-segmentation and identity-based access controls in networks running 20-year-old PLCs that lack native authentication mechanisms.',
    date: '2026-05-15',
    readTime: '15 min read',
    area: 'Network Engineering',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    contentFile: '5g-smart-grid-security.md',
    slug: 'analyzing-the-impact-of-5g-on-smart-grid-security',
    title: 'Analyzing the Impact of 5G on Smart Grid Security',
    summary: 'With the rollout of 5G infrastructure in power grids, the attack surface expands. We look at the security implications of ultra-reliable low-latency communication (URLLC) in power distribution.',
    date: '2026-04-02',
    readTime: '10 min read',
    area: 'Network Engineering',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    contentFile: 'reverse-engineering-plc-protocols.md',
    slug: 'reverse-engineering-proprietary-plc-protocols',
    title: 'Reverse Engineering Proprietary PLC Protocols',
    summary: 'A technical guide on capturing, analyzing, and fuzzing undocumented industrial protocols using custom Wireshark dissectors and software-defined radios (SDR).',
    date: '2026-03-18',
    readTime: '22 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: '6',
    contentFile: 'nerc-cip-002-bes-classification.md',
    slug: 'nerc-cip-002-how-bes-cyber-systems-are-classified-by-impact',
    title: 'NERC CIP-002: How BES Cyber Systems Are Classified by Impact',
    summary: 'A deep technical breakdown of NERC CIP-002 criteria, explaining how Bulk Electric System (BES) cyber assets and systems are categorized into High, Medium, and Low impact ratings.',
    date: '2026-08-04',
    readTime: '14 min read',
    area: 'Regulation Update',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  }
];
