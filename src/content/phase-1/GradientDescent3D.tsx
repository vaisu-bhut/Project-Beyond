"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// ============================================================
// LOSS LANDSCAPE
// L(x, z) = quadratic bowl - Σ (Gaussian dips) + sinusoidal ripple
// Designed to have: 1 global min, 4 local mins of varying depth,
//                   gentle "rim" so balls don't fly off, ripple texture.
// ============================================================

interface Minimum {
  x: number;
  z: number;
  depth: number;
  w: number;
  label: string;
}

const MINIMA: Minimum[] = [
  { x:  0.40, z:  0.20, depth: 1.55, w: 1.30, label: 'global' },
  { x: -2.80, z:  1.90, depth: 0.85, w: 1.05, label: 'local' },
  { x:  2.60, z:  2.70, depth: 0.55, w: 1.15, label: 'local' },
  { x: -2.40, z: -2.50, depth: 1.05, w: 1.20, label: 'local' },
  { x:  2.90, z: -2.10, depth: 0.70, w: 1.00, label: 'local' },
];

const SIN_AMP = 0.045;
const SIN_X = 1.35;
const SIN_Z = 1.45;
const QUAD_K = 0.030;

const lossFn = (x: number, z: number): number => {
  let y = QUAD_K * (x * x + z * z);
  for (let i = 0; i < MINIMA.length; i++) {
    const m = MINIMA[i];
    const dx = x - m.x, dz = z - m.z;
    y -= m.depth * Math.exp(-(dx * dx + dz * dz) / (2 * m.w * m.w));
  }
  y += SIN_AMP * Math.sin(SIN_X * x) * Math.cos(SIN_Z * z);
  return y;
};

const gradFn = (x: number, z: number): [number, number] => {
  let gx = 2 * QUAD_K * x;
  let gz = 2 * QUAD_K * z;
  for (let i = 0; i < MINIMA.length; i++) {
    const m = MINIMA[i];
    const dx = x - m.x, dz = z - m.z;
    const w2 = m.w * m.w;
    const k = m.depth * Math.exp(-(dx * dx + dz * dz) / (2 * w2)) / w2;
    gx += k * dx;
    gz += k * dz;
  }
  gx += SIN_AMP * SIN_X * Math.cos(SIN_X * x) * Math.cos(SIN_Z * z);
  gz -= SIN_AMP * SIN_Z * Math.sin(SIN_X * x) * Math.sin(SIN_Z * z);
  return [gx, gz];
};

// ============================================================
// COLOR PALETTE (custom: deep indigo high → lime/yellow low)
// ============================================================

const PALETTE_STOPS: [number, [number, number, number]][] = [
  [0.00, [22,  16,  48]],
  [0.18, [48,  38,  98]],
  [0.38, [40,  98,  138]],
  [0.58, [56,  168, 128]],
  [0.78, [180, 215, 80]],
  [1.00, [248, 244, 130]],
];

const samplePalette = (loss: number, lo: number, hi: number): [number, number, number] => {
  // Normalize loss to [0, 1]; low loss → bright (high t)
  let t = (loss - lo) / Math.max(1e-6, (hi - lo));
  t = 1 - Math.max(0, Math.min(1, t));
  for (let i = 0; i < PALETTE_STOPS.length - 1; i++) {
    const [t0, c0] = PALETTE_STOPS[i];
    const [t1, c1] = PALETTE_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const a = (t - t0) / (t1 - t0);
      return [
        (c0[0] + (c1[0] - c0[0]) * a) / 255,
        (c0[1] + (c1[1] - c0[1]) * a) / 255,
        (c0[2] + (c1[2] - c0[2]) * a) / 255,
      ];
    }
  }
  return [1, 1, 1];
};

// ============================================================
// OPTIMIZERS
// ============================================================

type OptType = 'sgd' | 'momentum' | 'adam';

class Optimizer {
  type: OptType;
  lr: number;
  t: number;
  mx: number; mz: number;   // first moment (Adam) or velocity (Momentum)
  vx: number; vz: number;   // second moment (Adam)
  beta1: number;
  beta2: number;
  eps: number;
  momentumBeta: number;

