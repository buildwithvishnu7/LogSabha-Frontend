"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Services — the 3D campaign command deck.
 *
 * WHAT IT SHOWS
 * Six disciplines as six nodes on a ring around one core. The core is the
 * campaign; every node is wired back to it with a lit spoke, because none of
 * these units is sold or run on its own — the survey feeds the strategy, the
 * strategy feeds the speech. Turning the deck is the point: from any angle you
 * can see that all six hang off the same centre.
 *
 * Each node carries its own geometry rather than six identical spheres, so a
 * discipline stays recognisable once the ring has turned and its label is
 * behind the core.
 *
 * Ported from reference/new_ref/assets/services-3d.js, which is vanilla
 * three.js. Two things are done differently here because r3f already provides
 * them and hand-rolling them again would be worse code: picking uses r3f's own
 * pointer events instead of a manual raycaster, and the canvas resizes itself,
 * so the reference's per-frame `clientWidth` check is unnecessary.
 */

const SAFFRON = "#ff9933";
const LIGHT = "#ffc27a";
const DEEP = "#e87d12";
const BLUE = "#1b6ec2";
const GREEN = "#138808";

const RING = 58;

export type DeckNode = {
  id: string;
  number: string;
  label: string;
  colour: string;
  shape: "pin" | "ico" | "stage" | "mic" | "bars" | "knot";
};

/** Shapes are assigned by meaning, not decoration — a map pin for choosing a
 *  seat, a stage for events, a microphone for speech, bars for survey data. */
export const SERVICE_NODES: DeckNode[] = [
  { id: "constituency", number: "01", label: "Constituency Selection", colour: SAFFRON, shape: "pin" },
  { id: "campaigning", number: "02", label: "Political Campaigning", colour: DEEP, shape: "ico" },
  { id: "events", number: "03", label: "Event Management", colour: LIGHT, shape: "stage" },
  { id: "speech", number: "04", label: "Speech Composition", colour: SAFFRON, shape: "mic" },
  { id: "survey", number: "05", label: "Survey Assistance", colour: GREEN, shape: "bars" },
  { id: "strategy", number: "06", label: "Election Strategy", colour: BLUE, shape: "knot" },
];

/* ── one node ─────────────────────────────────────────────────────────── */

