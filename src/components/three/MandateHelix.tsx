"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { milestones, milestoneYears } from "@/data/campaigns";

/* About — the mandate helix.
 *
 * WHAT IT SHOWS
 * Fifteen years of campaigns as one climbing spiral, 2012 at the foot and 2027
 * at the head. Every milestone is a disc, and each year's discs sit at the SAME
 * height — so a heavy year reads as a thick band and a quiet year as a single
 * point. The shape is the argument the page is making: the record is
 * continuous, and it goes up.
 *
 * WHY A HELIX AND NOT ANOTHER ORBIT
 * An orbit says "these things circle one centre" — right for alliances, wrong
 * here. Time does not orbit. A helix has an unambiguous bottom and top, so the
 * direction of travel survives any camera angle, which a ring cannot.
 *
 * Ported from reference/new_ref/assets/about-3d.js, matched part for part:
 * the CatmullRom ribbon, the per-year hoop, the spoke from spine to disc, and
 * year labels carried at each year's OWN angle rather than parked on one side.
 */

const AMBER = "#ff9933";
const AMBER_LIGHT = "#ffc27a";

const RADIUS = 46; // spiral radius
const RISE = 13; // vertical gap between year rings
const SPREAD = 0.85; // radians between two campaigns inside the same year
const TURN = (Math.PI * 2) / 6; // a full turn every six years

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export type HelixNode = {
  i: number;
  y: number;
  state: string;
  text: string;
  angle: number;
  height: number;
};

const SPAN_Y = Math.max((milestoneYears.length - 1) * RISE, 1);
const Y0 = -SPAN_Y / 2; // the helix is centred on the origin, not stacked above it

/** One node per milestone. Milestones from the same year share a height and fan
 *  out around that year's angle, which is what turns a busy year into a band. */
export function helixNodes(): HelixNode[] {
  const out: HelixNode[] = [];
  milestoneYears.forEach((year, yi) => {
    const inYear = milestones.filter((m) => m.y === year);
    const baseAng = yi * TURN;
    const y = Y0 + yi * RISE;
    inYear.forEach((m, k) => {
      out.push({
        i: out.length,
        y: year,
        state: m.state,
        text: m.text,
        angle: baseAng + (k - (inYear.length - 1) / 2) * SPREAD,
        height: y,
      });
    });
  });
  return out;
}

/** A year label as a sprite. Canvas text rather than a font loader: no network
 *  fetch, and nothing that can arrive after the first frame the way a loaded
 *  typeface can. Sprites always face the camera, so the labels stay legible
 *  however far the helix has turned. */
