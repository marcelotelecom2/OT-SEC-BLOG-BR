import type { ResearchNote } from '../types';

// Unverified seed entries from the initial project template (e3dfdda).
// Retained for editorial history, excluded from publication and the public bundle.
export const RESEARCH_NOTES: ResearchNote[] = [
  {
    id: '1',
    published: false,
    date: '2026-07-20',
    tag: '#IEC62443',
    tags: ['IEC62443', 'ICS', 'SCADA'],
    contentType: 'Vulnerability Analysis',
    content: 'Observing interesting artifacts in the recent Siemens S7-1500 firmware dump. The encrypted payload mechanism seems to utilize a custom implementation of Curve25519 rather than standard libraries. Investigating further.',
    author: 'SYS_ADMIN_01'
  },
  {
    id: '2',
    published: false,
    date: '2026-07-18',
    tag: '#OT_SECURITY',
    tags: ['OT_SECURITY', 'CISA', 'SCADA'],
    contentType: 'Industry Watch',
    content: 'Activity linked to Volt Typhoon identified in water treatment facility Honeypots. Primary vector appears to be exploiting legacy VPN gateways (CVE-2023-XXXX) to establish initial foothold before moving laterally via SMB.',
    author: 'SYS_ADMIN_01'
  },
  {
    id: '3',
    published: false,
    date: '2026-07-05',
    tag: '#SCADA',
    tags: ['SCADA', 'ICS', 'IEC61850'],
    contentType: 'Technology Watch',
    content: 'Mapped out the undocumented function codes in the Omron FINS protocol. Functions 0x09 and 0x0A allow for unauthenticated memory reads across the controller backplane. Developing a PoC.',
    author: 'SEC_RESEARCHER'
  },
  {
    id: '4',
    published: false,
    date: '2026-06-22',
    tag: '#ICS',
    tags: ['ICS', 'OT_SECURITY', 'POWER_GRID'],
    contentType: 'News Analysis',
    content: 'Ransomware deployment on a manufacturing execution system (MES). The threat actors did not encrypt the PLCs directly but locked the HMI SQL databases, effectively halting production. Time-to-recovery is heavily dependent on bare-metal backups.',
    author: 'SEC_RESEARCHER'
  },
  {
    id: '5',
    published: false,
    date: '2026-06-01',
    tag: '#AI',
    tags: ['AI', 'LLM', 'SCADA'],
    contentType: 'Paper Review',
    content: 'Fine-tuning the SLM for log analysis. It struggles with distinguishing between legitimate engineering workstation programming events and unauthorized ladder logic modifications. Need to weight the dataset heavier towards normal engineering behavior.',
    author: 'AI_LAB_LEAD'
  }
];
