import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "motion/react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import type { StateData } from "@/types";

// Name mapping: GeoJSON name → our data name
const NAME_MAP: Record<string, string> = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
};

interface IndiaMapProps {
  states: StateData[];
  onStateHover: (state: StateData | null) => void;
  hoveredState: StateData | null;
}

// Memoized individual state path to prevent unnecessary re-renders
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
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <path
      d={d}
      fill={isHovered ? "#f59e0b" : "#d97706"}
      fillOpacity={isHovered ? 1 : 0.7}
      stroke="rgba(26, 26, 46, 0.5)"
      strokeWidth={0.5}
      style={{
        cursor: hasData ? "pointer" : "default",
        transition: "fill 0.2s, fill-opacity 0.2s",
        filter: isHovered ? "drop-shadow(0 0 6px rgba(245,158,11,0.5))" : "none",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
});

export function IndiaMap({ states, onStateHover, hoveredState }: IndiaMapProps) {
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

  // Pre-compute paths once when features load
  const computedPaths = useMemo(() => {
    if (!features) return [];
    return features.features.map((f, i) => {
      const name = (f.properties?.name as string) ?? "";
      const normalized = NAME_MAP[name] ?? name;
      const stateData = states.find(
        (s) => s.name.toLowerCase() === normalized.toLowerCase(),
      );
      return {
        key: `${name}-${i}`,
        d: pathGenerator(f) ?? "",
        name: normalized,
        stateData,
      };
    });
  }, [features, pathGenerator, states]);

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
          isHovered={hoveredState?.name === item.stateData?.name}
          hasData={!!item.stateData}
          onEnter={() => item.stateData && onStateHover(item.stateData)}
          onLeave={() => onStateHover(null)}
        />
      ))}
    </svg>
  );
}

// ─── Floating State Tooltip ───

export function StateTooltip({ state }: { state: StateData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none w-56 rounded-xl border border-amber-500/30 bg-[#1a1a2e]/95 p-4 shadow-2xl backdrop-blur-md"
    >
      <p className="text-xs font-bold tracking-wider text-amber-500 uppercase">
        {state.name}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <p className="text-[10px] text-white/50">Total Seats</p>
          <p className="text-lg font-bold text-white">{state.seats}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50">NDA</p>
          <p className="text-lg font-bold text-green-400">{state.ndaSeats}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50">INDIA Alliance</p>
          <p className="text-lg font-bold text-blue-400">{state.indiaSeats}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50">Others</p>
          <p className="text-lg font-bold text-gray-400">{state.otherSeats}</p>
        </div>
      </div>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="bg-green-400"
          style={{ width: `${(state.ndaSeats / state.seats) * 100}%` }}
        />
        <div
          className="bg-blue-400"
          style={{ width: `${(state.indiaSeats / state.seats) * 100}%` }}
        />
        <div
          className="bg-gray-500"
          style={{ width: `${(state.otherSeats / state.seats) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}
