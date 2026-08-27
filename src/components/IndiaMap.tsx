import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { motion } from "motion/react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import type { StateData } from "@/types";

const NAME_MAP: Record<string, string> = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
  "NCT of Delhi": "Delhi",
  "Andaman & Nicobar Island": "Andaman & Nicobar Islands",
  "Dadara & Nagar Havelli": "Dadra & Nagar Haveli",
  // Ladakh is a separate geometry in the map data — fold it into J&K so the
  // whole region is covered/coloured instead of only half.
  Ladakh: "Jammu & Kashmir",
};

// Party → color mapping for state fills
const PARTY_COLORS: Record<string, { fill: string; hover: string; stroke: string; glow: string }> = {
  BJP:  { fill: "#f97316", hover: "#fb923c", stroke: "#fdba74", glow: "rgba(249,115,22,0.6)" },
  INC:  { fill: "#06b6d4", hover: "#22d3ee", stroke: "#67e8f9", glow: "rgba(6,182,212,0.6)" },
  AAP:  { fill: "#22c55e", hover: "#4ade80", stroke: "#86efac", glow: "rgba(34,197,94,0.6)" },
  SP:   { fill: "#ef4444", hover: "#f87171", stroke: "#fca5a5", glow: "rgba(239,68,68,0.6)" },
  TMC:  { fill: "#10b981", hover: "#34d399", stroke: "#6ee7b7", glow: "rgba(16,185,129,0.6)" },
  DMK:  { fill: "#e11d48", hover: "#f43f5e", stroke: "#fb7185", glow: "rgba(225,29,72,0.6)" },
  TDP:  { fill: "#eab308", hover: "#facc15", stroke: "#fde047", glow: "rgba(234,179,8,0.6)" },
  "JD(U)": { fill: "#16a34a", hover: "#22c55e", stroke: "#4ade80", glow: "rgba(22,163,74,0.6)" },
  JMM:  { fill: "#059669", hover: "#10b981", stroke: "#34d399", glow: "rgba(5,150,105,0.6)" },
  BSP:  { fill: "#3b82f6", hover: "#60a5fa", stroke: "#93c5fd", glow: "rgba(59,130,246,0.6)" },
  "SS(UBT)": { fill: "#ff9933", hover: "#ffc27a", stroke: "#ffd4a3", glow: "rgba(255,153,51,0.6)" },
  "CPI(M)": { fill: "#dc2626", hover: "#ef4444", stroke: "#f87171", glow: "rgba(220,38,38,0.6)" },
};

const DEFAULT_PARTY_COLOR = { fill: "#e87d12", hover: "#ff9933", stroke: "#ffc27a", glow: "rgba(255,153,51,0.6)" };

export interface HoverInfo {
  state: StateData;
  x: number;
  y: number;
}

interface IndiaMapProps {
  states: StateData[];
  onStateHover: (info: HoverInfo | null) => void;
  hoveredStateId: string | null;
}

