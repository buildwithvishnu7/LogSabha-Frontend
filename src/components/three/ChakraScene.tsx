"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* A real dharma wheel in WebGL for the RSS centenary hero.
 *
 * Why 3D here and nowhere else: the chakra is genuinely a solid object — a rim,
 * a hub and twenty-four spokes with depth — so lighting and perspective say
 * something a flat SVG cannot. Everything else on the site gets CSS motion.
 *
 * Kept deliberately cheap: three meshes plus one points cloud, no postprocessing,
 * no shadows, no texture loads. The caller lazy-loads this and only mounts it on
 * capable devices, with the flat chakra rendering underneath regardless. */

const SPOKES = 24;
const SAFFRON = "#FF8A1F";
const DEEP = "#B25400";

function Wheel({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // One geometry/material reused across all spokes — 24 draw calls of the same
  // buffer rather than 24 separate allocations.
  const spokeGeo = useMemo(() => new THREE.BoxGeometry(0.045, 1.42, 0.045), []);
  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SAFFRON,
        metalness: 0.65,
        roughness: 0.28,
        emissive: new THREE.Color(DEEP),
        emissiveIntensity: 0.18,
      }),
    [],
  );

  const spokes = useMemo(
    () => Array.from({ length: SPOKES }, (_, i) => (i * Math.PI * 2) / SPOKES),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Slow, steady turn — a century wheel should feel unhurried.
    g.rotation.z -= delta * 0.085;
    // Pointer parallax, eased so it never snaps.
    const p = pointer.current ?? { x: 0, y: 0 };
    g.rotation.x += (p.y * 0.22 - g.rotation.x) * 0.05;
    g.rotation.y += (p.x * 0.28 - g.rotation.y) * 0.05;
    // Gentle breathing scale keeps it alive when the pointer is still.
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
    g.scale.setScalar(s * Math.min(viewport.width / 6, 1.15));
  });

  return (
    <group ref={group}>
      {/* rim */}
      <mesh material={metal}>
        <torusGeometry args={[1.5, 0.055, 16, 96]} />
      </mesh>
      {/* inner ring */}
      <mesh material={metal}>
        <torusGeometry args={[0.42, 0.04, 14, 64]} />
      </mesh>
      {/* hub */}
      <mesh material={metal}>
        <sphereGeometry args={[0.13, 24, 24]} />
      </mesh>
      {/* twenty-four spokes */}
      {spokes.map((a, i) => (
        <mesh key={i} geometry={spokeGeo} material={metal} rotation={[0, 0, a]} position={[0, 0, 0]}>
          <object3D />
        </mesh>
      ))}
    </group>
  );
}

function Dust() {
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (pts.current) pts.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial size={0.028} color="#FFD9A0" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ChakraScene() {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <Canvas
      // No positioning override here — the caller's wrapper is already
      // absolutely positioned, and forcing `position: absolute` onto r3f's own
      // wrapper stops it sizing the canvas to the box.
      style={{ width: "100%", height: "100%" }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
      // dpr capped at 1.6: past that the pixel cost climbs faster than the
      // visible gain on a slowly rotating object.
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      onPointerMove={(e) => {
        const r = (e.target as HTMLElement).getBoundingClientRect();
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        };
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} color="#FFE0B0" />
      <directionalLight position={[-4, -2, 2]} intensity={0.9} color="#FF7A00" />
      <Wheel pointer={pointer} />
      <Dust />
    </Canvas>
  );
}
