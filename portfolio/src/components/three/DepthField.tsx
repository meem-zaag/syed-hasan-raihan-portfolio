"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { useThemeColor } from "@/lib/useThemeColor";

const NODE_COUNT = 220;
const FIELD_RADIUS = 9;
const LINK_DISTANCE = 1.7;
const MAX_LINKS = 180;

// Radial-gradient sprite so points render as soft glowing orbs instead of
// Three's default flat squares.
function useGlowSprite() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function generateField() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const seeds = new Float32Array(NODE_COUNT);
  const scales = new Float32Array(NODE_COUNT);
  for (let i = 0; i < NODE_COUNT; i++) {
    const r = FIELD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    positions[i * 3 + 2] = r * Math.cos(phi) - 2;
    seeds[i] = Math.random() * Math.PI * 2;
    scales[i] = 0.6 + Math.random() * 1.1;
  }
  return { positions, seeds, scales };
}

function NodeField({ pointerRef }: { pointerRef: React.RefObject<{ x: number; y: number }> }) {
  const [{ positions, seeds, scales }] = useState(generateField);
  const sprite = useGlowSprite();
  const signalColor = useThemeColor("--signal", "#ff8b5e");
  const emberColor = useThemeColor("--ember", "#e0a458");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  // Additive blending only reads as a glow against a dark canvas - on a
  // light background it barely brightens already-light pixels, so the
  // particles nearly vanish. Normal blending (a real composited, opaque-ish
  // dot) is what actually shows up in light mode.
  const pointBlending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
  const lineBlending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
  const pointOpacity = isLight ? 1 : 0.9;
  const lineOpacity = isLight ? 0.4 : 0.16;
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const basePositions = useRef(positions.slice());
  // Seed buffer for the link geometry's initial attribute args only - once
  // mounted, the live array is always read back off linesRef.current (same
  // pattern as the points position array above), never referenced by this
  // variable again, so there's nothing here for the compiler to flag.
  const linkPositionsSeed = useMemo(() => new Float32Array(MAX_LINKS * 2 * 3), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const geom = pointsRef.current?.geometry;
    const arr = geom?.attributes.position.array as Float32Array | undefined;
    if (geom && arr) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const bx = basePositions.current[i * 3];
        const by = basePositions.current[i * 3 + 1];
        const bz = basePositions.current[i * 3 + 2];
        const s = seeds[i];
        arr[i * 3] = bx + Math.sin(t * 0.15 + s) * 0.18;
        arr[i * 3 + 1] = by + Math.cos(t * 0.12 + s) * 0.18;
        arr[i * 3 + 2] = bz + Math.sin(t * 0.1 + s * 2) * 0.12;
      }
      geom.attributes.position.needsUpdate = true;

      // Draw faint constellation links between nearby nodes for a more
      // sculptural, less "cloud of dots" feel.
      const lineGeom = linesRef.current?.geometry;
      const lineArr = lineGeom?.attributes.position.array as Float32Array | undefined;
      if (lineGeom && lineArr) {
        let linkCount = 0;
        for (let i = 0; i < NODE_COUNT && linkCount < MAX_LINKS; i += 2) {
          const ax = arr[i * 3],
            ay = arr[i * 3 + 1],
            az = arr[i * 3 + 2];
          for (let j = i + 1; j < Math.min(i + 6, NODE_COUNT) && linkCount < MAX_LINKS; j++) {
            const bx = arr[j * 3],
              by = arr[j * 3 + 1],
              bz = arr[j * 3 + 2];
            const d = Math.hypot(ax - bx, ay - by, az - bz);
            if (d < LINK_DISTANCE) {
              const o = linkCount * 6;
              lineArr[o] = ax;
              lineArr[o + 1] = ay;
              lineArr[o + 2] = az;
              lineArr[o + 3] = bx;
              lineArr[o + 4] = by;
              lineArr[o + 5] = bz;
              linkCount++;
            }
          }
        }
        lineGeom.setDrawRange(0, linkCount * 2);
        lineGeom.attributes.position.needsUpdate = true;
      }
    }

    if (groupRef.current) {
      const targetY = (pointerRef.current?.x ?? 0) * 0.35;
      const targetX = -(pointerRef.current?.y ?? 0) * 0.2;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.y += 0.0006;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={sprite}
          color={signalColor}
          transparent
          opacity={pointOpacity}
          sizeAttenuation
          depthWrite={false}
          blending={pointBlending}
        />
      </points>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linkPositionsSeed, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={emberColor}
          transparent
          opacity={lineOpacity}
          depthWrite={false}
          blending={lineBlending}
        />
      </lineSegments>
    </group>
  );
}

function PointerTracker({ targetRef }: { targetRef: React.RefObject<{ x: number; y: number }> }) {
  const { size } = useThree();
  useFrame((state) => {
    targetRef.current = {
      x: state.pointer.x,
      y: state.pointer.y,
    };
    void size;
  });
  return null;
}

export default function DepthField() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const fogColor = useThemeColor("--background", "#161511");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <PointerTracker targetRef={pointerRef} />
      <NodeField pointerRef={pointerRef} />
      <fog attach="fog" args={[fogColor, 6, 15]} />
      {/* Bloom simulates light spilling into a dark scene - on a light
          background there's no dark canvas for it to spill into, so it just
          washes out contrast instead of adding a glow. Skip it in light mode. */}
      {!isLight && (
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
