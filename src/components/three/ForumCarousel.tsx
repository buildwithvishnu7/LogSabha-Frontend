"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { forumCategories, type Category } from "@/data/forum";

/* Community Forum — the category carousel.
 *
 * Six topic cards on a ring. Drag to spin, click a card to filter the feed.
 * Card faces are drawn to a canvas and used as textures, so the labels stay
 * crisp and live in the 3D scene rather than floating above it.
 *
 * Ported from reference/new_ref/assets/forum-3d.js.
 */

const CARD_W = 30;
const CARD_H = 40;
const RADIUS = 46;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Darken a hex colour by `k` (negative shades down). */
function shade(hex: string, k: number) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, k);
  return "#" + c.getHexString();
}

function faceTexture(cat: Category, selected: boolean) {
  const W = 384;
  const H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createLinearGradient(0, 0, W * 0.4, H);
  grd.addColorStop(0, cat.c);
  grd.addColorStop(1, shade(cat.c, -0.34));
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  g.strokeStyle = selected ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.28)";
  g.lineWidth = selected ? 10 : 4;
  g.strokeRect(16, 16, W - 32, H - 32);

  // the numbered disc
  g.fillStyle = "rgba(255,255,255,.22)";
  g.beginPath();
  g.arc(W / 2, 132, 44, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ffffff";
  g.font = '800 46px Poppins, system-ui, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(cat.glyph, W / 2, 134);

  // title, wrapped by hand — canvas has no line breaking
  g.font = '800 34px Poppins, system-ui, sans-serif';
  const words = cat.name.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > W - 72 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => g.fillText(l, W / 2, 236 + i * 42));

  g.font = '600 20px Poppins, system-ui, sans-serif';
  g.fillStyle = "rgba(255,255,255,.8)";
  g.fillText(`${cat.threads} discussions`, W / 2, 372);
  g.fillText(`${cat.replies} replies`, W / 2, 402);

  g.font = '600 16px Poppins, system-ui, sans-serif';
  g.fillStyle = "rgba(255,255,255,.6)";
  g.fillText(selected ? "SHOWING THIS TOPIC" : "TAP TO OPEN", W / 2, H - 54);

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function Card({
  cat,
  index,
  total,
  spin,
  selected,
  onHover,
  onSelect,
}: {
  cat: Category;
  index: number;
  total: number;
  spin: React.RefObject<number>;
  selected: boolean;
  onHover: (c: Category | null) => void;
  onSelect: (c: Category) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const texPlain = useMemo(() => faceTexture(cat, false), [cat]);
  const texSel = useMemo(() => faceTexture(cat, true), [cat]);
  useEffect(() => () => { texPlain.dispose(); texSel.dispose(); }, [texPlain, texSel]);
  const scale = useRef(0);

  useFrame((_, delta) => {
    const gp = group.current;
    if (!gp) return;
    const a = (index / total) * Math.PI * 2 + (spin.current ?? 0);
    gp.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS);
    // Face outward from the ring's axis so the set reads as a carousel of solid
    // cards rather than a fan of billboards.
    gp.rotation.y = a;
    // The card nearest the front lifts slightly, so which one is "current" is
    // readable without colour alone.
    const front = Math.cos(a);
    const goal = 1 + Math.max(0, front) * 0.12;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    scale.current += (goal - scale.current) * k;
    gp.scale.setScalar(Math.max(0.001, scale.current));
    const mat = (gp.children[0] as THREE.Mesh)?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.opacity = clamp(0.32 + (front * 0.5 + 0.5) * 0.85, 0, 1);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(cat);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(cat);
      }}
    >
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
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

/** A thin starfield behind the ring — the reference's forum sits on a night
 *  ground, and an empty navy plane behind a bright carousel reads as a hole. */
function Stars() {
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 320;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 220;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260 - 90;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((state) => {
    if (pts.current) pts.current.rotation.y = state.clock.elapsedTime * 0.012;
  });
  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial size={0.9} color="#9fb6d8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Rig() {
  useFrame(({ camera }) => {
    camera.position.set(0, 3, 96);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ForumCarousel({
  selectedId,
  onHoverCategory,
  onSelectCategory,
  reducedMotion = false,
}: {
  selectedId: string | null;
  onHoverCategory: (c: Category | null) => void;
  onSelectCategory: (c: Category) => void;
  reducedMotion?: boolean;
}) {
  const spin = useRef(0);
  const drag = useRef<{ x: number; spin: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: grabbing ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, spin: spin.current, moved: 0 };
        setGrabbing(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        d.moved = Math.max(d.moved, Math.abs(dx));
        spin.current = d.spin - dx * 0.007;
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
        const step = (Math.PI * 2) / forumCategories.length;
        if (e.key === "ArrowLeft") { spin.current -= step; e.preventDefault(); }
        else if (e.key === "ArrowRight") { spin.current += step; e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`${forumCategories.length} topic cards on a ring. Use the left and right arrow keys to spin it.`}
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
        camera={{ fov: 44, near: 0.5, far: 900 }}
      >
        <ambientLight intensity={1} />
        <Rig />
        <Stars />
        <Drift spin={spin} run={!reducedMotion && !grabbing} />
        {forumCategories.map((c, i) => (
          <Card
            key={c.id}
            cat={c}
            index={i}
            total={forumCategories.length}
            spin={spin}
            selected={selectedId === c.id}
            onHover={onHoverCategory}
            onSelect={(cat) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelectCategory(cat);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}

function Drift({ spin, run }: { spin: React.RefObject<number>; run: boolean }) {
  useFrame((_, delta) => {
    if (run) spin.current = (spin.current ?? 0) + 0.05 * Math.min(delta, 0.05);
  });
  return null;
}
