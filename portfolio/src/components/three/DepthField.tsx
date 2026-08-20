"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 220;
const FIELD_RADIUS = 9;

function generateField() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const seeds = new Float32Array(NODE_COUNT);
  for (let i = 0; i < NODE_COUNT; i++) {
    const r = FIELD_RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    positions[i * 3 + 2] = r * Math.cos(phi) - 2;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  return { positions, seeds };
}

function NodeField({ pointerRef }: { pointerRef: React.RefObject<{ x: number; y: number }> }) {
  const [{ positions, seeds }] = useState(generateField);
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const basePositions = useRef(positions.slice());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const geom = pointsRef.current?.geometry;
    if (geom) {
      const arr = geom.attributes.position.array as Float32Array;
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
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#d7ff5a"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
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

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <PointerTracker targetRef={pointerRef} />
      <NodeField pointerRef={pointerRef} />
      <fog attach="fog" args={["#161511", 6, 15]} />
    </Canvas>
  );
}
