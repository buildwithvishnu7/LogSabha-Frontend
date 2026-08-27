"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lsStates, lsParty } from "@/data/lok-sabha-2024";

/* The 18th Lok Sabha, seat by seat.
 *
 * All 543 members as individual seats in the chamber's hemicycle, coloured by
 * the party holding them. The seat totals are the declared 2024 result and sum
 * to exactly 543 — the geometry is generated from that arithmetic rather than
 * drawn, so it cannot drift out of step with the data.
 *
 * Ported from reference/new_ref/assets/loksabha-3d.js. The two ideas worth
 * keeping verbatim are the instancing (543 seats is one draw call, not 543) and
 * the sort by arc position, which is what makes each party read as one solid
 * wedge instead of a stripe scattered across every row.
 */

const ROWS = 11;
const R_IN = 26;
const R_OUT = 74;
const SPREAD = Math.PI * 0.92; // slightly less than a half turn, as in the chamber
const DIM = "#d7dfea";

export type PartyEntry = { key: string; name: string; colour: string; alliance: string; seats: number };

/** Left to right: INDIA bloc, then unaligned, then NDA — the way a seating
 *  diagram is normally read. The biggest party of each bloc sits toward the
 *  centre aisle. */
export function partyOrder(): PartyEntry[] {
  const tally: Record<string, number> = {};
  for (const st of Object.values(lsStates))
    for (const [k, n] of Object.entries(st.p)) tally[k] = (tally[k] ?? 0) + n;

  const rank: Record<string, number> = { INDIA: 0, OTH: 1, NDA: 2 };
  return Object.keys(tally)
    .map((k) => {
      const meta = lsParty[k] ?? { name: k, c: "#8fa3bf", al: "OTH" };
      return { key: k, name: meta.name, colour: meta.c, alliance: meta.al ?? "OTH", seats: tally[k] };
    })
    .sort((a, b) => {
      const ra = rank[a.alliance] ?? 1;
      const rb = rank[b.alliance] ?? 1;
      if (ra !== rb) return ra - rb;
      return a.alliance === "NDA" ? b.seats - a.seats : a.seats - b.seats;
    });
}

/** Seats per row, proportional to arc length, summing exactly to `total`. */
function rowCounts(total: number) {
  const radii: number[] = [];
  let sum = 0;
  for (let i = 0; i < ROWS; i++) {
    const r = R_IN + (R_OUT - R_IN) * (i / (ROWS - 1));
    radii.push(r);
    sum += r;
  }
  const counts = radii.map((r) => Math.max(1, Math.round((total * r) / sum)));
  let diff = total - counts.reduce((a, b) => a + b, 0);
  // The rounding remainder goes on the outer rows, which have the most room.
  let j = ROWS - 1;
  while (diff !== 0) {
    counts[j] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
    j = (j - 1 + ROWS) % ROWS;
  }
  return { counts, radii };
}

type Slot = { ang: number; rad: number; row: number; t: number; x: number; z: number; party: PartyEntry };

function buildSlots(order: PartyEntry[]): Slot[] {
  const total = order.reduce((a, p) => a + p.seats, 0);
  const { counts, radii } = rowCounts(total);

  const raw: Omit<Slot, "party" | "x" | "z">[] = [];
  for (let row = 0; row < ROWS; row++) {
    const n = counts[row];
    const rad = radii[row];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const ang = Math.PI + (Math.PI - SPREAD) / 2 + t * SPREAD;
      raw.push({ ang, rad, row, t });
    }
  }
  // Read left-to-right across the whole chamber, not row by row. Without this
  // every party would appear as eleven separate slivers.
  raw.sort((a, b) => a.t - b.t || a.row - b.row);

  const slots: Slot[] = [];
  let pi = 0;
  let used = 0;
  for (const s of raw) {
    while (pi < order.length - 1 && used >= order[pi].seats) {
      used = 0;
      pi++;
    }
    used++;
    slots.push({ ...s, party: order[pi], x: Math.cos(s.ang) * s.rad, z: Math.sin(s.ang) * s.rad });
  }
  return slots;
}

/* ── seats ────────────────────────────────────────────────────────────── */