  constructor(type: OptType, lr: number) {
    this.type = type;
    this.lr = lr;
    this.t = 0;
    this.mx = 0; this.mz = 0;
    this.vx = 0; this.vz = 0;
    this.beta1 = 0.9;
    this.beta2 = 0.999;
    this.eps = 1e-8;
    this.momentumBeta = 0.9;
  }
  setLR(lr: number) { this.lr = lr; }
  reset() {
    this.t = 0;
    this.mx = 0; this.mz = 0;
    this.vx = 0; this.vz = 0;
  }
  step(gx: number, gz: number): [number, number] {
    this.t += 1;
    let dx = 0, dz = 0;
    if (this.type === 'sgd') {
      dx = -this.lr * gx;
      dz = -this.lr * gz;
    } else if (this.type === 'momentum') {
      // v ← β v − η g ; x ← x + v
      this.mx = this.momentumBeta * this.mx - this.lr * gx;
      this.mz = this.momentumBeta * this.mz - this.lr * gz;
      dx = this.mx;
      dz = this.mz;
    } else if (this.type === 'adam') {
      this.mx = this.beta1 * this.mx + (1 - this.beta1) * gx;
      this.mz = this.beta1 * this.mz + (1 - this.beta1) * gz;
      this.vx = this.beta2 * this.vx + (1 - this.beta2) * gx * gx;
      this.vz = this.beta2 * this.vz + (1 - this.beta2) * gz * gz;
      const bc1 = 1 - Math.pow(this.beta1, this.t);
      const bc2 = 1 - Math.pow(this.beta2, this.t);
      const mhx = this.mx / bc1, mhz = this.mz / bc1;
      const vhx = this.vx / bc2, vhz = this.vz / bc2;
      dx = -this.lr * mhx / (Math.sqrt(vhx) + this.eps);
      dz = -this.lr * mhz / (Math.sqrt(vhz) + this.eps);
    }
    return [dx, dz];
  }
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}

// ============================================================
// CONSTANTS
// ============================================================

const SURFACE_SIZE = 10;
const SURFACE_SEGMENTS = 140;
const MAX_TRAIL = 2000;
const BALL_RADIUS = 0.13;

const OPT_COLORS = {
  sgd:       0xff7a6a,  // coral
  momentum:  0x5af0d4,  // cyan
  adam:      0xffc857,  // amber
} as const;

const OPT_LABELS = {
  sgd: 'SGD',
  momentum: 'SGD + Momentum',
  adam: 'Adam',
} as const;

// ============================================================
// TYPES
// ============================================================

interface Runner {
  type: OptType;
  ball: THREE.Mesh;
  trail: THREE.Line;
  trailPos: Float32Array;
  trailCount: number;
  opt: Optimizer;
  x: number;
  z: number;
  prevLoss: number;
  converged: boolean;
  stableSteps: number;
}

interface SceneState {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  surface?: THREE.Mesh;
  wireMesh?: THREE.Mesh;
  minimaGroup?: THREE.Group;
  cam?: { theta: number; phi: number; radius: number };
  updateCamera?: () => void;
  lossRange?: { lo: number; hi: number };
  runners?: Runner[];
  makeRunner?: (type: OptType, startX: number, startZ: number) => Runner;
  mount?: HTMLDivElement;
  animId?: number | null;
  time?: number;
  dragging?: boolean;
  lastMouse?: { x: number; y: number };
  raycaster?: THREE.Raycaster;
  mouseNDC?: THREE.Vector2;
  startPos?: { x: number; z: number };
  runningRef?: boolean;
  speedRef?: number;
  lrRef?: number;
  optimizerRef?: OptType;
  compareModeRef?: boolean;
  iter?: number;
  statsTick?: number;
}

interface RunnerStats {
  type: OptType;
  x: number;
  z: number;
  loss: number;
  gradMag: number;
  converged: boolean;
  steps: number;
}

interface StatsState {
  iter: number;
  runners: RunnerStats[];
}

// ============================================================
// MAIN COMPONENT
// ============================================================

