export const CONTENT_TYPES = [
  { value: 'Paper Review', label: 'Paper Review', badgeClass: 'text-purple-400 bg-purple-950/40 border-purple-800/60' },
  { value: 'News Analysis', label: 'News Analysis', badgeClass: 'text-sky-400 bg-sky-950/40 border-sky-800/60' },
  { value: 'Technology Watch', label: 'Technology Watch', badgeClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' },
  { value: 'Regulation Update', label: 'Regulation Update', badgeClass: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
  { value: 'Vulnerability Analysis', label: 'Vulnerability Analysis', badgeClass: 'text-rose-400 bg-rose-950/40 border-rose-800/60' },
  { value: 'Industry Watch', label: 'Industry Watch', badgeClass: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60' },
] as const;

export function getNoteContentType(note: { contentType?: string; tag?: string }): string {
  if (note.contentType) return note.contentType;
  const tag = (note.tag || '').toUpperCase();
  if (tag.includes('VULN') || tag.includes('CVE')) {
    return 'Vulnerability Analysis';
  }
  if (tag.includes('THREAT')) {
    return 'Industry Watch';
  }
  if (tag.includes('PROTOCOL') || tag.includes('HARDWARE') || tag.includes('AI')) {
    return 'Technology Watch';
  }
  if (tag.includes('INCIDENT') || tag.includes('NEWS')) {
    return 'News Analysis';
  }
  if (tag.includes('REG') || tag.includes('COMPLIANCE')) {
    return 'Regulation Update';
  }
  if (tag.includes('PAPER') || tag.includes('REVIEW')) {
    return 'Paper Review';
  }
  return 'Technology Watch';
}

export function getContentTypeBadgeStyle(type: string): string {
  const found = CONTENT_TYPES.find(c => c.value.toLowerCase() === type.toLowerCase());
  if (found) return found.badgeClass;
  return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
}

/**
 * Extracts normalized technical tags from a note.
 * Tags are free-form strings for technical topics (e.g., NERC_CIP, IEC62443, SCADA).
 */
export function getNoteTags(note: { tag?: string; tags?: string[] }): string[] {
  const tagsSet = new Set<string>();
  if (Array.isArray(note.tags) && note.tags.length > 0) {
    note.tags.forEach(t => {
      if (typeof t === 'string') {
        const clean = t.trim().replace(/^#/, '');
        if (clean) tagsSet.add(clean);
      }
    });
  } else if (note.tag && typeof note.tag === 'string') {
    const tokens = note.tag.split(/[,\s]+/);
    tokens.forEach(t => {
      const clean = t.trim().replace(/^#/, '');
      if (clean) tagsSet.add(clean);
    });
  }
  return Array.from(tagsSet);
}

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
  if (!tag) return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
  const clean = tag.toUpperCase().replace(/^#/, '');

  // Grid, Substation, Power Systems, Transmission
  if (clean.includes('GRID') || clean.includes('SUBSTATION') || clean.includes('FACTS') || clean.includes('STATCOM') || clean.includes('61850')) {
    return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
  }
  // Regulations, Compliance, Standards (NERC, FERC, NIST, IEC)
  if (clean.includes('NERC') || clean.includes('CIP') || clean.includes('FERC') || clean.includes('NIST') || clean.includes('62443') || clean.includes('62351') || clean.includes('REG')) {
    return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
  }
  // OT, ICS, SCADA, PLC, Hardware
  if (clean.includes('SCADA') || clean.includes('ICS') || clean.includes('OT_') || clean.includes('PLC') || clean.includes('HARDWARE')) {
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  }
  // Vulnerabilities, Threats, Incident Response, CISA, DOE
  if (clean.includes('VULN') || clean.includes('CVE') || clean.includes('THREAT') || clean.includes('INCIDENT') || clean.includes('CISA') || clean.includes('DOE')) {
    return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
  }
  // AI, LLM, Machine Learning
  if (clean.includes('AI') || clean.includes('LLM') || clean.includes('ML')) {
    return 'text-purple-400 bg-purple-950/40 border-purple-800/60';
  }

  const found = RESEARCH_TAGS.find(t => t.value.toLowerCase() === tag.toLowerCase() || t.value === `#${clean.toLowerCase()}`);
  if (found) return found.badgeClass;

  return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
}

export function getAuthorBadgeStyle(author?: string): string {
  if (!author) return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50';
  const cleanAuthor = author.replace(/^#/, '');
  const found = RESEARCH_AUTHORS.find(a => a.value.toLowerCase() === cleanAuthor.toLowerCase());
  if (found) return found.badgeClass;
  return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50';
}
