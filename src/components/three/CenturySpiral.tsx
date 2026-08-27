"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rssYears } from "@/data/rss-timeline";

/* RSS 100 — the century spiral.
 *
 * A hundred years, fourteen to a turn, climbing a saffron column: 1925 at the
 * foot, 2025 at the top. Drag up and down to travel through the decades, drag
 * sideways to walk around the column, click a year to open it.
 *
 * Ported from reference/new_ref/assets/rss-3d.js. The one number worth carrying
 * over exactly is FACING — see the comment on it.
 */

const PER_TURN = 14; // years per revolution
const RISE = 3.4; // vertical gap between years
const RADIUS = 40;
const TILE_W = 19;
const TILE_H = 10.6;

/* Tiles turn with the column, but only part way. At full rotation the ones to
   either side present their edge, the year cannot be read, and the frame ends up
   with three legible tiles in it. At 0.55 the spiral still reads as a spiral and
   a dozen years stay readable at once. */
const FACING = 0.55;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

// Oldest first, so the column climbs 1925 → 2025 the way a century is read.
const YEARS = [...rssYears].sort((a, b) => a.year - b.year);

function tileTexture(year: number, title: string, focused: boolean) {
  const W = 380;
  const H = 212;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createLinearGradient(0, 0, W, H);
  if (focused) {
    grd.addColorStop(0, "#ffc27a");
    grd.addColorStop(1, "#e87d12");
  } else {
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(1, "#e8eef7");
  }
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = focused ? "rgba(255,255,255,.92)" : "rgba(10,30,63,.20)";
  g.lineWidth = focused ? 6 : 2.5;
  g.strokeRect(10, 10, W - 20, H - 20);

  g.fillStyle = focused ? "#ffffff" : "#0a1e3f";
  g.textAlign = "left";
  g.font = '800 62px Poppins, system-ui, "Segoe UI", sans-serif';
  g.fillText(String(year), 30, 86);

  // The titles are Devanagari — the canvas needs a font stack that actually has
  // the glyphs, or every tile renders as boxes.
  g.font = '600 19px Poppins, "Nirmala UI", "Noto Sans Devanagari", system-ui, sans-serif';
  g.fillStyle = focused ? "rgba(255,255,255,.92)" : "rgba(10,30,63,.68)";
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > W - 62 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => g.fillText(l, 30, 124 + i * 26));

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function Tile({
  i,
  year,
  title,
  focus,
  onSelect,
}: {
  i: number;
  year: number;
  title: string;
  focus: React.RefObject<number>;
  onSelect: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [lit, setLit] = useState(false);

  const texPlain = useMemo(() => tileTexture(year, title, false), [year, title]);
  const texLit = useMemo(() => tileTexture(year, title, true), [year, title]);
  useEffect(() => () => { texPlain.dispose(); texLit.dispose(); }, [texPlain, texLit]);

  const angle = (i / PER_TURN) * Math.PI * 2;
  const x = Math.cos(angle) * RADIUS;
  const z = Math.sin(angle) * RADIUS;
  const y = i * RISE;

  useFrame(() => {
    const gp = group.current;
    if (!gp) return;
    const f = focus.current ?? 0;
    const near = Math.abs(f - i) < 0.5;
    if (near !== lit) setLit(near);
    // Fade with distance along the column so the far ends do not clutter.
    const d = Math.abs(i - f);
    const mesh = gp.children[0] as THREE.Mesh;
    const mat = mesh?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.opacity = clamp(1 - Math.max(0, d - 5) * 0.16, 0, 1);
    gp.visible = d < 14;
  });

  return (
    <group
      ref={group}
      position={[x, y, z]}
      rotation={[0, -angle * FACING + Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(i);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <planeGeometry args={[TILE_W, TILE_H]} />
        <meshBasicMaterial map={lit ? texLit : texPlain} transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The saffron column the years climb. */
function Column() {
  const h = YEARS.length * RISE;
  return (
    <mesh position={[0, h / 2, 0]}>
      <cylinderGeometry args={[2.2, 2.2, h, 16]} />
      <meshBasicMaterial color="#ff9933" transparent opacity={0.42} />
    </mesh>
  );
}

function Rig({ focus, spin }: { focus: React.RefObject<number>; spin: React.RefObject<number> }) {
  useFrame(({ camera }, delta) => {
    const f = focus.current ?? 0;
    const a = (f / PER_TURN) * Math.PI * 2 + (spin.current ?? 0);
    const targetY = f * RISE + 3;
    const cx = Math.cos(a) * (RADIUS + 46);
    const cz = Math.sin(a) * (RADIUS + 46);

    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    camera.position.x += (cx - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;
    camera.position.z += (cz - camera.position.z) * k;
    camera.lookAt(0, f * RISE, 0);
  });
  return null;
}

export default function CenturySpiral({
  index,
  onIndexChange,
  onSelect,
}: {
  index: number;
  onIndexChange: (i: number) => void;
  onSelect: (year: number) => void;
}) {
  const focus = useRef(index);
  const spin = useRef(0);
  const drag = useRef<{ x: number; y: number; start: number; spin: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const last = YEARS.length - 1;

  useEffect(() => {
    focus.current = index;
  }, [index]);

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: grabbing ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, start: index, spin: spin.current, moved: 0 };
        setGrabbing(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
        // Vertical drag travels the years; horizontal walks around the column.
        const next = clamp(d.start - dy / 26, 0, last);
        focus.current = next;
        spin.current = d.spin + dx * 0.006;
        if (Math.abs(Math.round(next) - index) >= 1) onIndexChange(Math.round(next));
      }}
      onPointerUp={() => {
        if (drag.current) onIndexChange(clamp(Math.round(focus.current), 0, last));
        drag.current = null;
        setGrabbing(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setGrabbing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") {
          onIndexChange(clamp(index + 1, 0, last));
          e.preventDefault();
        } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
          onIndexChange(clamp(index - 1, 0, last));
          e.preventDefault();
        } else if (e.key === "Enter") {
          onSelect(YEARS[index].year);
          e.preventDefault();
        }
      }}
      tabIndex={0}
      role="group"
      aria-label={`A spiral of ${YEARS.length} years, 1925 at the foot to 2025 at the top. Use the arrow keys to travel and Enter to open a year.`}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 80 } }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 44, near: 0.5, far: 900 }}
      >
        <ambientLight intensity={0.95} />
        <Rig focus={focus} spin={spin} />
        <Column />
        {YEARS.map((y, i) => (
          <Tile
            key={y.year}
            i={i}
            year={y.year}
            title={y.title}
            focus={focus}
            onSelect={(idx) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelect(YEARS[idx].year);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}

export { YEARS as spiralYears };
