import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "motion/react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import type { StateData } from "@/types";

const NAME_MAP: Record<string, string> = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
};

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
  onEnter,
  onLeave,
}: {
  d: string;
  isHovered: boolean;
  hasData: boolean;
  onEnter: (e: React.MouseEvent) => void;
  onLeave: () => void;
}) {
  return (
    <path
      d={d}
      fill={isHovered ? "#f59e0b" : "#d97706"}
      fillOpacity={isHovered ? 1 : 0.65}
      stroke={isHovered ? "#fbbf24" : "rgba(26, 26, 46, 0.6)"}
      strokeWidth={isHovered ? 1.5 : 0.5}
      style={{
        cursor: hasData ? "pointer" : "default",
        transition: "fill 0.2s, fill-opacity 0.2s, stroke 0.2s, stroke-width 0.2s",
        filter: isHovered
          ? "drop-shadow(0 0 10px rgba(245,158,11,0.6))"
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
        setFeatures(geo);
      })
      .catch(console.error);
  }, []);

  const projection = useMemo(
    () => geoMercator().center([82, 22]).scale(1000).translate([300, 300]),
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
      // Compute centroid for tooltip positioning
      const centroid = projection(geoCentroid(f as Feature<Geometry>));
      return {
        key: `${name}-${i}`,
        d: pathGenerator(f) ?? "",
        name: normalized,
        stateData,
        cx: centroid?.[0] ?? 300,
        cy: centroid?.[1] ?? 300,
      };
    });
  }, [features, pathGenerator, states, projection]);

  const handleEnter = useCallback(
    (item: (typeof computedPaths)[number], e: React.MouseEvent) => {
      if (!item.stateData) return;
      // Get position relative to the SVG container
      const svg = (e.target as SVGElement).closest("svg");
      if (!svg) return;
      // Use centroid position mapped to percentage of container
      const xPct = (item.cx / 600) * 100;
      const yPct = (item.cy / 600) * 100;
      onStateHover({
        state: item.stateData,
        x: xPct,
        y: yPct,
      });
    },
    [onStateHover, computedPaths],
  );

  if (!features) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <svg viewBox="0 0 600 600" className="h-full w-full">
      {computedPaths.map((item) => (
        <StatePath
          key={item.key}
          d={item.d}
          isHovered={hoveredStateId === item.stateData?.name}
          hasData={!!item.stateData}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.92 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none w-48 rounded-xl border border-white/15 bg-[#1a1a2e]/95 p-3 shadow-2xl backdrop-blur-lg sm:w-60 sm:p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">{state.name}</p>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
          {state.ndaSeats > state.indiaSeats ? "NDA" : "INDIA"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Lok Sabha Seats</span>
          <span className="font-bold text-white">{state.seats}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
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
        <div className="flex items-center gap-2 text-xs">
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
