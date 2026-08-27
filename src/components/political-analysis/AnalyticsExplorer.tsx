"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { lsStates, lsAlliance, lsParty, lsNational } from "@/data/lok-sabha-2024";
import { electionYears, lokSabhaYears } from "@/data/election-archive";
import type { HeightMetric, ColourMetric, StateStyle } from "@/components/three/IndiaMap3D";

/* The analytics explorer: India extruded, with height and colour each reading a
 * metric you pick, over a year timeline that spans Lok Sabha and state assembly
 * cycles alike.
 *
 * The map is an enhancement. Every number it encodes is also in the state table
 * beside it, which is plain HTML and needs no WebGL — so the section works with
 * the canvas absent, failed, or unreachable by a screen reader. */

const IndiaMap3D = dynamic(() => import("@/components/three/IndiaMap3D"), {
  ssr: false,
  loading: () => <MapFallback />,
});

function MapFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-24 w-24 animate-pulse rounded-full bg-[#ff9933]/20" />
    </div>
  );
}

const HEIGHTS: { id: HeightMetric; label: string }[] = [
  { id: "seats", label: "Seats won" },
  { id: "turnout", label: "Voter turnout" },
  { id: "ndaShare", label: "NDA share" },
  { id: "indiaShare", label: "INDIA share" },
];

const COLOURS: { id: ColourMetric; label: string }[] = [
  { id: "alliance", label: "Alliance" },
  { id: "party", label: "Leading party" },
  { id: "turnout", label: "Turnout" },
];

const YEARS = Object.keys(electionYears).sort();
const NOT_CONTESTED = "#c7d2de";

function Chip({
  on,
  onClick,
  children,
  title,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      aria-pressed={on}
      className={
        "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
        (on
          ? "border-transparent bg-[#0a1e3f] text-white"
          : "border-[#dce4ef] bg-white text-[#5a7091] hover:border-[#ff9933] hover:text-[#0a1e3f]")
      }
    >
      {children}
    </button>
  );
}

