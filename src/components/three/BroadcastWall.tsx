"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Speech } from "@/data/speeches";

/* Live Political Coverage — the broadcast wall.
 *
 * A curved wall of screens, one per session or speech, that you drag to pan and
 * click to play. Screen faces are drawn to a canvas and used as textures, so
 * titles live inside the 3D scene rather than floating over it.
 *
 * Ported from reference/new_ref/assets/live-3d.js.
 */

const SCR_W = 44;
const SCR_H = 25;
const RADIUS = 150;

/* A wide radius makes the wall a gentle curve rather than a barrel: at 72 the
   five screens wrapped almost 165° and the outer ones turned edge-on. The step
   is derived from the screen width so they never overlap — arc length per step
   is SCR_W * 1.22. */
const STEP = (SCR_W * 1.22) / RADIUS;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function faceTexture(item: Speech, selected: boolean) {
  const W = 640;
  const H = 364;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createLinearGradient(0, 0, W * 0.6, H);
  grd.addColorStop(0, item.live ? "#12306b" : "#0a1e3f");
  grd.addColorStop(1, item.live ? "#0a1e3f" : "#061428");
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  // A selected screen gets a saffron surround so the one you are about to play
  // is unmistakable even at the far end of the arc.
  g.strokeStyle = selected ? "#ff9933" : "rgba(255,255,255,.14)";
  g.lineWidth = selected ? 10 : 3;
  g.strokeRect(8, 8, W - 16, H - 16);

  let y = 62;

  if (item.live) {
    g.fillStyle = "#e11d48";
    g.beginPath();
    g.arc(48, y - 6, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffffff";
    g.font = '700 19px Poppins, system-ui, sans-serif';
    g.fillText("LIVE NOW", 66, y);
    y += 44;
  } else {
    g.fillStyle = "#ffc27a";
    g.font = '700 17px Poppins, system-ui, sans-serif';
    g.fillText(item.house, 40, y);
    y += 40;
  }

  // Wrap the title by hand — canvas has no line breaking.
  g.fillStyle = "#ffffff";
  g.font = '700 30px Poppins, system-ui, sans-serif';
  const words = item.title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > W - 84 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => g.fillText(l, 40, y + i * 38));
  y += Math.min(lines.length, 3) * 38 + 18;

  g.fillStyle = "rgba(255,255,255,.62)";
  g.font = '500 19px Poppins, system-ui, sans-serif';
  g.fillText(`${item.leader} · ${item.session}`, 40, y);

  // play glyph
  g.fillStyle = selected ? "#ff9933" : "rgba(255,255,255,.9)";
  g.beginPath();
  g.arc(W - 78, H - 74, 30, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = item.live || selected ? "#ffffff" : "#0a1e3f";
  g.beginPath();
  g.moveTo(W - 88, H - 92);
  g.lineTo(W - 88, H - 56);
  g.lineTo(W - 58, H - 74);
  g.closePath();
  g.fill();

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function Screen({
  item,
  index,
  centre,
  selected,
  onHover,
  onSelect,
}: {
  item: Speech;
  index: number;
  centre: React.RefObject<number>;
  selected: boolean;
  onHover: (s: Speech | null) => void;
  onSelect: (s: Speech) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const texPlain = useMemo(() => faceTexture(item, false), [item]);
  const texSel = useMemo(() => faceTexture(item, true), [item]);
  useEffect(() => () => { texPlain.dispose(); texSel.dispose(); }, [texPlain, texSel]);

  useFrame((_, delta) => {
    const gp = group.current;
    if (!gp) return;
    const c = centre.current ?? 0;
    const a = (index - c) * STEP;
    // Screens sit ON the arc and face its centre, so the wall reads as one
    // curved surface rather than a row of billboards.
    gp.position.set(Math.sin(a) * RADIUS, 0, -Math.cos(a) * RADIUS + RADIUS);
    gp.rotation.y = a;
    const near = Math.abs(index - c) < 0.5;
    const goal = near ? 1.12 : 1;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    gp.scale.x += (goal - gp.scale.x) * k;
    gp.scale.y = gp.scale.x;
    const mat = (gp.children[0] as THREE.Mesh)?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.opacity = clamp(1 - Math.max(0, Math.abs(index - c) - 2.2) * 0.5, 0, 1);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(item);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      <mesh>
        <planeGeometry args={[SCR_W, SCR_H]} />
        <meshBasicMaterial
          map={selected ? texSel : texPlain}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Rig() {
  useFrame(({ camera }) => {
    camera.position.set(0, 2, 96);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function BroadcastWall({
  items,
  index,
  onIndexChange,
  selectedId,
  onHoverItem,
  onSelectItem,
}: {
  items: Speech[];
  index: number;
  onIndexChange: (i: number) => void;
  selectedId: string | null;
  onHoverItem: (s: Speech | null) => void;
  onSelectItem: (s: Speech) => void;
}) {
  const centre = useRef(index);
  const drag = useRef<{ x: number; start: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const last = items.length - 1;

  useEffect(() => {
    centre.current = index;
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
        const next = clamp(d.start - dx / 130, 0, last);
        centre.current = next;
        if (Math.abs(Math.round(next) - index) >= 1) onIndexChange(Math.round(next));
      }}
      onPointerUp={() => {
        if (drag.current) onIndexChange(clamp(Math.round(centre.current), 0, last));
        drag.current = null;
        setGrabbing(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setGrabbing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { onIndexChange(clamp(index + 1, 0, last)); e.preventDefault(); }
        else if (e.key === "ArrowLeft") { onIndexChange(clamp(index - 1, 0, last)); e.preventDefault(); }
        else if (e.key === "Enter") { onSelectItem(items[index]); e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`A curved wall of ${items.length} screens. Use the left and right arrow keys to pan and Enter to play.`}
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
        camera={{ fov: 42, near: 0.5, far: 900 }}
      >
        <ambientLight intensity={1} />
        <Rig />
        {items.map((it, i) => (
          <Screen
            key={it.id}
            item={it}
            index={i}
            centre={centre}
            selected={selectedId === it.id}
            onHover={onHoverItem}
            onSelect={(s) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelectItem(s);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}
