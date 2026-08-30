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

/** World-space extent of the whole map. The camera fit solves against this
 *  rather than a guessed radius. */
export type Bounds = { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };

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
  onBounds,
}: {
  geo: Geo;
  metric: HeightMetric;
  colourBy: ColourMetric;
  styleFor?: (name: string) => StateStyle | null;
  selected: string | null;
  onHover: (n: string | null) => void;
  onSelect: (n: string) => void;
  onBounds: (b: Bounds) => void;
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

    // The group is rotated -90 on X, so local (x, y, z) lands at world
    // (x, z, -y): the projected plane becomes X/Z and the extrusion becomes Y.
    const bounds: Bounds = {
      minX: px(minx),
      maxX: px(maxx),
      minY: 0,
      maxY: 30, // the tallest a state gets under any metric
      minZ: -py(maxy),
      maxZ: -py(miny),
    };

    return { states, bounds };
  }, [geo]);

  // Geometries are allocated outside React's tree; free them on unmount.
  useEffect(() => () => built.states.forEach((s) => s.geometry.dispose()), [built]);
  useEffect(() => onBounds(built.bounds), [built, onBounds]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {built.states.map((s) => (
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

/** The 8 corners of a world-space box. */
function boxCorners(b: Bounds): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < 8; i++)
    out.push(
      new THREE.Vector3(
        i & 1 ? b.maxX : b.minX,
        i & 2 ? b.maxY : b.minY,
        i & 4 ? b.maxZ : b.minZ,
      ),
    );
  return out;
}

/* Solve the camera distance that makes the subject fill `fill` of the frame,
 * and re-centre the target on it while doing so.
 *
 * Measured in VIEW SPACE rather than with project(): a corner behind the camera
 * comes back through project() as a huge flipped number, and a tight fit pulls
 * the camera close enough for that to happen. In view space the failure is
 * simply z >= 0, which we can react to by backing off and trying again.
 *
 * Ported from india-map3d.js's fitFrame — the previous analytic
 * `need / tan(fov/2)` guess left the country filling about a third of the panel.
 */
function solveFit(
  corners: THREE.Vector3[],
  fov: number,
  aspect: number,
  pol: number,
  az: number,
  fill: number,
): { r: number; target: THREE.Vector3 } {
  const t = new THREE.Vector3();
  corners.forEach((c) => t.add(c));
  t.divideScalar(Math.max(1, corners.length));
  t.y = 0;

  const probe = new THREE.PerspectiveCamera(fov, aspect, 1, 6000);
  const tanH = Math.tan((fov * Math.PI) / 360);
  const tanW = tanH * aspect;
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const v = new THREE.Vector3();
  let r = 300;

  for (let pass = 0; pass < 6; pass++) {
    probe.position.set(
      t.x + r * Math.sin(pol) * Math.sin(az),
      t.y + r * Math.cos(pol),
      t.z + r * Math.sin(pol) * Math.cos(az),
    );
    probe.lookAt(t);
    probe.updateMatrixWorld();

    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, ok = true;
    for (const c of corners) {
      v.copy(c).applyMatrix4(probe.matrixWorldInverse);
      if (v.z > -1) { ok = false; break; } // behind or on the lens
      const d = -v.z;
      const nx = v.x / (d * tanW);
      const ny = v.y / (d * tanH);
      if (nx < x0) x0 = nx;
      if (nx > x1) x1 = nx;
      if (ny < y0) y0 = ny;
      if (ny > y1) y1 = ny;
    }
    if (!ok) { r = clamp(r * 1.8, 40, 900); continue; }

    // re-centre, capped so one pass can never throw the target across the scene
    const halfH = tanH * r;
    const halfW = halfH * aspect;
    let dx = ((x0 + x1) / 2) * halfW;
    let dy = ((y0 + y1) / 2) * halfH;
    const cap = r * 0.6;
    const mag = Math.hypot(dx, dy);
    if (mag > cap) { dx *= cap / mag; dy *= cap / mag; }
    right.setFromMatrixColumn(probe.matrixWorld, 0).normalize();
    up.setFromMatrixColumn(probe.matrixWorld, 1).normalize();
    t.addScaledVector(right, dx).addScaledVector(up, dy);

    const ext = Math.max((x1 - x0) / 2, (y1 - y0) / 2);
    if (!ext || !isFinite(ext)) break;
    r = clamp(r * (ext / fill), 40, 900);
  }

  return { r, target: t };
}

function Rig({
  cam,
  bounds,
  zoom,
}: {
  cam: React.RefObject<{ az: number; pol: number; azGoal: number; polGoal: number }>;
  bounds: Bounds | null;
  zoom: React.RefObject<number>;
}) {
  const { camera, size } = useThree();
  const r = useRef(300);
  const target = useRef(new THREE.Vector3());
  const solved = useRef<{ r: number; target: THREE.Vector3 } | null>(null);
  const lastKey = useRef("");

  useFrame((_, delta) => {
    const c = cam.current;
    if (!c || !bounds) return;
    const persp = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;

    // The solve is not cheap and only depends on aspect and the angles, so it
    // is redone when those change rather than every frame.
    const key = `${aspect.toFixed(3)}|${c.polGoal.toFixed(2)}|${c.azGoal.toFixed(2)}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      // 0.9: the country is the subject of the panel, not something floating
      // in the middle of it.
      solved.current = solveFit(boxCorners(bounds), persp.fov, aspect, c.polGoal, c.azGoal, 0.9);
    }
    const goal = solved.current;
    if (!goal) return;

    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    c.az += (c.azGoal - c.az) * k;
    c.pol += (c.polGoal - c.pol) * k;
    r.current += (goal.r * (zoom.current ?? 1) - r.current) * k;
    target.current.lerp(goal.target, k);

    const t = target.current;
    camera.position.set(
      t.x + r.current * Math.sin(c.pol) * Math.sin(c.az),
      t.y + r.current * Math.cos(c.pol),
      t.z + r.current * Math.sin(c.pol) * Math.cos(c.az),
    );
    camera.lookAt(t);
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
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [failed, setFailed] = useState(false);
  // Wheel zoom, as a multiplier on the solved distance.
  const zoom = useRef(1);
  // 32 degrees off vertical, matching the reference: high enough to read the
  // country's shape, low enough that the extruded sides are visible.
  const cam = useRef({ az: 0.1, pol: 0.5585, azGoal: 0.1, polGoal: 0.5585 });
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
      onWheel={(e) => {
        // The hint says "scroll to zoom", so it has to actually zoom.
        zoom.current = clamp(zoom.current * (e.deltaY > 0 ? 1.12 : 0.89), 0.45, 2.2);
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="India, with each state extruded by the selected metric. Use the arrow keys to turn the map."
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          // r3f defaults to ACES Filmic tone mapping; the reference is raw three
          // with none. ACES was darkening and desaturating the party colours —
          // the saffron and blue have to be the parties' actual colours.
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ fov: 26, near: 1, far: 6000 }}
      >
        {/* Total light reaching a top face must stay at or below 1.0, or the
            saffron and blue blow out to pale peach and baby blue. These four
            sum to 1.0 exactly. The previous set totalled 1.92 and washed the
            whole map out. */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[-90, 210, 130]} intensity={0.7} />
        {/* warm saffron rim */}
        <directionalLight position={[150, 80, -140]} intensity={0.26} color="#ffc27a" />
        {/* cool sky bounce */}
        <directionalLight position={[70, -70, 100]} intensity={0.18} color="#9dc0ff" />
        <Rig cam={cam} bounds={bounds} zoom={zoom} />
        {geo && (
          <MapBody
            geo={geo}
            metric={metric}
            colourBy={colourBy}
            styleFor={styleFor}
            onBounds={setBounds}
            selected={selected}
            onHover={onHover}
            onSelect={guardedSelect}
          />
        )}
      </Canvas>
    </div>
  );
}
