import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { AnalyticsAdmin } from './AnalyticsAdmin';
import { adminApi } from '../../lib/adminApi';

test('unavailable analytics shows an error instead of fabricated zero; retry displays provider metrics', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.com/admin' });
  const globals = { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const descriptors = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const original = adminApi.analytics;
  adminApi.analytics = async () => { throw new Error('Integração indisponível'); };
  const root = createRoot(document.getElementById('root')!);
  try {
    await act(async () => root.render(<AnalyticsAdmin />));
    assert.match(document.querySelector('[role="alert"]')!.textContent!, /indisponível/);
    assert.equal(document.querySelectorAll('.text-3xl').length, 0);
    assert.ok(document.querySelector('a[href*="dash.cloudflare.com"]'));
    adminApi.analytics = async () => ({ source: 'Cloudflare Web Analytics', start: '2026-10-20T12:00:00Z', end: '2026-10-21T12:00:00Z', visits: 27, pageViews: 37 });
    await act(async () => document.querySelector('button')!.click());
    assert.equal(document.querySelector('[role="alert"]'), null);
    assert.deepEqual([...document.querySelectorAll('.text-3xl')].map(node => node.textContent), ['27', '37']);
    assert.match(document.body.textContent!, /não representam pessoas únicas/);
  } finally {
    await act(async () => root.unmount()); adminApi.analytics = original; dom.window.close();
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key);
    }
  }
});
