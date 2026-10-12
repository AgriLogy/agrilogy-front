'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ForageCylinderProps {
  /** Interior diameter (m). Falls back to 1 when unknown. */
  diameterM: number | null;
  /** Total borehole depth H (m). Falls back to 1 when unknown. */
  totalDepthM: number | null;
  /** Current depth to the water surface (m). */
  depthM: number | null;
  /** HIGH threshold depth (green ring). */
  highM: number | null;
  /** LOW threshold depth (red ring). */
  lowM: number | null;
}

/** Largest extent maps to this many world units so any bore fits the panel. */
const FIT_SIZE = 2;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const ForageCylinder = ({
  diameterM,
  totalDepthM,
  depthM,
  highM,
  lowM,
}: ForageCylinderProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const D = diameterM ?? 1;
    const H = totalDepthM ?? 1;
    // Uniform scale: proportions kept, largest extent == FIT_SIZE.
    const s = FIT_SIZE / Math.max(D, H, 1e-6);
    const r = (D * s) / 2;
    const by = H * s;

    const depthClamped = depthM != null ? clamp(depthM, 0, H) : H;
    const waterH = Math.max(0, (H - depthClamped) * s);
    const waterY = -by / 2 + waterH / 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(2.7, 1.6, 2.7);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(3, 5, 2);
    scene.add(sun);

    // Bore walls: transparent shell + blue edges.
    const shellGeo = new THREE.CylinderGeometry(r, r, by, 40, 1, true);
    const shell = new THREE.Mesh(
      shellGeo,
      new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.14,
        roughness: 0.25,
        metalness: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    scene.add(shell);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(shellGeo, 20),
      new THREE.LineBasicMaterial({ color: 0x3b82f6 })
    );
    scene.add(edges);
    // Top + bottom rims.
    for (const y of [-by / 2, by / 2]) {
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 10, 48),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = y;
      scene.add(rim);
    }

    // Water body, grows from the bottom.
    if (waterH > 1e-4) {
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(r * 0.94, r * 0.94, waterH, 40),
        new THREE.MeshStandardMaterial({
          color: 0x2563eb,
          transparent: true,
          opacity: 0.85,
          roughness: 0.15,
          metalness: 0,
        })
      );
      water.position.y = waterY;
      scene.add(water);
    }

    // Threshold rings: green at HIGH depth, red at LOW depth.
    const ring = (atM: number | null, color: number) => {
      if (atM == null || H <= 0) return;
      const t = new THREE.Mesh(
        new THREE.TorusGeometry(r * 1.02, 0.014, 10, 48),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
      );
      t.rotation.x = Math.PI / 2;
      t.position.y = -by / 2 + (H - clamp(atM, 0, H)) * s;
      scene.add(t);
    };
    ring(highM, 0x38a169);
    ring(lowM, 0xe53e3e);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      // Release the GL context synchronously: without this, rapid
      // rebuilds (forage playback ticks) exhaust the browser's ~16
      // contexts and the oldest canvas goes black.
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [diameterM, totalDepthM, depthM, highM, lowM]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ForageCylinder;
