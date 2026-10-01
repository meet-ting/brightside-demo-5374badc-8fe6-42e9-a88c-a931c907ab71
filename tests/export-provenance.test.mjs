import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

test('export payload and public build identity match their provenance', () => {
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'brightside-provenance.json')));
  const marker = JSON.parse(fs.readFileSync(path.join(root, 'public/brightside-provenance.json')));
  const { files, ...identity } = provenance;
  assert.deepEqual(marker, identity);
  assert.equal(identity.schema, 1);
  assert.equal(identity.status, 'local-export-not-deployed');
  assert.match(identity.sessionId, /^[0-9a-f-]{36}$/);
  assert.match(identity.approvedCommit, /^[0-9a-f]{40}$/);
  for (const field of ['approvedDigest', 'sourceFingerprint', 'payloadDigest']) {
    assert.match(identity[field], /^[0-9a-f]{64}$/);
  }
  assert(['baseline', 'patch'].includes(identity.kind));
  if (identity.kind === 'baseline') assert.equal(identity.sourceFingerprint, identity.approvedDigest);
  assert.deepEqual(files.map(f => f.path), files.map(f => f.path).sort());
  for (const file of files) {
    assert(!path.isAbsolute(file.path) && !file.path.split('/').includes('..'));
    assert.equal(sha256(fs.readFileSync(path.join(root, file.path))), file.sha256, file.path);
  }
  assert.equal(sha256(JSON.stringify(files)), identity.payloadDigest);
});