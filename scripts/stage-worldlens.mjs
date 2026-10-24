#!/usr/bin/env node
/** Stage only inspected source originals; no screenshots or provenance are generated here. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceIndex = process.argv.indexOf('--source');
if (sourceIndex === -1 || !process.argv[sourceIndex + 1]) throw new Error('Pass --source <product WorldLens evidence directory>');
const source = resolve(process.argv[sourceIndex + 1]);
const pinned = '284fc88f94487a7716099469daadeec258d97b07';
const mapping = {
  'profile-overview.png': ['profiles', 'Profile table and selected overview', 'Synthetic profile table and selected profile inspector in the dark desktop workspace'],
  'super-metadata-result.png': ['super-profiles', 'Saved template overview', 'Saved synthetic Super Profile template with its selected overview'],
  'synchronization.png': ['synchronization', 'Synchronization before folder selection', 'Synchronization with no folder configured and no conflicts'],
  'setup-fresh.png': ['setup', 'Initial encrypted-vault setup', 'Initial setup before an encrypted vault is created'],
  'launch-review.png': ['launch-consent', 'Standard identity launch review', 'Standard browser identity consent before launch, opened and cancelled'],
  'settings-notifications.png': ['settings', 'Action sound controls', 'Notification settings showing the action sound switch and volume'],
  'settings-notifications-lower.png': ['settings', 'Sound preview and quiet behavior', 'Action sound preview with quiet and accessibility explanation'],
  'appearance-light.png': ['settings', 'Light appearance and bundled font', 'Light appearance controls with bundled Roboto available'],
  'appearance-contrast.png': ['settings', 'High-contrast appearance', 'High-contrast appearance controls with clear outlines'],
  'minimum-bilingual-dark.png': ['settings', 'Bilingual appearance at 200% zoom', 'Bilingual dark appearance in a 760 by 580 window at 200 percent Electron interface zoom'],
};
const [inventoryBytes, coverageBytes, provenanceBytes, summaryBytes] = await Promise.all(['inventory.json', 'coverage.json', 'provenance.json', 'runtime-summary.json'].map((name) => readFile(resolve(source, name))));
const inventory = JSON.parse(inventoryBytes);
const coverage = JSON.parse(coverageBytes), provenance = JSON.parse(provenanceBytes), summary = JSON.parse(summaryBytes);
if (summary.sourceCommit !== pinned || summary.artifactSha256 !== inventory.artifactSha256 || provenance.sourceCommit !== pinned || provenance.artifactSha256 !== inventory.artifactSha256 || coverage.sourceCommit !== pinned) throw new Error('Source inventories disagree');
const renderer = provenance.artifactFiles.find((file) => /^apps\/desktop\/dist\/assets\/index-.*\.js$/.test(file.path));
const host = provenance.artifactFiles.find((file) => file.path === 'target/release/material-browser');
if (!renderer || !host) throw new Error('Missing renderer or Linux host provenance');
if (inventory.sourceCommit !== pinned || inventory.records?.length !== 10) throw new Error('Unexpected source revision or image count');
const sha = (data) => createHash('sha256').update(data).digest('hex');
const staged = await Promise.all(inventory.records.map(async (record) => {
  const filename = basename(record.path);
  const labels = mapping[filename];
  if (!labels || record.sourceCommit !== pinned || record.artifactSha256 !== inventory.artifactSha256 || record.inspectionStatus !== 'inspected' || record.privacyReviewed !== true) throw new Error(`Unapproved capture: ${filename}`);
  const bytes = await readFile(resolve(source, filename));
  if (sha(bytes) !== record.captureSha256) throw new Error(`Original image hash mismatch: ${filename}`);
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a' || bytes.readUInt32BE(16) !== record.screenshot.width || bytes.readUInt32BE(20) !== record.screenshot.height) throw new Error(`PNG dimensions mismatch: ${filename}`);
  for (const value of [record.window?.width, record.window?.height, record.viewport?.width, record.viewport?.height, record.zoom]) if (!Number.isFinite(value) || value <= 0) throw new Error(`Missing geometry: ${filename}`);
  if (!Number.isFinite(Date.parse(record.capturedAt)) || !/^[a-f0-9]{64}$/.test(record.artifactSha256)) throw new Error(`Missing build/time provenance: ${filename}`);
  return { filename, bytes, item: {
    id: record.id, file: `images/worldlens/${filename}`, surface: labels[0], title: labels[1], alt: labels[2],
    sourceCommit: record.sourceCommit, theme: record.theme, language: record.language,
    capturedAtUtc: record.capturedAt, imageSha256: record.captureSha256,
    windowSize: record.window, cssViewport: record.viewport, imageDimensions: record.screenshot, zoomFactor: record.zoom,
    artifactLabel: 'Built production renderer and Linux host; unpackaged Electron capture', artifactSha256: record.artifactSha256,
    rendererSha256: renderer.sha256, hostSha256: host.sha256,
    receiptSha256: record.interactionReceiptSha256,
    captureRoute: inventory.route,
    scaleMethod: 'Actual Electron setZoomFactor; measured CSS viewport and window content bounds are separate. Physical display scale was not verified.',
    limitations: (record.limitations || []).join(' '),
  } };
}));
if (new Set(staged.map((entry) => entry.filename)).size !== 10) throw new Error('Duplicate capture filenames');
const target = resolve(root, 'public');
await mkdir(resolve(target, 'images/worldlens'), { recursive: true });
for (const { filename, bytes } of staged) await writeFile(resolve(target, 'images/worldlens', filename), bytes);
await writeFile(resolve(target, 'worldlens-inventory.json'), inventoryBytes);
await writeFile(resolve(target, 'worldlens-coverage.json'), coverageBytes);
await writeFile(resolve(target, 'worldlens-provenance.json'), provenanceBytes);
await writeFile(resolve(target, 'worldlens-runtime-summary.json'), summaryBytes);
await writeFile(resolve(target, 'evidence.json'), JSON.stringify({
  galleryTitle: 'Material Browser WorldLens desktop evidence', sourceRepository: 'https://github.com/Ding-Ding-Projects/material-browser',
  sourceCommit: pinned, captureMethod: inventory.route,
  summaryLimitations: 'Linux unpackaged capture. Windows installation, native preference restart persistence, physical display scale and audible speaker output are not verified.',
  sourceInventorySha256: sha(inventoryBytes), sourceCoverageSha256: sha(coverageBytes), sourceProvenanceSha256: sha(provenanceBytes), sourceRuntimeSummarySha256: sha(summaryBytes),
  images: staged.map(({ item }) => item),
}, null, 2) + '\n');
console.log(`Staged ${staged.length} unchanged inspected PNGs and exact source inventories at ${pinned}`);