export function AnalyticsExplorer() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [metric, setMetric] = useState<HeightMetric>("seats");
  const [colourBy, setColourBy] = useState<ColourMetric>("alliance");
  const [year, setYear] = useState("2024");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && (setNear(true), io.disconnect()),
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isLokSabha = lokSabhaYears.includes(Number(year));
  const yearData = electionYears[year];

  // On an assembly year the Lok Sabha metrics are meaningless, so each state is
  // styled from that year's own result and everything that did not poll goes
  // flat and grey. Returning null on a Lok Sabha year hands control back to the
  // height/colour metrics.
  const styleFor = useMemo(() => {
    if (isLokSabha || !yearData) return undefined;
    const byState = new Map(yearData.polls.map((p) => [p.state, p]));
    return (name: string): StateStyle | null => {
      const poll = byState.get(name);
      if (!poll) return { height: 1.5, colour: NOT_CONTESTED };
      if (!poll.v) return { height: 4, colour: "#e6eaf2" }; // held, result not loaded
      const share = poll.leadSeats / poll.seats;
      const party = lsParty[poll.lead];
      return { height: 3 + share * 24, colour: party ? party.c : "#94a3b8" };
    };
  }, [isLokSabha, yearData]);

  const active = hovered ?? selected;
  const activeRow = active ? lsStates[active] : null;
  const activePoll =
    !isLokSabha && active && yearData ? yearData.polls.find((p) => p.state === active) : undefined;

  // States listed by seats, which is the order a reader scans for.
  const stateList = useMemo(
    () => Object.values(lsStates).sort((a, b) => b.seats - a.seats),
    [],
  );

  return (
    <section
      ref={ref}
      id="explorer"
      className="oneview-lg relative border-y border-[#dce4ef] bg-[#f6f9fd]"
    >
      <div className="ov-head mx-auto w-full max-w-[1440px] px-4 pt-10 sm:px-6 lg:pt-[calc(var(--header-h)+18px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]">
              The explorer
            </span>
            <h2 className="mt-2 text-[clamp(20px,2.3vw,32px)] font-extrabold tracking-tight text-[#0a1e3f]">
              Every state, extruded by what you ask of it
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">Height</span>
              <div className="flex flex-wrap gap-1.5">
                {HEIGHTS.map((h) => (
                  <Chip key={h.id} on={metric === h.id} onClick={() => setMetric(h.id)}>
                    {h.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">Colour</span>
              <div className="flex flex-wrap gap-1.5">
                {COLOURS.map((c) => (
                  <Chip key={c.id} on={colourBy === c.id} onClick={() => setColourBy(c.id)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Year timeline. India votes for the Lok Sabha only in 2019 and 2024
            within this range; every other year is a state assembly cycle. */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">Year</span>
          {YEARS.map((y) => {
            const lok = lokSabhaYears.includes(Number(y));
            return (
              <Chip
                key={y}
                on={year === y}
                onClick={() => setYear(y)}
                title={lok ? "Lok Sabha general election" : "State assembly cycle"}
              >
                <span className="flex items-center gap-1">
                  {y}
                  {lok && <span className="h-1.5 w-1.5 rounded-full bg-[#ff9933]" />}
                </span>
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="ov-stage mt-4 grid gap-4 px-4 pb-4 sm:px-6 lg:mt-0 lg:grid-cols-[220px_minmax(0,1fr)_260px] lg:gap-5">
        {/* left rail — alliance split then the state table */}
        <aside className="order-2 min-h-0 overflow-y-auto rounded-xl border border-[#dce4ef] bg-white p-3 lg:order-1">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">Alliance</h3>
          <ul className="mt-2 space-y-1.5">
            {Object.entries(lsAlliance).map(([k, a]) => (
              <li key={k} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-[#22406e]">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.c }} />
                  {a.name}
                </span>
                <span className="font-bold text-[#0a1e3f]">{k === "NC" ? "—" : a.seats}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
            States &amp; UTs
          </h3>
          <ul className="mt-2 space-y-0.5">
            {stateList.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseEnter={() => setHovered(s.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(s.name)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected(selected === s.name ? null : s.name)}
                  className={
                    "flex w-full items-center justify-between rounded px-1.5 py-1 text-left text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                    (active === s.name ? "bg-[#fff4e6] text-[#0a1e3f]" : "text-[#22406e] hover:bg-[#f6f9fd]")
                  }
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: lsAlliance[s.win]?.c ?? "#94a3b8" }}
                    />
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="ml-2 shrink-0 font-bold">{s.seats}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* the map */}
        <div className="relative order-1 min-h-[46vh] overflow-hidden rounded-xl border border-[#dce4ef] bg-white lg:order-2 lg:min-h-0">
          {near ? (
            <IndiaMap3D
              metric={metric}
              colourBy={colourBy}
              styleFor={styleFor}
              selected={selected}
              onHover={setHovered}
              onSelect={(n) => setSelected((cur) => (cur === n ? null : n))}
            />
          ) : (
            <MapFallback />
          )}

          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 rounded-full border border-[#dce4ef] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#22406e] backdrop-blur transition-colors hover:border-[#ff9933]"
            >
              Reset view
            </button>
          )}
        </div>

        {/* right panel — national figures, or the hovered state */}
        <aside className="order-3 min-h-0 overflow-y-auto rounded-xl border border-[#dce4ef] bg-white p-4">
          {activeRow ? (
            <>
              <h3 className="text-sm font-extrabold text-[#0a1e3f]">{activeRow.name}</h3>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5a7091]">
                {isLokSabha ? `${activeRow.seats} Lok Sabha seats` : `${year} assembly`}
              </p>

              {!isLokSabha && activePoll ? (
                activePoll.v ? (
                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    <Row k="Assembly seats" v={String(activePoll.seats)} />
                    <Row k="Leading party" v={`${activePoll.lead} · ${activePoll.leadSeats}`} />
                    <Row k="Polled" v={activePoll.month} />
                  </dl>
                ) : (
                  <p className="mt-3 rounded-lg bg-[#f6f9fd] p-2.5 text-[11px] leading-relaxed text-[#5a7091]">
                    Held in {activePoll.month} {year}. The result is not loaded here — it comes in
                    with the ECI feed rather than being estimated.
                  </p>
                )
              ) : !isLokSabha ? (
                <p className="mt-3 rounded-lg bg-[#f6f9fd] p-2.5 text-[11px] leading-relaxed text-[#5a7091]">
                  Did not poll in {year}.
                </p>
              ) : (
                <>
                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    <Row k="NDA" v={String(activeRow.n)} c={lsAlliance.NDA.c} />
                    <Row k="INDIA" v={String(activeRow.i)} c={lsAlliance.INDIA.c} />
                    <Row k="Others" v={String(activeRow.o)} c={lsAlliance.OTH.c} />
                    <Row k="Turnout" v={`${activeRow.t}%`} />
                    <Row k="Leading party" v={`${activeRow.lead} · ${activeRow.leadSeats}`} />
                  </dl>
                  <h4 className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
                    Party split
                  </h4>
                  <ul className="mt-1.5 space-y-1">
                    {Object.entries(activeRow.p)
                      .sort((a, b) => b[1] - a[1])
                      .map(([p, n]) => (
                        <li key={p} className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-2 text-[#22406e]">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: lsParty[p]?.c ?? "#94a3b8" }}
                            />
                            {p}
                          </span>
                          <span className="font-bold text-[#0a1e3f]">{n}</span>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <>
              <h3 className="text-sm font-extrabold text-[#0a1e3f]">India · {lsNational.house}</h3>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5a7091]">
                General election 2024 · all 36 states &amp; UTs
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Tile v={lsNational.seats} l="Lok Sabha seats" />
                <Tile v={lsNational.majority} l="Majority mark" />
                <Tile v={`${lsNational.turnout}%`} l="Voter turnout" />
                <Tile v={lsNational.phases} l="Polling phases" />
              </div>
              <h4 className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
                Alliance split
              </h4>
              <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full">
                {(["NDA", "INDIA", "OTH"] as const).map((k) => (
                  <span
                    key={k}
                    style={{ background: lsAlliance[k].c, width: `${(lsAlliance[k].seats / 543) * 100}%` }}
                  />
                ))}
              </div>
              <dl className="mt-3 space-y-1.5 text-[11px]">
                <Row k="Electors" v={`${lsNational.electors} cr`} />
                <Row k="Votes polled" v={`${lsNational.voters} cr`} />
                <Row k="Women MPs elected" v={String(lsNational.womenMPs)} />
              </dl>
            </>
          )}
        </aside>
      </div>

      <div className="ov-foot mx-auto w-full max-w-[1440px] px-4 pb-6 sm:px-6">
        <motion.p
          className="text-center text-[11px] text-[#5a7091]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          Drag to turn the map · click a state to isolate it · arrow keys also work.{" "}
          {isLokSabha
            ? "Height and colour follow the selectors above."
            : `${year} is a state assembly cycle — states that did not poll are flat and grey.`}
        </motion.p>
      </div>
    </section>
  );
}

function Row({ k, v, c }: { k: string; v: string; c?: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-[#5a7091]">
        {c && <span className="h-2 w-2 rounded-full" style={{ background: c }} />}
        {k}
      </dt>
      <dd className="font-bold text-[#0a1e3f]">{v}</dd>
    </div>
  );
}

function Tile({ v, l }: { v: string | number; l: string }) {
  return (
    <div className="rounded-lg border border-[#e6eaf2] bg-[#f6f9fd] p-2.5">
      <div className="text-lg font-extrabold leading-none text-[#0a1e3f]">{v}</div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-[#5a7091]">{l}</div>
    </div>
  );
}
