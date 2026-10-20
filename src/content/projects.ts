import type { Project } from '../types';

// Reviewed against the official repository on 2026-10-20.
// Unverified template entries from e3dfdda remain archived with published: false.
export const PROJECTS: Project[] = [
  {
    id: 'open-noc-ai',
    published: true,
    title: 'Open-NOC-AI',
    description: 'An open-source AIOps platform in development for NOC/SOC operations, with tenant-scoped inventory, alerts, incidents, AI assistance and auditable automation workflows.',
    status: 'IN DEVELOPMENT',
    tags: ['AIOps', 'NOC/SOC', 'Automation'],
    githubUrl: 'https://github.com/marcelotelecom2/open-noc-ai'
  },
  {
    id: 's7-comm-fuzzer',
    published: false,
    title: 'S7-Comm Protocol Fuzzer',
    description: 'A specialized mutation-based fuzzer designed specifically for the S7comm and S7comm-plus protocols, capable of identifying edge-case vulnerabilities in Siemens PLCs without causing hardware faults.',
    status: 'RELEASED',
    tags: ['Fuzzing', 'Siemens', 'Vulnerability Research'],
    githubUrl: 'https://github.com/ot-sec/s7-fuzzer'
  },
  {
    id: 'modbus-honeypot',
    published: false,
    title: 'High-Interaction Modbus Honeypot',
    description: 'A realistic honeypot that emulates a water treatment facility\'s PLC network. It responds to Modbus TCP requests with physically plausible values to keep attackers engaged longer for better threat intelligence gathering.',
    status: 'BETA',
    tags: ['Honeypot', 'Threat Intel', 'Modbus'],
    githubUrl: 'https://github.com/ot-sec/modbus-honeypot',
    demoUrl: 'https://honeypot.ot-sec-lab.org'
  }
];