const GradientDescent3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sRef = useRef<SceneState>({});

  const [optimizer, setOptimizer] = useState<OptType>('momentum');
  const [lr, setLr] = useState(0.10);
  const [running, setRunning] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stats, setStats] = useState<StatsState>({
    iter: 0,
    runners: [], // [{type, x, z, loss, gradMag, converged}]
  });

  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { renderer, scene } = sRef.current;
    if (!renderer || !scene) return;
    const colorVal = isLight ? 0xf9fafb : 0x07090f;
    renderer.setClearColor(colorVal, 1);
    if (scene.fog) {
      scene.fog.color.setHex(colorVal);
    }
  }, [isLight]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------- SCENE SETUP (mount once) ----------------
  useEffect(() => {
    if (!mounted) return;
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight || 500;

    // ----- renderer -----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    const initialIsLight = document.documentElement.classList.contains("light");
    const initialColor = initialIsLight ? 0xf9fafb : 0x07090f;
    renderer.setClearColor(initialColor, 1);
    mount.appendChild(renderer.domElement);

    // ----- scene & camera -----
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(initialColor, 18, 32);
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);

    // spherical camera state
    const cam = { theta: Math.PI * 0.85, phi: Math.PI * 0.32, radius: 16 };
    const updateCamera = () => {
      camera.position.x = cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta);
      camera.position.y = cam.radius * Math.cos(cam.phi);
      camera.position.z = cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta);
      camera.lookAt(0, -0.4, 0);
    };
    updateCamera();

    // ----- lighting -----
    const ambient = new THREE.AmbientLight(0xaab8d0, 0.55);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(6, 12, 4);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x6677aa, 0.4);
    rimLight.position.set(-8, 4, -6);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(0xffe0b0, 0.3, 20);
    fillLight.position.set(0, 5, 0);
    scene.add(fillLight);

    // ----- compute loss range across grid for color normalization -----
    let lo = Infinity, hi = -Infinity;
    const HALF = SURFACE_SIZE / 2;
    const stepVal = SURFACE_SIZE / SURFACE_SEGMENTS;
    for (let i = 0; i <= SURFACE_SEGMENTS; i++) {
      for (let j = 0; j <= SURFACE_SEGMENTS; j++) {
        const x = -HALF + i * stepVal;
        const z = -HALF + j * stepVal;
        const y = lossFn(x, z);
        if (y < lo) lo = y;
        if (y > hi) hi = y;
      }
    }

    // ----- surface -----
    const surfaceGeom = new THREE.PlaneGeometry(
      SURFACE_SIZE, SURFACE_SIZE, SURFACE_SEGMENTS, SURFACE_SEGMENTS
    );
    surfaceGeom.rotateX(-Math.PI / 2); // lay flat: y is up, plane is XZ
    const pos = surfaceGeom.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = lossFn(x, z);
      pos.setY(i, y);
      const [r, g, b] = samplePalette(y, lo, hi);
      colors[i * 3 + 0] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    surfaceGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    surfaceGeom.computeVertexNormals();

    const surfaceMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      shininess: 22,
      specular: new THREE.Color(0x223344),
      side: THREE.DoubleSide,
      flatShading: false,
    });
    const surface = new THREE.Mesh(surfaceGeom, surfaceMat);
    scene.add(surface);

    // ----- wireframe overlay (subtle topographic feel) -----
    const wireGeom = new THREE.PlaneGeometry(
      SURFACE_SIZE, SURFACE_SIZE, 30, 30
    );
    wireGeom.rotateX(-Math.PI / 2);
    const wp = wireGeom.attributes.position;
    for (let i = 0; i < wp.count; i++) {
      const x = wp.getX(i);
      const z = wp.getZ(i);
      wp.setY(i, lossFn(x, z) + 0.005); // tiny lift
    }
    wireGeom.computeVertexNormals();
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    scene.add(wireMesh);

    // ----- markers at minima -----
    const minimaGroup = new THREE.Group();
    for (let i = 0; i < MINIMA.length; i++) {
      const m = MINIMA[i];
      const isGlobal = m.label === 'global';
      const markerGeom = new THREE.RingGeometry(0.18, 0.28, 24);
      markerGeom.rotateX(-Math.PI / 2);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isGlobal ? 0xfff0a0 : 0xffffff,
        transparent: true,
        opacity: isGlobal ? 0.95 : 0.35,
        side: THREE.DoubleSide,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.set(m.x, lossFn(m.x, m.z) + 0.02, m.z);
      minimaGroup.add(marker);

      if (isGlobal) {
        // pulsing inner dot
        const dotGeom = new THREE.CircleGeometry(0.12, 18);
        dotGeom.rotateX(-Math.PI / 2);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xfff5b0 });
        const dot = new THREE.Mesh(dotGeom, dotMat);
        dot.position.set(m.x, lossFn(m.x, m.z) + 0.025, m.z);
        dot.userData.isGlobalDot = true;
        minimaGroup.add(dot);
      }
    }
    scene.add(minimaGroup);

    // ----- axes labels (small ground-level markers) -----
    const axisMat = new THREE.LineBasicMaterial({ color: 0x445566, transparent: true, opacity: 0.5 });
    const axisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-HALF, 1.2, -HALF),
      new THREE.Vector3(HALF, 1.2, -HALF),
      new THREE.Vector3(HALF, 1.2, -HALF),
      new THREE.Vector3(HALF, 1.2, HALF),
    ]);
    const axes = new THREE.LineSegments(axisGeom, axisMat);
    scene.add(axes);

    // ----- runners (balls + trails) -----
    const makeRunner = (type: OptType, startX: number, startZ: number): Runner => {
      const color = OPT_COLORS[type];
      // ball
      const ballGeom = new THREE.SphereGeometry(BALL_RADIUS, 24, 18);
      const ballMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.45,
        shininess: 80,
      });
      const ball = new THREE.Mesh(ballGeom, ballMat);
      ball.position.set(startX, lossFn(startX, startZ) + BALL_RADIUS, startZ);
      scene.add(ball);

      // glow halo
      const haloGeom = new THREE.SphereGeometry(BALL_RADIUS * 1.9, 16, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.18,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      ball.add(halo);

      // trail
      const trailGeom = new THREE.BufferGeometry();
      const trailPos = new Float32Array(MAX_TRAIL * 3);
      trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
      trailGeom.setDrawRange(0, 0);
      const trailMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.85,
      });
      const trail = new THREE.Line(trailGeom, trailMat);
      scene.add(trail);

      return {
        type,
        ball,
        trail,
        trailPos,
        trailCount: 0,
        opt: new Optimizer(type, lr),
        x: startX, z: startZ,
        prevLoss: lossFn(startX, startZ),
        converged: false,
        stableSteps: 0,
      };
    };

    sRef.current = {
      renderer, scene, camera, surface, wireMesh, minimaGroup,
      cam, updateCamera,
      lossRange: { lo, hi },
      runners: [],
      makeRunner,
      mount,
      animId: null,
      time: 0,
      // mouse interaction state
      dragging: false,
      lastMouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
      mouseNDC: new THREE.Vector2(),
      startPos: { x: -3.6, z: 3.4 },
      runningRef: running,
      speedRef: speed,
      lrRef: lr,
      optimizerRef: optimizer,
      compareModeRef: compareMode,
      iter: 0,
      statsTick: 0,
    };

    // ----- initial runners -----
    spawnRunners();

    // ----- mouse / touch -----
    const dom = renderer.domElement;
    const onDown = (e: MouseEvent | TouchEvent) => {
      sRef.current.dragging = true;
      const ev = 'touches' in e ? e.touches[0] : e;
      sRef.current.lastMouse = { x: ev.clientX, y: ev.clientY };
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!sRef.current.dragging) return;
      const ev = 'touches' in e ? e.touches[0] : e;
      if (!sRef.current.lastMouse) return;
      const dx = ev.clientX - sRef.current.lastMouse.x;
      const dy = ev.clientY - sRef.current.lastMouse.y;
      const c = sRef.current.cam;
      if (c && sRef.current.updateCamera) {
        c.theta -= dx * 0.008;
        c.phi = Math.max(0.12, Math.min(Math.PI * 0.48, c.phi - dy * 0.008));
        sRef.current.lastMouse = { x: ev.clientX, y: ev.clientY };
        sRef.current.updateCamera();
      }
    };
    const onUp = () => { sRef.current.dragging = false; };
    const onWheel = (e: WheelEvent) => {
      const c = sRef.current.cam;
      if (c && sRef.current.updateCamera) {
        c.radius = Math.max(7, Math.min(28, c.radius + e.deltaY * 0.012));
        sRef.current.updateCamera();
      }
      e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      // place start position via raycast
      const rect = dom.getBoundingClientRect();
      if (!sRef.current.mouseNDC || !sRef.current.raycaster || !sRef.current.camera || !sRef.current.surface) return;
      sRef.current.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      sRef.current.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      sRef.current.raycaster.setFromCamera(sRef.current.mouseNDC, sRef.current.camera);
      const hits = sRef.current.raycaster.intersectObject(sRef.current.surface);
      if (hits.length > 0) {
        const p = hits[0].point;
        sRef.current.startPos = { x: p.x, z: p.z };
        respawnRunners();
      }
    };
    // distinguish click from drag
    let downAt: { x: number; y: number; t: number } | null = null;
    const onMouseDown = (e: MouseEvent) => {
      downAt = { x: e.clientX, y: e.clientY, t: Date.now() };
      onDown(e);
    };
    const onMouseUp = (e: MouseEvent) => {
      onUp();
      if (downAt) {
        const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
        const elapsed = Date.now() - downAt.t;
        if (moved < 4 && elapsed < 300) onClick(e);
      }
      downAt = null;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onDown as any, { passive: false });
    dom.addEventListener('touchmove', onMove as any, { passive: false });
    dom.addEventListener('touchend', onUp);

    // ----- resize -----
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 500;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ----- animation loop -----
    let lastTs = performance.now();
    const animate = (ts: number) => {
      const dt = Math.min(50, ts - lastTs);
      lastTs = ts;
      sRef.current.animId = requestAnimationFrame(animate);
      if (sRef.current.time !== undefined) {
        sRef.current.time += dt * 0.001;
      }

      // pulse global-min dot
      if (sRef.current.minimaGroup && sRef.current.time !== undefined) {
        sRef.current.minimaGroup.children.forEach((c) => {
          if (c.userData.isGlobalDot) {
            c.scale.setScalar(1 + 0.2 * Math.sin((sRef.current.time || 0) * 3));
          }
        });
      }

      // physics step (multiple per frame for speed > 1)
      if (sRef.current.runningRef) {
        const stepsThisFrame = sRef.current.speedRef || 1;
        for (let s = 0; s < stepsThisFrame; s++) physicsStep();
      }

      // publish stats
      if (sRef.current.statsTick === undefined) sRef.current.statsTick = 0;
      sRef.current.statsTick++;
      if (sRef.current.statsTick % 4 === 0) publishStats();

      renderer.render(scene, camera);
    };

    sRef.current.animId = requestAnimationFrame(animate);

    // cleanup
    return () => {
      if (sRef.current.animId) cancelAnimationFrame(sRef.current.animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onDown as any);
      dom.removeEventListener('touchmove', onMove as any);
      dom.removeEventListener('touchend', onUp);

      // dispose
      surfaceGeom.dispose();
      surfaceMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      if (sRef.current.runners) {
        sRef.current.runners.forEach((r) => {
          r.ball.geometry.dispose();
          disposeMaterial(r.ball.material);
          r.trail.geometry.dispose();
          disposeMaterial(r.trail.material);
        });
      }
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ---------------- helper: spawn / respawn runners ----------------
  function spawnRunners() {
    if (!sRef.current.makeRunner || !sRef.current.scene || !sRef.current.startPos) return;
    // clear existing
    if (sRef.current.runners) {
      sRef.current.runners.forEach((r) => {
        if (sRef.current.scene) {
          sRef.current.scene.remove(r.ball);
          sRef.current.scene.remove(r.trail);
        }
        r.ball.geometry.dispose();
        disposeMaterial(r.ball.material);
        r.trail.geometry.dispose();
        disposeMaterial(r.trail.material);
      });
    }
    sRef.current.runners = [];
    const { x, z } = sRef.current.startPos;
    const types: OptType[] = sRef.current.compareModeRef
      ? ['sgd', 'momentum', 'adam']
      : [sRef.current.optimizerRef || 'momentum'];
    types.forEach((t) => {
      if (sRef.current.makeRunner && sRef.current.runners) {
        const r = sRef.current.makeRunner(t, x, z);
        r.opt.setLR(sRef.current.lrRef || 0.10);
        sRef.current.runners.push(r);
      }
    });
    sRef.current.iter = 0;
  }
  function respawnRunners() {
    spawnRunners();
    setRunning(true);
  }

  // ---------------- physics step ----------------
  function physicsStep() {
    if (!sRef.current.runners) return;

    // Stop physics step if all active runners are converged
    const allConverged = sRef.current.runners.length > 0 && sRef.current.runners.every((r) => r.converged);
    if (allConverged) return;

    sRef.current.iter = (sRef.current.iter || 0) + 1;

    sRef.current.runners.forEach((r) => {
      if (r.converged) return;
      const [gx, gz] = gradFn(r.x, r.z);
      const [dx, dz] = r.opt.step(gx, gz);
      // clamp step size to avoid wild jumps when lr too high
      const stepMag = Math.hypot(dx, dz);
      const maxStep = 0.6;
      const sx = stepMag > maxStep ? dx * (maxStep / stepMag) : dx;
      const sz = stepMag > maxStep ? dz * (maxStep / stepMag) : dz;
      r.x += sx; r.z += sz;
      // keep inside bounds
      r.x = Math.max(-4.7, Math.min(4.7, r.x));
      r.z = Math.max(-4.7, Math.min(4.7, r.z));

      const y = lossFn(r.x, r.z);
      r.ball.position.set(r.x, y + BALL_RADIUS, r.z);

      // detect convergence
      const gmag = Math.hypot(gx, gz);
      if (gmag < 0.005) r.stableSteps += 1; else r.stableSteps = 0;
      if (r.stableSteps > 30) r.converged = true;

      // append to trail
      if (r.trailCount < MAX_TRAIL) {
        const idx = r.trailCount * 3;
        r.trailPos[idx + 0] = r.x;
        r.trailPos[idx + 1] = y + BALL_RADIUS * 0.6;
        r.trailPos[idx + 2] = r.z;
        r.trailCount += 1;
        r.trail.geometry.setDrawRange(0, r.trailCount);
        r.trail.geometry.attributes.position.needsUpdate = true;
        // expand bounding sphere occasionally
        if (r.trailCount % 30 === 0) r.trail.geometry.computeBoundingSphere();
      }
    });
  }

  // ---------------- publish stats ----------------
  function publishStats() {
    if (!sRef.current.runners) return;
    const runners = sRef.current.runners.map((r) => {
      const [gx, gz] = gradFn(r.x, r.z);
      return {
        type: r.type,
        x: r.x, z: r.z,
        loss: lossFn(r.x, r.z),
        gradMag: Math.hypot(gx, gz),
        converged: r.converged,
        steps: r.opt.t,
      };
    });
    setStats({ iter: sRef.current.iter || 0, runners });

    const allConverged = sRef.current.runners.length > 0 && sRef.current.runners.every((r) => r.converged);
    if (allConverged && sRef.current.runningRef) {
      sRef.current.runningRef = false;
      setRunning(false);
    }
  }

  // ---------------- sync React state → refs ----------------
  useEffect(() => { sRef.current.runningRef = running; }, [running]);
  useEffect(() => { sRef.current.speedRef = speed; }, [speed]);
  useEffect(() => {
    sRef.current.lrRef = lr;
    if (sRef.current.runners) sRef.current.runners.forEach((r) => r.opt.setLR(lr));
  }, [lr]);
  useEffect(() => {
    sRef.current.optimizerRef = optimizer;
    if (!sRef.current.compareModeRef) respawnRunners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizer]);
  useEffect(() => {
    sRef.current.compareModeRef = compareMode;
    respawnRunners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareMode]);

  const handleReset = () => respawnRunners();
  const handlePreset = (key: 'ridge' | 'saddle' | 'trap' | 'far') => {
    const presets = {
      ridge:    { x: -4.2, z:  0.0 },
      saddle:   { x:  0.0, z:  3.8 },
      trap:     { x: -3.4, z: -3.4 },
      far:      { x:  4.2, z:  4.2 },
    };
    sRef.current.startPos = presets[key];
    respawnRunners();
  };

  if (!mounted) {
    return (
      <div 
        className="flex items-center justify-center text-[var(--foreground-muted)] font-mono text-sm bg-[var(--background-elevated)] border border-[var(--border)] rounded-xl h-[650px]"
      >
        Loading 3D loss landscape visualizer...
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={`gd3-root ${isLight ? 'light' : ''}`}>
      <style>{CSS}</style>

      <div className="gd3-shell">
        {/* ===== LEFT: header + viewport ===== */}
        <div className="gd3-stage">
          <header className="gd3-header">
            <div className="gd3-mark">
              <span className="gd3-mark-bar" />
              <div className="gd3-mark-text">
                <div className="gd3-mark-eyebrow">fig. 01 · optimization dynamics</div>
                <h1 className="gd3-mark-title">Gradient Descent</h1>
                <div className="gd3-mark-sub">on a non-convex loss landscape ℒ : ℝ² → ℝ</div>
              </div>
            </div>
            <div className="gd3-hud">
              <Hud label="iter" value={String(stats.iter).padStart(4, '0')} />
              <Hud label="step rule"
                   value={compareMode ? '3 optimizers' : OPT_LABELS[optimizer]} />
            </div>
          </header>

          <div ref={mountRef} className="gd3-canvas">
            <div className="gd3-hint">drag to rotate · scroll to zoom · click surface to re-drop</div>
          </div>
        </div>

        {/* ===== RIGHT: control panel ===== */}
        <aside className="gd3-panel">
          <Section title="Optimizer">
            <div className="gd3-tabs">
              {(['sgd', 'momentum', 'adam'] as const).map((k) => (
                <button
                  key={k}
                  className={'gd3-tab ' + (optimizer === k && !compareMode ? 'is-on' : '')}
                  disabled={compareMode}
                  onClick={() => setOptimizer(k)}
                  style={{ '--tabAccent': hexFromInt(OPT_COLORS[k]) } as React.CSSProperties}
                >
                  <span className="gd3-tab-dot" />
                  {OPT_LABELS[k]}
                </button>
              ))}
            </div>
            <label className="gd3-toggle">
              <input type="checkbox" checked={compareMode}
                     onChange={(e) => setCompareMode(e.target.checked)} />
              <span className="gd3-toggle-box" />
              <span className="gd3-toggle-label">compare all three side-by-side</span>
            </label>
          </Section>

          <Section title="Hyperparameters">
            <Slider
              label="learning rate η"
              value={lr}
              min={0.005} max={0.30} step={0.005}
              format={(v) => v.toFixed(3)}
              onChange={setLr}
            />
            <Slider
              label="steps per frame"
              value={speed}
              min={1} max={8} step={1}
              format={(v) => `× ${v}`}
              onChange={setSpeed}
            />
          </Section>

          <Section title="Transport">
            <div className="gd3-row">
              <button className="gd3-btn primary" onClick={() => setRunning(!running)}>
                {running ? '❚❚  pause' : '►  run'}
              </button>
              <button className="gd3-btn" onClick={handleReset}>↺  reset</button>
            </div>
          </Section>

          <Section title="Start position">
            <div className="gd3-grid2">
              <button className="gd3-chip" onClick={() => handlePreset('ridge')}>ridge</button>
              <button className="gd3-chip" onClick={() => handlePreset('saddle')}>saddle</button>
              <button className="gd3-chip" onClick={() => handlePreset('trap')}>local trap</button>
              <button className="gd3-chip" onClick={() => handlePreset('far')}>far corner</button>
            </div>
            <p className="gd3-hint-block">
              click anywhere on the surface to drop the ball there.
            </p>
          </Section>

          <Section title="Telemetry">
            <div className="gd3-tele">
              {stats.runners.map((r) => (
                <div key={r.type} className="gd3-tele-row"
                     style={{ '--c': hexFromInt(OPT_COLORS[r.type]) } as React.CSSProperties}>
                  <div className="gd3-tele-head">
                    <span className="gd3-tele-dot" />
                    <span className="gd3-tele-name">{OPT_LABELS[r.type]}</span>
                    {r.converged && <span className="gd3-tele-flag">converged</span>}
                  </div>
                  <div className="gd3-tele-grid">
                    <Stat label="ℒ(x,z)"  value={r.loss.toFixed(4)} />
                    <Stat label="‖∇ℒ‖"    value={r.gradMag.toFixed(4)} />
                    <Stat label="x"        value={r.x.toFixed(2)} />
                    <Stat label="z"        value={r.z.toFixed(2)} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="What you're watching">
            <p className="gd3-note">
              The surface is a non-convex loss with one <em>global</em> minimum (gold ring) and
              four <em>local</em> minima (white rings). Each step moves the parameters opposite the
              gradient ∇ℒ.
            </p>
            <ul className="gd3-list">
              <li><b>SGD</b> follows the steepest direction — it gets stuck in shallow basins and slows on flat ridges.</li>
              <li><b>Momentum</b> accumulates velocity, letting the ball coast across plateaus and sometimes <em>escape</em> shallow traps.</li>
              <li><b>Adam</b> rescales each coordinate by the running variance of its gradient — fast on ill-conditioned curvature.</li>
            </ul>
          </Section>
        </aside>
      </div>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="gd3-section">
    <div className="gd3-section-head">
      <span className="gd3-section-rule" />
      <h3 className="gd3-section-title">{title}</h3>
    </div>
    <div className="gd3-section-body">{children}</div>
  </section>
);

interface HudProps {
  label: string;
  value: string;
}
const Hud: React.FC<HudProps> = ({ label, value }) => (
  <div className="gd3-hud-cell">
    <div className="gd3-hud-label">{label}</div>
    <div className="gd3-hud-value">{value}</div>
  </div>
);

interface StatProps {
  label: string;
  value: string;
}
const Stat: React.FC<StatProps> = ({ label, value }) => (
  <div className="gd3-stat">
    <span className="gd3-stat-label">{label}</span>
    <span className="gd3-stat-value">{value}</span>
  </div>
);

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}
const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, format, onChange }) => (
  <div className="gd3-slider">
    <div className="gd3-slider-head">
      <span className="gd3-slider-label">{label}</span>
      <span className="gd3-slider-value">{format(value)}</span>
    </div>
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);

function hexFromInt(n: number) {
  return '#' + n.toString(16).padStart(6, '0');
}

// ============================================================
// STYLES
// ============================================================

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

.gd3-root {
  --bg:        #07090f;
  --bg-2:      #0d1119;
  --bg-3:      #161b27;
  --line:      #232a3a;
  --ink:       #e9edf5;
  --ink-2:     #aab3c6;
  --ink-3:     #6b7588;
  --accent:    #f8f482;
  --display:   'Fraunces', Georgia, serif;
  --mono:      'JetBrains Mono', ui-monospace, monospace;
  position: relative;
  height: 650px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 13px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--line);
}
.gd3-root.light {
  --bg:        #ffffff;
  --bg-2:      #f9fafb;
  --bg-3:      #f3f4f6;
  --line:      #e5e7eb;
  --ink:       #111827;
  --ink-2:     #4b5563;
  --ink-3:     #9ca3af;
  --accent:    #4f46e5;
}
.gd3-root.light .gd3-btn.primary {
  color: #ffffff;
}
.gd3-root.light .gd3-btn.primary:hover {
  background: #4338ca;
}
.gd3-root.light .gd3-toggle input:checked + .gd3-toggle-box::after {
  left: 16px;
  background: #ffffff;
}
.gd3-root.light .gd3-hint {
  color: rgba(0,0,0,0.45);
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}
@media (max-width: 900px) {
  .gd3-root {
    height: auto;
    min-height: 850px;
  }
}
.gd3-shell {
  display: grid;
  grid-template-columns: 1fr 340px;
  height: 100%;
  width: 100%;
}
@media (max-width: 900px) {
  .gd3-shell { grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
}

/* ----- left stage ----- */
.gd3-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid var(--line);
  background:
    radial-gradient(ellipse at 70% 30%, rgba(80, 100, 180, 0.10), transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(180, 220, 120, 0.06), transparent 50%),
    var(--bg);
}
.gd3-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 22px 28px 18px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.gd3-mark { display: flex; gap: 14px; align-items: stretch; }
.gd3-mark-bar {
  width: 3px;
  background: linear-gradient(180deg, var(--accent), transparent);
  border-radius: 2px;
}
.gd3-mark-eyebrow {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 2px;
}
.gd3-mark-title {
  font-family: var(--display);
  font-weight: 500;
  font-size: 32px;
  letter-spacing: -0.015em;
  line-height: 1;
  margin: 0;
}
.gd3-mark-sub {
  font-size: 11px;
  color: var(--ink-2);
  margin-top: 6px;
  letter-spacing: 0.02em;
}
.gd3-hud { display: flex; gap: 18px; }
.gd3-hud-cell {
  text-align: right;
  padding-left: 18px;
  border-left: 1px solid var(--line);
}
.gd3-hud-label {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.gd3-hud-value {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--ink);
}

/* ----- canvas ----- */
.gd3-canvas {
  position: relative;
  flex: 1;
  min-height: 0;
  cursor: grab;
}
.gd3-canvas:active { cursor: grabbing; }
.gd3-canvas canvas { display: block; width: 100%; height: 100%; }
.gd3-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

/* ----- right panel ----- */
.gd3-panel {
  overflow-y: auto;
  background: var(--bg-2);
  padding: 20px 22px 40px;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.gd3-panel::-webkit-scrollbar { width: 6px; }
.gd3-panel::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

.gd3-section { margin-bottom: 22px; }
.gd3-section-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}
.gd3-section-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--line), transparent);
}
.gd3-section-title {
  font-family: var(--display);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin: 0;
  order: -1;
}
.gd3-section-body { display: flex; flex-direction: column; gap: 10px; }