function Seats({
  slots,
  highlight,
  onHover,
  onSelect,
}: {
  slots: Slot[];
  highlight: string | null;
  onHover: (p: PartyEntry | null, i: number) => void;
  onSelect: (p: PartyEntry) => void;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reveal = useRef(0);
  const hovered = useRef(-1);
  const dragged = useRef(false);

  // Colours are per-instance, rewritten only when the highlight changes.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    const dim = new THREE.Color(DIM);
    slots.forEach((s, i) => {
      const on = !highlight || s.party.key === highlight;
      m.setColorAt(i, on ? c.set(s.party.colour).clone() : dim);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [slots, highlight]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (reveal.current < 1) reveal.current = Math.min(1, reveal.current + Math.min(delta, 0.05) * 0.55);

    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      // Seats rise in a sweep from one side of the House to the other.
      const local = Math.max(0, Math.min(1, (reveal.current - s.t * 0.35) / 0.65));
      const hov = i === hovered.current ? 2.2 : 0;
      dummy.position.set(s.x, local * 1.6 - 1.6 + hov, s.z);
      dummy.scale.set(1, Math.max(0.02, local), 1);
      dummy.rotation.set(0, -s.ang, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, slots.length]}
      onPointerMove={(e) => {
        e.stopPropagation();
        const i = e.instanceId ?? -1;
        if (i === hovered.current) return;
        hovered.current = i;
        onHover(i >= 0 ? slots[i].party : null, i);
      }}
      onPointerOut={() => {
        hovered.current = -1;
        onHover(null, -1);
      }}
      onPointerDown={() => {
        dragged.current = false;
      }}
      onClick={(e) => {
        e.stopPropagation();
        const i = e.instanceId ?? -1;
        if (i >= 0 && !dragged.current) onSelect(slots[i].party);
      }}
    >
      {/* Slightly tapered so the seats read as benches under raking light. */}
      <cylinderGeometry args={[1.45, 1.7, 3.2, 10]} />
      <meshStandardMaterial roughness={0.5} metalness={0.08} />
    </instancedMesh>
  );
}

function Rig({ cam }: { cam: React.RefObject<{ az: number; pol: number; azGoal: number; polGoal: number }> }) {
  const r = useRef(150);
  useFrame(({ camera, size }, delta) => {
    const c = cam.current;
    if (!c) return;
    const persp = camera as THREE.PerspectiveCamera;
    const need = R_OUT + 14;
    const vFov = (persp.fov * Math.PI) / 180;
    const distV = need / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distH = need / Math.tan(hFov / 2);
    const goal = Math.min(420, Math.max(90, Math.max(distV, distH) * 1.04));

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

export default function LokSabhaChamber({
  highlight,
  onHoverParty,
  onSelectParty,
}: {
  highlight: string | null;
  onHoverParty: (p: PartyEntry | null) => void;
  onSelectParty: (p: PartyEntry) => void;
}) {
  const order = useMemo(() => partyOrder(), []);
  const slots = useMemo(() => buildSlots(order), [order]);
  const cam = useRef({ az: 0, pol: 0.78, azGoal: 0, polGoal: 0.78 });
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
        cam.current.polGoal = clamp(d.pol - dy * 0.004, 0.18, 1.2);
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
        if (e.key === "ArrowLeft") { c.azGoal -= 0.22; e.preventDefault(); }
        else if (e.key === "ArrowRight") { c.azGoal += 0.22; e.preventDefault(); }
        else if (e.key === "ArrowUp") { c.polGoal = clamp(c.polGoal - 0.1, 0.18, 1.2); e.preventDefault(); }
        else if (e.key === "ArrowDown") { c.polGoal = clamp(c.polGoal + 0.1, 0.18, 1.2); e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`All ${slots.length} seats of the 18th Lok Sabha, coloured by party. Use the arrow keys to swing the chamber.`}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 1, far: 900 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[-60, 120, 90]} intensity={0.9} />
        <directionalLight position={[80, 40, -70]} intensity={0.35} color="#ffc27a" />
        <Rig cam={cam} />
        <Seats
          slots={slots}
          highlight={highlight}
          onHover={(p) => onHoverParty(p)}
          onSelect={(p) => {
            if (drag.current && drag.current.moved > 6) return;
            onSelectParty(p);
          }}
        />
      </Canvas>
    </div>
  );
}