function NodeMesh({
  node,
  index,
  total,
  active,
  dimmed,
  spin,
  onHover,
  onSelect,
}: {
  node: DeckNode;
  index: number;
  total: number;
  active: boolean;
  dimmed: boolean;
  spin: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const holder = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const scale = useRef(0);

  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * RING;
  const z = Math.sin(angle) * RING;
  const phase = index * 1.27;

  // Dimming is a material swap rather than opacity so the node keeps its solidity.
  const colour = dimmed ? "#8a97a8" : node.colour;

  useFrame((state, delta) => {
    const h = holder.current;
    if (!h) return;
    const goal = active ? 1.3 : 1;
    // Frame-rate independent easing — the same curve at 60 and 144 Hz.
    const k = 1 - Math.pow(0.003, Math.min(delta, 0.05));
    scale.current += (goal - scale.current) * k;
    h.scale.setScalar(Math.max(0.001, scale.current));
    h.position.y = Math.sin(state.clock.elapsedTime * 0.7 + phase) * 3.2;
    // Counter-spin against the ring so a face never turns fully away.
    if (spin && inner.current) inner.current.rotation.y += delta * 0.35;
  });

  return (
    <group
      ref={holder}
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <group ref={inner}>
        {node.shape === "bars" ? (
          // A group rather than one mesh, so it still reads as "a chart" at the
          // size the ring puts it on screen.
          [5, 9, 13].map((h, i) => (
            <mesh key={i} position={[(i - 1) * 4.3, h / 2 - 6, 0]}>
              <boxGeometry args={[3.1, h, 3.1]} />
              <meshStandardMaterial color={colour} roughness={0.4} metalness={0.15} />
            </mesh>
          ))
        ) : node.shape === "mic" ? (
          <>
            <mesh position={[0, 3.4, 0]}>
              <sphereGeometry args={[4.6, 20, 16]} />
              <meshStandardMaterial color={colour} roughness={0.42} metalness={0.2} />
            </mesh>
            <mesh position={[0, -3.2, 0]}>
              <cylinderGeometry args={[1.1, 1.1, 8, 12]} />
              <meshStandardMaterial color={colour} roughness={0.42} metalness={0.2} />
            </mesh>
          </>
        ) : node.shape === "pin" ? (
          // Cone pointing down with a ball on top — a map pin.
          <>
            <mesh position={[0, -4, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[4.6, 9, 16]} />
              <meshStandardMaterial color={colour} roughness={0.42} metalness={0.14} />
            </mesh>
            <mesh position={[0, 3, 0]}>
              <sphereGeometry args={[4.2, 20, 16]} />
              <meshStandardMaterial color={colour} roughness={0.42} metalness={0.14} />
            </mesh>
          </>
        ) : (
          <mesh>
            {node.shape === "stage" ? (
              <boxGeometry args={[11, 6.5, 11]} />
            ) : node.shape === "knot" ? (
              <torusKnotGeometry args={[5.2, 1.7, 90, 12]} />
            ) : (
              <icosahedronGeometry args={[7.4, 1]} />
            )}
            <meshStandardMaterial color={colour} roughness={0.42} metalness={0.14} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/* ── the deck ─────────────────────────────────────────────────────────── */

function Deck({
  hovered,
  spin,
  onHover,
  onSelect,
}: {
  hovered: string | null;
  spin: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const ring = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!spin) return;
    const d = Math.min(delta, 0.05);
    if (ring.current) ring.current.rotation.y += 0.052 * d;
    if (shell.current) {
      shell.current.rotation.y -= 0.018 * d;
      shell.current.rotation.x += 0.008 * d;
    }
    if (core.current) {
      core.current.rotation.y += d * 0.17;
      core.current.rotation.x += d * 0.06;
    }
  });

  // Spokes are static geometry; building them once avoids six allocations a frame.
  const spokes = useMemo(
    () =>
      SERVICE_NODES.map((_, i) => {
        const a = (i / SERVICE_NODES.length) * Math.PI * 2;
        return {
          key: i,
          position: [(Math.cos(a) * RING) / 2, 0, (Math.sin(a) * RING) / 2] as [number, number, number],
          rotation: [0, -a, Math.PI / 2] as [number, number, number],
        };
      }),
    [],
  );

  return (
    <group>
      {/* core: the campaign everything hangs off */}
      <mesh ref={core}>
        <icosahedronGeometry args={[13, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.33}
          metalness={0.18}
          emissive={SAFFRON}
          emissiveIntensity={0.26}
        />
      </mesh>

      {/* halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[18, 0.5, 8, 96]} />
        <meshBasicMaterial color={DEEP} transparent opacity={0.62} />
      </mesh>

      {/* the ring track */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING, 0.24, 6, 180]} />
        <meshBasicMaterial color={SAFFRON} transparent opacity={0.28} />
      </mesh>

      {/* outer wireframe shell, for depth behind the ring */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[RING + 30, 1]} />
        <meshBasicMaterial color={LIGHT} wireframe transparent opacity={0.09} />
      </mesh>

      <group ref={ring}>
        {spokes.map((s) => (
          <mesh key={s.key} position={s.position} rotation={s.rotation}>
            <cylinderGeometry args={[0.22, 0.22, RING - 20, 6]} />
            <meshBasicMaterial color={SAFFRON} transparent opacity={0.34} />
          </mesh>
        ))}
        {SERVICE_NODES.map((n, i) => (
          <NodeMesh
            key={n.id}
            node={n}
            index={i}
            total={SERVICE_NODES.length}
            active={hovered === n.id}
            dimmed={hovered !== null && hovered !== n.id}
            spin={spin}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  );
}

/* ── camera rig ───────────────────────────────────────────────────────── */

function Rig({ cam }: { cam: React.RefObject<{ az: number; pol: number; azGoal: number; polGoal: number }> }) {
  const { camera, size } = useThree();
  const r = useRef(220);

  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;

    // Keep the ring inside the frame at any aspect — on a tall phone the
    // horizontal field is the constraint, on a wide desktop the vertical one.
    const persp = camera as THREE.PerspectiveCamera;
    const need = RING + 22;
    const vFov = (persp.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const distV = need / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distH = need / Math.tan(hFov / 2);
    const goal = Math.min(480, Math.max(130, Math.max(distV, distH) * 1.05));

    const k = 1 - Math.pow(0.003, Math.min(delta, 0.05));
    c.az += (c.azGoal - c.az) * k;
    c.pol += (c.polGoal - c.pol) * k;
    r.current += (goal - r.current) * k;

    camera.position.set(
      r.current * Math.sin(c.pol) * Math.sin(c.az),
      r.current * Math.cos(c.pol),
      r.current * Math.sin(c.pol) * Math.cos(c.az),
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── public component ─────────────────────────────────────────────────── */

export default function ServiceDeck({
  onSelect,
  reducedMotion = false,
}: {
  onSelect?: (id: string) => void;
  reducedMotion?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const cam = useRef({ az: 0.35, pol: 0.72, azGoal: 0.35, polGoal: 0.72 });
  const drag = useRef<{ x: number; y: number; az: number; pol: number; moved: number } | null>(null);

  const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, az: cam.current.azGoal, pol: cam.current.polGoal, moved: 0 };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
    cam.current.azGoal = d.az - dx * 0.006;
    cam.current.polGoal = clamp(d.pol - dy * 0.005, 0.16, 1.32);
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
    setDragging(false);
  }, []);

  // A click that travelled more than a few pixels was a drag, not a selection.
  const handleSelect = useCallback(
    (id: string) => {
      if (drag.current && drag.current.moved > 6) return;
      onSelect?.(id);
    },
    [onSelect],
  );

  // Arrow keys orbit the deck, so the scene is not pointer-only.
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const c = cam.current;
    if (e.key === "ArrowLeft") { c.azGoal -= 0.3; e.preventDefault(); }
    else if (e.key === "ArrowRight") { c.azGoal += 0.3; e.preventDefault(); }
    else if (e.key === "ArrowUp") { c.polGoal = clamp(c.polGoal - 0.12, 0.16, 1.32); e.preventDefault(); }
    else if (e.key === "ArrowDown") { c.polGoal = clamp(c.polGoal + 0.12, 0.16, 1.32); e.preventDefault(); }
  }, []);

  return (
    <div
      // Absolutely filling the (relative) stage rather than h-full: r3f wraps
      // the canvas in a div of its own, and a percentage height chain through
      // that wrapper collapses — the canvas came out 150px inside a 335px box.
      // An inset-0 box is definite, so r3f measures it correctly.
      className="absolute inset-0 outline-none"
      style={{ cursor: hovered ? "pointer" : dragging ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="The six services, shown as a rotating 3D deck. Use the arrow keys to turn it."
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.5, far: 900 }}
      >
        <ambientLight intensity={0.66} />
        <directionalLight position={[-40, 95, 80]} intensity={0.75} />
        <directionalLight position={[70, 25, -60]} intensity={0.42} color={LIGHT} />
        <Rig cam={cam} />
        <Deck
          hovered={hovered}
          spin={!reducedMotion}
          onHover={setHovered}
          onSelect={handleSelect}
        />
      </Canvas>
    </div>
  );
}