/* ----- tabs ----- */
.gd3-tabs { display: flex; flex-direction: column; gap: 4px; }
.gd3-tab {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink-2);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}
.gd3-tab:hover:not(:disabled) { color: var(--ink); border-color: var(--ink-3); }
.gd3-tab.is-on {
  color: var(--ink);
  background: var(--bg-3);
  border-color: var(--tabAccent);
  box-shadow: inset 3px 0 0 var(--tabAccent), 0 0 20px -10px var(--tabAccent);
}
.gd3-tab:disabled { opacity: 0.4; cursor: not-allowed; }
.gd3-tab-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--tabAccent);
  box-shadow: 0 0 8px var(--tabAccent);
}

/* ----- toggle ----- */
.gd3-toggle {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
}
.gd3-toggle input { display: none; }
.gd3-toggle-box {
  width: 32px; height: 18px;
  background: var(--bg-3);
  border: 1px solid var(--line);
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
}
.gd3-toggle-box::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 12px; height: 12px;
  background: var(--ink-3);
  border-radius: 50%;
  transition: all 0.2s;
}
.gd3-toggle input:checked + .gd3-toggle-box {
  background: var(--accent);
  border-color: var(--accent);
}
.gd3-toggle input:checked + .gd3-toggle-box::after {
  left: 16px;
  background: #1a1d22;
}
.gd3-toggle-label {
  font-size: 11px;
  color: var(--ink-2);
  letter-spacing: 0.02em;
}

