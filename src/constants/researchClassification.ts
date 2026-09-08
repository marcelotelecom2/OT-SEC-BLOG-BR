export const RESEARCH_TAGS = [
  { value: '#VULN_ANALYSIS', label: 'Vulnerability Analysis', category: 'threat', badgeClass: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
  { value: '#THREAT_INTEL', label: 'Threat Intelligence', category: 'threat', badgeClass: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
  { value: '#INCIDENT_RESP', label: 'Incident Response', category: 'threat', badgeClass: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
  { value: '#PROTOCOL_RE', label: 'Protocol Reverse Engineering', category: 'engineering', badgeClass: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
  { value: '#HARDWARE_SEC', label: 'Hardware & Firmware Security', category: 'engineering', badgeClass: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
  { value: '#AI_MODELS', label: 'AI & Anomaly Detection', category: 'intelligence', badgeClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' },
] as const;

export const RESEARCH_AUTHORS = [
  { value: 'SYS_ADMIN_01', label: 'SYS_ADMIN_01 (Core Lab Operations)', badgeClass: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/60' },
  { value: 'SEC_RESEARCHER', label: 'SEC_RESEARCHER (Vulnerability Analyst)', badgeClass: 'text-blue-400 bg-blue-950/50 border-blue-800/60' },
  { value: 'AI_LAB_LEAD', label: 'AI_LAB_LEAD (Machine Learning Lead)', badgeClass: 'text-sky-400 bg-sky-950/50 border-sky-800/60' },
  { value: 'OT_SPECIALIST', label: 'OT_SPECIALIST (ICS/SCADA Architect)', badgeClass: 'text-indigo-400 bg-indigo-950/50 border-indigo-800/60' },
] as const;

export function getTagBadgeStyle(tag: string): string {
  const found = RESEARCH_TAGS.find(t => t.value.toLowerCase() === tag.toLowerCase() || t.value === `#${tag.replace(/^#/, '')}`);
  if (found) return found.badgeClass;

  // Defaults based on prefix/type
  if (tag.includes('VULN') || tag.includes('THREAT') || tag.includes('INCIDENT') || tag.includes('CVE')) {
    return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
  }
  if (tag.includes('AI') || tag.includes('ML')) {
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  }
  return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
}

export function getAuthorBadgeStyle(author?: string): string {
  if (!author) return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50';
  const cleanAuthor = author.replace(/^#/, '');
  const found = RESEARCH_AUTHORS.find(a => a.value.toLowerCase() === cleanAuthor.toLowerCase());
  if (found) return found.badgeClass;
  return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50';
}
