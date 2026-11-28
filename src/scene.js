// Three.js r170 ES Modules Isometric Engine
// True 35.264° Orthographic projection + Copernicus DEM pedestal relief + Solarpunk palette

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Verified Space Journey Solarpunk palette (strictly Emerald #10B981 + Noble Gold #E8C57D)
export const PALETTE = {
  obsidian: 0x061212,
  stoneBase: 0x0d1f1f,
  emerald: 0x10b981,
  emeraldSoft: 0x34d399,
  nobleGold: 0xe8c57d,
  marble: 0xe2e8f0,
  architrave: 0xcbd5e1,
  gridMinor: 0x0b2626,
};

// Classic true isometric elevation angle: arctan(1 / sqrt(2)) ≈ 35.26439°
export const ISOMETRIC_ELEVATION_DEG = 35.264;
const ISO_RADIUS = 24;
const ISO_ELEV_RAD = (ISOMETRIC_ELEVATION_DEG * Math.PI) / 180;
const ISO_AZIMUTH_RAD = Math.PI / 4; // 45°

export class SensoryAtlasScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cameraMode = 'orthographic';
    this.frustumSize = 16;

    this.targetPedestalScale = 1.0;
    this.currentPedestalScale = 1.0;
    this.targetRingPulseSpeed = 1.5;
    this.targetRingRadiusScale = 1.0;
    this.targetSunColor = new THREE.Color(PALETTE.nobleGold);
    this.targetSunPos = new THREE.Vector3(12, 18, 8);

    this.clock = new THREE.Clock();
    this.initRenderer();
    this.initScene();
    this.initCameras();
    this.initLighting();
    this.initMonument();
    this.bindResize();
    this.animate();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.obsidian);
    this.scene.fog = new THREE.FogExp2(PALETTE.obsidian, 0.022);
  }

  computeIsometricPosition() {
    const y = ISO_RADIUS * Math.sin(ISO_ELEV_RAD);
    const horiz = ISO_RADIUS * Math.cos(ISO_ELEV_RAD);
    const x = horiz * Math.cos(ISO_AZIMUTH_RAD);
    const z = horiz * Math.sin(ISO_AZIMUTH_RAD);
    return new THREE.Vector3(x, y, z);
  }

  initCameras() {
    const aspect = window.innerWidth / window.innerHeight;
    const halfH = this.frustumSize / 2;
    const halfW = halfH * aspect;

    this.orthoCamera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 150);
    this.perspCamera = new THREE.PerspectiveCamera(38, aspect, 0.1, 150);

    const isoPos = this.computeIsometricPosition();
    this.orthoCamera.position.copy(isoPos);
    this.perspCamera.position.copy(isoPos);

    this.activeCamera = this.orthoCamera;
    this.attachControls(this.activeCamera);
  }

  attachControls(camera) {
    if (this.controls) {
      this.controls.dispose();
    }
    this.controls = new OrbitControls(camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.minZoom = 0.55;
    this.controls.maxZoom = 2.4;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 42;
    this.controls.target.set(0, 2.4, 0);
    this.controls.update();
  }

  toggleCameraMode() {
    const prevPos = this.activeCamera.position.clone();
    const prevTarget = this.controls.target.clone();

    if (this.cameraMode === 'orthographic') {
      this.cameraMode = 'perspective';
      this.activeCamera = this.perspCamera;
    } else {
      this.cameraMode = 'orthographic';
      this.activeCamera = this.orthoCamera;
    }

    this.activeCamera.position.copy(prevPos);
    this.attachControls(this.activeCamera);
    this.controls.target.copy(prevTarget);
    this.controls.update();
    return this.cameraMode;
  }

  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0x1f3d3b, 1.35);
    this.scene.add(this.ambientLight);

    // Warm Noble Gold directional sunlight (#E8C57D)
    this.sunLight = new THREE.DirectionalLight(PALETTE.nobleGold, 2.4);
    this.sunLight.position.copy(this.targetSunPos);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 60;
    const d = 12;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Solarpunk Emerald zenith fill light (#10B981)
    this.fillLight = new THREE.PointLight(PALETTE.emerald, 2.2, 26);
    this.fillLight.position.set(-7, 5, -7);
    this.scene.add(this.fillLight);
  }

  initMonument() {
    this.monumentGroup = new THREE.Group();

    const baseMat = new THREE.MeshStandardMaterial({
      color: PALETTE.stoneBase,
      roughness: 0.78,
      metalness: 0.22,
    });

    // Dynamic Copernicus DEM elevation pedestal (scales smoothly on sanctuary change)
    this.demPlinth = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.0, 10.5), baseMat);
    this.demPlinth.position.y = 0.5;
    this.demPlinth.receiveShadow = true;
    this.demPlinth.castShadow = true;
    this.monumentGroup.add(this.demPlinth);

    // Upper architectural assembly that rides smoothly atop the DEM plinth
    this.templeAssembly = new THREE.Group();
    this.templeAssembly.position.y = 1.0;

    const step = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.55, 8.2), baseMat);
    step.position.y = 0.275;
    step.receiveShadow = true;
    this.templeAssembly.add(step);

    // 8 Classical Columns
    const columnMat = new THREE.MeshStandardMaterial({
      color: PALETTE.marble,
      roughness: 0.48,
      metalness: 0.1,
    });
    const columnGeo = new THREE.CylinderGeometry(0.28, 0.34, 3.8, 18);
    const colCoords = [
      [-2.8, -2.8], [2.8, -2.8], [-2.8, 2.8], [2.8, 2.8],
      [0, -2.8], [0, 2.8], [-2.8, 0], [2.8, 0],
    ];
    colCoords.forEach(([x, z]) => {
      const col = new THREE.Mesh(columnGeo, columnMat);
      col.position.set(x, 2.45, z);
      col.castShadow = true;
      col.receiveShadow = true;
      this.templeAssembly.add(col);
    });

    // Roof Architrave + Botanical Solarpunk Canopy Strip
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.45, 7.0),
      new THREE.MeshStandardMaterial({ color: PALETTE.architrave, roughness: 0.4 })
    );
    roof.position.y = 4.55;
    roof.castShadow = true;
    this.templeAssembly.add(roof);

    const canopyStrip = new THREE.Mesh(
      new THREE.BoxGeometry(7.16, 0.12, 7.16),
      new THREE.MeshStandardMaterial({
        color: PALETTE.emerald,
        emissive: PALETTE.emerald,
        emissiveIntensity: 0.35,
        roughness: 0.3,
      })
    );
    canopyStrip.position.y = 4.82;
    this.templeAssembly.add(canopyStrip);

    // Noble Gold SIS Resonance Crystal (#E8C57D)
    this.crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.05, 0),
      new THREE.MeshStandardMaterial({
        color: PALETTE.nobleGold,
        emissive: PALETTE.nobleGold,
        emissiveIntensity: 0.45,
        roughness: 0.18,
        metalness: 0.72,
      })
    );
    this.crystal.position.y = 2.45;
    this.crystal.castShadow = true;
    this.templeAssembly.add(this.crystal);

    // Dual Acoustic Telemetry Rings (inner = sanctuary dB, outer = WHO 53 dB reference)
    this.acousticRingMat = new THREE.MeshBasicMaterial({
      color: PALETTE.emerald,
      transparent: true,
      opacity: 0.75,
    });
    this.acousticRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.055, 10, 48),
      this.acousticRingMat
    );
    this.acousticRing.rotation.x = Math.PI / 2;
    this.acousticRing.position.y = 2.45;
    this.templeAssembly.add(this.acousticRing);

    const whoRefRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.6, 0.025, 8, 64),
      new THREE.MeshBasicMaterial({
        color: PALETTE.nobleGold,
        transparent: true,
        opacity: 0.28,
      })
    );
    whoRefRing.rotation.x = Math.PI / 2;
    whoRefRing.position.y = 2.45;
    this.templeAssembly.add(whoRefRing);

    this.monumentGroup.add(this.templeAssembly);
    this.scene.add(this.monumentGroup);

    const grid = new THREE.GridHelper(44, 44, PALETTE.emerald, PALETTE.gridMinor);
    grid.position.y = 0.01;
    this.scene.add(grid);
  }

  applySanctuary(sanctuary) {
    // Map ESA Copernicus DEM elevation (0..100 m) to subtle architectural pedestal height (0.45..2.4 units)
    const clampedElev = Math.max(0, Math.min(100, sanctuary.elevationM));
    this.targetPedestalScale = 0.45 + (clampedElev / 100) * 1.95;

    // Map ambient dB (20..70 dB) to acoustic ring radius and cadence
    const dbNorm = Math.max(0, Math.min(1, (sanctuary.noiseDb - 20) / 50));
    this.targetRingRadiusScale = 0.85 + dbNorm * 0.45;
    this.targetRingPulseSpeed = 0.9 + dbNorm * 2.2;
    this.acousticRingMat.color.setHex(
      sanctuary.whoCompliant ? PALETTE.emerald : PALETTE.nobleGold
    );

    // Map optimal golden-hour window to solar azimuth & elevation
    const h = sanctuary.windowHour;
    if (h < 9) {
      // Dawn: low warm eastern light
      this.targetSunPos.set(16, 11, 10);
      this.targetSunColor.setHex(0xf3d9a4);
    } else if (h < 15.5) {
      // Midday zenith: clean botanical light
      this.targetSunPos.set(6, 22, 8);
      this.targetSunColor.setHex(0xf8fafc);
    } else {
      // Golden hour / twilight: noble golden western light
      this.targetSunPos.set(-14, 12, 11);
      this.targetSunColor.setHex(PALETTE.nobleGold);
    }
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const aspect = window.innerWidth / window.innerHeight;
      const halfH = this.frustumSize / 2;
      const halfW = halfH * aspect;

      this.orthoCamera.left = -halfW;
      this.orthoCamera.right = halfW;
      this.orthoCamera.top = halfH;
      this.orthoCamera.bottom = -halfH;
      this.orthoCamera.updateProjectionMatrix();

      this.perspCamera.aspect = aspect;
      this.perspCamera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    // Smoothly interpolate Copernicus DEM plinth height and solar lighting
    this.currentPedestalScale += (this.targetPedestalScale - this.currentPedestalScale) * 0.07;
    this.demPlinth.scale.y = this.currentPedestalScale;
    this.demPlinth.position.y = this.currentPedestalScale / 2;
    this.templeAssembly.position.y = this.currentPedestalScale;

    this.sunLight.position.lerp(this.targetSunPos, 0.04);
    this.sunLight.color.lerp(this.targetSunColor, 0.04);

    if (!this.reducedMotion) {
      this.monumentGroup.rotation.y = t * 0.07;
      this.crystal.rotation.y = t * 0.45;
      this.crystal.rotation.x = Math.sin(t * 0.6) * 0.18;
      this.crystal.position.y = 2.45 + Math.sin(t * 1.4) * 0.16;

      const pulse = 1 + Math.sin(t * this.targetRingPulseSpeed) * 0.055;
      this.acousticRing.scale.setScalar(this.targetRingRadiusScale * pulse);
    } else {
      this.acousticRing.scale.setScalar(this.targetRingRadiusScale);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.activeCamera);
  }
}