/* ----- slider ----- */
.gd3-slider { margin-bottom: 6px; }
.gd3-slider-head {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 8px;
}
.gd3-slider-label { font-size: 11px; color: var(--ink-2); letter-spacing: 0.03em; }
.gd3-slider-value {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 13px;
  color: var(--accent);
}
.gd3-slider input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  background: var(--line);
  border-radius: 1px;
  outline: none;
  cursor: pointer;
}
.gd3-slider input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px; height: 14px;
  background: var(--accent);
  border-radius: 50%;
  cursor: grab;
  border: 2px solid var(--bg-2);
  box-shadow: 0 0 0 1px var(--accent), 0 0 12px -2px var(--accent);
}
.gd3-slider input[type=range]::-moz-range-thumb {
  width: 14px; height: 14px;
  background: var(--accent);
  border-radius: 50%;
  cursor: grab;
  border: 2px solid var(--bg-2);
  box-shadow: 0 0 0 1px var(--accent);
}

/* ----- buttons ----- */
.gd3-row { display: flex; gap: 8px; }
.gd3-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--line);
  background: var(--bg-3);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}
.gd3-btn:hover { border-color: var(--ink-3); }
.gd3-btn.primary {
  background: var(--accent);
  color: #1a1d22;
  border-color: var(--accent);
  font-weight: 500;
}
.gd3-btn.primary:hover { background: #fffba0; }

/* ----- chips ----- */
.gd3-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.gd3-chip {
  padding: 8px;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-2);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.03em;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}
