import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TRANSLATIONS, getTranslations } from '../src/i18n.js';
import {
  CITY_DATASETS,
  WHO_THRESHOLD_DB,
  decodeHtmlEntities,
  normalizeSanctuary,
  loadCityDataset,
} from '../src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

test('index.html uses Three.js r170 ES Modules importmap and semantic metadata', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(html, /type="importmap"/);
  assert.match(html, /three@0\.170\.0\/build\/three\.module\.js/);
  assert.doesNotMatch(html, /r128|three\.min\.js/);
  assert.match(html, /<script type="module" src="\.\/src\/main\.js"><\/script>/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
});

test('Solarpunk brand palette strictly uses #10B981 and #E8C57D (zero legacy #F59E0B)', () => {
  const filesToAudit = [
    'index.html',
    'README.md',
    'src/styles.css',
    'src/scene.js',
    'src/main.js',
    'src/i18n.js',
    'src/data.js',
    'src/audio.js',
  ];

  for (const rel of filesToAudit) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.doesNotMatch(
      content,
      /#F59E0B|#D97706|0xF59E0B|0xD97706/i,
      `Forbidden amber/orange hex detected in ${rel}`
    );
  }

  const css = fs.readFileSync(path.join(ROOT, 'src/styles.css'), 'utf8');
  assert.match(css, /#10B981/i);
  assert.match(css, /#E8C57D/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('scene.js implements true 35.264 deg OrthographicCamera with perspective toggle', () => {
  const sceneSrc = fs.readFileSync(path.join(ROOT, 'src/scene.js'), 'utf8');
  assert.match(sceneSrc, /ISOMETRIC_ELEVATION_DEG\s*=\s*35\.264/);
  assert.match(sceneSrc, /new THREE\.OrthographicCamera/);
  assert.match(sceneSrc, /new THREE\.PerspectiveCamera/);
  assert.match(sceneSrc, /toggleCameraMode\s*\(/);
  assert.match(sceneSrc, /prefers-reduced-motion/);
});

test('i18n.js maintains 100% key parity across EN, ES, and PT', () => {
  const baseKeys = Object.keys(TRANSLATIONS.en).sort();
  for (const lang of ['es', 'pt']) {
    const keys = Object.keys(TRANSLATIONS[lang]).sort();
    assert.deepEqual(keys, baseKeys, `Top-level i18n keys mismatch for ${lang}`);
    assert.deepEqual(
      Object.keys(TRANSLATIONS[lang].cities).sort(),
      Object.keys(TRANSLATIONS.en.cities).sort(),
      `City labels mismatch for ${lang}`
    );
    assert.deepEqual(
      Object.keys(TRANSLATIONS[lang].urls).sort(),
      Object.keys(TRANSLATIONS.en.urls).sort(),
      `Localized URLs mismatch for ${lang}`
    );
  }
  assert.equal(getTranslations('unknown').badge, TRANSLATIONS.en.badge);
});

test('data.js unifies Rome, Paris, and London schemas and WHO 53 dB compliance', async () => {
  assert.equal(WHO_THRESHOLD_DB, 53);
  assert.equal(decodeHtmlEntities('Mus&amp;e d&#8217;Orsay [&hellip;]'), "Mus&e d'Orsay ...");

  const parisSample = normalizeSanctuary(
    {
      id: 'PAR-03',
      name: 'Musée d&#8217;Orsay',
      estimated_noise_db: 50,
      sis_score: 89,
      elevation_m: 51,
      optimal_window: '09:30:00 - 17:00:00',
    },
    'paris'
  );
  assert.equal(parisSample.name, "Musée d'Orsay");
  assert.equal(parisSample.noiseDb, 50);
  assert.equal(parisSample.whoCompliant, true);
  assert.equal(parisSample.windowShort, '09:30 - 17:00');
  assert.equal(parisSample.relativeReliefM, 16);

  const highNoiseNode = normalizeSanctuary({ id: 'S-05', acoustic_noise_db: 65, sis_score: 85, elevation_m: 1 }, 'london');
  assert.equal(highNoiseNode.whoCompliant, false);
  assert.equal(highNoiseNode.relativeReliefM, -10);

  // Offline fallback resilience check across all 3 configured cities
  for (const cityKey of Object.keys(CITY_DATASETS)) {
    const res = await loadCityDataset(cityKey, async () => {
      throw new Error('Simulated offline environment');
    });
    assert.equal(res.source, 'fallback');
    assert.ok(res.sanctuaries.length >= 3, `Expected >= 3 fallback sanctuaries for ${cityKey}`);
    for (const s of res.sanctuaries) {
      assert.ok(s.sisScore >= 0 && s.sisScore <= 100);
      assert.ok(s.canonicalUrl.startsWith('https://spacejourney.app/'));
    }
  }
});
