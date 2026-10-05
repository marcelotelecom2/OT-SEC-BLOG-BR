import { Article } from '../../types';
import aiContent from './ai-detecting-anomalies-ics-networks.md?raw';
import stuxnetContent from './stuxnet-payload-retrospective.md?raw';
import zeroTrustContent from './zero-trust-legacy-scada.md?raw';
import fiveGContent from './5g-smart-grid-security.md?raw';
import reverseEngContent from './reverse-engineering-plc-protocols.md?raw';
import nercCipContent from './nerc-cip-002-bes-classification.md?raw';

export const PUBLISHED_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'the-role-of-ai-in-detecting-anomalies-in-ics-networks',
    title: 'The Role of AI in Detecting Anomalies in ICS Networks',
    summary: 'An exploration of how machine learning models can be trained on Modbus and DNP3 traffic to identify novel attack vectors and misconfigurations in real-time.',
    content: aiContent,
    date: '2026-07-10',
    readTime: '12 min read',
    area: 'Artificial Intelligence',
    published: true,
    views: 0
  },
  {
    id: '2',
    slug: 'deconstructing-the-stuxnet-payload-lessons-still-unlearned',
    title: 'Deconstructing the Stuxnet Payload: Lessons Still Unlearned',
    summary: 'A retrospective analysis of the world\'s most famous cyberweapon, focusing on the specific Siemens Step7 DLL injections and how modern OT systems are still vulnerable to similar tactics.',
    content: stuxnetContent,
    date: '2026-06-22',
    readTime: '18 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 0
  },
  {
    id: '3',
    slug: 'zero-trust-architecture-in-legacy-scada-environments',
    title: 'Zero Trust Architecture in Legacy SCADA Environments',
    summary: 'Implementing micro-segmentation and identity-based access controls in networks running 20-year-old PLCs that lack native authentication mechanisms.',
    content: zeroTrustContent,
    date: '2026-05-15',
    readTime: '15 min read',
    area: 'Network Engineering',
    published: true,
    views: 0
  },
  {
    id: '4',
    slug: 'analyzing-the-impact-of-5g-on-smart-grid-security',
    title: 'Analyzing the Impact of 5G on Smart Grid Security',
    summary: 'With the rollout of 5G infrastructure in power grids, the attack surface expands. We look at the security implications of ultra-reliable low-latency communication (URLLC) in power distribution.',
    content: fiveGContent,
    date: '2026-04-02',
    readTime: '10 min read',
    area: 'Network Engineering',
    published: true,
    views: 0
  },
  {
    id: '5',
    slug: 'reverse-engineering-proprietary-plc-protocols',
    title: 'Reverse Engineering Proprietary PLC Protocols',
    summary: 'A technical guide on capturing, analyzing, and fuzzing undocumented industrial protocols using custom Wireshark dissectors and software-defined radios (SDR).',
    content: reverseEngContent,
    date: '2026-03-18',
    readTime: '22 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 0
  },
  {
    id: '6',
    slug: 'nerc-cip-002-how-bes-cyber-systems-are-classified-by-impact',
    title: 'NERC CIP-002: How BES Cyber Systems Are Classified by Impact',
    summary: 'A deep technical breakdown of NERC CIP-002 criteria, explaining how Bulk Electric System (BES) cyber assets and systems are categorized into High, Medium, and Low impact ratings.',
    content: nercCipContent,
    date: '2026-08-04',
    readTime: '14 min read',
    area: 'Regulation Update',
    published: true,
    views: 0,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  }
];
