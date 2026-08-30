"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hfjChapters } from "@/data/hfj-chapters";

/* Hindu For Justice — the 3D era timeline.
 *
 * Stone-like era slabs recede down a corridor. Drag or use the arrow keys to
 * travel along it, click a slab to jump to that chapter.
 *
 * Ported from reference/new_ref/assets/hfj-3d.js. The two things worth carrying
 * over exactly are the lane weave and the camera distance, both of which the
 * reference had already reasoned through — see the comments below.
 */

const SLAB_W = 22;
const SLAB_H = 31;
const SLAB_D = 2.4;
const GAP = 62; // distance between eras along Z
const OFFSET = 26; // lateral spread either side of the path

// The camera rides between the previous slab and the focused one. This has to
// stay well under GAP, or the previous slab ends up a few units in front of the
// lens and fills the frame; it also has to be far enough back that a SLAB_H-tall
// marker fits inside the vertical field.
const CAM_BACK = 50;

// Strict left/right alternation would put every second slab directly behind the
// one two ahead of it. A ~120°-per-step sine gives a three-lane weave instead,
// so the markers behind the focused one still peek past its edges.
const laneX = (i: number) => Math.sin(i * 2.1) * OFFSET;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** The slab face is drawn once per chapter into a canvas texture — the year and
 *  title have to be legible at an angle, and a DOM overlay would not survive
 *  being rotated into the corridor. */
function slabTexture(year: string, title: string, focused: boolean) {
  const W = 340;
  const H = 430;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createLinearGradient(0, 0, W * 0.5, H);
  if (focused) {
    grd.addColorStop(0, "#ffd9a8");
    grd.addColorStop(1, "#e87d12");
  } else {
    grd.addColorStop(0, "#f3f6fb");
    grd.addColorStop(1, "#cdd8e8");
  }
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = focused ? "rgba(255,255,255,.9)" : "rgba(10,30,63,.22)";
  g.lineWidth = focused ? 7 : 3;
  g.strokeRect(14, 14, W - 28, H - 28);

  const ink = focused ? "#ffffff" : "#0a1e3f";
  g.fillStyle = ink;
  g.textAlign = "center";

  g.font = "700 46px Poppins, system-ui, sans-serif";
  g.fillText(year, W / 2, 118);

  // Wrap the title by hand — canvas has no line breaking of its own.
  g.font = "600 23px Poppins, system-ui, sans-serif";
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > W - 76 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 5).forEach((l, i) => g.fillText(l, W / 2, 186 + i * 30));

  g.font = "500 17px Poppins, system-ui, sans-serif";
  g.fillStyle = focused ? "rgba(255,255,255,.85)" : "rgba(10,30,63,.55)";
  g.fillText(focused ? "OPEN THIS CHAPTER" : "", W / 2, H - 46);

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function Slab({
  index,
  year,
  title,
  focus,
  onSelect,
}: {
  index: number;
  year: string;
  title: string;
  focus: React.RefObject<number>;
  onSelect: (i: number) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Two textures per slab, swapped rather than redrawn — regenerating a 340x430
  // canvas every frame the focus moves would be the most expensive thing here.
  const texPlain = useMemo(() => slabTexture(year, title, false), [year, title]);
  const texLit = useMemo(() => slabTexture(year, title, true), [year, title]);
  useEffect(() => () => { texPlain.dispose(); texLit.dispose(); }, [texPlain, texLit]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const f = focus.current ?? 0;
    const near = Math.abs(f - index) < 0.5;
    if (near !== isFocused) setIsFocused(near);
    // Slabs far behind the camera fade out rather than popping.
    const d = index - f;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = clamp(1 - Math.max(0, -d - 0.6) * 0.8, 0, 1);
  });

  return (
    <mesh
      ref={mesh}
      position={[laneX(index), 0, -index * GAP]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <boxGeometry args={[SLAB_W, SLAB_H, SLAB_D]} />
      <meshBasicMaterial map={isFocused ? texLit : texPlain} transparent toneMapped={false} />
    </mesh>
  );
}

function Rig({ focus }: { focus: React.RefObject<number> }) {
  useFrame(({ camera }, delta) => {
    const f = focus.current ?? 0;
    const targetZ = -f * GAP + CAM_BACK;
    const targetX = laneX(f) * 0.45;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.position.y += (6 - camera.position.y) * k;
    camera.lookAt(laneX(f), 0, -f * GAP);
  });
  return null;
}

export default function EraTimeline({
  index,
  onIndexChange,
  onSelect,
}: {
  index: number;
  onIndexChange: (i: number) => void;
  onSelect: (i: number) => void;
}) {
  const focus = useRef(index);
  const drag = useRef<{ x: number; start: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const last = hfjChapters.length - 1;

  // The parent owns the index; the ref is what the render loop reads so the
  // camera can ease toward it instead of jumping on every state change.
  useEffect(() => {
    focus.current = index;
  }, [index]);

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: grabbing ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, start: index, moved: 0 };
        setGrabbing(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        d.moved = Math.max(d.moved, Math.abs(dx));
        const next = clamp(d.start - dx / 90, 0, last);
        focus.current = next;
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
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          onIndexChange(clamp(index + 1, 0, last));
          e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          onIndexChange(clamp(index - 1, 0, last));
          e.preventDefault();
        } else if (e.key === "Enter") {
          onSelect(index);
          e.preventDefault();
        }
      }}
      tabIndex={0}
      role="group"
      aria-label={`An era timeline of ${hfjChapters.length} chapters, from the 8th century to the present. Use the arrow keys to travel and Enter to open a chapter.`}
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
        camera={{ fov: 46, near: 0.5, far: 1400, position: [0, 6, CAM_BACK] }}
      >
        <ambientLight intensity={0.9} />
        <Rig focus={focus} />
        {hfjChapters.map((c, i) => (
          <Slab
            key={c.id}
            index={i}
            year={c.year}
            title={c.title}
            focus={focus}
            onSelect={(idx) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelect(idx);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}