const StatePath = memo(function StatePath({
  d,
  isHovered,
  hasData,
  rulingParty,
  onEnter,
  onLeave,
}: {
  d: string;
  isHovered: boolean;
  hasData: boolean;
  rulingParty?: string;
  onEnter: (e: React.MouseEvent) => void;
  onLeave: () => void;
}) {
  const colors = (rulingParty && PARTY_COLORS[rulingParty]) || DEFAULT_PARTY_COLOR;

  return (
    <path
      d={d}
      fill={isHovered ? colors.hover : colors.fill}
      fillOpacity={isHovered ? 1 : 0.65}
      stroke={isHovered ? colors.stroke : "rgba(26,26,46,0.6)"}
      strokeWidth={isHovered ? 1.5 : 0.5}
      style={{
        cursor: hasData ? "pointer" : "default",
        transition: "fill 0.3s, fill-opacity 0.3s, stroke 0.3s, stroke-width 0.3s",
        filter: isHovered
          ? `drop-shadow(0 0 10px ${colors.glow})`
          : "none",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
});

export function IndiaMap({ states, onStateHover, hoveredStateId }: IndiaMapProps) {
  const [features, setFeatures] = useState<FeatureCollection<Geometry> | null>(null);

  useEffect(() => {
    fetch("/data/india.topo.json")
      .then((res) => res.json())
      .then((topo: Topology) => {
        const geo = feature(topo, topo.objects.ind) as FeatureCollection<Geometry>;
        // Fix inverted polygon winding for states decoded from topojson
        geo.features.forEach((f) => {
          const coords = f.geometry.type === "Polygon"
            ? [f.geometry.coordinates]
            : f.geometry.type === "MultiPolygon"
              ? f.geometry.coordinates
              : [];
          coords.forEach((poly) => {
            poly.forEach((ring) => {
              let area = 0;
              for (let i = 0; i < ring.length - 1; i++) {
                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
              }
              if (area < 0) ring.reverse();
            });
          });
        });
        setFeatures(geo);
      })
      .catch(console.error);
  }, []);

  const projection = useMemo(
    () => geoMercator().center([80, 23]).scale(800).translate([290, 320]),
    [],
  );

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  const computedPaths = useMemo(() => {
    if (!features) return [];
    return features.features.map((f, i) => {
      const name = (f.properties?.name as string) ?? "";
      const normalized = NAME_MAP[name] ?? name;
      const stateData = states.find(
        (s) => s.name.toLowerCase() === normalized.toLowerCase(),
      );
      const centroid = projection(geoCentroid(f as Feature<Geometry>));
      const d = pathGenerator(f) ?? "";

      return {
        key: `${name}-${i}`,
        d,
        name: normalized,
        stateData,
        cx: centroid?.[0] ?? 300,
        cy: centroid?.[1] ?? 300,
      };
    });
  }, [features, pathGenerator, states, projection]);

  // Pause the mobile auto-cycle for a few seconds after the user interacts.
  const pausedUntilRef = useRef(0);

  const handleEnter = useCallback(
    (item: (typeof computedPaths)[number], e: React.MouseEvent) => {
      if (!item.stateData) return;
      // Get position relative to the SVG container
      const svg = (e.target as SVGElement).closest("svg");
      if (!svg) return;
      // A user interaction pauses the auto-cycle so their selection sticks.
      pausedUntilRef.current = Date.now() + 5000;
      // Use centroid position mapped to percentage of container
      const xPct = (item.cx / 600) * 100;
      const yPct = (item.cy / 600) * 100;
      onStateHover({
        state: item.stateData,
        x: xPct,
        y: yPct,
      });
    },
    [onStateHover],
  );

  // ─── Mobile auto-cycle ───
  // Touch screens have no hover, so the state tooltips never appear. On mobile
  // (< lg) cycle through the states one-by-one, highlighting each and showing
  // its tooltip. Desktop keeps pure hover behaviour (cycle disabled).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const statesWithData = useMemo(
    () => computedPaths.filter((p) => p.stateData),
    [computedPaths],
  );

  // Keep the latest callback in a ref so the interval below isn't torn down and
  // restarted every time the parent re-renders (which would reset the cycle to
  // the first state and freeze it there).
  const onStateHoverRef = useRef(onStateHover);
  onStateHoverRef.current = onStateHover;
  const cycleIndexRef = useRef(0);

  useEffect(() => {
    if (!isMobile || statesWithData.length === 0) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      const item = statesWithData[cycleIndexRef.current % statesWithData.length];
      cycleIndexRef.current += 1;
      onStateHoverRef.current({
        state: item.stateData!,
        x: (item.cx / 600) * 100,
        y: (item.cy / 600) * 100,
      });
    }, 2200);
    return () => clearInterval(id);
  }, [isMobile, statesWithData]);

  if (!features) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {computedPaths.map((item) => (
        <StatePath
          key={item.key}
          d={item.d}
          isHovered={hoveredStateId === item.stateData?.name}
          hasData={!!item.stateData}
          rulingParty={item.stateData?.rulingParty}
          onEnter={(e) => handleEnter(item, e)}
          onLeave={() => onStateHover(null)}
        />
      ))}
    </svg>
  );
}

// ─── State Tooltip — positioned near the hovered state ───

export function StateTooltip({ state }: { state: StateData }) {
  const voteShare = ((state.ndaSeats / state.seats) * 100).toFixed(1);
  const partyColors = (state.rulingParty && PARTY_COLORS[state.rulingParty]) || DEFAULT_PARTY_COLOR;
  const alliance = state.ndaSeats > state.indiaSeats ? "NDA" : state.indiaSeats > state.ndaSeats ? "INDIA" : "TIED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.92 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none w-32 rounded-xl border border-white/15 bg-[#12306b]/95 p-2 shadow-2xl backdrop-blur-lg sm:w-60 sm:p-4"
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[11px] font-bold text-white sm:text-sm">{state.name}</p>
        <span
          className="rounded-full px-1.5 py-0.5 text-[8px] font-bold sm:px-2 sm:text-[10px]"
          style={{
            backgroundColor: `${partyColors.fill}33`,
            color: partyColors.hover,
          }}
        >
          {state.rulingParty || alliance}
        </span>
      </div>

      <div className="mt-1.5 space-y-1 sm:mt-3 sm:space-y-2">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-white/50">Lok Sabha Seats</span>
          <span className="font-bold text-white">{state.seats}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-white/50">Vote Share</span>
          <span className="font-bold text-amber-400">{voteShare}%</span>
        </div>
        {/* Vote share bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${voteShare}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        {/* Seats bar */}
        <div className="flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
          <span className="text-white/50">Seats</span>
          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="flex h-full">
              <motion.div
                className="h-full bg-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${(state.ndaSeats / state.seats) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <motion.div
                className="h-full bg-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${(state.indiaSeats / state.seats) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.div
                className="h-full bg-gray-500"
                initial={{ width: 0 }}
                animate={{ width: `${(state.otherSeats / state.seats) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </div>
          </div>
          <span className="font-mono text-[10px] text-white/40">
            {state.ndaSeats}/{state.seats}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