function labelTexture(text: string) {
  const fs = 64;
  const pad = 8;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return { tex: new THREE.Texture(), aspect: 2 };
  probe.font = `700 ${fs}px Poppins, system-ui, sans-serif`;
  const w = Math.ceil(probe.measureText(text).width) + pad * 2;
  const h = fs + pad * 2;

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.font = `700 ${fs}px Poppins, system-ui, sans-serif`;
  g.textBaseline = "middle";
  g.fillStyle = AMBER_LIGHT;
  g.fillText(text, pad, h / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return { tex, aspect: w / h };
}

function YearLabel({ year, angle, height }: { year: number; angle: number; height: number }) {
  const { tex, aspect } = useMemo(() => labelTexture(String(year)), [year]);
  useEffect(() => () => tex.dispose(), [tex]);
  const scale = 9;
  return (
    <sprite
      // Held just outside the ring at THAT year's angle, so the labels climb
      // with the spiral instead of stacking down one side of it.
      position={[Math.cos(angle) * (RADIUS + 17), height + 3, Math.sin(angle) * (RADIUS + 17)]}
      scale={[scale * aspect, scale, 1]}
    >
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  );
}

function Disc({
  node,
  active,
  dimmed,
  reveal,
  onHover,
  onSelect,
}: {
  node: HelixNode;
  active: boolean;
  dimmed: boolean;
  reveal: React.RefObject<number>;
  onHover: (n: HelixNode | null) => void;
  onSelect: (n: HelixNode) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const cur = useRef(0);
  const x = Math.cos(node.angle) * RADIUS;
  const z = Math.sin(node.angle) * RADIUS;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const goal = (active ? 1.4 : 1) * (reveal.current ?? 1);
    const k = 1 - Math.pow(0.003, Math.min(delta, 0.05));
    cur.current += (goal - cur.current) * k;
    m.scale.setScalar(Math.max(0.001, cur.current));
  });

  return (
    <mesh
      ref={mesh}
      position={[x, node.height, z]}
      // Tipped rather than laid flat, so a disc reads as a coin on the spiral
      // instead of a dot from above.
      rotation={[Math.PI / 2.5, -node.angle, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <cylinderGeometry args={[4.6, 4.6, 1.1, 28]} />
      <meshStandardMaterial
        color={dimmed ? "#c7d2de" : AMBER}
        roughness={0.35}
        metalness={0.25}
        emissive={dimmed ? "#000000" : AMBER}
        emissiveIntensity={active ? 0.5 : 0.16}
      />
    </mesh>
  );
}

/** The climbing ribbon. CatmullRom through one point per year turns the stepped
 *  rings into a single continuous rise — which is the whole read. */
function Ribbon() {
  const geo = useMemo(() => {
    const pts = milestoneYears.map((_, yi) => {
      const a = yi * TURN;
      return new THREE.Vector3(Math.cos(a) * RADIUS, Y0 + yi * RISE, Math.sin(a) * RADIUS);
    });
    if (pts.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, pts.length * 14, 0.5, 8, false);
  }, []);
  useEffect(() => () => geo?.dispose(), [geo]);
  if (!geo) return null;
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={AMBER_LIGHT} transparent opacity={0.5} />
    </mesh>
  );
}

function World({
  nodes,
  highlight,
  spin,
  onHover,
  onSelect,
}: {
  nodes: HelixNode[];
  highlight: number | null;
  spin: boolean;
  onHover: (n: HelixNode | null) => void;
  onSelect: (n: HelixNode) => void;
}) {
  const world = useRef<THREE.Group>(null);
  const reveal = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (reveal.current < 1) reveal.current = Math.min(1, reveal.current + d * 0.55);
    // The whole world turns, not each item — that is what keeps the ribbon,
    // the hoops and the discs locked together as one object.
    if (spin && world.current) world.current.rotation.y += 0.045 * d;
  });

  return (
    <group ref={world}>
      {/* the spine */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, SPAN_Y + 24, 8]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.2} />
      </mesh>

      <Ribbon />

      {milestoneYears.map((year, yi) => {
        const baseAng = yi * TURN;
        const y = Y0 + yi * RISE;
        return (
          <group key={year}>
            {/* the year ring — a faint hoop so each level reads as a step */}
            <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[RADIUS, 0.16, 6, 90]} />
              <meshBasicMaterial color={AMBER} transparent opacity={0.14} />
            </mesh>
            <YearLabel year={year} angle={baseAng} height={y} />
          </group>
        );
      })}

      {/* spokes, spine out to each disc */}
      {nodes.map((n) => {
        const x = Math.cos(n.angle) * RADIUS;
        const z = Math.sin(n.angle) * RADIUS;
        return (
          <mesh
            key={`spoke-${n.i}`}
            position={[x / 2, n.height, z / 2]}
            rotation={[0, -n.angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.1, 0.1, RADIUS, 5]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.16} />
          </mesh>
        );
      })}

      {nodes.map((n) => (
        <Disc
          key={n.i}
          node={n}
          active={highlight === n.i}
          dimmed={highlight !== null && highlight !== n.i}
          reveal={reveal}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Rig({ cam }: { cam: React.RefObject<{ az: number; azGoal: number; pol: number; polGoal: number }> }) {
  const { size } = useThree();
  const r = useRef(250);

  useFrame(({ camera }, delta) => {
    const c = cam.current;
    if (!c) return;
    const persp = camera as THREE.PerspectiveCamera;
    const halfH = SPAN_Y / 2 + 16;
    const halfW = RADIUS + 20;
    const vFov = (persp.fov * Math.PI) / 180;
    const distV = halfH / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distH = halfW / Math.tan(hFov / 2);
    const goal = clamp(Math.max(distV, distH) * 1.08, 140, 620);

    const k = 1 - Math.pow(0.003, Math.min(delta, 0.05));
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

export default function MandateHelix({
  highlight,
  onHoverNode,
  onSelectNode,
  reducedMotion = false,
}: {
  highlight: number | null;
  onHoverNode: (n: HelixNode | null) => void;
  onSelectNode: (n: HelixNode) => void;
  reducedMotion?: boolean;
}) {
  const nodes = useMemo(() => helixNodes(), []);
  const cam = useRef({ az: 0.5, azGoal: 0.5, pol: 1.16, polGoal: 1.16 });
  const drag = useRef<{ x: number; y: number; az: number; pol: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  return (
    <div
      className="absolute inset-0 outline-none"
      style={{ cursor: grabbing ? "grabbing" : "grab", touchAction: "pan-y" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, az: cam.current.azGoal, pol: cam.current.polGoal, moved: 0 };
        setGrabbing(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
        cam.current.azGoal = d.az - dx * 0.006;
        cam.current.polGoal = clamp(d.pol - dy * 0.004, 0.5, 1.9);
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
        if (e.key === "ArrowLeft") { c.azGoal -= 0.3; e.preventDefault(); }
        else if (e.key === "ArrowRight") { c.azGoal += 0.3; e.preventDefault(); }
        else if (e.key === "ArrowUp") { c.polGoal = clamp(c.polGoal - 0.1, 0.5, 1.9); e.preventDefault(); }
        else if (e.key === "ArrowDown") { c.polGoal = clamp(c.polGoal + 0.1, 0.5, 1.9); e.preventDefault(); }
      }}
      tabIndex={0}
      role="group"
      aria-label={`${nodes.length} campaigns across ${milestoneYears.length} years, on a climbing spiral from ${milestoneYears[0]} at the foot to ${milestoneYears[milestoneYears.length - 1]} at the head. Use the arrow keys to turn and travel.`}
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
        camera={{ fov: 40, near: 0.5, far: 900 }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[-60, 120, 80]} intensity={0.7} />
        <directionalLight position={[80, 30, -70]} intensity={0.5} color={AMBER_LIGHT} />
        <Rig cam={cam} />
        <World
          nodes={nodes}
          highlight={highlight}
          spin={!reducedMotion}
          onHover={onHoverNode}
          onSelect={(n) => {
            if (drag.current && drag.current.moved > 6) return;
            onSelectNode(n);
          }}
        />
      </Canvas>
    </div>
  );
}
