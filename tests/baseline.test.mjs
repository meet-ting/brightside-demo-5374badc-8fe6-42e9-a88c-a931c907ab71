import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Router } from 'wouter';

const root = fileURLToPath(new URL('../', import.meta.url));
let server, pages, locations, cta, cacheDir;
before(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), 'brightside-baseline-'));
  server = await createServer({
    configFile: false, root, base: '/brightside/', plugins: [react()],
    cacheDir,
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: { alias: { '@': `${root}src` }, dedupe: ['react', 'react-dom'] },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  [pages, locations, cta] = await Promise.all([
    server.ssrLoadModule('/src/pages/pages.tsx'),
    server.ssrLoadModule('/src/lib/locations.ts'),
    server.ssrLoadModule('/src/lib/cta.ts'),
  ]);
});
after(async () => { await server?.close(); if (cacheDir) await rm(cacheDir, { recursive: true, force: true }); });
const render = (component, props, path = '/') => renderToStaticMarkup(
  createElement(Router, { base: '/brightside', ssrPath: `/brightside${path}` },
    createElement(component, props)),
);
test('exact twelve unique locations form the approved scope', () => {
  assert.deepEqual(locations.LOCATIONS.map(l => l.slug).sort(), [
    'bristol','bath','clifton','redland','bishopston','southville',
    'bedminster','westbury-on-trym','henleaze','fishponds','portishead','keynsham',
  ].sort());
  assert.equal(new Set(locations.LOCATIONS.map(l => l.slug)).size, 12);
});
test('baseline label and destination are explicit and prefix-safe', () => {
  assert.equal(cta.CTA_LABEL, 'Book your free consultation');
  assert.equal(cta.CTA_PATH, '/consultation');
  assert.equal(cta.ctaHrefWithBase('/brightside/', 'bristol'), '/brightside/consultation?location=bristol');
  assert.equal(cta.ctaHrefWithBase('/', 'bath'), '/consultation?location=bath');
});
test('every location renders the shared baseline CTA and correct destination', () => {
  for (const location of locations.LOCATIONS) {
    const html = render(pages.LocationPage, { params: { location: location.slug } }, `/${location.slug}`);
    const ctas = html.match(/<a\b[^>]*data-testid="campaign-cta"[^>]*>[\s\S]*?<\/a>/g) || [];
    assert.equal(ctas.length, 2, location.slug);
    for (const anchor of ctas) {
      assert(anchor.includes('Book your free consultation'), location.slug);
      assert(anchor.includes(`/brightside/consultation?location=${location.slug}`), location.slug);
    }
    assert(html.includes('Expert advice for your next home project'));
    assert(!html.includes('data-testid="page-not-found"'));
  }
});
test('directory links to every location and unknown location renders 404', () => {
  const directory = render(pages.LocationsPage, {}, '/locations');
  for (const l of locations.LOCATIONS) assert(directory.includes(`href="/brightside/${l.slug}"`));
  const unknown = render(pages.LocationPage, { params: { location: 'unknown-place' } }, '/unknown-place');
  assert(unknown.includes('data-testid="page-not-found"'));
  assert(!unknown.includes('data-testid="campaign-cta"'));
});
test('consultation renders an explicitly local demo form without contact inputs', () => {
  const html = render(pages.ConsultationPage, {}, '/consultation');
  assert(html.includes('data-testid="consultation-form"'));
  assert(html.includes('nothing is sent, booked or stored'));
  assert(!/type="(?:email|tel|password)"/.test(html));
});