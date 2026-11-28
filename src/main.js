// Space Journey — The Sensory Atlas HUD & Application Orchestrator

import { getTranslations } from './i18n.js';
import { loadCityDataset } from './data.js';
import { SensoryAudioEngine } from './audio.js';
import { SensoryAtlasScene } from './scene.js';

const state = {
  lang: 'en',
  cityKey: 'rome',
  sanctuaries: [],
  selectedIndex: 0,
  dataSource: 'fallback',
  cameraMode: 'orthographic',
};

const els = {
  canvas: document.getElementById('webgl-canvas'),
  badge: document.getElementById('hud-badge'),
  studio: document.getElementById('hud-studio'),
  title: document.getElementById('hud-title'),
  subtitle: document.getElementById('hud-subtitle'),
  cityLabel: document.getElementById('label-city'),
  citySelect: document.getElementById('city-select'),
  sanctuaryLabel: document.getElementById('label-sanctuary'),
  sanctuarySelect: document.getElementById('sanctuary-select'),
  sanctuaryDesc: document.getElementById('sanctuary-desc'),
  whoPill: document.getElementById('who-pill'),
  valAcoustic: document.getElementById('val-acoustic'),
  valSis: document.getElementById('val-sis'),
  valElevation: document.getElementById('val-elevation'),
  valWindow: document.getElementById('val-window'),
  lblAcoustic: document.getElementById('lbl-acoustic'),
  lblSis: document.getElementById('lbl-sis'),
  lblElevation: document.getElementById('lbl-elevation'),
  lblWindow: document.getElementById('lbl-window'),
  btnCamera: document.getElementById('btn-camera'),
  btnAudio: document.getElementById('btn-audio'),
  ctaSanctuary: document.getElementById('cta-sanctuary'),
  ctaAtlas: document.getElementById('cta-atlas'),
  linkPlanner: document.getElementById('link-planner'),
  linkEarth: document.getElementById('link-earth'),
  linkCopilot: document.getElementById('link-copilot'),
  linkDatasets: document.getElementById('link-datasets'),
  dataStatus: document.getElementById('data-status'),
  controlsHint: document.getElementById('controls-hint'),
  langButtons: document.querySelectorAll('[data-lang]'),
};

const scene = new SensoryAtlasScene(els.canvas);
const audio = new SensoryAudioEngine();

function renderCopy() {
  const t = getTranslations(state.lang);
  document.documentElement.lang = state.lang;

  els.badge.textContent = t.badge;
  els.studio.textContent = t.studio;
  els.title.textContent = t.title;
  els.subtitle.textContent = t.subtitle;
  els.cityLabel.textContent = t.cityLabel;
  els.sanctuaryLabel.textContent = t.sanctuaryLabel;

  els.lblAcoustic.textContent = t.metricAcoustic;
  els.lblSis.textContent = t.metricSis;
  els.lblElevation.textContent = t.metricElevation;
  els.lblWindow.textContent = t.metricWindow;

  els.btnCamera.textContent = state.cameraMode === 'orthographic' ? t.cameraOrtho : t.cameraPersp;
  els.btnAudio.textContent = audio.isEnabled ? t.audioOn : t.audioOff;

  els.ctaSanctuary.textContent = t.ctaSanctuary;
  els.ctaAtlas.textContent = t.ctaLiveAtlas;
  els.ctaAtlas.href = t.urls.atlas;

  els.linkPlanner.textContent = t.linkPlanner;
  els.linkPlanner.href = t.urls.planner;
  els.linkEarth.textContent = t.linkEarth;
  els.linkEarth.href = t.urls.earth;
  els.linkCopilot.textContent = t.linkCopilot;
  els.linkCopilot.href = t.urls.copilot;
  els.linkDatasets.textContent = t.linkDatasets;

  els.controlsHint.textContent = t.controlsHint;
  els.dataStatus.textContent = state.dataSource === 'live' ? t.dataLive : t.dataFallback;

  // Update city dropdown labels preserving selection
  Array.from(els.citySelect.options).forEach((opt) => {
    if (t.cities[opt.value]) {
      opt.textContent = t.cities[opt.value];
    }
  });

  els.langButtons.forEach((btn) => {
    const active = btn.dataset.lang === state.lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  renderSelectedSanctuary();
}

function renderSanctuaryOptions() {
  els.sanctuarySelect.innerHTML = '';
  state.sanctuaries.forEach((s, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = `${s.id} · ${s.name}`;
    els.sanctuarySelect.appendChild(opt);
  });
  els.sanctuarySelect.value = String(state.selectedIndex);
}

function renderSelectedSanctuary() {
  const s = state.sanctuaries[state.selectedIndex];
  if (!s) return;

  const t = getTranslations(state.lang);
  els.valAcoustic.textContent = `${s.noiseDb} dB`;
  els.valSis.textContent = `${s.sisScore}/100`;
  els.valElevation.textContent = `${s.elevationM} m`;
  els.valWindow.textContent = s.windowShort;

  els.whoPill.textContent = s.whoCompliant ? t.whoCompliant : t.whoMitigated;
  els.whoPill.classList.toggle('is-compliant', s.whoCompliant);
  els.whoPill.classList.toggle('is-mitigated', !s.whoCompliant);

  const shortDesc = s.description.length > 145
    ? `${s.description.slice(0, 142).trim()}...`
    : s.description;
  els.sanctuaryDesc.textContent = shortDesc || s.neighborhood;
  els.ctaSanctuary.href = s.canonicalUrl;

  scene.applySanctuary(s);
  audio.updateAcousticProfile(s.noiseDb);
}

async function selectCity(cityKey) {
  state.cityKey = cityKey;
  const loaded = await loadCityDataset(cityKey);
  state.sanctuaries = loaded.sanctuaries;
  state.dataSource = loaded.source;
  state.selectedIndex = 0;

  renderSanctuaryOptions();
  renderCopy();
}

els.citySelect.addEventListener('change', (e) => {
  selectCity(e.target.value);
});

els.sanctuarySelect.addEventListener('change', (e) => {
  state.selectedIndex = Number(e.target.value) || 0;
  renderSelectedSanctuary();
});

els.btnCamera.addEventListener('click', () => {
  state.cameraMode = scene.toggleCameraMode();
  renderCopy();
});

els.btnAudio.addEventListener('click', () => {
  audio.toggle();
  els.btnAudio.classList.toggle('is-active', audio.isEnabled);
  renderCopy();
});

els.langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    state.lang = btn.dataset.lang;
    renderCopy();
  });
});

window.addEventListener('keydown', (e) => {
  if (!state.sanctuaries.length) return;
  if (e.key === 'ArrowRight') {
    state.selectedIndex = (state.selectedIndex + 1) % state.sanctuaries.length;
    els.sanctuarySelect.value = String(state.selectedIndex);
    renderSelectedSanctuary();
  } else if (e.key === 'ArrowLeft') {
    state.selectedIndex = (state.selectedIndex - 1 + state.sanctuaries.length) % state.sanctuaries.length;
    els.sanctuarySelect.value = String(state.selectedIndex);
    renderSelectedSanctuary();
  }
});

// Boot with Rome FAIR dataset
selectCity('rome');
