"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sankalpArticles, type SankalpArticle } from "@/data/sankalp";

/* कलम का संकल्प — the resolve ring.
 *
 * WHAT IT SHOWS
 * A quill at the centre — the founder's own kalam — with one plate per article
 * held in a halo around it, tilted like pages fanned out from a single pen.
 * Drag to turn the halo, click a plate to open that piece.
 *
 * WHY A HALO AND NOT ANOTHER ORBIT
 * Political Parties already owns "things that circle a centre because they are
 * peers" (the alliance orbit). This is different on purpose: every plate here
 * traces back to one source — the pen — so the halo sits tilted and close
 * around it rather than spread into a flat ring, and the pen is the only thing
 * that casts light.
 *
 * Ported from reference/new_ref/assets/sankalp-3d.js.
 */

const AMBER = "#ff9933";
const AMBER_LIGHT = "#ffc27a";
const RADIUS = 40;
const TILT = 0.34;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/* A plate as a canvas texture — the Devanagari monogram, ringed like a coin.
   Canvas text rather than a font loader: no network fetch, and nothing that can
   arrive after the first frame the way a loaded typeface does. */
function plateTexture(mono: string, lit: boolean) {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  if (!g) return new THREE.Texture();

  const grd = g.createRadialGradient(s * 0.4, s * 0.35, 10, s / 2, s / 2, s / 2);
  grd.addColorStop(0, lit ? "#ffd9a8" : "#ffc27a");
  grd.addColorStop(1, lit ? "#e87d12" : "#c96608");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2);
  g.fill();

  g.strokeStyle = lit ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.45)";
  g.lineWidth = lit ? 9 : 5;
  g.beginPath();
  g.arc(s / 2, s / 2, s / 2 - 16, 0, Math.PI * 2);
  g.stroke();

  // The monogram is Devanagari, so the stack needs a face that actually has the
  // glyphs or every plate renders as a box.
  g.fillStyle = "#3b1c00";
  g.font = '700 118px Poppins, "Nirmala UI", "Noto Sans Devanagari", system-ui, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(mono, s / 2, s / 2 + 6);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function Plate({
  article,
  index,
  total,
  spin,
  lit,
  onHover,
  onSelect,
}: {
  article: SankalpArticle;
  index: number;
  total: number;
  spin: React.RefObject<number>;
  lit: boolean;
  onHover: (a: SankalpArticle | null) => void;
  onSelect: (a: SankalpArticle) => void;
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texPlain = useMemo(() => plateTexture(article.mono, false), [article.mono]);
  const texLit = useMemo(() => plateTexture(article.mono, true), [article.mono]);
  useEffect(() => () => { texPlain.dispose(); texLit.dispose(); }, [texPlain, texLit]);

  const cur = useRef(0);

  useFrame(() => {
    const sp = sprite.current;
    if (!sp) return;
    const a = (index / total) * Math.PI * 2 + (spin.current ?? 0);
    // Tilted halo, not a flat ring: the plates lean around the pen rather than
    // lying in a plane with it.
    sp.position.set(
      Math.cos(a) * RADIUS,
      Math.sin(a) * RADIUS * TILT + 2,
      Math.sin(a) * RADIUS * 0.55,
    );
    const goal = lit ? 15 : 11.5;
    cur.current += (goal - cur.current) * 0.12;
    sp.scale.setScalar(Math.max(0.001, cur.current));
    const mat = sp.material as THREE.SpriteMaterial;
    // Plates behind the pen dim rather than disappear, so the halo stays whole.
    mat.opacity = clamp(0.4 + (Math.sin(a) * 0.5 + 0.5) * 0.6, 0, 1);
  });

  return (
    <sprite
      ref={sprite}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(article);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(article);
      }}
    >
      <spriteMaterial map={lit ? texLit : texPlain} transparent depthWrite={false} />
    </sprite>
  );
}

/** The kalam itself — a nib, a shaft and a light. The only thing in the scene
 *  that emits, because everything else in the halo comes from it. */
function Quill({ spin }: { spin: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = (spin.current ?? 0) * 0.4;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.8;
  });
  return (
    <group ref={group} rotation={[0, 0, -0.42]}>
      {/* shaft */}
      <mesh position={[0, 9, 0]}>
        <cylinderGeometry args={[0.55, 0.95, 26, 12]} />
        <meshStandardMaterial color={AMBER_LIGHT} roughness={0.42} metalness={0.2} />
      </mesh>
      {/* nib */}
      <mesh position={[0, -6, 0]}>
        <coneGeometry args={[1.5, 8, 12]} />
        <meshStandardMaterial
          color={AMBER}
          roughness={0.3}
          metalness={0.35}
          emissive={AMBER}
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, -8, 0]} intensity={1.6} distance={0} decay={0} color={AMBER_LIGHT} />
    </group>
  );
}

function Rig() {
  useFrame(({ camera }) => {
    camera.position.set(0, 6, 104);
    camera.lookAt(0, 1, 0);
  });
  return null;
}

export default function ResolveRing({
  litUrl,
  onHoverArticle,
  onSelectArticle,
  reducedMotion = false,
}: {
  litUrl: string | null;
  onHoverArticle: (a: SankalpArticle | null) => void;
  onSelectArticle: (a: SankalpArticle) => void;
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
        spin.current = d.spin + dx * 0.007;
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
      aria-label={`कलम का संकल्प — ${sankalpArticles.length} लेख एक कलम के चारों ओर। घुमाने के लिए बाएँ-दाएँ तीर का उपयोग करें।`}
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[40, 60, 80]} intensity={0.4} />
        <Rig />
        <Quill spin={spin} />
        <Drift spin={spin} run={!reducedMotion && !grabbing} />
        {sankalpArticles.map((a, i) => (
          <Plate
            key={a.u}
            article={a}
            index={i}
            total={sankalpArticles.length}
            spin={spin}
            lit={litUrl === a.u}
            onHover={onHoverArticle}
            onSelect={(art) => {
              if (drag.current && drag.current.moved > 6) return;
              onSelectArticle(art);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}

function Drift({ spin, run }: { spin: React.RefObject<number>; run: boolean }) {
  useFrame((_, delta) => {
    if (run) spin.current = (spin.current ?? 0) + 0.06 * Math.min(delta, 0.05);
  });
  return null;
}
