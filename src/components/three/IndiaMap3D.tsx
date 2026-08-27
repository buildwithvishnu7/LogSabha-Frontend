"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { lsStates, lsParty, lsAlliance, type StateRow } from "@/data/lok-sabha-2024";

/* Political Analytics — India, extruded.
 *
 * Every state is a solid whose HEIGHT and COLOUR each read a metric you choose,
 * built from real district boundaries (759 of them, Survey-of-India derived).
 *
 * Ported from reference/new_ref/assets/india-map3d.js. Two deliberate changes:
 *
 *  1. The reference extrudes each district separately and merges the results.
 *     Here one ExtrudeGeometry is built per state from all its district rings at
 *     a fixed depth of 1, and the metric drives mesh scale instead. That is 36
 *     geometries either way, but scale is animatable — switching metric now
 *     eases between heights rather than rebuilding the mesh.
 *
 *  2. Its colour ramps are arbitrary (#fde68a→#15803d, #dbeafe→#1d4ed8). Those
 *     are replaced with ramps built from this site's saffron/navy tokens, except
 *     for party and alliance colours, which are the parties' real ones and must
 *     not be restyled.
 */

export type HeightMetric = "seats" | "turnout" | "ndaShare" | "indiaShare";
export type ColourMetric = "alliance" | "party" | "turnout";

/** Per-state override of height and/or colour. Used by the year selector: on a
 *  state-assembly year the Lok Sabha metrics mean nothing, so each state is
 *  styled from that year's assembly result instead, and states that did not
 *  poll are flattened and greyed rather than left showing stale 2024 figures. */
export type StateStyle = { height?: number; colour?: string };

type Geo = { v: number; s: { n: string; c: string; d: { n: string; c: string; p: number[][] }[] }[] };

const SPAN = 190; // world units across the map's larger dimension
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const mix = (a: string, b: string, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t);

function heightFor(d: StateRow | null, metric: HeightMetric): number {
  if (!d) return 2;
  switch (metric) {
    case "turnout":
      return 2 + clamp((d.t - 52) / 34, 0, 1) * 24;
    case "ndaShare":
      return 2 + (d.n / d.seats) * 24;
    case "indiaShare":
      return 2 + (d.i / d.seats) * 24;
    default:
      // Compressed so Uttar Pradesh's 80 seats does not dwarf every other state.
      return 2 + Math.pow(d.seats / 80, 0.72) * 26;
  }
}

function colourFor(d: StateRow | null, by: ColourMetric): THREE.Color {
  if (!d) return new THREE.Color("#c7d2de");
  if (by === "party") {
    const p = lsParty[d.lead];
    return new THREE.Color(p ? p.c : "#94a3b8");
  }
  if (by === "turnout") {
    // Saffron-to-navy: low turnout pale, high turnout deep blue.
    return mix("#ffd4a3", "#12306b", clamp((d.t - 55) / 28, 0, 1));
  }
  const a = lsAlliance[d.win];
  return new THREE.Color(a ? a.c : "#94a3b8");
}

/* ── one state ────────────────────────────────────────────────────────── */

function StateSolid({
  name,
  geometry,
  data,
  metric,
  colourBy,
  style,
  selected,
  anySelected,
  onHover,
  onSelect,
}: {
  name: string;
  geometry: THREE.ExtrudeGeometry;
  data: StateRow | null;
  metric: HeightMetric;
  colourBy: ColourMetric;
  style: StateStyle | null;
  selected: boolean;
  anySelected: boolean;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  // An explicit style wins over both metrics — that is how the year selector
  // switches the map to a state-assembly view without touching the geometry.
  const target = style?.height ?? heightFor(data, metric);
  const colour = useMemo(
    () => (style?.colour ? new THREE.Color(style.colour) : colourFor(data, colourBy)),
    [data, colourBy, style?.colour],
  );
  const cur = useRef(0);

  // Anything not selected recedes rather than disappearing, so the map stays
  // readable as a whole while one state is being read.
  const opacity = anySelected && !selected ? 0.35 : 1;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    cur.current += (target - cur.current) * k;
    // The group is rotated so the extrude axis (local z) points up in world y.
    m.scale.z = Math.max(0.001, cur.current);
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(name);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(name);
      }}
    >
      <meshStandardMaterial
        color={colour}
        roughness={0.55}
        metalness={0.08}
        transparent={opacity < 1}
        opacity={opacity}
        emissive={colour}
        emissiveIntensity={selected ? 0.35 : 0}
      />
    </mesh>
  );
}

/* ── the map ──────────────────────────────────────────────────────────── */

