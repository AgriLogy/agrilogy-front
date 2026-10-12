'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface BasinCubeProps {
  /** Interior length (m, X axis). Falls back to 1 when unknown. */
  lengthM: number | null;
  /** Interior width (m, Z axis). Falls back to 1 when unknown. */
  widthM: number | null;
  /** Sensor plane to bottom H_tot (m, Y axis). Falls back to 1. */
  hTotM: number | null;
  /** Current water column h(t) in metres. */
  hM: number | null;
  /** Usable depth h_max in metres (red max plane). */
  hMaxM: number | null;
  /** Fill vs h_max in % (used only when hM is unknown). */
  fillPct: number | null;
}

/** Longest side maps to this many world units so any pit fits the panel. */
const FIT_SIZE = 2;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const BasinCube = ({
  lengthM,
  widthM,
  hTotM,
  hM,
  hMaxM,
  fillPct,
}: BasinCubeProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const L = lengthM ?? 1;
    const W = widthM ?? 1;
    const H = hTotM ?? 1;
    // Uniform scale: proportions kept, longest side == FIT_SIZE.
    const s = FIT_SIZE / Math.max(L, W, H, 1e-6);
    const bx = L * s;
    const by = H * s;
    const bz = W * s;

    const waterMetres =
      hM != null
        ? clamp(hM, 0, H)
        : fillPct != null
          ? (clamp(fillPct, 0, 100) / 100) * H
          : 0;
    const waterH = waterMetres * s;
    const waterY = -by / 2 + waterH / 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(2.7, 2.1, 2.7);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(3, 5, 2);
    scene.add(sun);

    // Pit walls: transparent shell + blue edges.
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(bx, by, bz),
      new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.12,
        roughness: 0.25,
        metalness: 0,
        depthWrite: false,
      })
    );
    scene.add(shell);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(shell.geometry),
      new THREE.LineBasicMaterial({ color: 0x3b82f6 })
    );
    scene.add(edges);

    // Water body, grows from the bottom.
    if (waterH > 1e-4) {
      const water = new THREE.Mesh(
        new THREE.BoxGeometry(bx * 0.96, waterH, bz * 0.96),
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

    // Max-level plane at h_max (D_max dead band above it).
    if (hMaxM != null && H > 0) {
      const maxPlane = new THREE.Mesh(
        new THREE.BoxGeometry(bx * 1.02, 0.015, bz * 1.02),
        new THREE.MeshBasicMaterial({
          color: 0xe53e3e,
          transparent: true,
          opacity: 0.9,
        })
      );
      maxPlane.position.y = -by / 2 + clamp(hMaxM, 0, H) * s;
      scene.add(maxPlane);
    }

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
        const mat = (mesh as THREE.Mesh).material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      // Release the GL context synchronously so rebuilds never exhaust
      // the browser's context budget (see ForageCylinder).
      renderer.domElement.remove();
    };
  }, [lengthM, widthM, hTotM, hM, hMaxM, fillPct]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default BasinCube;
