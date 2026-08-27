"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lsStates, lsParty } from "@/data/lok-sabha-2024";

/* Political Parties — the alliance orbit.
 *
 * One system, three rings. Every party that won a seat sits on the ring of its
 * alliance — NDA inner, INDIA bloc middle, unaligned outer — and its sphere is
 * sized by how many seats it holds. The rings turn at different speeds and the
 * middle one turns the other way, so coalition membership and relative weight
 * read at a glance rather than needing a legend.
 *
 * Seat counts are derived from lok-sabha-2024.ts at render time, never stored
 * here, so the picture cannot drift out of step with the declared result.
 *
 * Ported from reference/new_ref/assets/parties-3d.js.
 */

const RINGS = {
  NDA: { r: 44, colour: "#ff9933", speed: 0.055, label: "NDA" },
  INDIA: { r: 68, colour: "#1b6ec2", speed: -0.04, label: "INDIA Bloc" },
  OTH: { r: 88, colour: "#138808", speed: 0.028, label: "Others" },
} as const;

export type Alliance = keyof typeof RINGS;

export type OrbitNode = {
  key: string;
  name: string;
  colour: string;
  alliance: Alliance;
  seats: number;
  angle: number;
  size: number;
};

/** Seats per party, summed from the state rows — the same arithmetic the
 *  chamber uses, so the two pages can never disagree. */
export function partySeats(): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const st of Object.values(lsStates))
    for (const [k, n] of Object.entries(st.p)) tally[k] = (tally[k] ?? 0) + n;
  return tally;
}

export function orbitNodes(): OrbitNode[] {
  const tally = partySeats();
  const max = Math.max(...Object.values(tally));

  const byRing: Record<Alliance, string[]> = { NDA: [], INDIA: [], OTH: [] };
  for (const k of Object.keys(tally)) {
    const al = (lsParty[k]?.al ?? "OTH") as string;
    const ring: Alliance = al === "NDA" ? "NDA" : al === "INDIA" ? "INDIA" : "OTH";
    byRing[ring].push(k);
  }

  const out: OrbitNode[] = [];
  (Object.keys(byRing) as Alliance[]).forEach((ring) => {
    // Biggest first, then spread evenly around the ring so a crowded outer ring
    // does not bunch its largest spheres together.
    const keys = byRing[ring].sort((a, b) => tally[b] - tally[a]);
    keys.forEach((k, i) => {
      out.push({
        key: k,
        name: lsParty[k]?.name ?? k,
        colour: lsParty[k]?.c ?? "#8fa3bf",
        alliance: ring,
        seats: tally[k],
        angle: (i / keys.length) * Math.PI * 2,
        size: 2 + Math.pow(tally[k] / max, 0.42) * 6.5,
      });
    });
  });
  return out;
}

/* ── one ring ─────────────────────────────────────────────────────────── */

function Ring({
  alliance,
  nodes,
  highlight,
  spin,
  onHover,
  onSelect,
}: {
  alliance: Alliance;
  nodes: OrbitNode[];
  highlight: string | null;
  spin: boolean;
  onHover: (n: OrbitNode | null) => void;
  onSelect: (n: OrbitNode) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const cfg = RINGS[alliance];

  useFrame((_, delta) => {
    if (!spin || !group.current) return;
    group.current.rotation.y += cfg.speed * Math.min(delta, 0.05);
  });

  return (
    <group ref={group}>
      {/* the track the parties sit on */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[cfg.r, 0.18, 6, 160]} />
        <meshBasicMaterial color={cfg.colour} transparent opacity={0.3} />
      </mesh>

      {nodes.map((n) => {
        const dim = highlight !== null && highlight !== n.key;
        return (
          <mesh
            key={n.key}
            position={[Math.cos(n.angle) * cfg.r, 0, Math.sin(n.angle) * cfg.r]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(n);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(n);
            }}
          >
            <sphereGeometry args={[n.size, 24, 18]} />
            <meshStandardMaterial
              color={dim ? "#c7d2de" : n.colour}
              roughness={0.42}
              metalness={0.12}
              emissive={dim ? "#000000" : n.colour}
              emissiveIntensity={highlight === n.key ? 0.4 : 0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Rig({ cam }: { cam: React.RefObject<{ az: number; pol: number; azGoal: number; polGoal: number }> }) {
  const r = useRef(210);
  useFrame(({ camera, size }, delta) => {
    const c = cam.current;
    if (!c) return;
    const persp = camera as THREE.PerspectiveCamera;
    const need = RINGS.OTH.r + 16;
    const vFov = (persp.fov * Math.PI) / 180;
    const distV = need / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distH = need / Math.tan(hFov / 2);
    const goal = Math.min(460, Math.max(120, Math.max(distV, distH) * 1.04));

    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
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

export default function PartyOrbit({
  highlight,
  onHoverParty,
  onSelectParty,
  reducedMotion = false,
}: {
  highlight: string | null;
  onHoverParty: (n: OrbitNode | null) => void;
  onSelectParty: (n: OrbitNode) => void;
  reducedMotion?: boolean;
}) {
  const nodes = useMemo(() => orbitNodes(), []);
  const byRing = useMemo(
    () => ({
      NDA: nodes.filter((n) => n.alliance === "NDA"),
      INDIA: nodes.filter((n) => n.alliance === "INDIA"),
      OTH: nodes.filter((n) => n.alliance === "OTH"),
    }),
    [nodes],
  );
  const cam = useRef({ az: 0, pol: 0.62, azGoal: 0, polGoal: 0.62 });
  const drag = useRef<{ x: number; y: number; az: number; pol: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: grabbing ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, az: cam.current.azGoal, pol: cam.current.polGoal, moved: 0 };
        setGrabbing(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
        cam.current.azGoal = d.az - dx * 0.005;
        cam.current.polGoal = clamp(d.pol - dy * 0.004, 0.14, 1.3);
      }}
      onPointerUp={() => {
        drag.current = null;
        setGrabbing(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setGrabbing(false);
      }}
      onKeyDown={(e) => {
        const c = cam.current;
        if (e.key === "ArrowLeft") { c.azGoal -= 0.25; e.preventDefault(); }
        else if (e.key === "ArrowRight") { c.azGoal += 0.25; e.preventDefault(); }
        else if (e.key === "ArrowUp") { c.polGoal = clamp(c.polGoal - 0.1, 0.14, 1.3); e.preventDefault(); }
        else if (e.key === "ArrowDown") { c.polGoal = clamp(c.polGoal + 0.1, 0.14, 1.3); e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`${nodes.length} parties of the 18th Lok Sabha on three alliance rings, each sphere sized by seats held. Use the arrow keys to turn the orbit.`}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.5, far: 800 }}
      >
        <ambientLight intensity={0.62} />
        <directionalLight position={[-50, 110, 90]} intensity={0.72} />
        <directionalLight position={[80, 40, -70]} intensity={0.34} color="#ffc27a" />
        <Rig cam={cam} />

        {/* the centre — the House the three rings all report to */}
        <mesh>
          <icosahedronGeometry args={[11, 2]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.34}
            metalness={0.16}
            emissive="#ff9933"
            emissiveIntensity={0.22}
          />
        </mesh>

        {(Object.keys(RINGS) as Alliance[]).map((a) => (
          <Ring
            key={a}
            alliance={a}
            nodes={byRing[a]}
            highlight={highlight}
            spin={!reducedMotion}
            onHover={onHoverParty}
            onSelect={(n) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelectParty(n);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}

export { RINGS };