function MapBody({
  geo,
  metric,
  colourBy,
  styleFor,
  selected,
  onHover,
  onSelect,
}: {
  geo: Geo;
  metric: HeightMetric;
  colourBy: ColourMetric;
  styleFor?: (name: string) => StateStyle | null;
  selected: string | null;
  onHover: (n: string | null) => void;
  onSelect: (n: string) => void;
}) {
  // Equirectangular with a cos(midLat) correction on longitude — at India's
  // latitudes a raw lon/lat plot stretches the country noticeably east-west.
  const built = useMemo(() => {
    let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
    for (const st of geo.s)
      for (const d of st.d)
        for (const ring of d.p)
          for (let i = 0; i < ring.length; i += 2) {
            if (ring[i] < minx) minx = ring[i];
            if (ring[i] > maxx) maxx = ring[i];
            if (ring[i + 1] < miny) miny = ring[i + 1];
            if (ring[i + 1] > maxy) maxy = ring[i + 1];
          }
    const DEG = Math.PI / 180;
    const midLat = (miny + maxy) / 2;
    const kx = Math.cos(midLat * DEG);
    const scale = SPAN / Math.max((maxx - minx) * kx, maxy - miny);
    const px = (lon: number) => (lon - (minx + maxx) / 2) * kx * scale;
    const py = (lat: number) => (lat - (miny + maxy) / 2) * scale;

    const states = geo.s.map((st) => {
      const shapes: THREE.Shape[] = [];
      for (const d of st.d)
        for (const ring of d.p) {
          if (ring.length < 8) continue; // a ring of 3 points is noise, not a district
          const s = new THREE.Shape();
          s.moveTo(px(ring[0]), py(ring[1]));
          for (let i = 2; i < ring.length; i += 2) s.lineTo(px(ring[i]), py(ring[i + 1]));
          s.closePath();
          shapes.push(s);
        }
      // Depth 1 on purpose: the metric drives mesh.scale.z, so height changes
      // animate instead of forcing a rebuild.
      const geometry = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false });
      return { name: st.n, geometry };
    });
    return states;
  }, [geo]);

  // Geometries are allocated outside React's tree; free them on unmount.
  useEffect(() => () => built.forEach((s) => s.geometry.dispose()), [built]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {built.map((s) => (
        <StateSolid
          key={s.name}
          name={s.name}
          geometry={s.geometry}
          data={lsStates[s.name] ?? null}
          metric={metric}
          colourBy={colourBy}
          style={styleFor ? styleFor(s.name) : null}
          selected={selected === s.name}
          anySelected={selected !== null}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Rig({ cam }: { cam: React.RefObject<{ az: number; pol: number; azGoal: number; polGoal: number }> }) {
  const { camera, size } = useThree();
  const r = useRef(300);

  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;
    const persp = camera as THREE.PerspectiveCamera;
    const need = SPAN * 0.62;
    const vFov = (persp.fov * Math.PI) / 180;
    const distV = need / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distH = need / Math.tan(hFov / 2);
    const goal = clamp(Math.max(distV, distH) * 1.02, 150, 700);

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

export default function IndiaMap3D({
  metric = "seats",
  colourBy = "alliance",
  styleFor,
  selected,
  onHover,
  onSelect,
}: {
  metric?: HeightMetric;
  colourBy?: ColourMetric;
  styleFor?: (name: string) => StateStyle | null;
  selected: string | null;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [failed, setFailed] = useState(false);
  const cam = useRef({ az: 0.1, pol: 0.62, azGoal: 0.1, polGoal: 0.62 });
  const drag = useRef<{ x: number; y: number; az: number; pol: number; moved: number } | null>(null);

  // 339KB of boundary geometry, fetched rather than imported so it never enters
  // a JS bundle and the browser can cache it on its own.
  useEffect(() => {
    let alive = true;
    fetch("/data/india-geo.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((j: Geo) => alive && setGeo(j))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, az: cam.current.azGoal, pol: cam.current.polGoal, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
    cam.current.azGoal = d.az - dx * 0.005;
    cam.current.polGoal = clamp(d.pol - dy * 0.004, 0.12, 1.25);
  };
  const endDrag = () => {
    drag.current = null;
  };
  const guardedSelect = (n: string) => {
    if (drag.current && drag.current.moved > 6) return;
    onSelect(n);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const c = cam.current;
    if (e.key === "ArrowLeft") { c.azGoal -= 0.25; e.preventDefault(); }
    else if (e.key === "ArrowRight") { c.azGoal += 0.25; e.preventDefault(); }
    else if (e.key === "ArrowUp") { c.polGoal = clamp(c.polGoal - 0.1, 0.12, 1.25); e.preventDefault(); }
    else if (e.key === "ArrowDown") { c.polGoal = clamp(c.polGoal + 0.1, 0.12, 1.25); e.preventDefault(); }
  };

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <p className="max-w-sm text-sm text-[#5a7091]">
          The map geometry could not be loaded. Every figure it shows is in the state table below.
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: "grab", touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="India, with each state extruded by the selected metric. Use the arrow keys to turn the map."
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 1, far: 2000 }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[-120, 220, 140]} intensity={0.85} />
        <directionalLight position={[160, 90, -120]} intensity={0.35} color="#ffc27a" />
        <Rig cam={cam} />
        {geo && (
          <MapBody
            geo={geo}
            metric={metric}
            colourBy={colourBy}
            styleFor={styleFor}
            selected={selected}
            onHover={onHover}
            onSelect={guardedSelect}
          />
        )}
      </Canvas>
    </div>
  );
}
