"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { channels, clips, type Clip } from "@/data/media-coverage";

/* Media Coverage — the press drum.
 *
 * WHAT IT SHOWS
 * A closed drum, not an open arc — every channel and every clip is always
 * somewhere on it, so the shape reads as "this is the whole set" the way Live
 * Coverage's broadcast wall (an arc you pan across) deliberately does not.
 *
 * Two bands: the four featured clips run the upper band as large, bright
 * panels; the six channel marks run the lower band, smaller and dimmer, the way
 * a chyron sits under the picture rather than beside it.
 *
 * Panels are canvas-drawn planes rather than sprites, so each one tilts to face
 * outward from the drum's own axis instead of billboarding flat at the camera —
 * the drum has to read as a cylinder from any angle, not a ring of flat cards
 * pretending to be one.
 *
 * Ported from reference/new_ref/assets/media-3d.js.
 */

const RADIUS = 46;
const CLIP_Y = 9;
const CHAN_Y = -11;
const AMBER = "#ff9933";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function clipTexture(c: Clip, lit: boolean) {
  const W = 420;
  const H = 300;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createLinearGradient(0, 0, W * 0.6, H);
  grd.addColorStop(0, lit ? "#12306b" : "#0a1e3f");
  grd.addColorStop(1, "#061428");
  g.fillStyle = grd;
  roundRect(g, 4, 4, W - 8, H - 8, 18);
  g.fill();

  g.strokeStyle = lit ? AMBER : "rgba(255,255,255,.16)";
  g.lineWidth = lit ? 7 : 2.5;
  roundRect(g, 4, 4, W - 8, H - 8, 18);
  g.stroke();

  g.fillStyle = "#ffc27a";
  g.font = '700 15px Poppins, system-ui, sans-serif';
  g.fillText(c.kind === "video" ? "REEL" : "STILL", 32, 52);

  g.fillStyle = "#ffffff";
  g.font = '800 34px Poppins, system-ui, sans-serif';
  const words = c.t.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > W - 64 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((l, i) => g.fillText(l, 32, 106 + i * 40));

  g.fillStyle = "rgba(255,255,255,.6)";
  g.font = '500 17px Poppins, system-ui, sans-serif';
  g.fillText(c.sub, 32, 106 + Math.min(lines.length, 2) * 40 + 14);

  // play glyph
  g.fillStyle = lit ? AMBER : "rgba(255,255,255,.85)";
  g.beginPath();
  g.arc(W - 62, H - 58, 26, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = lit ? "#ffffff" : "#0a1e3f";
  g.beginPath();
  g.moveTo(W - 70, H - 73);
  g.lineTo(W - 70, H - 43);
  g.lineTo(W - 45, H - 58);
  g.closePath();
  g.fill();

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function channelTexture(name: string) {
  const W = 300;
  const H = 96;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return new THREE.Texture();
  g.fillStyle = "rgba(255,255,255,.07)";
  roundRect(g, 2, 2, W - 4, H - 4, 12);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,.16)";
  g.lineWidth = 2;
  roundRect(g, 2, 2, W - 4, H - 4, 12);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,.78)";
  g.font = '700 30px Poppins, system-ui, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(name, W / 2, H / 2 + 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

function Panel({
  angle,
  y,
  w,
  h,
  texture,
  spin,
  onHover,
  onSelect,
}: {
  angle: number;
  y: number;
  w: number;
  h: number;
  texture: THREE.Texture;
  spin: React.RefObject<number>;
  onHover?: () => void;
  onSelect?: () => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const gp = group.current;
    if (!gp) return;
    const a = angle + (spin.current ?? 0);
    gp.position.set(Math.sin(a) * RADIUS, y, Math.cos(a) * RADIUS);
    // Face outward from the drum's axis, not at the camera — that is what makes
    // the ring read as a cylinder rather than a carousel of flat cards.
    gp.rotation.y = a;
    const mat = (gp.children[0] as THREE.Mesh)?.material as THREE.MeshBasicMaterial | undefined;
    // Panels on the far side dim rather than vanish, so the set still reads as
    // closed.
    if (mat) mat.opacity = clamp(0.25 + (Math.cos(a) * 0.5 + 0.5) * 0.9, 0, 1);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        if (!onSelect) return;
        e.stopPropagation();
        onHover?.();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        if (!onSelect) return;
        e.stopPropagation();
        onSelect();
      }}
    >
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({ spin, drift }: { spin: React.RefObject<number>; drift: boolean }) {
  useFrame(({ camera }, delta) => {
    if (drift) spin.current = (spin.current ?? 0) + 0.055 * Math.min(delta, 0.05);
    camera.position.set(0, 2, 118);
    camera.lookAt(0, -1, 0);
  });
  return null;
}

export default function PressDrum({
  selectedId,
  onHoverClip,
  onSelectClip,
  reducedMotion = false,
}: {
  selectedId: string | null;
  onHoverClip: (c: Clip | null) => void;
  onSelectClip: (c: Clip) => void;
  reducedMotion?: boolean;
}) {
  const spin = useRef(0);
  const drag = useRef<{ x: number; spin: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [lit, setLit] = useState<string | null>(null);

  const clipTex = useMemo(
    () => clips.map((c) => ({ id: c.id, plain: clipTexture(c, false), lit: clipTexture(c, true) })),
    [],
  );
  const chanTex = useMemo(() => channels.map((c) => channelTexture(c.name)), []);
  useEffect(
    () => () => {
      clipTex.forEach((t) => { t.plain.dispose(); t.lit.dispose(); });
      chanTex.forEach((t) => t.dispose());
    },
    [clipTex, chanTex],
  );

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
        spin.current = d.spin + dx * 0.006;
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
        if (e.key === "ArrowLeft") { spin.current -= 0.4; e.preventDefault(); }
        else if (e.key === "ArrowRight") { spin.current += 0.4; e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`A rotating drum carrying ${clips.length} featured clips and ${channels.length} channel marks. Use the left and right arrow keys to turn it.`}
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
        camera={{ fov: 44, near: 0.5, far: 800 }}
      >
        <ambientLight intensity={1} />
        <Rig spin={spin} drift={!reducedMotion && !grabbing} />

        {/* the drum's own rims, so the cylinder is visible even between panels */}
        {[CLIP_Y - 14, CHAN_Y + 8].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[RADIUS, 0.14, 6, 120]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.22} />
          </mesh>
        ))}

        {/* upper band — the featured clips */}
        {clips.map((c, i) => {
          const t = clipTex[i];
          return (
            <Panel
              key={c.id}
              angle={(i / clips.length) * Math.PI * 2}
              y={CLIP_Y}
              w={26}
              h={18.5}
              texture={selectedId === c.id || lit === c.id ? t.lit : t.plain}
              spin={spin}
              onHover={() => {
                setLit(c.id);
                onHoverClip(c);
              }}
              onSelect={() => {
                if (drag.current && drag.current.moved > 6) return;
                onSelectClip(c);
              }}
            />
          );
        })}

        {/* lower band — the channel marks */}
        {channels.map((c, i) => (
          <Panel
            key={c.name}
            angle={(i / channels.length) * Math.PI * 2 + 0.3}
            y={CHAN_Y}
            w={15}
            h={4.8}
            texture={chanTex[i]}
            spin={spin}
          />
        ))}
      </Canvas>
    </div>
  );
}
