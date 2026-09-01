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
  spin,
  onSelect,
}: {
  i: number;
  year: number;
  title: string;
  focus: React.RefObject<number>;
  spin: React.RefObject<number>;
  onSelect: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [lit, setLit] = useState(false);

  const texPlain = useMemo(() => tileTexture(year, title, false), [year, title]);
  const texLit = useMemo(() => tileTexture(year, title, true), [year, title]);
  useEffect(() => () => { texPlain.dispose(); texLit.dispose(); }, [texPlain, texLit]);

  const angle = (i / PER_TURN) * Math.PI * 2;
  
  const y = i * RISE;

  useFrame(() => {
    const gp = group.current;
    if (!gp) return;
    const f = focus.current ?? 0;
    const near = Math.abs(f - i) < 0.5;
    if (near !== lit) setLit(near);
    // Fade by DISTANCE ALONG THE COLUMN, not by index: the reference measures
    // it in world units so the falloff is the same however far apart the years
    // are placed.
    // sin for X and cos for Z, so a = 0 puts the tile on +Z facing the camera.
    // Swapping those (and negating the rotation) is what made FrontSide cull
    // every tile in the spiral.
    const a = angle + (spin.current ?? 0);
    gp.position.set(Math.sin(a) * RADIUS, y, Math.cos(a) * RADIUS);
    gp.rotation.y = a * FACING; // turn with the column, but not fully

    const dist = Math.abs(y - f * RISE);
    const fade = clamp(1 - dist / 92, 0, 1);
    const mesh = gp.children[0] as THREE.Mesh;
    const mat = mesh?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) mat.opacity = 0.06 + fade * 0.94;
    gp.visible = fade > 0.02;
    gp.scale.setScalar(0.86 + fade * 0.14);
  });

  return (
    <group
      ref={group}
      // position and rotation are written every frame in useFrame above,
      // because both depend on the spin

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
        {/* FrontSide, not DoubleSide: a tile on the far side of the column is
            seen from behind and its label reads mirrored. Culling them leaves
            the near arc — which is the half you can actually read. */}
        <meshStandardMaterial
          map={lit ? texLit : texPlain}
          roughness={0.55}
          metalness={0.02}
          transparent
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** The saffron column the years climb. */
/** The column the years wind around — the flagstaff the spiral hangs off.
 *  Open-ended, so it reads as a staff rather than a capped tube. */
function Column() {
  const h = Math.max(YEARS.length, 1) * RISE + 40;
  return (
    <mesh position={[0, h / 2 - 20, 0]}>
      <cylinderGeometry args={[2.2, 2.2, h, 20, 1, true]} />
      <meshStandardMaterial
        color="#ff9933"
        roughness={0.5}
        metalness={0.2}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* The camera rides alongside the focused year, looking slightly up the column.
   It does NOT orbit — horizontal drag turns the world instead. Orbiting with a
   wide lens kept ten tiles in shot at once, all of them too small to read; a
   long lens at a fixed offset gives the two or three that matter. */
function Rig({ focus }: { focus: React.RefObject<number> }) {
  useFrame(({ camera }, delta) => {
    const f = focus.current ?? 0;
    const focusY = f * RISE;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    camera.position.x += (0 - camera.position.x) * k;
    camera.position.y += (focusY + 8 - camera.position.y) * k;
    camera.position.z += (RADIUS + 84 - camera.position.z) * k;
    camera.lookAt(0, focusY + 2, 0);
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
    // Bring the chosen year round to the front. Travelling the column without
    // this leaves the year you picked facing away, which is the one thing the
    // control is for.
    spin.current = -index * ((Math.PI * 2) / PER_TURN);
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
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          // r3f defaults to ACES Filmic tone mapping; the reference is raw three
          // with none. ACES darkens and desaturates, which is wrong for colours
          // that carry meaning (party colours, the saffron).
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ fov: 34, near: 1, far: 1200 }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[-40, 90, 120]} intensity={0.62} />
        <directionalLight position={[70, 40, -60]} intensity={0.3} color="#ffc27a" />
        <Rig focus={focus} />
        <Column />
        {YEARS.map((y, i) => (
          <Tile
            key={y.year}
            i={i}
            year={y.year}
            title={y.title}
            focus={focus}
            spin={spin}
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