.gd3-chip:hover {
  color: var(--ink);
  border-color: var(--ink-3);
  background: var(--bg-3);
}
.gd3-hint-block {
  font-size: 10px;
  color: var(--ink-3);
  font-style: italic;
  margin: 8px 0 0;
  letter-spacing: 0.02em;
}

/* ----- telemetry ----- */
.gd3-tele { display: flex; flex-direction: column; gap: 10px; }
.gd3-tele-row {
  padding: 10px 12px;
  background: var(--bg-3);
  border: 1px solid var(--line);
  border-radius: 6px;
  border-left: 3px solid var(--c);
}
.gd3-tele-head {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.gd3-tele-dot {
  width: 6px; height: 6px;
  background: var(--c);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--c);
}
.gd3-tele-name {
  font-size: 11px;
  color: var(--ink);
  letter-spacing: 0.04em;
  flex: 1;
}
.gd3-tele-flag {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: var(--c);
  color: #111;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 500;
}
.gd3-tele-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 14px;
}
.gd3-stat {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 11px;
}
.gd3-stat-label {
  color: var(--ink-3);
  font-style: italic;
}
.gd3-stat-value {
  color: var(--ink);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* ----- notes ----- */
.gd3-note {
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink-2);
  margin: 0 0 10px;
  letter-spacing: 0.01em;
}
.gd3-note em {
  color: var(--accent);
  font-style: italic;
  font-family: var(--display);
}
.gd3-list {
  margin: 0;
  padding-left: 16px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink-2);
}
.gd3-list li { margin-bottom: 6px; letter-spacing: 0.01em; }
.gd3-list b { color: var(--ink); font-weight: 500; }
.gd3-list em { color: var(--accent); font-style: italic; font-family: var(--display); }
`;

export default GradientDescent3D;
