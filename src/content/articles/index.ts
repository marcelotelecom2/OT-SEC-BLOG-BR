import { Article } from '../../types';
import { ARTICLES_METADATA } from './metadata';
import aiContent from './ai-detecting-anomalies-ics-networks.md?raw';
import stuxnetContent from './stuxnet-payload-retrospective.md?raw';
import zeroTrustContent from './zero-trust-legacy-scada.md?raw';
import fiveGContent from './5g-smart-grid-security.md?raw';
import reverseEngContent from './reverse-engineering-plc-protocols.md?raw';
import nercCipContent from './nerc-cip-002-bes-classification.md?raw';

export { ARTICLES_METADATA };

const contentMap: Record<string, string> = {
  '1': aiContent,
  '2': stuxnetContent,
  '3': zeroTrustContent,
  '4': fiveGContent,
  '5': reverseEngContent,
  '6': nercCipContent,
};

export const PUBLISHED_ARTICLES: Article[] = ARTICLES_METADATA.map((meta) => ({
  ...meta,
  content: contentMap[meta.id] || '',
}));

