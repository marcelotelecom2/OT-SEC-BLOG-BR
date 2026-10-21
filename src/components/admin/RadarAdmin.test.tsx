import assert from 'node:assert/strict';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { RadarAdmin } from './RadarAdmin';
import { LanguageProvider } from '../../context/LanguageContext';
import { adminApi } from '../../lib/adminApi';
import type { RadarPublication } from '../../types';

test('manual editor exposes all fields and starts with a private draft without auto-collecting content', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.com/admin' });
  const globals = { window: dom.window, document: dom.window.document, crypto: webcrypto, IS_REACT_ACT_ENVIRONMENT: true };
  const descriptors = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const originalLoad = adminApi.radar;
  const originalSave = adminApi.saveRadar;
  let loadCount = 0;
  let saved: RadarPublication | undefined;
  adminApi.radar = async () => { loadCount++; return { entries: [] }; };
  adminApi.saveRadar = async entry => { saved = entry; return { entry, commit: 'test-only' }; };
  const root = createRoot(document.getElementById('root')!);
  try {
    await act(async () => root.render(<LanguageProvider><RadarAdmin /></LanguageProvider>));
    const add = [...document.querySelectorAll('button')].find(button => button.textContent?.includes('New publication'))!;
    await act(async () => add.click());
    assert.equal(document.querySelectorAll('#radar-type option').length, 5);
    for (const id of ['radar-title', 'radar-date', 'radar-source', 'radar-link', 'radar-comment', 'radar-language']) {
      assert.ok(document.getElementById(id), id);
      assert.ok(document.querySelector(`label[for="${id}"]`), id);
    }
    assert.equal((document.querySelector('input[type="checkbox"]') as HTMLInputElement).checked, false);
    await act(async () => document.querySelector('form')!.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(saved?.published, false);
    assert.equal(saved?.sourceUrl, '');
    assert.equal(saved?.comment, '');
    assert.equal(loadCount, 1);
    assert.ok(document.querySelector('[role="status"]')?.textContent?.includes('repository'));
  } finally {
    await act(async () => root.unmount());
    adminApi.radar = originalLoad; adminApi.saveRadar = originalSave;
    dom.window.close();
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key);
    }
  }
});
