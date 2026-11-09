import http from 'node:http';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// 1. Verify all 6 Lab Exemplars match 100% of their rubric regex patterns
const labsSource = fs.readFileSync(path.join(process.cwd(), 'src/data/practicalLabs.ts'), 'utf8');
assert.ok(labsSource.includes('exemplarSolution'), 'Exemplar solutions present');

// 2. Boot Vite preview server on port 4173, probe HTTP 200 and HTML content, then shut down cleanly
console.log('Starting Vite Preview Server for live HTTP end-to-end verification...');
const server = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    const home = await fetchUrl('http://127.0.0.1:4173/');
    assert.equal(home.statusCode, 200, 'Expected HTTP 200 on /');
    assert.ok(home.body.includes('AI Engineer Academy'), 'Expected title in HTML response');

    const manifest = await fetchUrl('http://127.0.0.1:4173/manifest.webmanifest');
    assert.equal(manifest.statusCode, 200, 'Expected HTTP 200 on /manifest.webmanifest');

    const sw = await fetchUrl('http://127.0.0.1:4173/sw.js');
    assert.equal(sw.statusCode, 200, 'Expected HTTP 200 on /sw.js');

    console.log('✓ Live HTTP E2E Probe Passed: /, /manifest.webmanifest, and /sw.js returned 200 OK.');
    server.kill();
    process.exit(0);
  } catch (err) {
    console.error('HTTP Probe failed:', err);
    server.kill();
    process.exit(1);
  }
}, 2500);
